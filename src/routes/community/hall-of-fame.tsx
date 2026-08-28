import { createFileRoute } from "@tanstack/react-router";
import { CommunitySubnav } from "@/components/site/community-subnav";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { hallItems } from "@/data/community-hub";

export const Route = createFileRoute("/community/hall-of-fame")({
  head: () => ({
    meta: [
      { title: "Hall of Fame · Hybrid Vacations" },
      {
        name: "description",
        content:
          "The people who showed up first. A growing record of the first Hybrid camps, squads, and weeks.",
      },
    ],
  }),
  component: HallOfFamePage,
});

function HallOfFamePage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/group.jpg"
        alt="The first Hybrid camp group"
        kicker="Community · Hall of Fame"
        title="The first to believe"
        sub="Every community has a beginning. These are the people who showed up first."
      />
      <CommunitySubnav />

      <Section>
        <Container className="max-w-3xl">
          <Kicker>Thank you</Kicker>
          <Display className="mt-2 text-5xl">You were here first</Display>
          <p className="mt-5 text-base leading-relaxed text-muted">
            The names and faces here belong to the people who took a chance on Hybrid, believed in
            the idea, and helped bring the first experiences to life. You were not just attendees.
            You became part of the story from the start.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            This is our way of saying thank you. For believing in it, for showing up, and for
            laying the foundations of the community we are building now.
          </p>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="max-w-3xl">
          <Kicker>What this is</Kicker>
          <Display className="mt-2 text-5xl">A record, not an archive</Display>
          <p className="mt-5 text-base leading-relaxed text-muted">
            The Hall of Fame marks the people present at the first delivery of a Hybrid product.
            First Beach Volleyball Camp. First domestic performance group. First Padel Camp. First
            Tennis Camp. And whatever comes next.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Each new experience gets its own photographs and names. The roll call will grow as we
            gather the pictures.
          </p>
        </Container>
      </Section>

      {hallItems.map((item, index) => (
        <Section key={item.title} className={index % 2 === 1 ? "bg-surface" : undefined}>
          <Container>
            <Kicker>{item.when}</Kicker>
            <Display className="mt-2 text-5xl">{item.title}</Display>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{item.body}</p>
            <Photo
              src={item.image}
              alt={item.title}
              className="mt-8 aspect-[16/10] w-full rounded-lg object-center"
              sizes="100vw"
            />
            {item.coming ? (
              <p className="mt-4 text-xs font-semibold tracking-widest text-accent uppercase">Names to come</p>
            ) : (
              <p className="mt-4 text-xs font-semibold tracking-widest text-muted uppercase">
                The first group. Names being added.
              </p>
            )}
          </Container>
        </Section>
      ))}

      <CtaBand
        title="Be part of the next first"
        body="Tennis and Padel in Mallorca are open to pre-register. Lanzarote 2027 is open to book."
        to="/vacations"
        label="See the camps"
      />
    </main>
  );
}
