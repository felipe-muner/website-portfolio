"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";

const FIELD =
  "mb-3.5 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3.5 py-3 text-[15px] text-slate-900 focus:bg-white focus:outline-2 focus:outline-[var(--brand)]";
const LABEL = "mb-1.5 block text-[13px] font-semibold text-slate-500";

/** Demo only: submitting just confirms. On the live site it goes to the business. */
export function QuoteForm({ business, services }: { business: string; services: string[] }) {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="py-6 text-center">
        <Check className="mx-auto mb-2.5 size-11 text-[var(--brand)]" />
        <h3 className="font-[family-name:var(--font-pv-display)] text-xl font-bold">Thanks!</h3>
        <p className="mt-1 text-[15px] text-slate-500">
          This is a preview. On the live site, your request goes straight to {business}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="pv-name" className={LABEL}>
        Your name
      </label>
      <input id="pv-name" required autoComplete="name" className={FIELD} />
      <label htmlFor="pv-phone" className={LABEL}>
        Phone
      </label>
      <input id="pv-phone" type="tel" required autoComplete="tel" className={FIELD} />
      <label htmlFor="pv-service" className={LABEL}>
        What do you need?
      </label>
      <select id="pv-service" className={FIELD}>
        {services.map((s) => (
          <option key={s}>{s}</option>
        ))}
        <option>Something else</option>
      </select>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3.5 font-bold text-white transition-transform hover:-translate-y-px"
      >
        Request my quote
      </button>
    </form>
  );
}
