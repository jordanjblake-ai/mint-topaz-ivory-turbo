import { createFileRoute } from "@tanstack/react-router";
import { EnquireForm } from "@/components/site/enquire-form";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";

export const Route = createFileRoute("/vacations/tennis")({ component: TennisPage });

function TennisPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/tennis-open.jpg"
        alt="Empty clay tennis courts in Mallorca"
        kicker="Tennis · Mallorca 2027"
        title="Coastlines and courtlines"
        sub="Clay in Capdepera, minutes from Font de Sa Cala. A training-focused week with island living around it. Pre-register and we will send the full week when it is ready."
      />
      <Section>
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>April 2027</Kicker>
            <Display className="mt-2 text-5xl">Serious sessions. Mediterranean week.</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Clay courts a short walk from the coast. Hotel Na Taconera sits next to the club, so
              the day is train, recover, swim, eat. This is not a sightseeing tour with a racket
              on the side.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-fg">
              <li className="border-t border-border pt-4">Location: Font de Sa Cala, Capdepera</li>
              <li className="border-t border-border pt-4">Surface: clay</li>
              <li className="border-t border-border pt-4">Stay: Hotel Na Taconera, a few minutes from the courts</li>
              <li className="border-t border-border pt-4">Pre-register. We will send details when the week is ready.</li>
            </ul>
          </div>
          <Photo
            src="/images/tennis-player.jpg"
            alt="Tennis training on clay"
            className="aspect-4/5 w-full rounded-lg"
          />
        </Container>
      </Section>
      <Section className="bg-surface" id="register">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Pre-register</Kicker>
            <Display className="mt-2 text-5xl">Get on the list</Display>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We will contact you when dates, training options, and stay details are ready. No
              payment now.
            </p>
          </div>
          <EnquireForm defaultInterest="tennis" />
        </Container>
      </Section>
    </main>
  );
}
