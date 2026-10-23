/** Integration regression test: local Core + a disposable PostgreSQL test database. */
import assert from 'node:assert/strict';
import { createHmac, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import dotenv from 'dotenv';
import {PgFixtureClient,ObjectId} from './pg-fixtures.mjs';

const config = process.env.BILLING_CONFIG_JSON ? JSON.parse(process.env.BILLING_CONFIG_JSON) : dotenv.parse(readFileSync(process.env.CORE_ENV_PATH || '../dotsuite-core/.env'));
assert.equal(config.TEST_DATABASE_NAME, process.env.BILLING_TEST_DB, 'Core and tests must use the same isolated database');
assert.equal(config.LEMON_TEST_MODE, 'true', 'Only Test mode is allowed');
const database = process.env.BILLING_TEST_DB;
assert.ok(database?.startsWith('dotsuite_billing_test_'), 'Set BILLING_TEST_DB to an isolated dotsuite_billing_test_* database');
const coreUrl = process.env.BILLING_CORE_URL || 'http://127.0.0.1:18080';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(coreUrl).hostname), 'Only local Core servers are supported');
const client = new PgFixtureClient(config.DATABASE_URL);
const id = new ObjectId();
const token = `ds_prod_${randomBytes(24).toString('hex')}`;
const prefix = token.slice(0, 16);
const timestamp = (sequence) => new Date(Date.UTC(2026, 9, 19, 0, sequence)).toISOString();
let checks = 0;
const subscriptionDates = new Map();
const orderDates = new Map();
const subscriptionOrders = new Map();
const subscriptionVariants = new Map();
async function coreRequest(path, options) {
  for (let retry = 0; retry < 5; retry++) {
    const response = await fetch(`${coreUrl}${path}`, options);
    if (response.status !== 429) return response;
    await response.text();
    const seconds = Number(response.headers.get('retry-after')) || 10;
    await new Promise((resolve) => setTimeout(resolve, Math.min(seconds, 30) * 1000));
  }
  throw new Error('Core rate limit did not clear');
}

async function status() {
  const response = await coreRequest('/internal/billing/status', { headers: {
    'X-Internal-Secret': config.INTERNAL_API_SECRET, 'X-User-Id': id.toHexString(),
  } });
  assert.equal(response.status, 200);
  return response.json();
}
async function webhook(event, { subscription = '900001', order, sequence = 1, ...attributes } = {}, options = {}) {
  order = order ?? subscriptionOrders.get(subscription) ?? 800001;
  if (event === 'subscription_created' && !subscriptionDates.has(subscription)) {
    subscriptionDates.set(subscription, attributes.created_at || timestamp(sequence));
    orderDates.set(order, attributes.created_at || timestamp(sequence));
    subscriptionOrders.set(subscription,order);
    subscriptionVariants.set(subscription,attributes.variant_id || Number(config.LS_VARIANT_PRO_MONTHLY));
  }
  const created = event.startsWith('order_') ? (orderDates.get(order) || timestamp(sequence))
    : event.startsWith('subscription_payment_') ? (attributes.created_at || timestamp(sequence))
    : (subscriptionDates.get(subscription) || timestamp(sequence));
  const body = JSON.stringify({
    meta: { event_name: event, ...(options.withoutCustom ? {} : {custom_data: { user_id: options.userId || id.toHexString() }}) },
    data: { id: event.startsWith('order_') ? String(order) : subscription, attributes: {
      store_id: Number(config.LEMON_STORE_ID), test_mode: true,
      customer_id: 700001, variant_id: subscriptionVariants.get(subscription) || Number(config.LS_VARIANT_PRO_MONTHLY),
      order_id: order, status: event.startsWith('order_') ? 'paid' : 'active', created_at: created, updated_at: timestamp(sequence), ends_at: null, ...attributes,
    } },
  });
  const signature = options.invalidSignature ? 'invalid' : createHmac('sha256', config.LEMON_WEBHOOK_SECRET).update(body).digest('hex');
  const response = await coreRequest('/v1/webhooks/lemon', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Signature': signature }, body,
  });
  assert.equal(response.status, options.expectedStatus || 200, `${event}: ${await response.text()}`);
  checks++;
}

