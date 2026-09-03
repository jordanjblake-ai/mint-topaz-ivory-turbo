import { createFileRoute, Link } from "@tanstack/react-router";
import { coaches, lanzarote, testimonials } from "@/data/site";
import { BOOK_PACKAGES, pounds } from "@/data/book";
import { headFor } from "@/data/seo";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { EnquireForm } from "@/components/site/enquire-form";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { WeekBoard } from "@/components/camp/week-board";
import { TestimonialCard } from "@/components/site/testimonial-card";

export const Route = createFileRoute("/vacations/lanzarote")({
  head: () => headFor("/vacations/lanzarote"),
  component: LanzarotePage,
});

const weeks = [
  { label: "Week 1", dates: "30/31 Jan to 6/7 Feb" },
  { label: "Week 2", dates: "6/7 Feb to 13/14 Feb" },
  { label: "Week 3", dates: "13/14 Feb to 20/21 Feb" },
];

function LanzarotePage() {
  return (
    <main>
      <PageHero
        image="/images/hero-lanzarote.jpg"
        alt="Playa Grande Beach Volleyball courts, Lanzarote"
        kicker="Beach Volleyball · Lanzarote 2027"
        title="Train on Playa Grande"
        sub="Puerto del Carmen. Golden sand. The same dedicated coach all week. Then the island, the group, and winter sun."
        actions={
          <>
            <Button asChild size="lg">
              <a href="#packages">Book now</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/portal">Already booked?</Link>
            </Button>
          </>
        }
      />

      <Section>
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            {weeks.map((week) => (
              <div key={week.label} className="rounded-md bg-surface p-6 shadow-border">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">{week.label}</p>
                <p className="mt-2 font-display text-3xl text-fg">{week.dates}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
            Camp only from £425 per person. £100 non-refundable deposit holds your place.
          </p>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Kicker>The week</Kicker>
            <Display className="mt-2 text-5xl sm:text-6xl">Same coach. All week.</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Nine sessions, 16+ hours, with one dedicated coach on your group. The work progresses.
              Sideout, defence, serving, and match play, not a new voice every morning.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Improver through to advanced. Solo players are matched. Wednesday is a lighter day so
              you can see the island. Evenings are sunset stretches, a camp dinner, and a farewell
              that actually feels like one.
            </p>
          </div>
          <Photo
            src="/images/camp-2.jpg"
            alt="Coached session on Playa Grande"
            className="aspect-4/5 w-full rounded-lg"
          />
        </Container>
        <Container className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The schedule</p>
          <h3 className="mt-2 font-display text-3xl text-fg sm:text-4xl">Same shape each week</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Nine sessions, a scramble, a rest Wednesday, a camp tournament, then a free Saturday.
            Dates below are Week 1. Weeks 2 and 3 follow the same schedule.
          </p>
          <div className="mt-8">
            <WeekBoard weekId={1} />
          </div>
        </Container>
      </Section>

      <Section id="packages">
        <Container>
          <Kicker>Packages</Kicker>
          <Display className="mt-2 text-5xl">Camp, or camp plus stay</Display>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Stay packages are apartments at Moraña, priced per person. Bedrooms are shared with
            someone you choose. Every person has their own bed. Twin rooms, not a double.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {BOOK_PACKAGES.map((item) => (
              <div key={item.id} className="rounded-md bg-surface p-5 shadow-border">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-semibold text-fg">{item.name}</p>
                  <p className="shrink-0 text-right text-sm font-semibold text-fg">
                    {pounds(item.priceEach)} per person
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.note}</p>
                <Link
                  to="/book"
                  search={{ package: item.id }}
                  className="mt-4 inline-flex h-11 items-center text-xs font-semibold uppercase tracking-wide text-accent hover:text-accent-hover"
                >
                  Book now
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">Or pay in full on checkout.</p>
          <ul className="mt-8 space-y-2 text-sm text-muted">
            {lanzarote.payment.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
            Groups of 6 or 8+: email{" "}
            <a href="mailto:support@hybridvacations.com?subject=Group%20booking" className="text-fg hover:text-accent">
              support@hybridvacations.com
            </a>{" "}
            and we will set the booking up. Stay is Saturday to Saturday. Check-in from 14:00, out before 11:00.
          </p>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="grid gap-10 md:grid-cols-3">
          <ListBlock title="Included" items={lanzarote.included} />
          <ListBlock title="Optional" items={lanzarote.optional} />
          <ListBlock title="Not included" items={lanzarote.notIncluded} />
        </Container>
      </Section>

      <Section>
        <Container>
          <Kicker>Partners</Kicker>
          <Display className="mt-2 text-5xl">Who we run this with</Display>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {lanzarote.partners.map((partner) => {
              const inner = (
                <>
                  <p className="font-display text-2xl text-fg group-hover:text-accent">{partner.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{partner.note}</p>
                </>
              );
              return partner.href ? (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-md bg-surface p-6 shadow-border"
                >
                  {inner}
                </a>
              ) : (
                <div key={partner.name} className="rounded-md bg-surface p-6 shadow-border">
                  {inner}
                </div>
              );
            })}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Photo src="/images/partner-1.jpg" alt="Lanzarote camp partner courts" className="aspect-video w-full rounded-md" />
            <Photo src="/images/partner-2.jpg" alt="Seafront accommodation in Puerto del Carmen" className="aspect-video w-full rounded-md" />
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <Kicker>Coaches</Kicker>
          <Display className="mt-2 text-5xl">The Hybrid group</Display>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Hybrid coaches and the beachvolleycamps.ch network. Your group keeps one dedicated coach
            across the week.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {coaches.slice(0, 4).map((coach) => (
              <Link key={coach.slug} to="/coaches" className="group">
                <Photo src={coach.image} alt={coach.name} className="aspect-3/4 w-full rounded-md" />
                <p className="mt-3 font-display text-2xl text-fg group-hover:text-accent">{coach.name}</p>
                <p className="text-xs uppercase tracking-wider text-muted">{coach.handle}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Kicker>From camp</Kicker>
          <Display className="mt-2 text-5xl">What the week feels like</Display>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((item) => (
              <TestimonialCard key={item.name} {...item} />
            ))}
          </div>
        </Container>
      </Section>

      <section className="grid grid-cols-2 md:grid-cols-4">
        {[
          "/images/gallery-1.jpg",
          "/images/gallery-2.jpg",
          "/images/action-2.jpg",
          "/images/camp-4.jpg",
        ].map((src) => (
          <Photo key={src} src={src} alt="Lanzarote camp" className="aspect-square size-full" sizes="(min-width: 768px) 25vw, 50vw" />
        ))}
      </section>

      <Section>
        <Container>
          <Kicker>Questions</Kicker>
          <Display className="mt-2 text-5xl">Before you book</Display>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {lanzarote.faqs.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="cursor-pointer list-none font-semibold text-fg [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-accent group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {item.a}
                  {"href" in item && item.href ? (
                    <>
                      {" "}
                      <Link to={item.href} className="text-fg hover:text-accent">
                        {item.link}
                      </Link>
                      .
                    </>
                  ) : null}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="hold" className="bg-surface">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Book now</Kicker>
            <Display className="mt-2 text-5xl">£100 deposit. We take it from there.</Display>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Pay the £100 deposit here to hold the week. We will email confirmation, then the
              balances later. Prefer to talk first?{" "}
              <a className="text-accent hover:text-accent-hover" href="mailto:support@hybridvacations.com">
                support@hybridvacations.com
              </a>
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link to="/book">Pay the deposit</Link>
            </Button>
          </div>
          <EnquireForm defaultInterest="lanzarote" variant="lanzarote" />
        </Container>
      </Section>

      <CtaBand
        title="Want help with the rest of the trip?"
        body="Flights, transfers, extra nights. Ask and we will put it together."
        to="/travel"
        label="Plan a trip"
      />
    </main>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-display text-3xl text-fg">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="border-t border-border pt-3 text-sm leading-relaxed text-muted">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
