import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { SizeGuideSections } from "@/components/site/size-guide";
import { Container, Section } from "@/components/site/section";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/kit/sizes")({
  head: () => headFor("/kit/sizes"),
  component: SizeGuidePage,
});

function SizeGuidePage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/action-2.jpg"
        alt="Players on a Hybrid court"
        kicker="Kit"
        title="Size guide"
        sub="XS, S, M, L and XL. Centimetres first, inches in brackets."
      />
      <Section>
        <Container className="max-w-3xl">
          <SizeGuideSections />
        </Container>
      </Section>
    </main>
  );
}
