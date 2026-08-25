import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { coaches, experiences, site, testimonials } from "@/data/site";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { ExperienceCard } from "@/components/site/experience-card";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { TestimonialCard } from "@/components/site/testimonial-card";

export const Route = createFileRoute("/")({ component: Home });

const pillars = [
  {
    title: "Train",
    body: "Same coach all week. Real sessions, not a holiday drill circuit. Improver through to advanced.",
  },
  {
    title: "Explore",
    body: "Winter sun, island coast, and a Wednesday to actually see the place you flew for.",
  },
  {
    title: "Connect",
    body: "Come solo. Leave with a group. UK players, European players, one camp.",
  },
];

function Home() {
  return (
    <main>
      <PageHero
        image="/images/hero-home.jpg"
        alt="Beach volleyball players training at sunset"
        kicker={site.positioning}
        title="Travel through what you love"
        sub="Train hard. Explore the landscape. Connect with good people. Lanzarote is open for 2027. Tennis and padel follow in Mallorca."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/vacations/lanzarote">Book Lanzarote</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/vacations">All camps</Link>
            </Button>
          </>
        }
      />

      <Section>
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Kicker>Upcoming</Kicker>
              <Display className="mt-2 text-5xl sm:text-6xl">Find your next Hybrid</Display>
            </div>
            <Link
              to="/vacations"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent hover:text-accent-hover"
            >
              All camps <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.slug} experience={experience} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <Kicker>The week</Kicker>
          <Display className="mt-2 max-w-3xl text-5xl sm:text-6xl">
            A holiday that trains. A camp that still feels like a trip.
          </Display>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="border-t border-accent/60 pt-6">
                <h3 className="font-display text-3xl text-fg">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <section className="grid grid-cols-2 md:grid-cols-4">
        {[
          { src: "/images/spike.jpg", alt: "Spike at the net" },
          { src: "/images/group.jpg", alt: "Camp group on court" },
          { src: "/images/sunset.jpg", alt: "Sunset after sessions" },
          { src: "/images/dig.jpg", alt: "Defensive dig in the sand" },
        ].map((shot) => (
          <Photo key={shot.src} src={shot.src} alt={shot.alt} className="aspect-square size-full" sizes="(min-width: 768px) 25vw, 50vw" />
        ))}
      </section>

      <Section>
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Kicker>Coaches</Kicker>
              <Display className="mt-2 text-5xl sm:text-6xl">The people you train with</Display>
            </div>
            <Link
              to="/coaches"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent hover:text-accent-hover"
            >
              Meet the coaches <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {coaches.slice(0, 4).map((coach) => (
              <Link key={coach.slug} to="/coaches" className="group block">
                <Photo
                  src={coach.image}
                  alt={coach.name}
                  className={`aspect-3/4 w-full rounded-md ${coach.imageClass}`}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
                <p className="mt-3 font-display text-2xl text-fg group-hover:text-accent">{coach.name}</p>
                <p className="text-xs uppercase tracking-wider text-muted">{coach.role}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <Kicker>From the group</Kicker>
          <Display className="mt-2 text-5xl sm:text-6xl">What the week actually feels like</Display>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((item) => (
              <TestimonialCard key={item.name} {...item} />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <Photo
            src="/images/coach-mark-hero.jpg"
            alt="Mark Garcia-Kidd, Hybrid founder"
            className="aspect-4/5 w-full rounded-lg object-top"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
          <div>
            <Kicker>UK coaching</Kicker>
            <Display className="mt-2 text-5xl sm:text-6xl">Train here. Travel later.</Display>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              Private sessions, clinics, and mini-camps around the U.K. A way
              into Hybrid close to home. Contact us and we will shape the session around you.
            </p>
            <Button asChild className="mt-8">
              <Link to="/coaching">UK coaching</Link>
            </Button>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Ready for Lanzarote?"
        body="Three weeks in Jan and Feb 2027. Camp from £425. Deposit £100 to hold your place."
        to="/vacations/lanzarote"
        label="View the camp"
      />
    </main>
  );
}
