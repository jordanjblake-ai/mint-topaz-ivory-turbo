import { createFileRoute } from "@tanstack/react-router";
import { HybridStory } from "@/components/story/HybridStory";

export const Route = createFileRoute("/story-time")({
  component: StoryTimePage,
  head: () => ({
    meta: [
      { title: "Story Time — Hybrid Vacations" },
      {
        name: "description",
        content: "Sixteen months from a name to a world-tour court. The Hybrid story, still unfinished.",
      },
    ],
  }),
});

function StoryTimePage() {
  return <HybridStory />;
}
