import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { forgotPasswordRequest } from "@/services/auth";
import { toast } from "sonner";
import { AuthShell, AuthField } from "./auth.login";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [{ title: "Reset Password — ePlant" }, { name: "description", content: "Reset your ePlant password." }],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell title="Reset password" sub="We'll send you a reset link.">
      {sent ? (
        <div className="text-sm text-ink/70">
          Check <span className="text-leaf font-medium">{email}</span> for the reset link.
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await forgotPasswordRequest(email);
            toast.success("Reset link sent");
            setSent(true);
          }}
          className="space-y-4"
        >
          <AuthField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full bg-leaf text-mist py-3 text-xs uppercase tracking-widest font-medium">
            Send reset link
          </button>
        </form>
      )}
      <p className="mt-8 text-sm text-ink/60 text-center">
        <Link to="/auth/login" className="text-leaf font-medium underline">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
