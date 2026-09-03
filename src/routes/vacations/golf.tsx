import { createFileRoute } from "@tanstack/react-router";
import { EnquireForm } from "@/components/site/enquire-form";
import { PageHero } from "@/components/site/page-hero";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { headFor } from "@/data/seo";
import { sportHero, sportImageAlt } from "@/data/sport-images";

export const Route = createFileRoute("/vacations/golf")({
  head: () => headFor("/vacations/golf"),
  component: GolfPage,
});

function GolfPage() {
  const image = sportHero("Golf");
  return (
    <main>
      <PageHero
        compact
        image={image}
        alt={sportImageAlt(image, "Golf course greens and bunkers")}
        kicker="Golf · 2028"
        title="Golf, the Hybrid way"
        sub="Train, travel, community. Destination follows in 2028. Get notified and we will send the week when it is ready."
      />
      <Section>
        <Container className="max-w-3xl">
          <Kicker>Coming 2028</Kicker>
          <Display className="mt-2 text-5xl">A Hybrid week. With Golf.</Display>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Same idea as the other camps: serious sessions, a place worth travelling to, and a
            group that wants to be there. The destination lands with the 2028 dates.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-fg">
            <li className="border-t border-border pt-4">Sport: Golf</li>
            <li className="border-t border-border pt-4">Year: 2028</li>
            <li className="border-t border-border pt-4">Get notified. No payment now.</li>
          </ul>
        </Container>
      </Section>
      <Section className="bg-surface" id="notify">
        <Container className="max-w-3xl space-y-10">
          <div>
            <Kicker>Get notified</Kicker>
            <Display className="mt-2 text-5xl">Tell us you want in</Display>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Drop your name and we will follow up when the Golf week is ready.
            </p>
          </div>
          <EnquireForm defaultInterest="golf" />
        </Container>
      </Section>
    </main>
  );
}
