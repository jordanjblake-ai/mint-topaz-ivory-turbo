import { createFileRoute } from "@tanstack/react-router";
import { EnquireForm } from "@/components/site/enquire-form";
import { PageHero } from "@/components/site/page-hero";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { site } from "@/data/site";

type ContactSearch = { interest?: string };

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    interest: typeof search.interest === "string" ? search.interest : undefined,
  }),
  head: () => ({
    meta: [{ title: "Contact us · Hybrid Vacations" }],
  }),
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
        sub="Camps, UK coaching, or a trip around the sport. We reply from support@hybridvacations.com."
      />
      <Section>
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Get in touch</Kicker>
            <Display className="mt-2 text-5xl">We will come back with a clear next step</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Lanzarote places are held with a £100 deposit. Tennis and padel are pre-register for
              now. Golf is a 2028 notify. For UK coaching, tell us what you need and we will come
              back.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-accent hover:text-accent-hover"
            >
              {site.email}
            </a>
          </div>
          <EnquireForm defaultInterest={interest ?? "lanzarote"} />
        </Container>
      </Section>
    </main>
  );
}
