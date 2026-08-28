import { createFileRoute } from "@tanstack/react-router";
import { CommunityIntro } from "@/components/site/community-intro";

export const Route = createFileRoute("/community/")({
  head: () => ({
    meta: [
      { title: "Community · Hybrid Vacations" },
      {
        name: "description",
        content:
          "The people that make Hybrid. Come for the sport. Stay for the people. Leave with memories.",
      },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <main>
      <CommunityIntro />
    </main>
  );
}
