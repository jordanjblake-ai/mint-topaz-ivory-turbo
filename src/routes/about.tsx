import { createFileRoute, Link } from "@tanstack/react-router";
import { coaches, site, testimonials } from "@/data/site";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { TestimonialCard } from "@/components/site/testimonial-card";

export const Route = createFileRoute("/about")({ component: AboutPage });

const ideas = [
  {
    title: "Sport + Travel",
    body: "You go because of the game. The place is the other half of the week, not a backdrop.",
  },
  {
    title: "Training + Holiday",
    body: "Improve without turning the trip into a bootcamp. Sessions in the morning. Island in the afternoon.",
  },
  {
    title: "Individual + Community",
    body: "Arrive on your own. Train in a group. Leave with people you will see at the next event.",
  },
];

function AboutPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/group.jpg"
        alt="Hybrid camp community"
        kicker="About Hybrid"
        title={site.tagline}
        sub="A sports and travel company built around coaching, destinations, and a group you actually want to spend a week with."
      />
      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Photo
            src="/images/camp-4.jpg"
            alt="Hybrid players on the sand, sport and travel in the same week"
            className="aspect-[3/2] w-full rounded-lg object-center"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
          <div>
            <Kicker>The name</Kicker>
            <Display className="mt-2 text-5xl">Hybrid is the combination</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Sport and travel. Performance and adventure. Local coaching and international camps.
              Mark Garcia-Kidd started Hybrid after years competing for England and organising the
              kind of trips he wanted to take himself: serious training, in a place worth flying to,
              with people who care about the game.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Beach Volleyball is the home sport. Tennis and Padel are next. Golf is on the 2028
              horizon. UK coaching sits underneath all of it, so the community does not only exist
              one week a year.
            </p>
          </div>
        </Container>
      </Section>
      <Section className="bg-surface">
        <Container>
          <Kicker>What we mean</Kicker>
          <Display className="mt-2 text-5xl">The Hybrid idea</Display>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {ideas.map((idea) => (
              <div key={idea.title} className="border-t border-accent/60 pt-6">
                <h3 className="font-display text-3xl text-fg">{idea.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{idea.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Kicker>People</Kicker>
              <Display className="mt-2 text-5xl">The coaching group</Display>
            </div>
            <Button asChild variant="secondary">
              <Link to="/coaches">Meet the coaches</Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {coaches.slice(0, 4).map((coach) => (
              <div key={coach.slug}>
                <Photo src={coach.image} alt={coach.name} className={`aspect-3/4 w-full rounded-md ${coach.imageClass}`} />
                <p className="mt-3 font-display text-2xl text-fg">{coach.name}</p>
                <p className="text-xs uppercase tracking-wider text-muted">{coach.role}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section className="bg-surface">
        <Container>
          <Kicker>From the group</Kicker>
          <Display className="mt-2 text-5xl">What players say</Display>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((item) => (
              <TestimonialCard key={item.name} {...item} />
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand
        title="Come for a week"
        body="Lanzarote 2027 is open. Or contact us for UK coaching if you want to start closer to home."
        to="/vacations"
        label="See camps"
      />
    </main>
  );
}
