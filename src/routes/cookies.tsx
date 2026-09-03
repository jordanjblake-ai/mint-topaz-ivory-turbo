import { createFileRoute } from "@tanstack/react-router";
import { LegalDoc } from "@/components/site/legal-doc";
import { company, cookies } from "@/data/legal";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/cookies")({
  head: () => headFor("/cookies"),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="Cookie Policy"
      intro={`How ${company.name} uses cookies on this site. Essential cookies run the site. Analytics and marketing only if you say yes.`}
      sections={cookies}
    />
  );
}
