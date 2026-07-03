"use client";

import { useState } from "react";
import { ChevronLeft, Loader2, ShieldAlert, Waves } from "lucide-react";
import { MOCK_ACCOUNTS, useAuth, type Account } from "@/lib/layouts/dive/auth";

const CYAN = "#2ed3e8";

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center px-5 pt-16">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        {children}
      </div>
    </main>
  );
}

/** Gates the dashboard behind the mock Google sign-in + email allow-list. */
export function DashboardGate({ children }: { children: React.ReactNode }) {
  const { status, session, signIn, signOut } = useAuth();
  const [phase, setPhase] = useState<"start" | "chooser" | "loading">("start");
  const [pending, setPending] = useState<Account | null>(null);

  if (status === "authorized") return <>{children}</>;

  if (status === "loading") {
    return (
      <Shell>
        <Loader2 className="mx-auto size-8 animate-spin" style={{ color: CYAN }} />
        <p className="mt-4 text-sm text-white/60">Loading your dashboard…</p>
      </Shell>
    );
  }

  if (status === "unauthorized" && session) {
    return (
      <Shell>
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#ff5d73]/15">
          <ShieldAlert className="size-7 text-[#ff8a99]" />
        </div>
        <h1 className="mt-5 text-xl font-bold">Access not authorized</h1>
        <p className="mt-2 text-sm text-white/60">
          <span className="font-semibold text-white">{session.email}</span> isn&rsquo;t on the
          allow-list for this dashboard. Ask the owner to add it in Settings.
        </p>
        <button
          type="button"
          onClick={() => {
            signOut();
            setPhase("start");
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold transition hover:border-white"
        >
          <ChevronLeft className="size-4" /> Use another account
        </button>
      </Shell>
    );
  }

  // signed-out → the mock Google flow
  function choose(a: Account) {
    setPending(a);
    setPhase("loading");
    window.setTimeout(() => signIn(a), 1300);
  }

  return (
    <Shell>
      <div className="mx-auto grid size-12 place-items-center rounded-2xl" style={{ backgroundColor: CYAN }}>
        <Waves className="size-6 text-[#04263b]" />
      </div>
      <h1 className="mt-5 text-xl font-bold">Aqua Sport Supply</h1>
      <p className="mt-1 text-sm text-white/55">Owner dashboard — sign in to continue</p>

      {phase === "loading" ? (
        <div className="mt-8 flex flex-col items-center">
          <Loader2 className="size-8 animate-spin" style={{ color: CYAN }} />
          <p className="mt-4 text-sm text-white/60">
            Signing in as <span className="font-semibold text-white">{pending?.email}</span>…
          </p>
        </div>
      ) : phase === "chooser" ? (
        <div className="mt-7 text-left">
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-white/45">
            Choose an account
          </p>
          <ul className="space-y-2">
            {MOCK_ACCOUNTS.map((a) => (
              <li key={a.email}>
                <button
                  type="button"
                  onClick={() => choose(a)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left transition hover:border-[#2ed3e8]/50"
                >
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-[#04263b]"
                    style={{ backgroundColor: CYAN }}
                  >
                    {a.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">{a.name}</span>
                    <span className="block truncate text-xs text-white/50">{a.email}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 px-1 text-xs text-white/40">
            Only <span className="font-semibold text-white/70">owner@aquasportsupply.co.th</span> is
            authorized by default — try another to see the gate.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPhase("chooser")}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#1f1f1f] transition hover:bg-white/90"
        >
          <GoogleG className="size-5" />
          Continue with Google
        </button>
      )}
    </Shell>
  );
}
