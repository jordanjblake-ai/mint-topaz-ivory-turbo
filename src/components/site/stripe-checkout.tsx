import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pounds } from "@/data/book";

export function PreviewCheckout({
  amount,
  email,
  onPaid,
}: {
  amount: number;
  email: string;
  onPaid: () => void;
}) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function pay(event: React.FormEvent) {
    event.preventDefault();
    const digits = number.replace(/\s/g, "");
    if (digits !== "4242424242424242") {
      setError("Use the Stripe test card 4242 4242 4242 4242 in this preview.");
      return;
    }
    if (!/^\d{2}\s?\/\s?\d{2}$/.test(expiry.trim())) {
      setError("Expiry looks like 12 / 28.");
      return;
    }
    if (!/^\d{3}$/.test(cvc.trim())) {
      setError("CVC is three digits.");
      return;
    }
    setBusy(true);
    window.setTimeout(() => onPaid(), 700);
  }

  return (
    <form onSubmit={pay} className="rounded-md bg-[#0a2540] p-5 text-white shadow-border">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-wide">Stripe Checkout</p>
        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-white/60">Preview</p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-white/70">
        Live deposits go through Stripe on the Hybrid account. This preview takes the test card only.
        Nothing is charged.
      </p>
      <div className="mt-5 grid gap-3">
        <div>
          <Label htmlFor="pay-email" className="text-white/70">
            Email
          </Label>
          <Input id="pay-email" value={email} readOnly className="bg-white text-[#0a2540]" />
        </div>
        <div>
          <Label htmlFor="card" className="text-white/70">
            Card number
          </Label>
          <Input
            id="card"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
              setError("");
            }}
            className="bg-white text-[#0a2540]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="exp" className="text-white/70">
              Expiry
            </Label>
            <Input
              id="exp"
              placeholder="12 / 28"
              autoComplete="cc-exp"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="bg-white text-[#0a2540]"
            />
          </div>
          <div>
            <Label htmlFor="cvc" className="text-white/70">
              CVC
            </Label>
            <Input
              id="cvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="bg-white text-[#0a2540]"
            />
          </div>
        </div>
      </div>
      {error ? <p className="mt-3 text-sm text-[#ffa27b]">{error}</p> : null}
      <Button type="submit" className="mt-5 w-full" disabled={busy}>
        {busy ? "Paying…" : `Pay ${pounds(amount)} deposit`}
      </Button>
      <p className="mt-3 text-center text-[0.65rem] uppercase tracking-[0.16em] text-white/50">
        Powered by Stripe
      </p>
    </form>
  );
}
