import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { registerRequest } from "@/services/auth";
import { toast } from "sonner";
import { AuthShell, AuthField } from "./auth.login";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [{ title: "Create Account — ePlant" }, { name: "description", content: "Create your ePlant account." }],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell title="Join the greenhouse" sub="Create your ePlant account.">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            const { user, token } = await registerRequest(name, email, pw);
            setSession(user, token);
            toast.success("Welcome to ePlant");
            navigate({ to: "/account" });
          } finally { setLoading(false); }
        }}
        className="space-y-4"
      >
        <AuthField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <AuthField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <AuthField label="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required minLength={6} />
        <button disabled={loading} className="w-full bg-leaf text-mist py-3 text-xs uppercase tracking-widest font-medium disabled:opacity-50">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="mt-8 text-sm text-ink/60 text-center">
        Already have one? <Link to="/auth/login" className="text-leaf font-medium underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
