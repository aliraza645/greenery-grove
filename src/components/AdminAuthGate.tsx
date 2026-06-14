import { useEffect, useState, type ReactNode } from "react";
import { Lock } from "lucide-react";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";
const STORAGE_KEY = "eplant-admin-gate";

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
        setAuthed(true);
      }
    } catch {}
    setReady(true);
  }, []);

  if (!ready) return null;

  if (authed) {
    return (
      <>
        {children}
        <button
          onClick={() => {
            try { localStorage.removeItem(STORAGE_KEY); } catch {}
            setAuthed(false);
          }}
          className="fixed bottom-4 right-4 z-[60] text-[10px] uppercase tracking-widest bg-white border border-ink/10 px-3 py-2 text-ink/60 hover:text-leaf shadow-sm"
        >
          Admin sign out
        </button>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-mist px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
            setAuthed(true);
            setError(null);
          } else {
            setError("Invalid admin credentials.");
          }
        }}
        className="w-full max-w-md bg-white border border-leaf/10 p-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-leaf text-mist flex items-center justify-center">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-leaf">Admin access</h1>
            <p className="text-xs text-ink/60">Restricted area — staff only</p>
          </div>
        </div>

        <label className="block mb-4">
          <span className="text-xs uppercase tracking-widest text-ink/60 block mb-2">Email</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-mist border border-leaf/15 px-4 py-3 text-sm outline-none focus:border-leaf"
          />
        </label>
        <label className="block mb-4">
          <span className="text-xs uppercase tracking-widest text-ink/60 block mb-2">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-mist border border-leaf/15 px-4 py-3 text-sm outline-none focus:border-leaf"
          />
        </label>

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

        <button className="w-full bg-leaf text-mist py-3 text-xs uppercase tracking-widest font-medium">
          Enter admin
        </button>

        <p className="mt-6 text-[11px] text-ink/50 leading-relaxed">
          Demo credentials: <span className="font-mono text-ink/70">admin@gmail.com</span> /{" "}
          <span className="font-mono text-ink/70">admin123</span>
        </p>
      </form>
    </div>
  );
}
