import { createFileRoute } from "@tanstack/react-router";
import { LegalDoc } from "@/components/site/legal-doc";
import { company, privacy } from "@/data/legal";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Privacy Policy · Hybrid Vacations" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="Privacy Policy"
      intro={`${company.name} is the data controller for this site and for Hybrid bookings. This policy is written for UK GDPR. Questions: ${company.email}.`}
      sections={privacy}
    />
  );
}
