import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { loginRequest } from "@/services/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [{ title: "Login — ePlant" }, { name: "description", content: "Sign in to your ePlant account." }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell title="Welcome back" sub="Sign in to your greenhouse account.">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            const { user, token } = await loginRequest(email, pw);
            setSession(user, token);
            toast.success(`Welcome back, ${user.name}`);
            navigate({ to: "/account" });
          } finally { setLoading(false); }
        }}
        className="space-y-4"
      >
        <AuthField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <AuthField label="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        <div className="text-right">
          <Link to="/auth/forgot-password" className="text-xs text-clay hover:underline">Forgot password?</Link>
        </div>
        <button disabled={loading} className="w-full bg-leaf text-mist py-3 text-xs uppercase tracking-widest font-medium disabled:opacity-50">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-8 text-sm text-ink/60 text-center">
        New here? <Link to="/auth/register" className="text-leaf font-medium underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-6 py-16 max-w-md">
      <div className="bg-white p-10 border border-leaf/10">
        <h1 className="font-serif text-4xl text-leaf">{title}</h1>
        <p className="text-sm text-ink/60 mt-2 mb-8">{sub}</p>
        {children}
      </div>
    </div>
  );
}

export function AuthField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-ink/60 block mb-2">{label}</span>
      <input {...props} className="w-full bg-mist border border-leaf/15 px-4 py-3 text-sm outline-none focus:border-leaf" />
    </label>
  );
}
