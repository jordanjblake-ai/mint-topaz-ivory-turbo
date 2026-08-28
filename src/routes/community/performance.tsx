import { createFileRoute, Link } from "@tanstack/react-router";
import { EnquireForm } from "@/components/site/enquire-form";
import { CommunitySubnav } from "@/components/site/community-subnav";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Button } from "@/components/ui/button";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import {
  squadCoaches,
  squadDifference,
  squadExpect,
  squadFacts,
  squadPerks,
  squadPurpose,
  squadSchedule,
} from "@/data/community-hub";

export const Route = createFileRoute("/community/performance")({
  head: () => ({
    meta: [
      { title: "Performance Squad · Hybrid Vacations" },
      {
        name: "description",
        content:
          "Advanced Beach Volleyball performance coaching. 1 court, 8 players, 2 hours. Tuesday or Wednesday, May to September 2027.",
      },
    ],
  }),
  component: PerformanceSquadPage,
});

function PerformanceSquadPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/action-2.jpg"
        alt="Hybrid performance players training"
        kicker="Community · Performance Squad"
        title="Performance coaching"
        sub="1 court. 8 players. 2 hours. Advanced work for players competing at UKBT 4★ and above. Tuesday or Wednesday, May to September 2027."
        actions={
          <Button asChild size="lg">
            <a href="#register">Register your interest</a>
          </Button>
        }
      />
      <CommunitySubnav />

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
            Register as a pair, as an individual, or as a group of 8. Deadline: Wednesday 25 March
            2027. Places are limited.
          </p>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>The purpose</Kicker>
            <Display className="mt-2 text-5xl">Built for the right players</Display>
            <ul className="mt-8 space-y-4">
              {squadPurpose.map((item) => (
                <li key={item} className="border-t border-border pt-4 text-sm leading-relaxed text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Kicker>What is different</Kicker>
            <Display className="mt-2 text-5xl">A squad, not drop-in sessions</Display>
            <ul className="mt-8 space-y-4">
              {squadDifference.map((item) => (
                <li key={item} className="border-t border-border pt-4 text-sm leading-relaxed text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Kicker>Entry</Kicker>
          <Display className="mt-2 text-5xl">Be in it for the right reasons</Display>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            This programme is preferably partnership-based. We want to take teams into the group
            for the 2027 season. Talented individuals are welcome too, if the level is there.
          </p>
          <Button asChild className="mt-8">
            <a href="#register">Register now</a>
          </Button>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <Kicker>What you can expect</Kicker>
          <Display className="mt-2 text-5xl">The work, the feedback, the group</Display>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {squadExpect.map((block) => (
              <div key={block.title} className="border-t border-accent/60 pt-6">
                <h3 className="font-display text-3xl text-fg">{block.title}</h3>
                <ul className="mt-4 space-y-3">
                  {block.points.map((point) => (
                    <li key={point} className="text-sm leading-relaxed text-muted">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-md bg-bg p-6 shadow-border">
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">Added value</p>
            <ul className="mt-4 space-y-3">
              {squadPerks.map((perk) => (
                <li key={perk} className="text-sm leading-relaxed text-fg">
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
            <Kicker>Session detail</Kicker>
            <Display className="mt-2 text-5xl">May to September 2027</Display>
            <ul className="mt-8 space-y-4">
              {squadSchedule.map((row) => (
                <li key={row.label} className="border-t border-border pt-4">
                  <p className="text-xs font-semibold tracking-widest text-muted uppercase">{row.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-fg">{row.body}</p>
                </li>
              ))}
            </ul>
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
            Guest coaches will come through the summer to support the programme and keep the
            sessions sharp.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link to="/coaches">Meet the wider coaching group</Link>
          </Button>
        </Container>
      </Section>

      <Section id="register" className="scroll-mt-24">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Register your interest</Kicker>
            <Display className="mt-2 text-5xl">Tell us who you are</Display>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Pair, individual, or a group of 8. Deadline Wednesday 25 March 2027. We will come
              back if there is a place.
            </p>
          </div>
          <EnquireForm defaultInterest="performance" />
        </Container>
      </Section>
    </main>
  );
}
