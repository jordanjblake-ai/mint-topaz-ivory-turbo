import { createFileRoute } from "@tanstack/react-router";
import { HybridStory } from "@/components/story/HybridStory";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/story-time")({
  component: StoryTimePage,
  head: () => headFor("/story-time"),
});

function StoryTimePage() {
  return <HybridStory />;
}
