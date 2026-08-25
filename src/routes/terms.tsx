import { createFileRoute } from "@tanstack/react-router";
import { LegalDoc } from "@/components/site/legal-doc";
import { company, terms } from "@/data/legal";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms & Conditions · Hybrid Vacations" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="Terms & Conditions"
      intro={`These Terms govern bookings with ${company.name}. They cover camps, UK coaching, deposits, cancellation, and how we run a week. Read them before you pay.`}
      sections={terms}
    />
  );
}
