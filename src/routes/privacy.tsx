import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalDoc } from "@/components/site/legal-doc";
import { company, privacy } from "@/data/legal";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/privacy")({
  head: () => headFor("/privacy"),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="Privacy Policy"
      intro={`${company.name} is the data controller for this site and for Hybrid bookings. This policy is written for UK GDPR. Questions: ${company.email}.`}
      sections={privacy}
    >
      <p className="mt-12 text-sm leading-relaxed text-muted">
        <Link to="/privacy/request" className="text-fg hover:text-accent">
          Use your data rights
        </Link>
        <span className="mx-2 text-border">·</span>
        <Link to="/security" className="text-fg hover:text-accent">
          Security and compliance
        </Link>
      </p>
    </LegalDoc>
  );
}
