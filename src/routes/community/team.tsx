import { createFileRoute } from "@tanstack/react-router";
import { CommunitySubnav } from "@/components/site/community-subnav";
import { CtaBand } from "@/components/site/cta-band";
import { TeamHero, TeamRoster } from "@/components/site/team-roster";
import { cdnUrl } from "@/lib/cdn";
import { teamCardSrc } from "@/data/team-hybrid";

export const Route = createFileRoute("/community/team")({
  head: () => ({
    meta: [
      { title: "Team Hybrid · Hybrid Vacations" },
      {
        name: "description",
        content:
          "The athletes who compete at the highest level, and stand for far more than results. Passion, commitment, community, positivity. Ambition without ego. Competition with community.",
      },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        href: cdnUrl(teamCardSrc("hero", "wide", "webp")),
        type: "image/webp",
        media: "(min-width: 768px)",
      },
      {
        rel: "preload",
        as: "image",
        href: cdnUrl(teamCardSrc("hero", "tall", "webp")),
        type: "image/webp",
        media: "(max-width: 767px)",
      },
    ],
  }),
  component: TeamHybridPage,
});

function TeamHybridPage() {
  return (
    <main>
      <h1 className="sr-only">Team Hybrid</h1>
      <TeamHero />
      <CommunitySubnav />
      <TeamRoster />
      <CtaBand
        title="Want to train with this group?"
        body="Performance Squad is the UK block. Camps are the weeks away."
        to="/community/performance"
        label="Performance Squad"
      />
    </main>
  );
}
