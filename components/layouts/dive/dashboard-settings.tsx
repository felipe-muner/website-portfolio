"use client";

import { useState } from "react";
import { LogOut, Mail, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/layouts/dive/auth";

const CYAN = "#2ed3e8";

/** Config page: who's signed in + the Google emails allowed into the dashboard. */
export function DashboardSettings() {
  const { session, authorized, addEmail, removeEmail, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email address");
      return;
    }
    addEmail(value);
    setEmail("");
    setError(null);
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      {/* Signed-in account */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-base font-bold">Signed in</h2>
        {session && (
          <div className="mt-4 flex items-center gap-3">
            <span
              className="grid size-11 place-items-center rounded-full text-base font-bold text-[#04263b]"
              style={{ backgroundColor: CYAN }}
            >
              {session.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{session.name}</p>
              <p className="truncate text-xs text-white/55">{session.email}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={signOut}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold transition hover:border-[#ff5d73] hover:text-[#ff8a99]"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </section>

      {/* Authorized emails */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <ShieldCheck className="size-5" style={{ color: CYAN }} /> Who can open this dashboard
        </h2>
        <p className="mt-1 text-sm font-light text-white/55">
          Only these Google accounts get in. Everyone else sees “access not authorized”.
        </p>

        <ul className="mt-4 space-y-2">
          {authorized.map((e) => (
            <li
              key={e}
              className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Mail className="size-4 shrink-0 text-white/40" />
                <span className="truncate text-sm text-white/85">{e}</span>
                {session && e.toLowerCase() === session.email.toLowerCase() && (
                  <span className="shrink-0 rounded-full bg-[#2ed3e8]/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-[#2ed3e8]">
                    You
                  </span>
                )}
              </span>
              <button
                type="button"
                aria-label={`Remove ${e}`}
                onClick={() => removeEmail(e)}
                disabled={authorized.length === 1}
                className="text-white/35 transition hover:text-[#ff5d73] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={submit} className="mt-4">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="name@example.com"
              className={`flex-1 rounded-xl border bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#2ed3e8] ${
                error ? "border-[#ff5d73]" : "border-white/15"
              }`}
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-[#04263b]"
              style={{ backgroundColor: CYAN }}
            >
              <Plus className="size-4" /> Add
            </button>
          </div>
          {error && <p className="mt-1.5 text-xs text-[#ff8a99]">{error}</p>}
        </form>
      </section>
    </div>
  );
}
