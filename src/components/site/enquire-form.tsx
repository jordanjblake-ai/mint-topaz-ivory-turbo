import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { enquireInterests, site } from "@/data/site";
import { kindFromInterest } from "@/data/ops";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { allowAttempt, isEmail } from "@/lib/guard";
import { useOps } from "@/lib/ops-store";

const weeks = [
  { value: "", label: "Not sure yet" },
  { value: "week-1", label: "Week 1 · 30/31 Jan to 6/7 Feb" },
  { value: "week-2", label: "Week 2 · 6/7 Feb to 13/14 Feb" },
  { value: "week-3", label: "Week 3 · 13/14 Feb to 20/21 Feb" },
];

const coachingFormats = [
  { value: "private", label: "Private session" },
  { value: "clinic", label: "Clinic" },
  { value: "mini-camp", label: "Mini-camp" },
];

export function EnquireForm({
  defaultInterest = "lanzarote",
  compact = false,
}: {
  defaultInterest?: string;
  compact?: boolean;
}) {
  const addEnquiry = useOps((s) => s.addEnquiry);
  const hydrate = useOps((s) => s.hydrate);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(defaultInterest);
  const [week, setWeek] = useState("");
  const [format, setFormat] = useState("private");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [company, setCompany] = useState("");

  useEffect(() => {
    setInterest(defaultInterest);
  }, [defaultInterest]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (!isEmail(email)) {
      setError("That email does not look right.");
      return;
    }
    if (!accepted) {
      setError("Please confirm you have read the Terms and Privacy Policy.");
      return;
    }
    if (company.trim()) {
      setSent(true);
      return;
    }
    if (!allowAttempt("enquire", 6, 60_000)) {
      setError("Too many enquiries just now. Wait a minute and try again.");
      return;
    }
    const interestLabel =
      enquireInterests.find((item) => item.value === interest)?.label ?? interest;
    const weekLabel = weeks.find((item) => item.value === week)?.label ?? "";
    const formatLabel = coachingFormats.find((item) => item.value === format)?.label ?? "";
    const kind = kindFromInterest(interest, interest === "coaching" ? format : undefined);

    addEnquiry({
      name: name.trim(),
      email: email.trim(),
      kind,
      week: (week || "") as "" | "week-1" | "week-2" | "week-3",
      partySize: 1,
      solo: true,
      stay: "",
      message: message.trim(),
      source: "site",
    });

    const subject = encodeURIComponent(`Hybrid enquiry: ${interestLabel}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Interest: ${interestLabel}`,
        interest === "coaching" && formatLabel ? `Format: ${formatLabel}` : "",
        weekLabel ? `Week: ${weekLabel}` : "",
        "",
        message || "(no extra message)",
      ]
        .filter((line) => line !== "")
        .join("\n"),
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-md bg-surface p-6 shadow-border">
        <p className="font-display text-3xl text-fg">We have the details</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Your email app should open a message to {site.email}. If it does not, write to us
          directly and we will come back with dates, availability, and next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="interest">I am interested in</Label>
        <select
          id="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {enquireInterests.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {interest === "coaching" ? (
        <div>
          <Label htmlFor="format">Session type</Label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {coachingFormats.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {interest === "lanzarote" ? (
        <div>
          <Label htmlFor="week">Preferred week</Label>
          <select
            id="week"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {weeks.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div>
        <Label htmlFor="message">Anything we should know</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Level, dates, travelling solo, club group..."
          maxLength={1500}
        />
      </div>
      <div aria-hidden className="hidden">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 size-4 shrink-0 accent-accent"
        />
        <span>
          I have read the{" "}
          <Link to="/terms" className="text-fg hover:text-accent">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-fg hover:text-accent">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Send message
      </Button>
    </form>
  );
}
