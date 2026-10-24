"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { BUSINESS, NOT_SURE, SERVICES } from "@/lib/layouts/aircon";
import { useQuoteNote, useServiceChoice } from "./events";

/** MGM's own services; previews pass their own list. */
const MGM_SERVICES = SERVICES.map((s) => s.title);

const FIELD =
  "h-12 w-full rounded-xl border border-white/12 bg-[var(--ac-field,#06100c)] px-4 text-[15px] text-[#ebf4f0] transition-colors placeholder:text-white/30 hover:border-white/25 focus:border-[var(--ac-accent,#66e6ba)] focus:outline-none";
const LABEL = "font-mono text-[10px] uppercase tracking-[0.2em] text-white/45";

/**
 * MGM · "request your free quote". The services picker and the room sizer can
 * preselect the service and fill in the message. Demo only: submitting just
 * confirms. The props restyle it for another business (the outreach
 * previews); the defaults are MGM's.
 */
export function QuoteForm({
  contact = BUSINESS.owners,
  phone = BUSINESS.phone,
  services = MGM_SERVICES,
  area = { label: "Suburb", placeholder: "e.g. Maroochydore" },
  phonePlaceholder = "04XX XXX XXX",
}: {
  /** Who gets back to the visitor. */
  contact?: string;
  phone?: string;
  services?: string[];
  area?: { label: string; placeholder: string };
  phonePlaceholder?: string;
} = {}) {
  const options = useMemo(() => [...services, NOT_SURE], [services]);
  const [service, setService] = useState(NOT_SURE);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  useServiceChoice(
    useCallback((title: string) => {
      if (options.includes(title)) setService(title);
      setSent(null);
    }, [options]),
  );
  useQuoteNote(
    useCallback((note: string) => {
      setMessage(note);
      setSent(null);
    }, []),
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    setSent(name.split(/\s+/)[0] || "there");
  };

  if (sent) {
    return (
      <div className="flex h-full min-h-[24rem] flex-col items-start justify-center">
        <span className="grid size-12 place-items-center rounded-full bg-[var(--ac-accent,#66e6ba)] text-[var(--ac-accent-ink,#001c12)]">
          <Check className="size-6" strokeWidth={2.5} />
        </span>
        <h3 className="font-display mt-6 text-4xl font-light leading-tight tracking-[-0.03em] sm:text-5xl">
          Thanks, <span className="text-[var(--ac-accent-soft,#99f2e0)]">{sent}.</span>
        </h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/60">
          {`${contact} will be in touch shortly about your ${service === NOT_SURE ? "enquiry" : service.toLowerCase()}. Need it sorted now? Call ${phone}.`}
        </p>
        <button
          type="button"
          onClick={() => setSent(null)}
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45 underline-offset-4 hover:text-white hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className={LABEL}>Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={FIELD} />
        </label>
        <label className="block space-y-2">
          <span className={LABEL}>Phone</span>
          <input name="phone" type="tel" required autoComplete="tel" placeholder={phonePlaceholder} className={FIELD} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className={LABEL}>
            Email <span className="normal-case tracking-normal text-white/30">(optional)</span>
          </span>
          <input name="email" type="email" autoComplete="email" placeholder="you@email.com" className={FIELD} />
        </label>
        <label className="block space-y-2">
          <span className={LABEL}>{area.label}</span>
          <input name="suburb" required placeholder={area.placeholder} className={FIELD} />
        </label>
      </div>
      <label className="block space-y-2">
        <span className={LABEL}>What do you need?</span>
        <select
          name="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className={`${FIELD} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='8'%20fill='none'%3E%3Cpath%20d='M1%201.5l5%205%205-5'%20stroke='%23ffffff80'%20stroke-width='1.5'/%3E%3C/svg%3E")] bg-[position:right_1rem_center] bg-no-repeat pr-10 [&_option]:bg-[var(--ac-option,#091712)]`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-2">
        <span className={LABEL}>
          Message <span className="normal-case tracking-normal text-white/30">(optional)</span>
        </span>
        <textarea
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your space, number of rooms, or anything else that helps us quote."
          className={`${FIELD} h-auto resize-none py-3 leading-relaxed`}
        />
      </label>
      <button
        type="submit"
        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--ac-accent,#66e6ba)] px-7 text-sm font-semibold text-[var(--ac-accent-ink,#001c12)] transition-transform hover:-translate-y-0.5 sm:w-auto"
      >
        Request my free quote
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </button>
      <p className="text-xs text-white/40">We&apos;ll only use your details to respond to this enquiry. No spam, ever.</p>
    </form>
  );
}
