import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useRef, useState } from "react";
import { company } from "@/data/legal";
import { headFor } from "@/data/seo";
import { PRIVACY_REQUEST_TYPES, submitPrivacyRequest } from "@/lib/privacy-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Container, Display, Kicker, Section } from "@/components/site/section";

export const Route = createFileRoute("/privacy/request")({
  head: () => headFor("/privacy/request"),
  component: PrivacyRequestPage,
});

const selectClass =
  "h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent";

function PrivacyRequestPage() {
  const loadedAt = useRef(Date.now());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState(PRIVACY_REQUEST_TYPES[0].value);
  const [detail, setDetail] = useState("");
  const [companyHoneypot, setCompanyHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (Date.now() - loadedAt.current < 800) {
      setSent(true);
      return;
    }
    setBusy(true);
    try {
      await submitPrivacyRequest({
        data: {
          name,
          email,
          requestType,
          detail,
          company: companyHoneypot,
        },
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not send. Try again or email us.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <Section>
        <Container className="max-w-xl">
          <Kicker>Privacy</Kicker>
          <Display as="h1" className="mt-2 text-5xl sm:text-6xl">
            Your data rights
          </Display>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Access, correction, erasure, portability, restriction, objection, or withdraw consent.
            {company.name} will verify who you are before we act. We reply within one month.
          </p>

          {sent ? (
            <p className="mt-10 text-sm leading-relaxed text-fg">
              Request received. If we need anything else we will email you. You can also write to{" "}
              <a href={`mailto:${company.email}`} className="text-accent hover:underline">
                {company.email}
              </a>
              .
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 grid gap-5">
              <div>
                <Label htmlFor="pr-name">Full name *</Label>
                <Input id="pr-name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </div>
              <div>
                <Label htmlFor="pr-email">Email *</Label>
                <Input
                  id="pr-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <Label htmlFor="pr-type">What do you want to do *</Label>
                <select
                  id="pr-type"
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as typeof requestType)}
                  className={selectClass}
                >
                  {PRIVACY_REQUEST_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="pr-detail">Anything we should know</Label>
                <Textarea
                  id="pr-detail"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  maxLength={2000}
                  placeholder="Dates, camps, or the email you booked with, if different."
                />
              </div>
              <div aria-hidden className="hidden">
                <Label htmlFor="pr-company">Company</Label>
                <Input
                  id="pr-company"
                  value={companyHoneypot}
                  onChange={(e) => setCompanyHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              {error ? <p className="text-sm text-accent">{error}</p> : null}
              <Button type="submit" size="lg" disabled={busy}>
                {busy ? "Sending…" : "Send request"}
              </Button>
            </form>
          )}

          <p className="mt-10 text-sm text-muted">
            <Link to="/privacy" className="text-fg hover:text-accent">
              Privacy Policy
            </Link>
            <span className="mx-2 text-border">·</span>
            <Link to="/security" className="text-fg hover:text-accent">
              Security
            </Link>
          </p>
        </Container>
      </Section>
    </main>
  );
}
