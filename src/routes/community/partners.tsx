import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CommunitySubnav } from "@/components/site/community-subnav";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { PartnerMarks, PartnerPlate } from "@/components/site/partner-marks";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { featuredPartners, supportingPartners } from "@/data/community-hub";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/community/partners")({
  head: () => headFor("/community/partners"),
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
        sub="The clubs, camps, and places we build the weeks with."
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

      <PartnerMarks />

      {featuredPartners.map((partner, index) => (
        <Section key={partner.id} id={partner.id} className={index % 2 === 0 ? "scroll-mt-28 bg-surface" : "scroll-mt-28"}>
          <Container className="grid items-start gap-12 lg:grid-cols-2">
            {partner.image ? (
              <Photo
                src={partner.image}
                alt={partner.name}
                className={`aspect-4/5 w-full rounded-lg ${index % 2 === 1 ? "lg:order-2" : ""}`}
              />
            ) : null}
            <div>
              <PartnerPlate partner={partner} className="mb-6" />
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

      <Section id="on-the-island" className="scroll-mt-28">
        <Container>
          <Kicker>On the island</Kicker>
          <Display className="mt-2 text-5xl">Lanzarote week</Display>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            The camp week also sits with a local club and a seafront stay. Same standard. Different
            job.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {supportingPartners.map((partner) => (
              <article
                key={partner.id}
                id={partner.id}
                className="scroll-mt-28 rounded-lg border border-border bg-surface p-6 sm:p-8"
              >
                <PartnerPlate partner={partner} />
                <h3 className="mt-6 font-display text-3xl tracking-wide text-fg">{partner.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{partner.intro}</p>
                <p className="mt-4 text-sm leading-relaxed text-fg">{partner.withHybrid}</p>
                {partner.href ? (
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-fg hover:text-accent"
                  >
                    Visit {partner.name}
                    <ArrowUpRight className="size-4" />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </Section>

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
