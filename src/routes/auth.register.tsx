import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { registerRequest } from "@/services/auth";
import { apiErrorMessage } from "@/services/api";
import { toast } from "sonner";
import { AuthShell, AuthField } from "./auth.login";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [{ title: "Create Account — ePlant" }, { name: "description", content: "Create your ePlant account." }],
  }),
  component: RegisterPage,
});

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = "Name must be at least 3 characters.";
    if (!emailRe.test(email.trim())) e.email = "Enter a valid email.";
    if (pw.length < 8) e.pw = "Password must be at least 8 characters.";
    if (pw2 !== pw) e.pw2 = "Passwords do not match.";
    return e;
  }, [name, email, pw, pw2]);

  const isValid = Object.keys(errors).length === 0;
  const err = (k: string) => (touched[k] ? errors[k] : undefined);

  return (
    <AuthShell title="Join the greenhouse" sub="Create your ePlant account.">
      <form
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          setTouched({ name: true, email: true, pw: true, pw2: true });
          if (!isValid) return;
          setLoading(true);
          try {
            const { user, token } = await registerRequest(name.trim(), email.trim().toLowerCase(), pw);
            setSession(user, token);
            toast.success("Welcome to ePlant");
            navigate({ to: "/account" });
          } catch (e2) {
            toast.error(apiErrorMessage(e2, "Registration failed"));
          } finally { setLoading(false); }
        }}
        className="space-y-4"
      >
        <FieldWrap error={err("name")}>
          <AuthField label="Name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} required />
        </FieldWrap>
        <FieldWrap error={err("email")}>
          <AuthField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} required />
        </FieldWrap>
        <FieldWrap error={err("pw")}>
          <AuthField label="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, pw: true }))} required minLength={8} />
        </FieldWrap>
        <FieldWrap error={err("pw2")}>
          <AuthField label="Confirm password" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, pw2: true }))} required />
        </FieldWrap>
        <button
          disabled={loading || !isValid}
          className="w-full bg-leaf text-mist py-3 text-xs uppercase tracking-widest font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="mt-8 text-sm text-ink/60 text-center">
        Already have one? <Link to="/auth/login" className="text-leaf font-medium underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}

function FieldWrap({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
