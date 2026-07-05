"use client";

// Mock Google auth for the Azure Villas owner dashboard. No real OAuth — it
// simulates a Google sign-in and gates the dashboard behind an email
// allow-list. Persisted to localStorage. Mirrors the /dive dashboard pattern.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface Account {
  email: string;
  name: string;
}

export type AuthStatus = "loading" | "signed-out" | "authorized" | "unauthorized";

export const MOCK_ACCOUNTS: readonly Account[] = [
  { email: "owner@azurevillas.co", name: "Azure Villas" },
  { email: "manager@azurevillas.co", name: "Villa Manager" },
  { email: "guest.traveller@gmail.com", name: "Guest Traveller" },
];

const DEFAULT_AUTHORIZED = ["owner@azurevillas.co"];

const SESSION_KEY = "villa.v1.auth.session.v1";
const EMAILS_KEY = "villa.v1.auth.emails.v1";

interface AuthValue {
  status: AuthStatus;
  session: Account | null;
  authorized: string[];
  hydrated: boolean;
  signIn: (a: Account) => void;
  signOut: () => void;
  isAuthorized: (email: string) => boolean;
  addEmail: (email: string) => void;
  removeEmail: (email: string) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function VillaAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Account | null>(null);
  const [authorized, setAuthorized] = useState<string[]>(DEFAULT_AUTHORIZED);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const s = window.localStorage.getItem(SESSION_KEY);
      if (s) setSession(JSON.parse(s) as Account);
      const e = window.localStorage.getItem(EMAILS_KEY);
      if (e) {
        const parsed = JSON.parse(e) as string[];
        if (Array.isArray(parsed) && parsed.length) setAuthorized(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else window.localStorage.removeItem(SESSION_KEY);
      window.localStorage.setItem(EMAILS_KEY, JSON.stringify(authorized));
    } catch {
      // ignore
    }
  }, [session, authorized, hydrated]);

  const isAuthorized = useCallback(
    (email: string) => authorized.some((e) => e.toLowerCase() === email.toLowerCase()),
    [authorized],
  );

  const signIn = useCallback((a: Account) => setSession(a), []);
  const signOut = useCallback(() => setSession(null), []);

  const addEmail = useCallback((email: string) => {
    const e = email.trim().toLowerCase();
    if (!e) return;
    setAuthorized((prev) => (prev.some((x) => x.toLowerCase() === e) ? prev : [...prev, e]));
  }, []);

  const removeEmail = useCallback((email: string) => {
    setAuthorized((prev) => prev.filter((x) => x.toLowerCase() !== email.toLowerCase()));
  }, []);

  const status: AuthStatus = !hydrated
    ? "loading"
    : !session
      ? "signed-out"
      : isAuthorized(session.email)
        ? "authorized"
        : "unauthorized";

  const value = useMemo<AuthValue>(
    () => ({ status, session, authorized, hydrated, signIn, signOut, isAuthorized, addEmail, removeEmail }),
    [status, session, authorized, hydrated, signIn, signOut, isAuthorized, addEmail, removeEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useVillaAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useVillaAuth must be used inside <VillaAuthProvider>");
  return ctx;
}
