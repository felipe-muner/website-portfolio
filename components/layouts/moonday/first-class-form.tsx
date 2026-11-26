"use client";

import { useState } from "react";
import { MOONDAY, MOONDAY_CLASSES } from "@/lib/layouts/moonday";

const FIELD =
  "mt-2 w-full border-b bg-transparent pb-2.5 text-[1.02rem] outline-none transition-colors placeholder:opacity-50 focus:border-b-2";

/** Demo enquiry form: nothing is sent, it only thanks the visitor. */
export function FirstClassForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex min-h-72 flex-col justify-center rounded-[18px] p-8" style={{ backgroundColor: MOONDAY.red, color: MOONDAY.cream }}>
        <p className="text-[2rem] font-[760] leading-none tracking-[-0.04em]">Thank you.</p>
        <p className="mt-3 max-w-sm text-lg leading-snug">
          A teacher will write back before the next class with a time that suits
          the moon, and you.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="grid gap-7 sm:grid-cols-2"
      style={{ color: MOONDAY.ink }}
    >
      <label className="text-sm font-semibold" style={{ color: MOONDAY.red }}>
        Your name
        <input required name="name" autoComplete="name" className={FIELD} style={{ borderColor: MOONDAY.frame, color: MOONDAY.ink }} />
      </label>
      <label className="text-sm font-semibold" style={{ color: MOONDAY.red }}>
        Email
        <input required type="email" name="email" autoComplete="email" className={FIELD} style={{ borderColor: MOONDAY.frame, color: MOONDAY.ink }} />
      </label>
      <label className="text-sm font-semibold sm:col-span-2" style={{ color: MOONDAY.red }}>
        Class you are curious about
        <select name="class" className={`${FIELD} cursor-pointer`} style={{ borderColor: MOONDAY.frame, color: MOONDAY.ink }} defaultValue={MOONDAY_CLASSES[0].name}>
          {MOONDAY_CLASSES.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
          <option>Not sure yet</option>
        </select>
      </label>
      <label className="text-sm font-semibold sm:col-span-2" style={{ color: MOONDAY.red }}>
        Anything we should know about your body
        <textarea name="notes" rows={4} className={`${FIELD} resize-y`} style={{ borderColor: MOONDAY.frame, color: MOONDAY.ink }} />
      </label>
      <div>
        <button
          type="submit"
          className="rounded-full px-6 py-3 text-[0.95rem] font-semibold transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: MOONDAY.red, color: MOONDAY.cream }}
        >
          Send
        </button>
      </div>
    </form>
  );
}