try {
  await client.connect();
  const db = client.db(database);
  await db.collection('users').insertOne({
    _id: id, email: `billing-regression-${id}@example.com`, name: 'Billing regression test',
    is_active: true, tier: 'free', posts_used: 7, images_used: 2,
    referral_code: randomBytes(8).toString('hex'), createdAt: new Date(), updatedAt: new Date(),
  });
  await db.collection('api_keys').insertOne({
    user_id: id, key_hash: createHmac('sha256', config.API_TOKEN_SECRET).update(token).digest('hex'),
    key_prefix: prefix, label: 'Disposable billing regression test', is_active: true,
    scopes: ['account:read'], created_at: new Date(),
  });
  const extensionResponse = await coreRequest('/v1/billing/status', { headers: { Authorization: `Bearer ${token}` } });
  assert.equal(extensionResponse.status, 200, 'The extension billing route must be registered');
  assert.equal((await status()).tier, 'free');
  await webhook('order_created');
  assert.equal((await status()).tier, 'free', 'An order receipt must not grant subscription access');
  await webhook('subscription_created');
  assert.equal((await status()).ls_subscription_id, '900001');
  await db.collection('users').updateOne({ _id: id }, { $set: { posts_used: 12, images_used: 3 } });
  await webhook('subscription_created');
  await webhook('order_created');
  let billing = await status();
  assert.equal(billing.posts_used, 12, 'Retries must preserve usage');
  assert.equal(billing.images_used, 3);
  assert.equal(billing.ls_subscription_id, '900001', 'Order IDs must not replace subscription IDs');
  await webhook('subscription_expired', {}, { invalidSignature: true, expectedStatus: 401 });
  await webhook('subscription_expired', { test_mode: false });
  await webhook('subscription_expired', { store_id: 999999 });
  assert.equal((await status()).tier, 'pro', 'Different mode/store events must be ignored');
  await webhook('subscription_created', {}, { userId: new ObjectId().toHexString(), expectedStatus: 500 });
  await webhook('subscription_created', { subscription: '900002', order: 800002, created_at:timestamp(2), sequence: 2, variant_id: Number(config.LS_VARIANT_MAX_MONTHLY) });
  await webhook('subscription_cancelled', { sequence: 3, ends_at: new Date(Date.now() + 30 * 86400000).toISOString() });
  await webhook('subscription_expired', { sequence: 4, status: 'expired' });
  assert.equal((await status()).tier, 'max', 'Old subscriptions cannot expire a newer purchase');
  await webhook('subscription_cancelled', { subscription: '900002', sequence: 5, status: 'cancelled', ends_at: new Date(Date.now() + 30 * 86400000).toISOString() });
  assert.ok((await status()).subscription_ends_at);
  await webhook('subscription_updated', { subscription: '900002', sequence: 6, variant_id: Number(config.LS_VARIANT_MAX_MONTHLY) });
  assert.equal((await status()).subscription_ends_at, null, 'Resuming must clear cancellation date');
  await webhook('order_refunded', {status:'refunded', refunded:true, total:1500, refunded_amount:1500});
  assert.equal((await status()).tier, 'max', 'Refund of an older order must preserve the current plan');
  await webhook('order_refunded', { order: 800002, status:'refunded', refunded:true, total:3000, refunded_amount:3000 });
  assert.equal((await status()).tier, 'free');
  await webhook('subscription_created', { subscription: '900002', order: 800002, created_at:timestamp(2), sequence: 2, variant_id: Number(config.LS_VARIANT_MAX_MONTHLY) });
  assert.equal((await status()).tier, 'free', 'Replayed creation must not restore a refunded purchase');
  await webhook('subscription_created', { subscription: '900003', order: 800003, created_at:timestamp(7), sequence: 7 });
  await webhook('subscription_expired', { subscription: '900003', sequence: 8, status: 'expired' });
  await webhook('subscription_created', { subscription: '900003', order: 800003, created_at:timestamp(7), sequence: 7 });
  assert.equal((await status()).tier, 'free', 'Stale creation cannot restore an expired subscription');

  const scenarios = ['activation, duplicate delivery, old subscriptions, cancellation, expiry, store/mode isolation'];
  async function reset() {
    subscriptionDates.clear(); orderDates.clear(); subscriptionOrders.clear(); subscriptionVariants.clear();
    const fields = ['billing_state','billing_revision','billing_manual_tier','billing_manual_source','billing_products','billing_switches',
      'ls_subscription_id','ls_order_id','ls_subscription_ids','ls_order_ids','ls_refunded_order_ids','ls_subscription_updated_at','subscription_ends_at','dotscramble_active','dotscramble_ends_at'];
    await db.collection('users').updateOne({_id:id}, {$unset:Object.fromEntries(fields.map(k=>[k,''])),
      $set:{tier:'free',posts_used:7,images_used:2,quota_period:new Date().toISOString().slice(0,7)}});
  }
  const extras = JSON.parse(config.LEMON_ADDITIONAL_PLANS || '[]');
  const catalog = [
    {variant_id:Number(config.LS_VARIANT_PRO_MONTHLY),product:'dotshare',tier:'pro',cycle:'monthly',payment_type:'subscription'},
    {variant_id:Number(config.LS_VARIANT_PRO_YEARLY),product:'dotshare',tier:'pro',cycle:'annually',payment_type:'subscription'},
    {variant_id:Number(config.LS_VARIANT_MAX_MONTHLY),product:'dotshare',tier:'max',cycle:'monthly',payment_type:'subscription'},
    {variant_id:Number(config.LS_VARIANT_MAX_YEARLY),product:'dotshare',tier:'max',cycle:'annually',payment_type:'subscription'},
    {variant_id:Number(config.LS_VARIANT_DOTSCRAMBLE_MAX_MONTHLY),product:'dotscramble',tier:'max',cycle:'monthly',payment_type:'one_time'},
    {variant_id:Number(config.LS_VARIANT_DOTSCRAMBLE_MAX_YEARLY),product:'dotscramble',tier:'max',cycle:'annually',payment_type:'one_time'},
    ...extras,
  ];
  assert.equal(catalog.filter(p=>p.variant_id>0).length,12,'Configure the complete Test matrix');
  const recent = new Date(Date.now()-60000).toISOString();
  for(const [index,plan] of catalog.entries()) {
    await reset();
    const isOrder=plan.payment_type==='one_time';
    const attrs={subscription:String(950000+index),order:850000+index,variant_id:plan.variant_id,created_at:recent,updated_at:recent,
      status:isOrder?'paid':'active',...(isOrder?{first_order_item:{variant_id:plan.variant_id}}:{})};
    await webhook(isOrder?'order_created':'subscription_created',attrs);
    let current=await status();
    assert.equal(current.products[plan.product].tier,plan.tier);
    const other=plan.product==='dotshare'?'dotscramble':'dotshare';
    assert.equal(current.products[other].tier,'free','Purchases must be isolated by product');
    assert.equal(current.tier,plan.product==='dotshare'?plan.tier:'free');
    await db.collection('users').updateOne({_id:id},{$set:{posts_used:13,images_used:4}});
    await webhook(isOrder?'order_created':'subscription_created',attrs);
    current=await status();assert.equal(current.posts_used,13);assert.equal(current.images_used,4);
    if(isOrder)assert.ok(current.products[plan.product].one_time_ends_at>Date.now());
    scenarios.push(`${plan.product}/${plan.tier}/${plan.payment_type}/${plan.cycle}: activation, duplicate, product isolation`);
  }

  await reset();
  await webhook('order_refunded',{order:860001,status:'refunded',refunded:true,total:1500,refunded_amount:1500,sequence:22});
  await webhook('subscription_created',{subscription:'960001',order:860001,sequence:20});
  assert.equal((await status()).tier,'free','Refund-before-creation must remain revoked');
  scenarios.push('full refund before subscription creation');

  await reset();
  await webhook('subscription_created',{subscription:'960002',order:860002,sequence:23});
  await webhook('order_refunded',{order:860002,status:'partial_refund',refunded:false,total:1500,refunded_amount:100,sequence:24});
  assert.equal((await status()).tier,'pro','Partial refund must retain access');
  await webhook('order_refunded',{order:860002,status:'refunded',refunded:true,total:1500,refunded_amount:1500,sequence:25});
  assert.equal((await status()).tier,'free');
  await webhook('subscription_updated',{subscription:'960002',order:860002,sequence:26});
  assert.equal((await status()).tier,'free','Later subscription snapshots cannot undo a refund');
  scenarios.push('partial vs full refund, including later subscription_updated');

  await reset();
  await webhook('subscription_created',{subscription:'960003',order:860003,sequence:27});
  await db.collection('users').updateOne({_id:id},{$set:{posts_used:22,images_used:6}});
  const renewal={subscription:'970001',subscription_id:960003,billing_reason:'renewal',status:'paid',created_at:timestamp(28),sequence:28};
  await webhook('subscription_payment_success',renewal);
  assert.equal((await status()).posts_used,0,'A successful renewal starts usage once');
  await db.collection('users').updateOne({_id:id},{$set:{posts_used:9,images_used:2}});
  await webhook('subscription_payment_recovered',renewal);
  assert.equal((await status()).posts_used,9,'Recovered duplicate must not reset twice');
  await webhook('subscription_payment_refunded',{...renewal,created_at:timestamp(28),sequence:29,status:'partial_refund',total:1500,refunded_amount:100,refunded:false});
  assert.equal((await status()).tier,'pro');
  await webhook('subscription_payment_refunded',{...renewal,created_at:timestamp(28),sequence:30,status:'refunded',total:1500,refunded_amount:1500,refunded:true});
  assert.equal((await status()).tier,'free');
  await webhook('subscription_payment_recovered',{...renewal,sequence:31});
  assert.equal((await status()).tier,'free','Recovery cannot undo a full invoice refund');
  await webhook('subscription_payment_success',{...renewal,subscription:'970002',created_at:timestamp(32),sequence:32});
  assert.equal((await status()).tier,'pro','A new paid period restores access');
  await webhook('subscription_payment_refunded',{...renewal,created_at:timestamp(28),sequence:33,status:'refunded',refunded:true});
  assert.equal((await status()).tier,'pro','Older refunded invoice must preserve newer payment');
  scenarios.push('renewal, recovery, partial/full invoice refunds, old refunded period');

  await reset();
  const once=catalog.find(p=>p.product==='dotshare'&&p.tier==='pro'&&p.payment_type==='one_time'&&p.cycle==='monthly');
  await webhook('order_created',{order:860010,variant_id:once.variant_id,status:'paid',created_at:recent,updated_at:recent});
  const before=(await status()).products.dotshare;
  const change=await coreRequest('/internal/billing/checkout',{method:'POST',headers:{'Content-Type':'application/json','X-Internal-Secret':config.INTERNAL_API_SECRET,'X-User-Id':id.toHexString()},body:JSON.stringify({product:'dotshare',tier:'pro',cycle:'annually',payment_type:'subscription'})});
  assert.equal(change.status,200);const deferred=await change.json();assert.equal(deferred.scheduled,true);assert.equal(deferred.checkout_url,null);assert.equal(deferred.starts_at,before.one_time_ends_at);
  assert.equal((await status()).tier,'pro','Scheduling never removes paid access');
  const pending=(await status()).pending_changes.dotshare;assert.equal(pending.ready,true);assert.equal(pending.plan.cycle,'annually');
  scenarios.push('one-time to recurring switch deferred without charge or access loss');

  await db.collection('users').updateOne({_id:id},{$set:{quota_period:'2020-01',posts_used:100,images_used:10}});
  assert.equal((await status()).posts_used,0,'Monthly quota expiry must be enforced on read');
  await db.collection('users').updateOne({_id:id},{$set:{posts_used:4}});
  assert.equal((await status()).posts_used,4,'Same month does not reset twice');
  scenarios.push('calendar-month quota reset once');

  await reset();
  const scramble=catalog.find(p=>p.product==='dotscramble'&&p.payment_type==='one_time'&&p.cycle==='monthly');
  await webhook('order_created',{order:860020,variant_id:scramble.variant_id,status:'paid',created_at:'2020-01-01T00:00:00Z',updated_at:'2020-01-01T00:00:00Z'});
  assert.equal((await status()).products.dotscramble.tier,'free','One-time access expires without a provider expiry event');
  await db.collection('api_keys').updateOne({user_id:id},{$set:{scopes:['account:read','dotscramble:verify']}});
  const denied=await coreRequest('/v1/license/activate',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({machine_id:'billing-test-machine'})});
  assert.equal(denied.status,403,'Expired one-time license must not activate');
  scenarios.push('fixed-term expiry and license enforcement');

  await reset();
  const concurrent={order:860030,variant_id:once.variant_id,status:'paid',created_at:recent,updated_at:recent};
  await Promise.all(Array.from({length:6},()=>webhook('order_created',concurrent)));
  const concurrentAccess=(await status()).products.dotshare;
  assert.ok(concurrentAccess.one_time_ends_at < Date.now()+32*86400000,'Concurrent replay must grant exactly one month');
  await Promise.all([
    webhook('order_refunded',{...concurrent,status:'refunded',refunded:true,total:1500,refunded_amount:1500,updated_at:new Date().toISOString()}),
    webhook('order_created',concurrent),
  ]);
  assert.equal((await status()).tier,'free','Concurrent refund and creation must converge to revoked access');
  scenarios.push('concurrent duplicate purchases and refund/creation race');

  await reset();
  const outOfOrder={variant_id:once.variant_id,status:'paid',created_at:recent,updated_at:recent};
  await webhook('order_created',{...outOfOrder,order:860051});
  await webhook('order_created',{...outOfOrder,order:860050});
  const queued=await status();assert.equal(queued.tier,'pro','Out-of-order payments must not create an unpaid gap');
  assert.ok(queued.products.dotshare.one_time_ends_at>Date.now()+55*86400000);
  await webhook('order_refunded',{...outOfOrder,order:860050,status:'refunded',refunded:true,total:1500,refunded_amount:1500});
  const remaining=(await status()).products.dotshare;
  assert.equal(remaining.one_time_ends_at,queued.products.dotshare.one_time_ends_at,'Refund must preserve the other assigned term');
  scenarios.push('out-of-order one-time purchases and preservation of the other paid term');
  await reset();await db.collection('users').updateOne({_id:id},{$set:{tier:'pro'}});
  const manual=await status();assert.equal(manual.tier,'pro');assert.equal(manual.products.dotshare.tier,'pro');
  scenarios.push('legacy manually granted DotShare access remains visible and usable');

  await reset();
  await db.collection('users').updateOne({_id:id},{$set:{billing_manual_tier:'max',billing_manual_source:'owner'}});
  let owner=await status();
  assert.equal(owner.tier,'max');assert.equal(owner.products.dotshare.payment_type,'owner');
  assert.equal(owner.ls_subscription_id,null);assert.equal(owner.products.dotshare.ends_at,null);
  assert.ok(!owner.managed_products.includes('dotshare'));
  const noCheckout=await coreRequest('/internal/billing/checkout',{method:'POST',headers:{'Content-Type':'application/json','X-Internal-Secret':config.INTERNAL_API_SECRET,'X-User-Id':id.toHexString()},body:JSON.stringify({product:'dotshare',tier:'max',cycle:'monthly',payment_type:'subscription'})});
  assert.equal(noCheckout.status,409,'Owner access must not create an unnecessary checkout');
  await webhook('order_created',{order:860060,variant_id:scramble.variant_id,status:'paid',created_at:recent,updated_at:recent});
  owner=await status();assert.equal(owner.products.dotscramble.tier,'max');
  await webhook('order_refunded',{order:860060,variant_id:scramble.variant_id,status:'refunded',refunded:true,total:1000,refunded_amount:1000,created_at:recent,updated_at:new Date().toISOString()});
  owner=await status();assert.equal(owner.products.dotscramble.tier,'free');assert.equal(owner.products.dotshare.payment_type,'owner');assert.equal(owner.tier,'max');
  scenarios.push('explicit owner Max grant survives reconciliation, blocks duplicate checkout and isolates DotScramble purchase/refund');

  if(process.env.BILLING_PROVIDER_TEST === 'true') {
    // Reuse only the known, already-cancelled disposable Test subscription.
    // The explicit mode/status guards run before any provider mutation.
    await reset();
    const lemonHeaders={Authorization:`Bearer ${config.LEMON_API_KEY}`,Accept:'application/vnd.api+json'};
    const source=await fetch('https://api.lemonsqueezy.com/v1/subscriptions/2618631',{headers:lemonHeaders});
    assert.equal(source.status,200);const provider=(await source.json()).data;
    assert.equal(provider.attributes.test_mode,true);assert.equal(provider.attributes.status,'cancelled');
    assert.equal(provider.attributes.store_id,Number(config.LEMON_STORE_ID));
    await webhook('subscription_created',{...provider.attributes,subscription:provider.id,order:provider.attributes.order_id});
    const managementHeaders={'Content-Type':'application/json','X-Internal-Secret':config.INTERNAL_API_SECRET,'X-User-Id':id.toHexString()};
    const details=await coreRequest('/internal/billing/subscription?product=dotshare',{headers:managementHeaders});
    assert.equal(details.status,200,'Owned provider Test subscription must be manageable');
    const managed=await details.json();assert.equal(managed.cancelled,true);assert.equal(managed.renews_at,null);assert.equal(managed.can_resume,true);
    assert.ok(managed.payment_method_url.includes(`/subscription/${provider.id}/payment-details?`));
    assert.ok(!(managed.payment_method_url.includes('app.lemonsqueezy.com/dashboard')));
    const forged=await coreRequest('/internal/billing/subscription',{method:'POST',headers:managementHeaders,body:JSON.stringify({product:'dotshare',action:'cancel',subscription_id:'999999'})});
    assert.equal(forged.status,422,'Browser-supplied provider IDs must be rejected');
    const otherProduct=await coreRequest('/internal/billing/subscription?product=dotscramble',{headers:managementHeaders});
    assert.equal(otherProduct.status,404,'One product cannot operate on the other product subscription');
    await db.collection('users').updateOne({_id:id},{$set:{[`billing_state.subscriptions.${provider.id}.customer_id`]:'wrong-customer'}});
    const otherOwner=await coreRequest('/internal/billing/subscription?product=dotshare',{headers:managementHeaders});
    assert.equal(otherOwner.status,403,'Provider customer ownership must match the authenticated ledger');
    await db.collection('users').updateOne({_id:id},{$set:{[`billing_state.subscriptions.${provider.id}.customer_id`]:String(provider.attributes.customer_id)}});
    try {
      const resumed=await coreRequest('/internal/billing/subscription',{method:'POST',headers:managementHeaders,body:JSON.stringify({product:'dotshare',action:'resume'})});
      assert.equal(resumed.status,200);assert.equal((await resumed.json()).cancelled,false);
      assert.equal((await status()).products.dotshare.ends_at,null,'Resume must immediately update local access without waiting for webhook');
    } finally {
      const cancelled=await coreRequest('/internal/billing/subscription',{method:'POST',headers:managementHeaders,body:JSON.stringify({product:'dotshare',action:'cancel'})});
      assert.equal(cancelled.status,200);const final=await cancelled.json();assert.equal(final.cancelled,true);assert.equal(final.renews_at,null);
    }
    assert.equal((await status()).products.dotshare.ends_at,Date.parse(provider.attributes.ends_at),'Cancel must preserve the paid end date');
    scenarios.push('account-scoped Test management: cancel/resume, correct signed payment link, immediate status, forged ID and cross-product/customer rejection');
    const outcome=await coreRequest('/internal/billing/checkout',{method:'POST',headers:{'Content-Type':'application/json','X-Internal-Secret':config.INTERNAL_API_SECRET,'X-User-Id':id.toHexString()},body:JSON.stringify({product:'dotshare',tier:'pro',cycle:'monthly',payment_type:'one_time'})});
    assert.equal(outcome.status,200);const scheduled=await outcome.json();assert.equal(scheduled.scheduled,true);assert.equal(scheduled.checkout_url,null);
    const after=(await status()).products.dotshare;assert.equal(after.tier,'pro');assert.equal(after.ends_at,Date.parse(provider.attributes.ends_at));
    scenarios.push('provider Test API: recurring to one-time switch, cancellation response applied, paid end preserved');
    await reset();
    const providerCheckout=await coreRequest('/internal/billing/checkout',{method:'POST',headers:{'Content-Type':'application/json','X-Internal-Secret':config.INTERNAL_API_SECRET,'X-User-Id':id.toHexString()},body:JSON.stringify({product:'dotshare',tier:'pro',cycle:'monthly',payment_type:'subscription',locale:'en',return_url:'https://dotsuite.dev/en/dashboard/billing/complete?product=dotshare&tier=pro'})});
    assert.equal(providerCheckout.status,200,'Provider checkout must accept the expiration timestamp');
    const providerUrl=(await providerCheckout.json()).checkout_url;
    const checkoutId=new URL(providerUrl).pathname.split('/').pop();
    const checkoutDetails=await fetch('https://api.lemonsqueezy.com/v1/checkouts/'+checkoutId,{headers:lemonHeaders});
    assert.equal(checkoutDetails.status,200);const checkoutAttrs=(await checkoutDetails.json()).data.attributes;
    assert.equal(checkoutAttrs.test_mode,true);assert.ok(Date.parse(checkoutAttrs.expires_at)>Date.now());
    assert.equal(checkoutAttrs.checkout_options.locale,'en');assert.equal(checkoutAttrs.checkout_data.custom.user_id,id.toHexString());
    assert.equal((await status()).tier,'free','Creating a real provider Test checkout must not grant access');
    scenarios.push('real provider Test checkout creation, expiration accepted, correct mode/locale/account, no payment');

  }

  await reset();
  const shortStart=new Date(Date.now()-27*86400000).toISOString();
  await webhook('order_created',{order:860040,variant_id:scramble.variant_id,status:'paid',created_at:shortStart,updated_at:shortStart});
  const expires=(await status()).products.dotscramble.ends_at;
  const activated=await coreRequest('/v1/license/activate',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({machine_id:'billing-test-machine'})});
  assert.equal(activated.status,200,'A valid one-time DotScramble purchase must activate');
  const license=(await activated.json()).license_token;
  const claims=JSON.parse(Buffer.from(license.split('.')[0],'base64url').toString('utf8'));
  assert.equal(claims.uid,id.toHexString());assert.ok(claims.exp<=Math.floor(expires/1000),'Offline token cannot outlive the purchased term');
  await webhook('order_refunded',{order:860040,variant_id:scramble.variant_id,status:'refunded',refunded:true,total:1000,refunded_amount:1000,created_at:shortStart,updated_at:new Date().toISOString()});
  const revoked=await coreRequest('/v1/license/recheck',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({machine_id:'billing-test-machine'})});
  assert.equal(revoked.status,403,'Full refund must revoke online license recheck');
  scenarios.push('one-time license activation, token expiry bound, online revocation after full refund');

  // Payment delivery must not share the public browsing governor.
  const diagnostic=JSON.stringify({meta:{event_name:'diagnostic_burst'},data:{id:'probe',attributes:{store_id:Number(config.LEMON_STORE_ID),test_mode:true}}});
  const sig=createHmac('sha256',config.LEMON_WEBHOOK_SECRET).update(diagnostic).digest('hex');
  const burst=await Promise.all(Array.from({length:35},()=>fetch(coreUrl+'/v1/webhooks/lemon',{method:'POST',headers:{'Content-Type':'application/json','X-Signature':sig},body:diagnostic})));
  assert.ok(burst.every(r=>r.status===200),'Signed webhook burst must not be IP-rate-limited');
  checks+=burst.length;scenarios.push('35 simultaneous signed webhook deliveries without 429');
  console.log(JSON.stringify({passed:true,webhook_requests:checks,scenarios},null,2));

} finally {
  const db = client.db(database);
  await Promise.all([
    db.collection('users').deleteOne({ _id: id }),
    db.collection('api_keys').deleteOne({ key_prefix: prefix, user_id: id }),
    db.collection('audit_logs').deleteMany({ user_id: id }),
    db.collection('refund_alerts').deleteMany({ user_id: id }),
    db.collection('dotscramble_activations').deleteMany({ user_id:id }),
  ]).catch(() => {});
  await client.close();
}
