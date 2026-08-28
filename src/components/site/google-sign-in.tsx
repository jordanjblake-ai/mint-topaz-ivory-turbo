import { useState } from "react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

const google = GROK_PROVIDERS.find((item) => item.idp === "google");

export function GoogleSignInButton({
  callbackURL,
  label = "Continue with Google",
  variant = "primary",
}: {
  callbackURL: string;
  label?: string;
  variant?: "primary" | "secondary";
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!authEnabled || !google) {
    return <p className="text-sm text-muted">Google sign-in is not available yet.</p>;
  }

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        size="lg"
        variant={variant}
        className="w-full"
        disabled={busy}
        onClick={() => {
          setError("");
          setBusy(true);
          void signIn(google.providerId, {
            callbackURL,
            errorCallbackURL: callbackURL,
          }).catch((err: unknown) => {
            setBusy(false);
            setError(err instanceof Error ? err.message : "Google sign-in did not finish.");
          });
        }}
      >
        {busy ? "Opening Google…" : label}
      </Button>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
    </div>
  );
}
