import { createFileRoute } from "@tanstack/react-router";
import { CommunityIntro } from "@/components/site/community-intro";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/community/")({
  head: () => headFor("/community"),
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <main>
      <CommunityIntro />
    </main>
  );
}
