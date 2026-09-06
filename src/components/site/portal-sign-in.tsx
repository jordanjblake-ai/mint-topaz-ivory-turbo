import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { GoogleSignInButton } from "@/components/site/google-sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPortalCode, verifyPortalCode } from "@/lib/portal-otp";
import { setPortalEntry } from "@/lib/portal-entry";

export function NoCampYet() {
  return (
    <p className="text-sm text-accent">
      <Link to="/vacations/lanzarote" className="text-accent underline-offset-2 hover:underline">
        No camp on this email yet. Hold a place to open the portal.
      </Link>
    </p>
  );
}

export function PortalSignIn({
  callbackURL,
  onVerified,
}: {
  callbackURL: string;
  onVerified: (email: string, hasBooking: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [locked, setLocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendCode(event?: FormEvent) {
    event?.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await requestPortalCode({ data: { email } });
      setSent(true);
      setLocked(false);
      setCode("");
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That email does not look right.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmCode(event: FormEvent) {
    event.preventDefault();
    if (locked) return;
    setError("");
    setBusy(true);
    try {
      const result = await verifyPortalCode({ data: { email, code } });
      if (result.status === "ok") {
        setPortalEntry("player");
        onVerified(result.email, result.hasBooking);
        return;
      }
      if (result.status === "locked") {
        setLocked(true);
        setError("That code is no longer valid. Request a new code.");
        return;
      }
      setError(
        result.remaining
          ? `That code did not match. ${result.remaining} ${result.remaining === 1 ? "try" : "tries"} left.`
          : "That code did not match.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code did not match.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <GoogleSignInButton callbackURL={callbackURL} label="Sign in with Google" intent="player" />
      </div>
      <form className="grid gap-4" onSubmit={sent ? confirmCode : sendCode}>
        <div>
          <Label htmlFor="portal-email">Booking email</Label>
          <Input
            id="portal-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSent(false);
              setLocked(false);
              setMessage("");
              setError("");
            }}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
          />
        </div>
        <Button
          type={sent ? "button" : "submit"}
          size="lg"
          variant="secondary"
          className="h-auto min-h-12 w-full whitespace-normal px-4 text-center leading-snug"
          disabled={busy}
          onClick={sent ? () => void sendCode() : undefined}
        >
          {busy && !sent ? "Sending…" : "Open with email"}
        </Button>
        {sent ? (
          <>
            <p className="text-sm text-muted">{message || "If that email has a booking, we sent a code."}</p>
            <div>
              <Label htmlFor="portal-code">6-digit code</Label>
              <Input
                id="portal-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button type="submit" size="lg" disabled={busy || locked || code.length !== 6}>
                {busy ? "Checking…" : "Confirm code"}
              </Button>
              <Button type="button" size="lg" variant="secondary" disabled={busy} onClick={() => void sendCode()}>
                Request a new code
              </Button>
            </div>
          </>
        ) : null}
      </form>
      {error ? (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
