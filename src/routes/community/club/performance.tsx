import { createFileRoute, Link } from "@tanstack/react-router";
import { EnquireForm } from "@/components/site/enquire-form";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Button } from "@/components/ui/button";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import {
  squadCoaches,
  squadDifference,
  squadFacts,
  squadPerks,
  squadPurpose,
  squadShape,
} from "@/data/community-hub";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/community/club/performance")({
  head: () => headFor("/community/club/performance"),
  component: PerformanceSquadPage,
});

function PerformanceSquadPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/action-2.jpg"
        alt="Hybrid performance players training"
        kicker="The Club · Performance Squad"
        title="Being built for 2027"
        sub="An 18-week UKBT 4★ Beach Volleyball programme, May to September. Enquire, and we will come back once the timetable is signed."
        actions={
          <Button asChild size="lg">
            <a href="#enquire">Enquire</a>
          </Button>
        }
      />

      <Section>
        <Container>
          <div className="grid gap-6 border-y border-border py-8 sm:grid-cols-3">
            {squadFacts.map((fact) => (
              <div key={fact.label}>
                <p className="font-display text-5xl text-fg">{fact.value}</p>
                <p className="mt-1 text-xs font-semibold tracking-widest text-muted uppercase">{fact.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">
            The shape is set. One court, eight players, two hours. Days and times stay open until
            Mark signs the timetable. Ask by Wednesday 25 March 2027.
          </p>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>The programme</Kicker>
            <Display className="mt-2 text-5xl">Who it is for</Display>
            <ul className="mt-8 space-y-4">
              {squadPurpose.map((item) => (
                <li key={item} className="border-t border-border pt-4 text-sm leading-relaxed text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Kicker>What we know</Kicker>
            <Display className="mt-2 text-5xl">A squad, not drop-in</Display>
            <ul className="mt-8 space-y-4">
              {squadDifference.map((item) => (
                <li key={item} className="border-t border-border pt-4 text-sm leading-relaxed text-fg">
                  {item}
                </li>
              ))}
            </ul>
            <ul className="mt-8 space-y-3">
              {squadPerks.map((perk) => (
                <li key={perk} className="text-sm leading-relaxed text-muted">
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>2027</Kicker>
            <Display className="mt-2 text-5xl">Enquire first</Display>
            <ul className="mt-8 space-y-4">
              {squadShape.map((row) => (
                <li key={row.label} className="border-t border-border pt-4">
                  <p className="text-xs font-semibold tracking-widest text-muted uppercase">{row.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-fg">{row.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted">
              Pair, individual, or a group of 8. We will come back if there is a place. No price on
              this page on purpose.
            </p>
          </div>
          <Photo
            src="/images/spike.jpg"
            alt="Hybrid players in a competitive session"
            className="aspect-4/5 w-full rounded-lg"
          />
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <Kicker>Coaching team</Kicker>
          <Display className="mt-2 text-5xl">Who you train with</Display>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {squadCoaches.map((coach) => (
              <article key={coach.name}>
                {coach.image ? (
                  <Photo
                    src={coach.image}
                    alt={coach.name}
                    className={`aspect-3/4 w-full rounded-md ${coach.imageClass}`}
                    sizes="(min-width: 1024px) 22vw, 50vw"
                  />
                ) : (
                  <div className="flex aspect-3/4 w-full items-end rounded-md bg-bg p-5 shadow-border">
                    <p className="font-display text-6xl text-accent">DS</p>
                  </div>
                )}
                <p className="mt-3 font-display text-2xl text-fg">{coach.name}</p>
                <p className="text-xs tracking-widest text-muted uppercase">{coach.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{coach.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
            Guest coaches will come through the summer once the week is locked.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link to="/coaches">Meet the wider coaching group</Link>
          </Button>
        </Container>
      </Section>

      <Section id="enquire" className="scroll-mt-24">
        <Container className="grid items-start gap-12 lg:grid-cols-1">
          <div>
            <Kicker>Enquire</Kicker>
            <Display className="mt-2 text-5xl">Tell us who you are</Display>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              Ask to be considered. Deadline Wednesday 25 March 2027. We will come back when the
              timetable is signed.
            </p>
          </div>
          <EnquireForm defaultInterest="performance" />
        </Container>
      </Section>
    </main>
  );
}
