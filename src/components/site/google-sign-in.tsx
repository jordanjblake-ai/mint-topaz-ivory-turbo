import { useState } from "react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

function BrokerButton({
  idp,
  callbackURL,
  label,
  variant = "primary",
}: {
  idp: "google" | "microsoft";
  callbackURL: string;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const provider = GROK_PROVIDERS.find((item) => item.idp === idp);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!authEnabled || !provider) {
    return <p className="text-sm text-muted">{label} is not available yet.</p>;
  }

  return (
    <div className="grid min-w-0 w-full gap-2">
      <Button
        type="button"
        size="lg"
        variant={variant}
        className="h-auto min-h-12 w-full whitespace-normal px-4 text-center leading-snug"
        disabled={busy}
        onClick={() => {
          // signIn opens the Google window synchronously on this click.
          // Do not setState first — a re-render can swallow the pop-up.
          const job = signIn(provider.providerId, {
            callbackURL,
            errorCallbackURL: callbackURL,
          });
          setError("");
          setBusy(true);
          void job
            .catch((err: unknown) => {
              setError(err instanceof Error ? err.message : `${label} did not finish.`);
            })
            .finally(() => setBusy(false));
        }}
      >
        {busy ? `Opening ${provider.label}…` : label}
      </Button>
      {error ? (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function GoogleSignInButton({
  callbackURL,
  label = "Continue with Google",
  variant = "primary",
}: {
  callbackURL: string;
  label?: string;
  variant?: "primary" | "secondary";
}) {
  return <BrokerButton idp="google" callbackURL={callbackURL} label={label} variant={variant} />;
}

export function MicrosoftSignInButton({
  callbackURL,
  label = "Sign in with Microsoft",
  variant = "primary",
}: {
  callbackURL: string;
  label?: string;
  variant?: "primary" | "secondary";
}) {
  return <BrokerButton idp="microsoft" callbackURL={callbackURL} label={label} variant={variant} />;
}
