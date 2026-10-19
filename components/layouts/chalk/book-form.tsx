"use client";

import { useCallback, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { GYM_PLANS } from "@/lib/layouts/content";
import { GYM_WEEK, WEEKDAYS, classesOf, type ScheduleSession } from "@/lib/layouts/schedule";
import { usePlanChoice, useSessionChoice } from "./events";

const CLASSES = classesOf(GYM_WEEK);
const FREE_ONLY = "Just the free class";

const sessionsOf = (className: string) =>
  GYM_WEEK.filter((s) => s.className === className).sort(
    (a, b) => a.weekday - b.weekday || a.start.localeCompare(b.start),
  );
const when = (s: ScheduleSession) => `${WEEKDAYS[s.weekday]} ${s.start} · ${s.teacher}`;

const FIELD =
  "h-12 w-full rounded-sm border border-white/12 bg-[#0f0f0e] px-4 text-[15px] text-white transition-colors placeholder:text-white/30 hover:border-white/25 focus:border-[#f5c518] focus:outline-none";
const LABEL = "font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/50";

/**
 * Gym 6 · Chalk — "book a free class". Class and time come from the real
 * timetable (and get preselected when a session, the gym clock or a plan is
 * clicked elsewhere on the page). Demo only: submitting just confirms.
 */
export function BookForm() {
  const [sessionId, setSessionId] = useState(GYM_WEEK[0].id);
  const [plan, setPlan] = useState(FREE_ONLY);
  const [booked, setBooked] = useState<{ name: string; session: ScheduleSession; plan: string } | null>(null);

  const session = GYM_WEEK.find((s) => s.id === sessionId) ?? GYM_WEEK[0];

  usePlanChoice(
    useCallback((name: string) => {
      setPlan(name);
      setBooked(null);
    }, []),
  );
  useSessionChoice(
    useCallback((id: string) => {
      setSessionId(id);
      setBooked(null);
    }, []),
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    setBooked({ name: name.split(/\s+/)[0] || "champ", session, plan });
  };

  if (booked) {
    return (
      <div className="flex h-full flex-col items-start justify-center py-6">
        <span className="grid size-12 place-items-center rounded-sm bg-[#f5c518] text-black">
          <Check className="size-6" strokeWidth={3} />
        </span>
        <h3 className="font-display mt-6 text-5xl uppercase leading-none">You&apos;re in, {booked.name}.</h3>
        <p className="mt-4 max-w-md leading-relaxed text-white/65">
          {booked.session.className} with {booked.session.teacher} — {WEEKDAYS[booked.session.weekday]} at{" "}
          {booked.session.start}. Bring water and a towel; we&apos;ll confirm on WhatsApp.
        </p>
        {booked.plan !== FREE_ONLY && (
          <p className="mt-2 max-w-md leading-relaxed text-white/65">
            Your <span className="text-white">{booked.plan}</span> membership will be ready at the front desk.
          </p>
        )}
        <button
          type="button"
          onClick={() => setBooked(null)}
          className="font-display mt-8 rounded-sm border border-white/15 px-5 py-2 text-lg uppercase tracking-[0.04em] text-white/80 transition-colors hover:border-[#f5c518] hover:text-[#f5c518]"
        >
          Book another class
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={FIELD} />
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>WhatsApp</span>
          <input name="phone" type="tel" required autoComplete="tel" placeholder="+66 …" className={FIELD} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Class</span>
          <select
            value={session.className}
            onChange={(e) => setSessionId(sessionsOf(e.target.value)[0].id)}
            className={FIELD}
          >
            {CLASSES.map((c) => (
              <option key={c} value={c} className="bg-[#0f0f0e]">
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>When</span>
          <select value={session.id} onChange={(e) => setSessionId(e.target.value)} className={FIELD}>
            {sessionsOf(session.className).map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0f0f0e]">
                {when(s)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-2">
        <span className={LABEL}>Membership after the free class</span>
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className={FIELD}>
          {[FREE_ONLY, ...GYM_PLANS.map((p) => p.name)].map((name) => (
            <option key={name} value={name} className="bg-[#0f0f0e]">
              {name}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="font-display group mt-2 inline-flex h-14 items-center justify-between gap-6 justify-self-start rounded-sm bg-[#f5c518] px-6 text-2xl uppercase tracking-[0.04em] text-black transition-colors hover:bg-white"
      >
        Book my free class
        <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
      </button>
      <p className="text-xs text-white/40">
        Demo form — nothing is sent. In the real site this books the class and confirms on WhatsApp.
      </p>
    </form>
  );
}
