import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CommunitySubnav } from "@/components/site/community-subnav";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { partners } from "@/data/community-hub";

export const Route = createFileRoute("/community/partners")({
  head: () => ({
    meta: [
      { title: "Partners · Hybrid Vacations" },
      {
        name: "description",
        content:
          "Fireball Beach Volleyball and beachvolleycamps.ch. The people we build camps, squads, and weeks with.",
      },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/partner-1.jpg"
        alt="Hybrid camp courts in Lanzarote"
        kicker="Community · Partners"
        title="More than partners"
        sub="They help make the weeks, the sessions, and the community. Not a logo wall."
      />
      <CommunitySubnav />

      <Section>
        <Container className="max-w-3xl">
          <Kicker>Together</Kicker>
          <Display className="mt-2 text-5xl">People we build with</Display>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Our partners help create the experiences and the groups that make Hybrid what it is.
            Shared sport, new people, a place to find your lot. Their work sits next to ours, not
            underneath it.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Thank you to everyone involved. This page will grow as Hybrid does.
          </p>
        </Container>
      </Section>

      {partners.map((partner, index) => (
        <Section key={partner.name} className={index % 2 === 0 ? "bg-surface" : undefined}>
          <Container className="grid items-start gap-12 lg:grid-cols-2">
            <Photo
              src={partner.image}
              alt={partner.name}
              className={`aspect-4/5 w-full rounded-lg ${index % 2 === 1 ? "lg:order-2" : ""}`}
            />
            <div>
              <Kicker>Partner</Kicker>
              <Display className="mt-2 text-5xl">{partner.name}</Display>
              <p className="mt-5 text-base leading-relaxed text-muted">{partner.intro}</p>
              <div className="mt-8 space-y-5">
                <div className="border-t border-border pt-5">
                  <p className="text-xs font-semibold tracking-widest text-muted uppercase">What they do</p>
                  <p className="mt-2 text-sm leading-relaxed text-fg">{partner.what}</p>
                </div>
                <div className="border-t border-border pt-5">
                  <p className="text-xs font-semibold tracking-widest text-muted uppercase">With Hybrid</p>
                  <p className="mt-2 text-sm leading-relaxed text-fg">{partner.withHybrid}</p>
                </div>
              </div>
              {partner.href ? (
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-fg hover:text-accent"
                >
                  Visit {partner.name}
                  <ArrowUpRight className="size-4" />
                </a>
              ) : null}
            </div>
          </Container>
        </Section>
      ))}

      <CtaBand
        title="Want to partner with Hybrid?"
        body="If you run a club, a camp, or a court we should know, send a note."
        to="/contact"
        label="Get in touch"
        search={{ interest: "other" }}
      />
    </main>
  );
}
