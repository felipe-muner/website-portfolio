"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { TOPICS } from "@/lib/layouts/hinge";

const FIELD =
  "h-12 w-full rounded-xl border-2 border-[var(--ink)] bg-white/60 px-4 text-[15px] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink)]/35 focus:bg-white focus:ring-4 focus:ring-[var(--coral)]/30";
const LABEL = "text-[13px] font-semibold";

/** Demo call-back form: validates, then shows the confirmation (nothing is sent). */
export function CallbackForm() {
  const [sent, setSent] = useState<string | null>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSent(String(data.get("name") || "").split(" ")[0] || "there");
  }

  if (sent) {
    return (
      <div className="flex min-h-[24rem] flex-col items-start justify-center gap-4" role="status">
        <span className="grid size-14 place-items-center rounded-full border-2 border-[var(--ink)] bg-[var(--sun)]">
          <Check className="size-6" />
        </span>
        <p className="font-display text-4xl uppercase leading-none">Thanks, {sent}.</p>
        <p className="max-w-sm text-[15px] leading-relaxed text-[var(--ink)]/75">
          A physio will call you back within two hours (or first thing tomorrow if it&apos;s after 19:00). This is a demo, so
          nothing was actually sent.
        </p>
        <button type="button" onClick={() => setSent(null)} className="text-sm font-semibold underline underline-offset-4">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Your name</span>
          <input name="name" required autoComplete="name" className={FIELD} />
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>Phone or WhatsApp</span>
          <input name="phone" type="tel" required autoComplete="tel" className={FIELD} />
        </label>
      </div>
      <label className="grid gap-2">
        <span className={LABEL}>Email</span>
        <input name="email" type="email" autoComplete="email" className={FIELD} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>What is it about?</span>
          <select name="topic" className={`${FIELD} appearance-none`}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>Best time to call</span>
          <select name="when" className={`${FIELD} appearance-none`}>
            <option>Any time</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2">
        <span className={LABEL}>Where does it hurt, and since when?</span>
        <textarea name="message" rows={4} className={`${FIELD} h-auto py-3`} />
      </label>
      <button type="submit" className="hinge-btn justify-self-start">
        Request a call back
        <span className="hinge-btn-arrow">
          <ArrowUpRight className="size-4" />
        </span>
      </button>
    </form>
  );
}
