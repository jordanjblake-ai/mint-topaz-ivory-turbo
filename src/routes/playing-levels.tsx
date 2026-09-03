import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { campLevels, otherSports } from "@/data/playing-levels";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/playing-levels")({
  head: () => headFor("/playing-levels"),
  component: PlayingLevelsPage,
});

function PlayingLevelsPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/action-2.jpg"
        alt="Players training on a Hybrid court"
        kicker="Playing levels"
        title="Train with the right people"
        sub="Hybrid camps split groups so you play at a standard that helps you, not a mixed bag. Tell us honestly. We place you."
      />

      <Section>
        <Container className="max-w-3xl">
          <Kicker>Beach Volleyball camp</Kicker>
          <Display className="mt-2 text-5xl">Improver to advanced</Display>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Lanzarote is not a first-lesson week and it is not an elite-only week. Groups of six,
            same dedicated coach all week. Performance Squad is a separate UKBT 4★ programme at
            home.
          </p>
        </Container>
        <Container>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {campLevels.map((level) => (
              <article key={level.name} className="border-t border-accent/60 pt-6">
                <h2 className="font-display text-3xl text-fg">{level.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-fg">{level.who}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{level.court}</p>
                <p className="mt-4 text-xs font-semibold tracking-widest text-accent uppercase">
                  {level.guide}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <Kicker>Other sports</Kicker>
          <Display className="mt-2 text-5xl">Tennis, Padel, Golf</Display>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {otherSports.map((item) => (
              <div key={item.sport} className="border-t border-border pt-6">
                <h2 className="font-display text-3xl text-fg">{item.sport}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <Kicker>How we place you</Kicker>
          <Display className="mt-2 text-5xl">Say where you are</Display>
          <p className="mt-5 text-base leading-relaxed text-muted">
            The form asks for a level. Use this guide, not a guess that makes the week easier or
            harder than it should be. If you are between two groups, say so. We would rather move
            you on day one than leave you in the wrong six.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/vacations/lanzarote">Lanzarote camp</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/contact">Enquire</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
