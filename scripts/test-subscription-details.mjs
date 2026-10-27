import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const file=new URL('../src/components/pricing/SubscriptionDetails.tsx',import.meta.url);
const compiled=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
const loaded={exports:{}};
new Function('require','module','exports',compiled)(createRequire(file),loaded,loaded.exports);
const Details=loaded.exports.default;
const end=Date.parse('2027-10-26T00:00:00Z');
const base={status:'cancelled',cancelled:true,ends_at:end,renews_at:null,can_cancel:false,can_resume:true,
  has_paid_access:true,current_period_refunded:false,payment_method_url:null,
  last_payment:{amount_cents:10000,currency:'USD',paid_at:'2026-10-26T00:00:00Z',refunded_amount_cents:0,fully_refunded:false}};
const render=changes=>renderToStaticMarkup(React.createElement(Details,{subscription:{...base,...changes},locale:'en',busy:false,onChange(){},onRefresh(){}}));

const cancelled=render({});
assert.match(cancelled,/Your paid access remains available until/);
assert.match(cancelled,/Resume subscription/);

const partial=render({last_payment:{...base.last_payment,refunded_amount_cents:100}});
assert.match(partial,/Partially refunded/);
assert.match(partial,/\$1\.00/);
assert.match(partial,/Resume subscription/);
assert.match(partial,/Your paid access remains available until/);

const full=render({current_period_refunded:true,has_paid_access:false,
  last_payment:{...base.last_payment,refunded_amount_cents:10000,fully_refunded:true}});
assert.match(full,/fully refunded/);
assert.match(full,/Fully refunded/);
assert.doesNotMatch(full,/Resume subscription|Your paid access remains available until/);

const activeRefund=render({current_period_refunded:true,has_paid_access:false,status:'active',cancelled:false,ends_at:null,renews_at:end,can_cancel:true,
  last_payment:{...base.last_payment,refunded_amount_cents:10000,fully_refunded:true}});
assert.match(activeRefund,/Cancel automatic renewal/,'A refund must not hide the action to stop future payments');
assert.doesNotMatch(activeRefund,/Resume subscription|Your paid access remains available until/);

const expired=render({status:'expired',has_paid_access:false,can_resume:false});
assert.match(expired,/does not currently grant paid access/);
assert.doesNotMatch(expired,/Resume subscription|Your paid access remains available until/);

const otherPurchase=render({current_period_refunded:true,has_paid_access:false,
  current_access:{tier:'max',payment_type:'one_time',subscription_id:null,ends_at:end,renews_at:null,one_time_ends_at:end}});
assert.match(otherPurchase,/This subscription no longer grants paid access/);
assert.doesNotMatch(otherPurchase,/account.*Free|Resume subscription/,'An old refunded subscription must not describe a separate purchase as revoked');

const oldResponse=render({has_paid_access:undefined,current_period_refunded:undefined});
assert.doesNotMatch(oldResponse,/Resume subscription|Your paid access remains available until/,'Unknown access must not promise an old paid term');
console.log('Subscription details: 7 refund/cancellation/expiry/rollout scenarios passed');
