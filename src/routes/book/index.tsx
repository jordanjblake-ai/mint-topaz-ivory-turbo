import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { PreviewCheckout } from "@/components/site/stripe-checkout";
import { PageHero } from "@/components/site/page-hero";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BOOK_PACKAGES,
  BOOK_WEEKS,
  campTotal,
  depositTotal,
  packageById,
  pounds,
  type BookPackageId,
  type BookWeekId,
} from "@/data/book";
import { allowAttempt, isEmail } from "@/lib/guard";
import { createCampCheckout } from "@/lib/checkout";
import { useOps } from "@/lib/ops-store";

const StripeEmbedded = lazy(() => import("@/components/site/stripe-embedded"));

type BookSearch = { package?: string; week?: string };

export const Route = createFileRoute("/book/")({
  validateSearch: (search: Record<string, unknown>): BookSearch => ({
    package: typeof search.package === "string" ? search.package : undefined,
    week: typeof search.week === "string" ? search.week : undefined,
  }),
  head: () => ({ meta: [{ title: "Book · Hybrid Vacations" }] }),
  component: BookPage,
});

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const addEnquiry = useOps((s) => s.addEnquiry);
  const hydrate = useOps((s) => s.hydrate);
  const startPack = BOOK_PACKAGES.some((item) => item.id === search.package)
    ? (search.package as BookPackageId)
    : "camp";
  const startWeek = BOOK_WEEKS.some((item) => item.id === search.week)
    ? [search.week as BookWeekId]
    : (["week-1"] as BookWeekId[]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [packageId, setPackageId] = useState<BookPackageId>(startPack);
  const [weeks, setWeeks] = useState<BookWeekId[]>(startWeek);
  const [partySize, setPartySize] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pay, setPay] = useState<{
    mode: "stripe" | "preview";
    clientSecret: string | null;
    publishableKey: string | null;
    amount: number;
  } | null>(null);

  const deposit = useMemo(() => depositTotal(partySize, weeks), [partySize, weeks]);
  const total = useMemo(() => campTotal(packageId, partySize, weeks), [packageId, partySize, weeks]);
  const pack = packageById(packageId);

  function toggleWeek(id: BookWeekId) {
    setWeeks((current) => {
      if (current.includes(id)) {
        const next = current.filter((item) => item !== id);
        return next.length ? next : current;
      }
      return [...current, id];
    });
    setPay(null);
  }

  function recordHold() {
    hydrate();
    addEnquiry({
      name,
      email,
      kind: "lanzarote",
      week: weeks[0] ?? "week-1",
      partySize,
      solo: partySize === 1,
      stay: pack.stay,
      message: `Stripe deposit ${pounds(deposit)}. ${pack.name}. ${weeks.join(", ")}.`,
      source: "site",
    });
    const rows = useOps.getState().enquiries;
    const latest = rows[0];
    if (latest) useOps.getState().setStatus(latest.id, "held");
  }

  async function continueToPay(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !isEmail(email)) {
      setError("Name and a working email are required.");
      return;
    }
    if (!accepted) {
      setError("Please confirm you have read the Terms and Privacy Policy.");
      return;
    }
    if (!allowAttempt("checkout", 6, 60_000)) {
      setError("Too many payment attempts. Wait a minute.");
      return;
    }
    setBusy(true);
    try {
      const result = await createCampCheckout({
        data: {
          name: name.trim(),
          email: email.trim(),
          packageId,
          weeks,
          partySize,
          origin: window.location.origin,
        },
      });
      setPay({
        mode: result.mode,
        clientSecret: result.clientSecret,
        publishableKey: result.publishableKey,
        amount: result.amount,
      });
    } catch {
      setError("Could not start checkout. Try again, or email support.");
    } finally {
      setBusy(false);
    }
  }

  function finishPreview() {
    recordHold();
    navigate({ to: "/book/thanks" });
  }

  return (
    <main>
      <PageHero
        compact
        image="/images/hero-lanzarote.jpg"
        alt="Playa Grande"
        kicker="Lanzarote 2027"
        title="Pay the deposit. Hold the place."
        sub="£100 per person, per week. Camp balance 15 January. Stay balance 1 January if you took the apartment."
      />
      <Section>
        <Container className="grid items-start gap-12 lg:grid-cols-[1fr_22rem]">
          <div>
            {pay ? (
              <div>
                <Kicker>Payment</Kicker>
                <Display className="mt-2 text-5xl">Checkout</Display>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {pounds(pay.amount)} deposit for {partySize === 1 ? "you" : `${partySize} people`},{" "}
                  {weeks.length === 1 ? "one week" : `${weeks.length} weeks`}. Card details go to Stripe, not us.
                </p>
                <div className="mt-8">
                  {pay.mode === "stripe" && pay.clientSecret && pay.publishableKey ? (
                    <Suspense fallback={<p className="text-sm text-muted">Loading checkout…</p>}>
                      <StripeEmbedded clientSecret={pay.clientSecret} publishableKey={pay.publishableKey} />
                    </Suspense>
                  ) : (
                    <PreviewCheckout amount={pay.amount} email={email} onPaid={finishPreview} />
                  )}
                </div>
                <button
                  type="button"
                  className="mt-6 text-sm text-muted hover:text-fg"
                  onClick={() => setPay(null)}
                >
                  Back to booking details
                </button>
              </div>
            ) : (
              <form className="grid gap-6" onSubmit={continueToPay}>
                <div>
                  <Kicker>Your place</Kicker>
                  <Display className="mt-2 text-5xl">Book Lanzarote</Display>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="book-name">Name</Label>
                    <Input id="book-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  </div>
                  <div>
                    <Label htmlFor="book-email">Email</Label>
                    <Input
                      id="book-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <fieldset>
                  <legend className="text-sm font-medium text-fg">Weeks</legend>
                  <div className="mt-3 grid gap-2">
                    {BOOK_WEEKS.map((week) => (
                      <label
                        key={week.id}
                        className="flex min-h-11 items-center gap-3 rounded-sm bg-surface px-4 text-sm shadow-border"
                      >
                        <input
                          type="checkbox"
                          checked={weeks.includes(week.id)}
                          onChange={() => toggleWeek(week.id)}
                          className="size-4 accent-accent"
                        />
                        <span>
                          {week.label}
                          <span className="text-muted"> · {week.range}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <Label htmlFor="pack">Package</Label>
                  <select
                    id="pack"
                    value={packageId}
                    onChange={(e) => {
                      setPackageId(e.target.value as BookPackageId);
                      setPay(null);
                    }}
                    className="mt-2 h-11 w-full rounded-sm border border-border bg-bg px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {BOOK_PACKAGES.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} · {pounds(item.priceEach)} pp
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-muted">{pack.note}</p>
                </div>
                <div>
                  <Label htmlFor="party">People</Label>
                  <Input
                    id="party"
                    type="number"
                    min={1}
                    max={8}
                    value={partySize}
                    onChange={(e) => setPartySize(Math.min(8, Math.max(1, Number(e.target.value) || 1)))}
                  />
                </div>
                <label className="flex items-start gap-3 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-1 size-4 accent-accent"
                  />
                  <span>
                    I have read the{" "}
                    <Link to="/terms" className="text-fg hover:text-accent">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-fg hover:text-accent">
                      Privacy Policy
                    </Link>
                    . The £100 deposit is non-refundable except where the law says otherwise.
                  </span>
                </label>
                {error ? <p className="text-sm text-accent">{error}</p> : null}
                <Button type="submit" size="lg" disabled={busy}>
                  {busy ? "Opening checkout…" : `Continue to pay ${pounds(deposit)}`}
                </Button>
              </form>
            )}
          </div>
          <aside className="rounded-md bg-surface p-5 shadow-border">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Due now</p>
            <p className="mt-2 font-display text-5xl text-fg">{pounds(deposit)}</p>
            <p className="mt-2 text-sm text-muted">
              Deposit. {partySize} × {weeks.length} week{weeks.length === 1 ? "" : "s"} × £100.
            </p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Package</dt>
                <dd className="text-right text-fg">{pack.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Camp total</dt>
                <dd className="text-right text-fg">{pounds(total)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">After deposit</dt>
                <dd className="text-right text-fg">{pounds(total - deposit)}</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-muted">
              Groups of 6 or 8+, email support. Tennis and Padel are still pre-register, not checkout.
            </p>
          </aside>
        </Container>
      </Section>
    </main>
  );
}
