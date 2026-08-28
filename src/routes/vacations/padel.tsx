import { createFileRoute } from "@tanstack/react-router";
import { EnquireForm } from "@/components/site/enquire-form";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";

export const Route = createFileRoute("/vacations/padel")({ component: PadelPage });

function PadelPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/tennis-clay.jpg"
        alt="Padel court in Mallorca"
        kicker="Padel · Mallorca 2027"
        title="Mallorca. 5 to 9 April."
        sub="A spring Padel week in Capdepera. Coaching, match play, and the island around it. Pre-register and we will send the details."
      />
      <Section>
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>April 2027</Kicker>
            <Display className="mt-2 text-5xl">Same Hybrid idea. Different racket.</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Four days on Mallorca built around Padel. Coaching and match play sit at the centre.
              Stay and extras follow when they are ready.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-fg">
              <li className="border-t border-border pt-4">Dates: 5 to 9 April 2027</li>
              <li className="border-t border-border pt-4">Location: Capdepera, Mallorca</li>
              <li className="border-t border-border pt-4">Pre-register now. No payment yet.</li>
            </ul>
          </div>
          <Photo src="/images/ocean.jpg" alt="Mallorca coastline" className="aspect-4/5 w-full rounded-lg" />
        </Container>
      </Section>
      <Section className="bg-surface">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Pre-register</Kicker>
            <Display className="mt-2 text-5xl">Tell us you want in</Display>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Drop your name and we will follow up when the package is ready. No payment now.
            </p>
          </div>
          <EnquireForm defaultInterest="padel" />
        </Container>
      </Section>
    </main>
  );
}
