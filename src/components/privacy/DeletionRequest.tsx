"use client";

import { useState, type FormEvent } from "react";
import { SUPPORT_EMAIL } from "@/lib/support";
import type { DeletionRequestCopy } from "./deletion-request-copy";

/** Deletion-request form for one app; [appId] keeps anchors and field ids unique when several apps share the page. */
export default function DeletionRequest({ appId, copy: t }: { appId: string; copy: DeletionRequestCopy }) {
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [draftOpened, setDraftOpened] = useState(false);
  const body = t.body + email.trim() + (uid.trim() ? t.id + uid.trim() : "") + t.ending;
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(body)}`;
  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // This is a draft handoff, not a submission acknowledgement. No backend or deletion is triggered.
    setDraftOpened(true);
    window.location.href = mailto;
  }
  return (
    <section id={`delete-${appId}`} aria-labelledby={`${appId}-deletion-heading`} className="scroll-mt-28 rounded-2xl border border-(--primary)/40 bg-(--card-bg) p-6 md:p-8">
      <h2 id={`${appId}-deletion-heading`} className="text-2xl md:text-3xl font-bold mb-4">{t.title}</h2>
      <p className="text-(--text-muted) leading-8">{t.intro}</p>
      {t.inApp && <p className="rounded-xl border border-(--primary)/40 p-4 mt-5 leading-7">{t.inApp}</p>}
      <h3 className="text-lg font-semibold mt-6 mb-3">{t.scope}</h3>
      <ul className="list-disc ps-6 text-(--text-muted) space-y-2 leading-7">{t.items.map(item => <li key={item}>{item}</li>)}</ul>
      <p className="text-(--text-muted) leading-8 mt-5">{t.timing}</p>
      <p className="rounded-xl border border-(--card-border) p-4 mt-5 leading-7 font-medium">{t.warning}</p>
      <form onSubmit={prepareEmail} className="mt-7 space-y-4">
        <div>
          <label htmlFor={`${appId}-deletion-email`} className="block font-medium mb-2">{t.email}</label>
          <input id={`${appId}-deletion-email`} type="email" autoComplete="email" required maxLength={254} dir="ltr" value={email} onChange={e => { setEmail(e.target.value); setDraftOpened(false); }} aria-describedby={`${appId}-deletion-hint`} className="w-full rounded-xl border border-(--card-border) bg-(--background) px-4 py-3 focus-visible:outline-2 focus-visible:outline-(--primary)" />
          <p id={`${appId}-deletion-hint`} className="text-sm text-(--text-muted) mt-2 leading-6">{t.hint}</p>
        </div>
        <div>
          <label htmlFor={`${appId}-deletion-uid`} className="block font-medium mb-2">{t.uid}</label>
          <input id={`${appId}-deletion-uid`} autoComplete="off" maxLength={128} dir="ltr" value={uid} onChange={e => { setUid(e.target.value); setDraftOpened(false); }} className="w-full rounded-xl border border-(--card-border) bg-(--background) px-4 py-3 focus-visible:outline-2 focus-visible:outline-(--primary)" />
        </div>
        <button type="submit" className="w-full sm:w-auto rounded-xl bg-(--primary) text-(--background) px-5 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4">{t.submit}</button>
        <p className="text-sm text-(--text-muted) leading-7" role={draftOpened ? "status" : undefined}>{t.draft}</p>
        {draftOpened && <div className="rounded-xl border border-(--card-border) p-4"><p className="font-medium mb-3">{t.preview}</p><p className="whitespace-pre-wrap break-words text-sm leading-7 select-text">{body}</p></div>}
      </form>
      <p className="mt-5 leading-8">{t.fallback}: <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t.subject)}`} className="text-(--primary) underline underline-offset-4 break-all" dir="ltr">{SUPPORT_EMAIL}</a></p>
      <h3 className="text-lg font-semibold mt-8 mb-3">{t.copies}</h3>
      <p className="text-sm text-(--text-muted) leading-8">{t.retention}</p>
    </section>
  );
}
