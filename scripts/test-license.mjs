/** DotScramble licensing against a real local Core + disposable PostgreSQL account. Never production. */
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {createServer} from 'node:http';
import {PgFixtureClient,ObjectId} from './pg-fixtures.mjs';
const c=JSON.parse(process.env.BILLING_CONFIG_JSON);
assert.equal(c.LEMON_TEST_MODE,'true');
assert.ok(c.TEST_DATABASE_NAME.startsWith('dotsuite_billing_test_'));
const base=process.env.BILLING_CORE_URL;assert.equal(new URL(base).hostname,'127.0.0.1');
const client=new PgFixtureClient(c.DATABASE_URL);
const id=new ObjectId();
const internal={'X-Internal-Secret':c.INTERNAL_API_SECRET,'X-User-Id':String(id),'Content-Type':'application/json'};

async function request(path,options){
 for(let retry=0;retry<12;retry++){
  const r=await fetch(base+path,options);
  if(r.status!==429){const text=await r.text();return{status:r.status,value:text?JSON.parse(text):null};}
  await r.text();
  const seconds=Number(r.headers.get('retry-after'))||10;
  await new Promise(done=>setTimeout(done,Math.min(seconds,30)*1000));
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

// A stand-in for Lemon Squeezy's refund API (Core is pointed at it via LEMON_API_BASE)
const lemonCalls=[];let lemonFails=new Set();
const lemon=createServer((req,res)=>{let body='';req.on('data',c=>body+=c);req.on('end',()=>{
 lemonCalls.push({method:req.method,path:req.url,body:body?JSON.parse(body):null,auth:req.headers.authorization});
 const failing=[...lemonFails].some(id=>req.url.includes(`/${id}/`));
 res.writeHead(failing?422:200,{'Content-Type':'application/vnd.api+json'});
 res.end(JSON.stringify(failing?{errors:[{detail:'Refund window closed'}]}:{data:{id:'x',type:'orders',attributes:{}}}));
});});
await new Promise(r=>lemon.listen(Number(new URL(c.LEMON_API_BASE).port),'127.0.0.1',r));
const staffHeaders=(email='admin@dotsuite.dev')=>({'X-Internal-Secret':c.INTERNAL_API_SECRET,'Content-Type':'application/json',...(email?{'X-Staff-Email':email}:{})});
const staff=(path,method='GET',body,email)=>request(path,{method,headers:staffHeaders(email),...(body===undefined?{}:{body:JSON.stringify(body)})});
const order=async(n)=>{const now=new Date().toISOString();const body=JSON.stringify({meta:{event_name:'order_created',custom_data:{user_id:String(id)}},data:{id:String(n),attributes:{store_id:Number(c.LEMON_STORE_ID),test_mode:true,customer_id:700001,variant_id:Number(c.LS_VARIANT_DOTSCRAMBLE_MAX_MONTHLY),order_id:n,status:'paid',total:1000,created_at:now,updated_at:now,ends_at:null}}});
 const r=await request('/v1/webhooks/lemon',{method:'POST',headers:{'Content-Type':'application/json','X-Signature':createHmac('sha256',c.LEMON_WEBHOOK_SECRET).update(body).digest('hex')},body});assert.equal(r.status,200);};

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
 // Usage counters arrive with the daily check: numbers per day, added up per machine
 const today=new Date().toISOString().slice(0,10);
 const shared=rotated.value.plaintext_key;
 assert.equal((await license('recheck',shared,{machine_id:'shared',usage:[{day:'1999-01-01',pro_saves:1}]})).status,400,'days far in the past are rejected');
 assert.equal((await license('recheck',shared,{machine_id:'shared',usage:[{day:today,pro_saves:200000}]})).status,400,'absurd counts are rejected');
 assert.equal((await license('recheck',shared,{machine_id:'shared',app_version:'1.6.0',usage:[{day:today,pro_saves:3,batch_images:10}]})).status,200);
 assert.equal((await license('recheck',shared,{machine_id:'shared',usage:[{day:today,pro_saves:2,ai_runs:1}]})).status,200);

 // Staff see everything needed to judge a refund
 const found=await staff('/v1/admin/customers/lookup?q='+encodeURIComponent(`LICENSE-${id}@example.com`));
 assert.equal(found.status,200);assert.equal(found.value.customers[0].id,String(id));
 assert.equal((await request('/v1/admin/customers/lookup?q=x',{headers:{}})).status,401,'internal secret required');
 let ev=await staff(`/v1/admin/customers/${id}/dotscramble`);assert.equal(ev.status,200,JSON.stringify(ev.value));
 const sharedDevice=ev.value.devices.find(d=>d.machine_id==='shared');
 assert.equal(sharedDevice.app_version,'1.6.0');assert.equal(sharedDevice.in_slot,true);assert.equal(sharedDevice.key.source,'dotscramble');
 assert.ok(ev.value.devices.find(d=>d.machine_id==='laptop1'&&d.in_slot===false),'removed devices stay in the history');
 assert.equal(ev.value.usage.total.pro_saves,5);assert.equal(ev.value.usage.total.batch_images,10);assert.equal(ev.value.usage.since_latest_payment.ai_runs,1);
 assert.equal(ev.value.usage.days[0].day,today);
 assert.ok(ev.value.events.some(e=>e.event==='license.device_removed_via_website'));
 const paid=ev.value.payments.find(p=>p.id==='870001');assert.equal(paid.kind,'order');assert.equal(paid.product,'dotscramble');assert.equal(paid.refundable,true);

 // Refund requests: logged, decided once, carried out through Lemon Squeezy
 assert.equal((await staff(`/v1/admin/customers/${id}/refund-requests`,'POST',{payment_kind:'order',payment_id:'870001',reason:'Did not work'},null)).status,400,'staff email required');
 assert.equal((await staff(`/v1/admin/customers/${id}/refund-requests`,'POST',{payment_kind:'order',payment_id:'999',reason:'x'})).status,404);
 let made=await staff(`/v1/admin/customers/${id}/refund-requests`,'POST',{payment_kind:'order',payment_id:'870001',reason:'Says it never worked'});
 assert.equal(made.status,201,JSON.stringify(made.value));const reqId=made.value.id;
 assert.equal((await staff(`/v1/admin/customers/${id}/refund-requests`,'POST',{payment_kind:'order',payment_id:'870001',reason:'again'})).status,409);
 assert.equal((await staff('/v1/admin/refund-requests')).value.requests.length,1);
 assert.equal((await staff(`/v1/admin/refund-requests/${reqId}/decision`,'POST',{decision:'approve',note:''})).status,400,'a reason is required');
 let decided=await staff(`/v1/admin/refund-requests/${reqId}/decision`,'POST',{decision:'approve',note:'Used 5 photos only'});
 assert.equal(decided.status,200,JSON.stringify(decided.value));assert.equal(decided.value.status,'approved');
 assert.equal(lemonCalls.length,1);assert.equal(lemonCalls[0].path,'/orders/870001/refund');assert.equal(lemonCalls[0].method,'POST');
 assert.deepEqual(lemonCalls[0].body,{data:{type:'orders',id:'870001'}});assert.match(lemonCalls[0].auth,/^Bearer /);
 assert.equal((await staff(`/v1/admin/refund-requests/${reqId}/decision`,'POST',{decision:'approve',note:'twice'})).status,409,'never refunds twice');

 // A provider rejection is kept, explained and can be retried; a denial needs a reason too
 await order(870002);lemonFails=new Set(['870002']);
 const second=(await staff(`/v1/admin/customers/${id}/refund-requests`,'POST',{payment_kind:'order',payment_id:'870002',reason:'Changed my mind'})).value.id;
 const failed=await staff(`/v1/admin/refund-requests/${second}/decision`,'POST',{decision:'approve',note:'ok'});
 assert.equal(failed.status,409);assert.match(JSON.stringify(failed.value),/Refund window closed/);
 ev=await staff(`/v1/admin/customers/${id}/dotscramble`);
 assert.equal(ev.value.refund_requests.find(r=>r.id===second).status,'failed');
 assert.equal((await staff(`/v1/admin/refund-requests/${second}/decision`,'POST',{decision:'deny',note:'Used Batch on 10 photos after buying'})).status,200);
 ev=await staff(`/v1/admin/customers/${id}/dotscramble`);
 const denied=ev.value.refund_requests.find(r=>r.id===second);assert.equal(denied.status,'denied');assert.equal(denied.decided_by,'admin@dotsuite.dev');
 assert.ok(ev.value.events.some(e=>e.event==='refund.approved')&&ev.value.events.some(e=>e.event==='refund.denied'));
 console.log('License scenarios passed: activate, reconnect, ID migration, limit, website removal, deactivate, key revoke, manual keys, rotation, isolation, usage, staff evidence, refund approve/deny/retry.');
} finally { await client.close(); lemon.close(); }
