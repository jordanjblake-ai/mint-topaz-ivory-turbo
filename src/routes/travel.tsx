import { createFileRoute, Link } from "@tanstack/react-router";
import { EnquireForm } from "@/components/site/enquire-form";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Button } from "@/components/ui/button";
import { Container, Display, Kicker, Section } from "@/components/site/section";

export const Route = createFileRoute("/travel")({ component: TravelPage });

const pieces = [
  {
    title: "Sports experience",
    body: "The camp, the coaching, the group. This is what Hybrid builds and runs.",
  },
  {
    title: "Stay",
    body: "Camp-plus-accommodation on Lanzarote, or we help you extend nights around the week.",
  },
  {
    title: "Club trips",
    body: "Bring your club, your squad, or a group of mates. We shape the week around you.",
  },
  {
    title: "Everything else",
    body: "Extra destinations, or a holiday that is not a Hybrid camp. Request a quote.",
  },
];

function TravelPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/aerial.jpg"
        alt="Aerial view of a coastal destination"
        kicker="Plan a trip"
        title="Build your Hybrid"
        sub="Stays, extra nights, and trips around the camp week. Or a holiday that is not a camp at all."
      />
      <Section>
        <Container>
          <Kicker>How it works</Kicker>
          <Display className="mt-2 max-w-3xl text-5xl">The camp, the stay, and the rest</Display>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Book a Hybrid week as it is, add a stay around it, or ask us to put a trip together.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {pieces.map((piece) => (
              <div
                key={piece.title}
                className="rounded-md bg-surface p-6 shadow-border"
              >
                <h3 className="font-display text-3xl text-fg">{piece.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{piece.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section className="bg-surface">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <Photo
            src="/images/ocean.jpg"
            alt="Atlantic coastline"
            className="aspect-4/5 w-full rounded-lg"
          />
          <div>
            <Kicker>Two paths</Kicker>
            <Display className="mt-2 text-5xl">See the camps, or tell us the trip</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              If you already know the camp week, start there. If you want a longer stay, a club
              trip, or something that is not on the camps list, send a quote request and we will
              come back with options.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/vacations">See camps</Link>
              </Button>
              <Button asChild variant="secondary">
                <a href="#quote">Request a quote</a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
      <Section id="quote">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Request a quote</Kicker>
            <Display className="mt-2 text-5xl">Tell us the trip</Display>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Dates, who is travelling, sport or not, and anything already booked. We will reply from
              support@hybridvacations.com.
            </p>
          </div>
          <EnquireForm defaultInterest="travel" />
        </Container>
      </Section>
    </main>
  );
}
