"use client";

import { useCallback, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { BUDGETS, COMMISSION_SIZES, COMMISSION_TYPES, TIMELINES, type CommissionType } from "@/lib/layouts/meads";
import { useCommissionStart, type CommissionStart } from "./events";

const isType = (t: unknown): t is CommissionType => typeof t === "string" && COMMISSION_TYPES.some((x) => x === t);

const FIELD =
  "min-h-12 w-full rounded-xl border border-white/12 bg-[#0d0a10] px-4 py-3 text-[15px] text-[#f3ead9] transition-colors placeholder:text-white/30 hover:border-white/25 focus:border-[#e9b44c] focus:outline-none";
const LABEL = "font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/50";

/**
 * Artist · Maria Meads — "begin a commission". The type, size and a note can
 * arrive preselected from a tier, a jacket or a work in the gallery. Demo
 * only: submitting just confirms.
 */
export function CommissionForm() {
  const [type, setType] = useState<CommissionType>("Soul portrait");
  const [size, setSize] = useState<string>(COMMISSION_SIZES["Soul portrait"][1]);
  const [budget, setBudget] = useState<string>(BUDGETS[1]);
  const [timeline, setTimeline] = useState<string>(TIMELINES[0]);
  const [story, setStory] = useState("");
  const [sent, setSent] = useState<{ name: string } | null>(null);

  const changeType = (t: CommissionType) => {
    setType(t);
    setSize(COMMISSION_SIZES[t][0]);
  };

  useCommissionStart(
    useCallback((start: CommissionStart) => {
      if (isType(start.type)) {
        setType(start.type);
        const sizes = COMMISSION_SIZES[start.type];
        setSize(start.size && sizes.includes(start.size) ? start.size : sizes[0]);
      }
      if (start.note) setStory((s) => (s.includes(start.note ?? "") ? s : [start.note, s].filter(Boolean).join("\n")));
      setSent(null);
    }, []),
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    setSent({ name: name.split(/\s+/)[0] || "friend" });
  };

  if (sent) {
    return (
      <div className="flex h-full flex-col items-start justify-center py-6">
        <span className="grid size-12 place-items-center rounded-full bg-[#e9b44c] text-[#120d14]">
          <Check className="size-6" strokeWidth={2.5} />
        </span>
        <h3 className="font-display mt-6 text-4xl leading-tight sm:text-5xl">
          Thank you, {sent.name}.<br />
          <span className="text-[#e9b44c]">Let&apos;s listen first.</span>
        </h3>
        <p className="mt-5 max-w-md leading-relaxed text-white/65">
          Maria reads every enquiry herself and replies within two days with a time for the listening call. {type} · {size} ·{" "}
          {budget.toLowerCase()}.
        </p>
        <button
          type="button"
          onClick={() => setSent(null)}
          className="mt-8 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/80 transition-colors hover:border-[#e9b44c] hover:text-[#e9b44c]"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <fieldset className="grid gap-2">
        <legend className={`${LABEL} mb-2`}>What shall we make?</legend>
        <div className="flex flex-wrap gap-2">
          {COMMISSION_TYPES.map((t) => (
            <label
              key={t}
              className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#e9b44c]/60 ${
                type === t ? "border-[#e9b44c] bg-[#e9b44c]/12 text-[#f0c76d]" : "border-white/12 text-white/65 hover:border-white/30"
              }`}
            >
              <input type="radio" name="type" value={t} checked={type === t} onChange={() => changeType(t)} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Size</span>
          <select value={size} onChange={(e) => setSize(e.target.value)} className={FIELD}>
            {COMMISSION_SIZES[type].map((s) => (
              <option key={s} value={s} className="bg-[#0d0a10]">
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>Budget</span>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className={FIELD}>
            {BUDGETS.map((b) => (
              <option key={b} value={b} className="bg-[#0d0a10]">
                {b}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="grid gap-2">
        <legend className={`${LABEL} mb-2`}>Timing</legend>
        <div className="flex flex-wrap gap-2">
          {TIMELINES.map((t) => (
            <label
              key={t}
              className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#e9b44c]/60 ${
                timeline === t ? "border-[#e9b44c] bg-[#e9b44c]/12 text-[#f0c76d]" : "border-white/12 text-white/65 hover:border-white/30"
              }`}
            >
              <input type="radio" name="timeline" value={t} checked={timeline === t} onChange={() => setTimeline(t)} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-2">
        <span className={LABEL}>Your story</span>
        <textarea
          name="story"
          rows={4}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Who is it for, what keeps showing up in your life, the animals and places you love…"
          className={`${FIELD} resize-y`}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={LABEL}>Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={FIELD} />
        </label>
        <label className="grid gap-2">
          <span className={LABEL}>Email or Instagram</span>
          <input name="contact" required placeholder="you@… or @handle" className={FIELD} />
        </label>
      </div>

      <button
        type="submit"
        className="group mt-2 inline-flex h-[52px] items-center gap-3 justify-self-start rounded-full bg-[#e9b44c] px-7 text-[15px] font-semibold text-[#120d14] transition-colors hover:bg-[#f3ead9]"
      >
        Begin the conversation
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </button>
      <p className="text-xs text-white/40">Demo form — nothing is sent. On the real site this lands in Maria&apos;s inbox.</p>
    </form>
  );
}
