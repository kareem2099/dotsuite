/** DotScramble licensing against a real local Core + disposable PostgreSQL account. Never production. */
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {PgFixtureClient,ObjectId} from './pg-fixtures.mjs';
const c=JSON.parse(process.env.BILLING_CONFIG_JSON);
assert.equal(c.LEMON_TEST_MODE,'true');
assert.ok(c.TEST_DATABASE_NAME.startsWith('dotsuite_billing_test_'));
const base=process.env.BILLING_CORE_URL;assert.equal(new URL(base).hostname,'127.0.0.1');
const client=new PgFixtureClient(c.DATABASE_URL);
const id=new ObjectId();
const internal={'X-Internal-Secret':c.INTERNAL_API_SECRET,'X-User-Id':String(id),'Content-Type':'application/json'};

async function request(path,options){
 for(let retry=0;retry<5;retry++){
  const r=await fetch(base+path,options);
  if(r.status!==429){const text=await r.text();return{status:r.status,value:text?JSON.parse(text):null};}
  await new Promise(done=>setTimeout(done,1500));
 }
 throw Error('Core rate limit did not clear');
}
const call=(path,method='GET',body)=>request(path,{method,headers:internal,...(body===undefined?{}:{body:JSON.stringify(body)})});
const license=(route,key,body,method=route==='deactivate'?'DELETE':'POST')=>request('/v1/license/'+route,{method,headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(body)});
const newKey=async(source='dotscramble')=>{const r=await call('/internal/keys/generate','POST',{label:'DotScramble test',scopes:['dotscramble:verify'],source});assert.equal(r.status,201,JSON.stringify(r.value));return r.value;};
const devices=async()=>{const r=await call('/internal/dotscramble/devices');assert.equal(r.status,200);return r.value;};
const ids=async()=>(await devices()).devices.map(d=>d.machine_id).sort();
const activeKeys=async()=>(await call('/internal/keys')).value.map(k=>k.key_prefix).sort();
const mid=token=>JSON.parse(Buffer.from(token.split('.')[0],'base64url').toString()).mid;

try {
 await client.connect();const db=client.db(c.TEST_DATABASE_NAME);
 await db.collection('users').insertOne({_id:id,email:`license-${id}@example.com`,username:'licensee',referral_code:String(id),is_active:true,tier:'free',createdAt:new Date(),updatedAt:new Date()});
 // A paid one-time DotScramble month, through the real signed webhook
 const now=new Date().toISOString();
 const body=JSON.stringify({meta:{event_name:'order_created',custom_data:{user_id:String(id)}},data:{id:'870001',attributes:{store_id:Number(c.LEMON_STORE_ID),test_mode:true,customer_id:700001,variant_id:Number(c.LS_VARIANT_DOTSCRAMBLE_MAX_MONTHLY),order_id:870001,status:'paid',created_at:now,updated_at:now,ends_at:null}}});
 const hook=await request('/v1/webhooks/lemon',{method:'POST',headers:{'Content-Type':'application/json','X-Signature':createHmac('sha256',c.LEMON_WEBHOOK_SECRET).update(body).digest('hex')},body});
 assert.equal(hook.status,200);

 // Activate, with a name for the dashboard (control characters dropped)
 const a=await newKey();
 let r=await license('activate',a.plaintext_key,{machine_id:'laptop1',device_name:'Linux · laptop\n'});
 assert.equal(r.status,200,JSON.stringify(r.value));assert.equal(mid(r.value.license_token),'laptop1');
 let list=await devices();assert.equal(list.limit,2);assert.equal(list.devices.length,1);
 assert.equal(list.devices[0].name,'Linux · laptop');assert.ok(list.devices[0].activated_at&&list.devices[0].last_seen_at);
 assert.equal((await license('activate',a.plaintext_key,{machine_id:'bad"id'})).status,400);

 // Connecting again on the same computer retires the key it replaces
 const b=await newKey();
 assert.equal((await license('activate',b.plaintext_key,{machine_id:'laptop1'})).status,200);
 assert.equal((await license('recheck',a.plaintext_key,{machine_id:'laptop1'})).status,401,'replaced key must stop working');
 assert.deepEqual(await activeKeys(),[b.key_prefix]);
 assert.deepEqual(await ids(),['laptop1']);

 // A 1.5 ID moves to the 1.6 ID instead of using a second slot
 const cKey=await newKey();
 assert.equal((await license('activate',cKey.plaintext_key,{machine_id:'oldid'})).status,200);
 r=await license('recheck',cKey.plaintext_key,{machine_id:'newid',previous_machine_id:'oldid',device_name:'Linux · desk'});
 assert.equal(r.status,200,JSON.stringify(r.value));assert.equal(mid(r.value.license_token),'newid');
 assert.deepEqual(await ids(),['laptop1','newid']);
 assert.equal((await devices()).devices.find(d=>d.machine_id==='newid').name,'Linux · desk');

 // Full: the message points at the Devices page
 const d=await newKey();
 r=await license('activate',d.plaintext_key,{machine_id:'third'});
 assert.equal(r.status,409);assert.match(JSON.stringify(r.value),/Devices/);

 // Removing a device on the website frees its slot and retires its key
 assert.equal((await call('/internal/dotscramble/devices/laptop1','DELETE')).status,204);
 assert.equal((await call('/internal/dotscramble/devices/laptop1','DELETE')).status,404);
 assert.equal((await license('recheck',b.plaintext_key,{machine_id:'laptop1'})).status,401);
 assert.deepEqual(await ids(),['newid']);
 assert.equal((await license('activate',d.plaintext_key,{machine_id:'third'})).status,200);

 // Deactivating in the app frees the slot (and an old-ID slot) and retires the key
 assert.equal((await license('deactivate',d.plaintext_key,{machine_id:'third',previous_machine_id:'nothere'})).status,204);
 assert.equal((await license('recheck',d.plaintext_key,{machine_id:'third'})).status,401);
 assert.deepEqual(await ids(),['newid']);

 // Revoking a key on the API keys page frees the computers that used it
 assert.equal((await call(`/internal/keys/${cKey.key_prefix}`,'DELETE')).status,204);
 assert.deepEqual(await ids(),[]);

 // Keys made by hand on the dashboard are never retired automatically
 const manual=await newKey('dashboard'),f=await newKey();
 assert.equal((await license('activate',manual.plaintext_key,{machine_id:'shared'})).status,200);
 assert.equal((await license('activate',f.plaintext_key,{machine_id:'shared'})).status,200);
 assert.equal((await license('recheck',manual.plaintext_key,{machine_id:'shared'})).status,200,'a manual key keeps working');

 // Rotating a key keeps its devices
 const rotated=await call(`/internal/keys/${f.key_prefix}/rotate`,'POST');assert.equal(rotated.status,200);
 assert.equal((await license('recheck',rotated.value.plaintext_key,{machine_id:'shared'})).status,200);

 // Another account can't see or remove these devices
 const other={...internal,'X-User-Id':String(new ObjectId())};
 assert.equal((await request('/internal/dotscramble/devices/shared',{method:'DELETE',headers:other})).status,404);
 console.log('License scenarios passed: activate, reconnect, ID migration, limit, website removal, deactivate, key revoke, manual keys, rotation, isolation.');
} finally { await client.close(); }
