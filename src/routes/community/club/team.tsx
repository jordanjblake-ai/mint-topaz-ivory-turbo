import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/site/cta-band";
import { TeamRoster } from "@/components/site/team-roster";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/community/club/team")({
  head: () => headFor("/community/club/team"),
  component: TeamHybridPage,
});

function TeamHybridPage() {
  return (
    <main>
      <h1 className="sr-only">Team Hybrid</h1>
      <TeamRoster />
      <CtaBand
        title="Want to train with this group?"
        body="Performance Squad is the UK block. Camps are the weeks away."
        to="/community/club/performance"
        label="Performance Squad"
      />
    </main>
  );
}
