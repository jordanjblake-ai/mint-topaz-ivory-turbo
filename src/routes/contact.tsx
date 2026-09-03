import { createFileRoute } from "@tanstack/react-router";
import { EnquireForm } from "@/components/site/enquire-form";
import { PageHero } from "@/components/site/page-hero";
import { Container, Section } from "@/components/site/section";
import { headFor } from "@/data/seo";

type ContactSearch = { interest?: string };

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    interest: typeof search.interest === "string" ? search.interest : undefined,
  }),
  head: () => headFor("/contact"),
  component: ContactPage,
});

function ContactPage() {
  const { interest } = Route.useSearch();

  return (
    <main>
      <PageHero
        compact
        image="/images/sunset.jpg"
        alt="End of a camp day"
        kicker="Contact us"
        title="How can we help"
        sub="Camps, UK coaching, or a trip around the sport. Send the form and we will come back."
      />
      <Section className="bg-surface">
        <Container>
          <EnquireForm defaultInterest={interest ?? "other"} variant="contact" />
        </Container>
      </Section>
    </main>
  );
}
