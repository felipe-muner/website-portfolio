"use client";

import { useCallback, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { WEEKDAYS, YOGA_WEEK, classesOf, type ScheduleSession } from "@/lib/layouts/schedule";
import { PASSES } from "@/lib/layouts/stillwater";
import { usePassChoice, useSessionChoice } from "./events";

const CLASSES = classesOf(YOGA_WEEK);
const FREE_ONLY = "Just the free class";
const LEVELS = ["First time on a mat", "I practise now and then", "I practise most days"] as const;

const sessionsOf = (className: string) =>
  YOGA_WEEK.filter((s) => s.className === className).sort((a, b) => a.weekday - b.weekday || a.start.localeCompare(b.start));
const when = (s: ScheduleSession) => `${WEEKDAYS[s.weekday]} ${s.start} · ${s.teacher}`;

const FIELD =
  "h-12 w-full rounded-xl border border-[#ece4d6]/12 bg-[#0a1014] px-4 text-[15px] text-[#ece4d6] transition-colors placeholder:text-[#ece4d6]/30 hover:border-[#ece4d6]/25 focus:border-[#f2b46d] focus:outline-none";
const LABEL = "text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ece4d6]/50";

/**
 * Yoga 6 · Stillwater — "book your free class". Class and time come from the
 * real timetable (and get preselected when a class, the studio clock or a
 * pass is chosen elsewhere on the page). Demo only: submitting just confirms.
 */
export function BookForm() {
  const [sessionId, setSessionId] = useState(YOGA_WEEK[0].id);
  const [pass, setPass] = useState(FREE_ONLY);
  const [level, setLevel] = useState<string>(LEVELS[0]);
  const [booked, setBooked] = useState<{ name: string; session: ScheduleSession; pass: string } | null>(null);

  const session = YOGA_WEEK.find((s) => s.id === sessionId) ?? YOGA_WEEK[0];

  usePassChoice(
    useCallback((name: string) => {
      setPass(name);
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
    setBooked({ name: name.split(/\s+/)[0] || "friend", session, pass });
  };

  if (booked) {
    return (
      <div className="flex h-full flex-col items-start justify-center py-6">
        <span className="grid size-12 place-items-center rounded-full bg-[#f2b46d] text-[#0a1014]">
          <Check className="size-6" strokeWidth={2.5} />
        </span>
        <h3 className="font-display mt-6 text-5xl font-light leading-none">
          See you on the mat, <em className="text-[#f2b46d]">{booked.name}.</em>
        </h3>
        <p className="mt-5 max-w-md leading-relaxed text-[#ece4d6]/65">
          {booked.session.className} with {booked.session.teacher} — {WEEKDAYS[booked.session.weekday]} at{" "}
          {booked.session.start}. Come ten minutes early for tea; we&apos;ll confirm on WhatsApp.
        </p>
        {booked.pass !== FREE_ONLY && (
          <p className="mt-2 max-w-md leading-relaxed text-[#ece4d6]/65">
            Your <span className="text-[#ece4d6]">{booked.pass}</span> pass will be waiting at the desk.
          </p>
        )}
        <button
          type="button"
          onClick={() => setBooked(null)}
          className="mt-8 rounded-full border border-[#ece4d6]/20 px-5 py-2.5 text-sm text-[#ece4d6]/80 transition-colors hover:border-[#f2b46d] hover:text-[#f2b46d]"
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
          <select value={session.className} onChange={(e) => setSessionId(sessionsOf(e.target.value)[0].id)} className={FIELD}>
            {CLASSES.map((c) => (
              <option key={c} value={c} className="bg-[#0a1014]">
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>When</span>
          <select value={session.id} onChange={(e) => setSessionId(e.target.value)} className={FIELD}>
            {sessionsOf(session.className).map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0a1014]">
                {when(s)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className="grid gap-2">
        <legend className={`${LABEL} mb-2`}>Your practice</legend>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <label
              key={l}
              className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#f2b46d]/60 ${
                level === l ? "border-[#f2b46d] bg-[#f2b46d]/12 text-[#f2b46d]" : "border-[#ece4d6]/12 text-[#ece4d6]/65 hover:border-[#ece4d6]/30"
              }`}
            >
              <input type="radio" name="level" value={l} checked={level === l} onChange={() => setLevel(l)} className="sr-only" />
              {l}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-2">
        <span className={LABEL}>After your free class</span>
        <select value={pass} onChange={(e) => setPass(e.target.value)} className={FIELD}>
          {[FREE_ONLY, ...PASSES.map((p) => p.name)].map((name) => (
            <option key={name} value={name} className="bg-[#0a1014]">
              {name}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="group mt-2 inline-flex h-[52px] items-center gap-3 justify-self-start rounded-full bg-[#f2b46d] px-7 text-[15px] font-semibold text-[#0a1014] transition-colors hover:bg-[#ece4d6]"
      >
        Book my free class
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </button>
      <p className="text-xs text-[#ece4d6]/40">
        Demo form — nothing is sent. On the real site this holds your mat and confirms on WhatsApp.
      </p>
    </form>
  );
}
