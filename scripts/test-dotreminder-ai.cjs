/* Local fakes only. No real mail, database writes, user tokens or Gemini requests. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const root = process.env.DOTREMINDER_TEST_REPO || path.resolve(__dirname, '..');
const realRequire = createRequire(path.join(root, 'package.json'));
const ts = realRequire('typescript');

function loader(overrides = {}, env = {}) {
  const cache = new Map();
  function load(relative) {
    const filename = path.join(root, relative);
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} }; cache.set(filename, module);
    const source = fs.readFileSync(filename, 'utf8');
    const code = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    function requireModule(name) {
      if (Object.hasOwn(overrides, name)) return overrides[name];
      if (name.startsWith('@/lib/dotreminder/')) return load('src/lib/dotreminder/' + name.slice('@/lib/dotreminder/'.length) + '.ts');
      if (name.startsWith('./')) return load(path.relative(root, path.resolve(path.dirname(filename), name + '.ts')));
      return realRequire(name);
    }
    vm.runInNewContext(code, {module,exports:module.exports,require:requireModule,Request,Response,Headers,TextDecoder,Uint8Array,AbortSignal,Intl,Date,URL,fetch,process:{env},console:{error:()=>{},log:()=>{}},setTimeout,clearTimeout}, {filename});
    return module.exports;
  }
  return load;
}
const load = loader();
const validation = load('src/lib/dotreminder/request.ts');
const provider = load('src/lib/dotreminder/service.ts');
const auth = load('src/lib/dotreminder/auth.ts');
const input = {operation:'chat',text:'[{"role":"user","content":"A fake reminder request"}]',nowMillis:1793750400000,timeZone:'Africa/Cairo'};
const request = (body=input,authorization='Bearer fake-review-token') => new Request('http://localhost/api/dotreminder/ai',{method:'POST',headers:{'content-type':'application/json',...(authorization?{authorization}:{})},body:JSON.stringify(body)});

test('missing or malformed credentials are rejected by the real verifier before model access', async()=>{
  await assert.rejects(()=>auth.verifyDotReminderUser(null),error=>error.status===401);
  await assert.rejects(()=>auth.verifyDotReminderUser('Bearer not-a-jwt'),error=>error.status===401);
});
test('unsigned tokens are rejected by Firebase Admin verification',async()=>{
  const now=Math.floor(Date.now()/1000);
  const token=Buffer.from(JSON.stringify({alg:'none',kid:'fake-review'})).toString('base64url')+'.'+Buffer.from(JSON.stringify({aud:'remindme-56f27',iss:'https://securetoken.google.com/remindme-56f27',sub:'fake-user',iat:now,exp:now+3600,auth_time:now})).toString('base64url')+'.';
  await assert.rejects(()=>auth.verifyDotReminderUser('Bearer '+token),error=>error.status===401);
});
test('JSON schema rejects arbitrary operations, extra proxy targets and invalid timezones',async()=>{
  for(const body of [{...input,operation:'proxy'},{...input,url:'https://example.com'},{...input,timeZone:'Not/AZone'},{...input,text:'x'.repeat(24001)}])
    await assert.rejects(()=>validation.readAiRequest(request(body)),error=>error.status===400);
});
test('body limit works without a content-length header',async()=>{
  const oversized=new Request('http://localhost',{method:'POST',headers:{'content-type':'application/json'},body:'x'.repeat(validation.MAX_AI_BODY_BYTES+1)});
  await assert.rejects(()=>validation.readAiRequest(oversized),error=>error.status===413);
});
test('valid Arabic content and device timezone survive validation',async()=>{
  const parsed=await validation.readAiRequest(request({...input,text:'ذكّرني بالمياه بعد عشر دقائق'}));
  assert.equal(parsed.text,'ذكّرني بالمياه بعد عشر دقائق');assert.equal(parsed.timeZone,'Africa/Cairo');
});
test('provider key goes in a server header, never in URL or returned response',async()=>{
  const reply=await provider.generateReminderReply(input,{key:'SERVER_ONLY_TEST_KEY',model:'gemini-2.5-flash',signal:new AbortController().signal,fetcher:async(url,options)=>{
    assert.equal(url.includes('SERVER_ONLY_TEST_KEY'),false);
    assert.equal(options.headers['x-goog-api-key'],'SERVER_ONLY_TEST_KEY');
    const body=JSON.parse(options.body);assert.ok(body.systemInstruction.parts[0].text.includes('Africa/Cairo'));
    return Response.json({candidates:[{content:{parts:[{thought:true,text:'not for client'},{text:'A fake reply'}]}}]});
  }});
  assert.equal(reply,'A fake reply');
});
test('provider throttling becomes a retryable limit error',async()=>{
  await assert.rejects(()=>provider.generateReminderReply(input,{key:'test-key',model:'gemini-2.5-flash',signal:new AbortController().signal,fetcher:async()=>new Response('',{status:429})}),error=>error.status===429&&error.retryAfter===60);
});
test('provider failures do not expose raw error bodies',async()=>{
  await assert.rejects(()=>provider.generateReminderReply(input,{key:'test-key',model:'gemini-2.5-flash',signal:new AbortController().signal,fetcher:async()=>new Response('SENSITIVE_PROVIDER_ERROR',{status:403})}),error=>error.code==='ai_unavailable'&&!error.message.includes('SENSITIVE'));
});
test('a missing key or unapproved model cannot call arbitrary hosts',async()=>{
  let calls=0;
  for(const options of [{key:'',model:'gemini-2.5-flash'},{key:'test-key',model:'https://example.com'}])
    await assert.rejects(()=>provider.generateReminderReply(input,{...options,signal:new AbortController().signal,fetcher:async()=>{calls++;return new Response()}}),error=>error.status===503);
  assert.equal(calls,0);
});
test('malformed generated reminder JSON is rejected',()=>{
  assert.throws(()=>validation.validateAiReply('{"title":"missing fields"}','extract'),error=>error.status===502);
  assert.throws(()=>validation.validateAiReply('','chat'),error=>error.status===502);
});
test('bounded valid reminder data is passed through for user review',()=>{
  const reminder={title:'Fake reminder',reminderTime:input.nowMillis+600000,category:'Other',isRecurring:false,recurrenceIntervalMillis:null,recurrenceEndTime:null};
  assert.equal(JSON.parse(validation.validateAiReply(JSON.stringify(reminder),'extract')).title,reminder.title);
});
function routeFixture({verify=async()=> 'fake-user',limit=true,key='SERVER_ONLY_TEST_KEY',useRealAuth=false,limitFailure=false}={}) {
  let generates=0,limits=[];
  const overrides={
    '@/lib/rateLimit':{getClientIP:()=> '127.0.0.1',checkRateLimit:async(...args)=>{limits.push(args);if(limitFailure)throw new Error('Fake storage failure');return {success:limit,resetIn:120}}},
    '@/lib/dotreminder/auth':{verifyDotReminderUser:verify},
    '@/lib/dotreminder/service':{generateReminderReply:async()=>{generates++;return 'Fake reply'}},
  };
  if(useRealAuth) delete overrides['@/lib/dotreminder/auth'];
  const require=loader(overrides,{DOTREMINDER_GEMINI_API_KEY:key});
  return {route:require('src/app/api/dotreminder/ai/route.ts'),get generates(){return generates},limits};
}
test('route checks account before any quota or model call',async()=>{
  const fixture=routeFixture({useRealAuth:true});const response=await fixture.route.POST(request(input,null));
  assert.equal(response.status,401);assert.equal(fixture.limits.length,0);assert.equal(fixture.generates,0);
});
test('route validates input before quota or model work',async()=>{
  const fixture=routeFixture();const response=await fixture.route.POST(request({...input,operation:'proxy'}));
  assert.equal(response.status,400);assert.equal(fixture.generates,0);assert.equal(fixture.limits.length,0);
});
test('route limits both account and hashed IP and prevents model use when blocked',async()=>{
  const fixture=routeFixture({limit:false});const response=await fixture.route.POST(request());
  assert.equal(response.status,429);assert.equal(response.headers.get('retry-after'),'120');assert.equal(fixture.generates,0);
  assert.equal(fixture.limits.length,3);assert.equal(fixture.limits[0][0],'dotreminder-ai:user:fake-user');
  assert.ok(!fixture.limits[2][0].includes('127.0.0.1'));
});
test('successful route responses are not cached and contain no key',async()=>{
  const fixture=routeFixture();const response=await fixture.route.POST(request());
  assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
  const body=await response.json();assert.equal(body.reply,'Fake reply');assert.equal(JSON.stringify(body).includes('SERVER_ONLY_TEST_KEY'),false);
});
test('unconfigured route fails closed without spending model quota',async()=>{
  const fixture=routeFixture({key:''});const response=await fixture.route.POST(request());
  assert.equal(response.status,503);assert.equal(fixture.generates,0);assert.equal(fixture.limits.length,0);
});

test('an accidentally configured Auth emulator is never trusted by this production verifier',async()=>{
  const verify=loader({}, {FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:9099'})('src/lib/dotreminder/auth.ts').verifyDotReminderUser;
  await assert.rejects(()=>verify('Bearer fake'),error=>error.status===503);
});
test('provider deadline is bounded and reported without internal error details',async()=>{
  const controller=new AbortController();controller.abort();
  await assert.rejects(()=>provider.generateReminderReply(input,{key:'test-key',model:'gemini-2.5-flash',signal:controller.signal,fetcher:async()=>{throw new Error('internal timeout')}}),error=>error.status===504);
});
test('quota storage failure prevents paid model calls',async()=>{
  const fixture=routeFixture({limitFailure:true});const response=await fixture.route.POST(request());
  assert.equal(response.status,503);assert.equal(fixture.generates,0);
});
