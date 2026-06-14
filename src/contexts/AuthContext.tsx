import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchMe, type AuthUser } from "@/services/auth";

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  setSession: (u: AuthUser, t: string) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "eplant-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (!raw) return;
      const s = JSON.parse(raw);
      setUser(s.user);
      setToken(s.token);
      // Best-effort revalidate via /auth/me — on failure keep the existing
      // session so AdminDataContext doesn't get wiped by a transient error.
      fetchMe()
        .then((u) => setUser(u))
        .catch(() => {
          // Only clear if we get a definitive 401 (token truly invalid/expired)
          // The error shape from axios has response.status
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isUnauthorized = (e: unknown) => (e as any)?.response?.status === 401;
          return fetchMe().catch((e) => {
            if (isUnauthorized(e)) {
              setUser(null); setToken(null);
              if (typeof window !== "undefined") localStorage.removeItem(KEY);
            }
            // Otherwise (network error, 5xx) — keep the session alive
          });
        });
    } catch {}
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user,
    token,
    setSession: (u, t) => {
      setUser(u); setToken(t);
      if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify({ user: u, token: t }));
    },
    logout: () => {
      setUser(null); setToken(null);
      if (typeof window !== "undefined") localStorage.removeItem(KEY);
    },
  }), [user, token]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
