/** Real local Core + disposable PostgreSQL account. Never uses production data. */
import assert from 'node:assert/strict';
import {PgFixtureClient,ObjectId} from './pg-fixtures.mjs';
const c=JSON.parse(process.env.BILLING_CONFIG_JSON);
assert.equal(c.LEMON_TEST_MODE,'true');
assert.ok(c.TEST_DATABASE_NAME.startsWith('dotsuite_billing_test_'));
const base=process.env.BILLING_CORE_URL;assert.equal(new URL(base).hostname,'127.0.0.1');
const client=new PgFixtureClient(c.DATABASE_URL);
const id=new ObjectId(),other=new ObjectId();
const requests=[];
const headersFor=uid=>({'X-Internal-Secret':c.INTERNAL_API_SECRET,'X-User-Id':String(uid),'Content-Type':'application/json'});
async function call(path,method='GET',body,uid=id) {
 const r=await fetch(base+path,{method,headers:headersFor(uid),...(body===undefined?{}:{body:JSON.stringify(body)})});
 const value=r.status===204?null:await r.json(); return {status:r.status,value};
}
const create=()=>call('/internal/keys/generate','POST',{label:'Disposable key',scopes:['account:read'],expires_in_days:30,source:'vscode'});
const ping=async token=>(await fetch(base+'/v1/ping',{headers:{Authorization:'Bearer '+token}})).status;
try {
 await client.connect();const db=client.db(c.TEST_DATABASE_NAME);
 await db.collection('users').insertMany([id,other].map(_id=>({_id,email:`keys-${_id}@example.com`,referral_code:String(_id),is_active:true,tier:'free',createdAt:new Date(),updatedAt:new Date()})));
 const list=async history=>{const r=await call('/internal/keys'+(history?'?include_inactive=true':''));assert.equal(r.status,200);return r.value;};
 for(let i=0;i<9;i++){const r=await create();assert.equal(r.status,201);requests.push(r.value);}
 const competing=await Promise.all(Array.from({length:5},()=>create()));
 assert.equal(competing.filter(r=>r.status===201).length,1);
 assert(competing.every(r=>[201,403,409].includes(r.status)));requests.push(competing.find(r=>r.status===201).value);
 assert.equal((await list()).length,10);
 assert.equal((await create()).status,403);
 const key=requests[0]; assert.equal(await ping(key.plaintext_key),200);
 assert.equal((await call(`/internal/keys/${key.key_prefix}`,'PATCH',{label:'Named laptop'},other)).status,404);
 assert.equal((await call(`/internal/keys/${key.key_prefix}/rotate`,'POST',undefined,other)).status,404);
 assert.equal((await call(`/internal/keys/${key.key_prefix}`,'DELETE',undefined,other)).status,404);
 assert.equal((await call('/internal/keys','GET',undefined,other)).value.length,0);
 assert.equal((await call(`/internal/keys/${key.key_prefix}`,'PATCH',{label:'Named laptop'})).status,204);
 const replaced=await call(`/internal/keys/${key.key_prefix}/rotate`,'POST');assert.equal(replaced.status,200);
 const next=replaced.value;assert.notEqual(next.key_prefix,key.key_prefix);assert.deepEqual(next.scopes,['account:read']);assert.equal(next.expires_at,key.expires_at);assert.equal(next.label,'Named laptop');
 assert.equal((await list()).length,10,'Replacement works at full capacity without another record');
 assert.equal(await ping(key.plaintext_key),401);assert.equal(await ping(next.plaintext_key),200);
 const denied=await fetch(base+'/v1/posts',{headers:{Authorization:'Bearer '+next.plaintext_key}});assert.equal(denied.status,403,'Replacement never broadens scope');
 assert.equal((await call(`/internal/keys/${key.key_prefix}/rotate`,'POST')).status,404);
 assert.equal((await call(`/internal/keys/${next.key_prefix}`,'DELETE')).status,204);assert.equal(await ping(next.plaintext_key),401);
 assert.equal((await list()).length,9);let history=await list(true);assert.equal(history.find(k=>k.key_prefix===next.key_prefix).status,'revoked');
 await db.collection('users').updateOne({_id:id},{$set:{api_key_creation_lock:{id:'abandoned',expires_at:new Date(Date.now()-1000)}}});
 const recovered=await create();assert.equal(recovered.status,201,'Expired creation lease is recoverable');
 await db.collection('api_keys').updateOne({key_prefix:recovered.value.key_prefix},{$set:{expires_at:new Date(Date.now()-1000)}});
 assert.equal((await list(true)).find(k=>k.key_prefix===recovered.value.key_prefix).status,'expired');
 assert.equal((await call(`/internal/keys/${recovered.value.key_prefix}/rotate`,'POST')).status,404,'Cannot restore expired access by rotating');
 assert.equal((await create()).status,201,'Expired key frees a slot');
 assert.equal((await list(true)).filter(k=>k.status==='active').length,10);
 assert.equal((await call('/internal/keys/generate','POST',{label:'Bad',scopes:['invalid']})).status,400);
 assert.equal((await call('/internal/keys/generate','POST',{label:'Bad',expires_in_days:1})).status,400);
 history=await list(true);assert(history.every(k=>!('key_hash'in k)&&!('plaintext_key'in k)));
 assert(history.some(k=>k.source==='vscode'));assert(history.some(k=>k.rotated_at&&k.revoked_at));
 const audit=JSON.stringify(await db.collection('audit_logs').find({user_id:id}).toArray());
 for(const k of [...requests,next])assert(!audit.includes(k.plaintext_key));
 console.log(JSON.stringify({passed:true,scenarios:['10-active limit under concurrent creation','rotation at capacity preserves scope and expiry','old secret rejected and new secret accepted','rename and cross-account isolation','revocation frees a slot and disables auth','inactive history without secret/hash exposure','expiry and abandoned-lease recovery','invalid scopes and expiry rejected','metadata and audit contain no secrets']}));
} finally {
 const db=client.db(c.TEST_DATABASE_NAME);
 await db.collection('api_keys').deleteMany({user_id:{$in:[id,other]}});
 await db.collection('audit_logs').deleteMany({user_id:{$in:[id,other]}});
 await db.collection('users').deleteMany({_id:{$in:[id,other]}});
 await client.close();
}
