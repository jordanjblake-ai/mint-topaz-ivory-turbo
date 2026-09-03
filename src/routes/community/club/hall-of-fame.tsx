import { createFileRoute } from "@tanstack/react-router";
import { HallRoll } from "@/components/site/hall-roll";
import { PageHero } from "@/components/site/page-hero";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/community/club/hall-of-fame")({
  head: () => headFor("/community/club/hall-of-fame"),
  component: HallOfFamePage,
});

function HallOfFamePage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/group.jpg"
        alt="The first Hybrid camp group"
        kicker="The Club · Hall of Fame"
        title="The first to believe"
        sub="Every community has a beginning. These are the people who showed up first."
      />

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

      <HallRoll />
    </main>
  );
}
