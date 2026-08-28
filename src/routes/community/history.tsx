import { createFileRoute } from "@tanstack/react-router";
import { CommunitySubnav } from "@/components/site/community-subnav";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { historyItems } from "@/data/community-hub";

export const Route = createFileRoute("/community/history")({
  head: () => ({
    meta: [
      { title: "Hybrid History · Hybrid Vacations" },
      {
        name: "description",
        content:
          "A visual timeline of Hybrid. Founded June 2025. First camp 2026. The story is still being written.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/sunset.jpg"
        alt="Hybrid camp sunset"
        kicker="Community · Hybrid History"
        title="This is our history"
        sub="Image-led. Short on copy. A timeline of a club that is still being written."
      />
      <CommunitySubnav />

      <Section>
        <Container className="max-w-3xl">
          <Kicker>Timeline</Kicker>
          <Display className="mt-2 text-5xl">How fast this has moved</Display>
          <p className="mt-5 text-base leading-relaxed text-muted">
            From a founder in June 2025 to camps, a domestic squad, a club championship, and
            World Tour athletes. The next chapter is 2027.
          </p>
        </Container>
      </Section>

      {historyItems.map((item, index) => (
        <section
          key={item.when + item.title}
          className={index % 2 === 0 ? "bg-surface" : "bg-bg"}
        >
          <Container className="grid items-center gap-8 py-12 lg:grid-cols-2 lg:gap-14 lg:py-16">
            <Photo
              src={item.image}
              alt={item.title}
              className={`aspect-[16/10] w-full rounded-lg ${index % 2 === 1 ? "lg:order-2" : ""}`}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div>
              <p className="font-display text-4xl text-accent sm:text-5xl">{item.when}</p>
              <h2 className="mt-3 font-display text-4xl text-fg sm:text-5xl">{item.title}</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{item.body}</p>
            </div>
          </Container>
        </section>
      ))}

      <CtaBand
        title="The next line is yours"
        body="Come for the sport. Stay for the people. Leave with memories."
        to="/vacations"
        label="See camps"
      />
    </main>
  );
}
