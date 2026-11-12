"use client";

import { useEffect, useState } from "react";

/**
 * This month's X budget. DotSuite pays X for every post made through DotShare's
 * X app, so each plan includes a monthly amount; every post's charge is shown
 * with what X actually deducted when that could be measured.
 */

interface Usage {
  month: string;
  budget_micros: number;
  spent_micros: number;
  reserved_micros: number;
  remaining_micros: number;
  posts_this_month: number;
  posts_today: number;
  daily_post_limit: number;
  prices: { post_micros: number; post_with_link_micros: number; media_micros: number };
}
interface Charge { status: string; kind: string; charged_micros: number; observed_micros: number | null; url: string | null; at: string }

const usd = (micros: number) => `$${(micros / 1_000_000).toFixed(micros % 10_000 === 0 ? 2 : 3)}`;

export default function XBudget() {
  const [data, setData] = useState<{ usage: Usage; recent: Charge[] } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/x/usage")
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  if (failed) return null;
  if (!data) return <div className="h-40 rounded-xl border border-(--card-border) bg-(--card-bg) animate-pulse" aria-busy="true" />;

  const { usage, recent } = data;
  const used = usage.spent_micros + usage.reserved_micros;
  const percent = usage.budget_micros > 0 ? Math.min(100, Math.round((used / usage.budget_micros) * 100)) : 100;
  const roughPosts = Math.floor(usage.remaining_micros / Math.max(1, usage.prices.post_micros));
  const roughLinkPosts = Math.floor(usage.remaining_micros / Math.max(1, usage.prices.post_with_link_micros));

  return (
    <section aria-labelledby="x-budget" className="rounded-xl border border-(--card-border) bg-(--card-bg) p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="x-budget" className="text-lg font-bold">X budget · {usage.month}</h2>
        <p className="text-sm text-(--text-muted)">Resets on the 1st (UTC)</p>
      </div>

      <div className="mt-4 h-2 rounded-full bg-(--card-border) overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="X budget used">
        <div className={`h-full ${percent >= 90 ? "bg-red-500" : "bg-(--primary)"}`} style={{ width: `${percent}%` }} />
      </div>
      <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div><dt className="text-(--text-muted)">Remaining</dt><dd className="font-semibold text-base">{usd(usage.remaining_micros)}</dd></div>
        <div><dt className="text-(--text-muted)">Used</dt><dd className="font-semibold text-base">{usd(used)} <span className="text-(--text-muted) font-normal">of {usd(usage.budget_micros)}</span></dd></div>
        <div><dt className="text-(--text-muted)">Posts this month</dt><dd className="font-semibold text-base">{usage.posts_this_month}</dd></div>
        <div><dt className="text-(--text-muted)">Today</dt><dd className="font-semibold text-base">{usage.posts_today} <span className="text-(--text-muted) font-normal">of {usage.daily_post_limit}</span></dd></div>
      </dl>
      <p className="mt-4 text-sm text-(--text-muted)">
        That&apos;s about {roughPosts} text posts, or {roughLinkPosts} posts with a link. X charges {usd(usage.prices.post_micros)} per post,{" "}
        {usd(usage.prices.post_with_link_micros)} for a post with a link and {usd(usage.prices.media_micros)} per image. Anything that might
        be a link is charged as one, and if X deducts more than that, you&apos;re charged what X actually took.
      </p>

      {recent.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-sm">
            <thead className="text-(--text-muted) text-start">
              <tr><th className="py-2 text-start font-medium">When</th><th className="text-start font-medium">Post</th><th className="text-start font-medium">Status</th><th className="text-end font-medium">X deducted</th><th className="text-end font-medium">Charged</th></tr>
            </thead>
            <tbody>
              {recent.map((charge, i) => (
                <tr key={`${charge.at}-${i}`} className="border-t border-(--card-border)">
                  <td className="py-2">{new Date(charge.at).toLocaleString()}</td>
                  <td>{charge.url ? <a href={charge.url} className="text-(--primary) underline underline-offset-2">{charge.kind === "post_url" ? "Post with link" : "Post"}</a> : charge.kind === "post_url" ? "Post with link" : "Post"}</td>
                  <td className="capitalize">{charge.status}</td>
                  <td className="text-end">{charge.observed_micros === null ? "—" : usd(charge.observed_micros)}</td>
                  <td className="text-end font-medium">{usd(charge.charged_micros)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
