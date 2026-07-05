"use client";

import { useState } from "react";
import { ChevronLeft, Loader2, Palmtree, ShieldAlert } from "lucide-react";
import { MOCK_ACCOUNTS, useVillaAuth, type Account } from "@/lib/layouts/villa/auth";
import { AZURE } from "@/lib/layouts/villa/theme";

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
    <main className="grid min-h-dvh place-items-center px-5" style={{ backgroundColor: AZURE.sand, color: AZURE.teal }}>
      <div className="w-full max-w-sm bg-white p-9 text-center shadow-xl shadow-black/5">
        {children}
      </div>
    </main>
  );
}

/** Gates the villa dashboard behind the mock Google sign-in + email allow-list. */
export function VillaDashboardGate({ children }: { children: React.ReactNode }) {
  const { status, session, signIn, signOut } = useVillaAuth();
  const [phase, setPhase] = useState<"start" | "chooser" | "loading">("start");
  const [pending, setPending] = useState<Account | null>(null);

  if (status === "authorized") return <>{children}</>;

  if (status === "loading") {
    return (
      <Shell>
        <Loader2 className="mx-auto size-8 animate-spin" style={{ color: AZURE.gold }} />
        <p className="mt-4 text-sm" style={{ color: `${AZURE.teal}99` }}>Loading your dashboard…</p>
      </Shell>
    );
  }

  if (status === "unauthorized" && session) {
    return (
      <Shell>
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#c2453f]/10">
          <ShieldAlert className="size-7 text-[#c2453f]" />
        </div>
        <h1 className="mt-5 text-xl font-semibold">Access not authorized</h1>
        <p className="mt-2 text-sm" style={{ color: `${AZURE.teal}99` }}>
          <span className="font-semibold" style={{ color: AZURE.teal }}>{session.email}</span> isn&rsquo;t on
          the allow-list for this dashboard.
        </p>
        <button
          type="button"
          onClick={() => {
            signOut();
            setPhase("start");
          }}
          className="mt-6 inline-flex items-center gap-2 border px-5 py-2.5 text-sm font-semibold transition hover:bg-black/[0.03]"
          style={{ borderColor: `${AZURE.teal}33` }}
        >
          <ChevronLeft className="size-4" /> Use another account
        </button>
      </Shell>
    );
  }

  function choose(a: Account) {
    setPending(a);
    setPhase("loading");
    window.setTimeout(() => signIn(a), 1200);
  }

  return (
    <Shell>
      <div className="mx-auto grid size-12 place-items-center rounded-full" style={{ backgroundColor: AZURE.teal }}>
        <Palmtree className="size-6" style={{ color: AZURE.gold }} />
      </div>
      <h1 className="mt-5 text-xl font-semibold tracking-wide">Azure Villas</h1>
      <p className="mt-1 text-sm" style={{ color: `${AZURE.teal}80` }}>Owner dashboard — sign in to continue</p>

      {phase === "loading" ? (
        <div className="mt-8 flex flex-col items-center">
          <Loader2 className="size-8 animate-spin" style={{ color: AZURE.gold }} />
          <p className="mt-4 text-sm" style={{ color: `${AZURE.teal}99` }}>
            Signing in as <span className="font-semibold" style={{ color: AZURE.teal }}>{pending?.email}</span>…
          </p>
        </div>
      ) : phase === "chooser" ? (
        <div className="mt-7 text-left">
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider" style={{ color: `${AZURE.teal}70` }}>
            Choose an account
          </p>
          <ul className="space-y-2">
            {MOCK_ACCOUNTS.map((a) => (
              <li key={a.email}>
                <button
                  type="button"
                  onClick={() => choose(a)}
                  className="flex w-full items-center gap-3 border px-3 py-2.5 text-left transition hover:border-[color:var(--gold)]"
                  style={{ borderColor: `${AZURE.teal}1f`, ["--gold" as string]: AZURE.gold }}
                >
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: AZURE.teal }}
                  >
                    {a.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{a.name}</span>
                    <span className="block truncate text-xs" style={{ color: `${AZURE.teal}80` }}>{a.email}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 px-1 text-xs" style={{ color: `${AZURE.teal}70` }}>
            Only <span className="font-semibold">owner@azurevillas.co</span> is authorized by default —
            try another to see the gate.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPhase("chooser")}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 border bg-white px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.03]"
          style={{ borderColor: `${AZURE.teal}26` }}
        >
          <GoogleG className="size-5" />
          Continue with Google
        </button>
      )}
    </Shell>
  );
}
