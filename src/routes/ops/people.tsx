import { createFileRoute, Link } from "@tanstack/react-router";
import { PEOPLE_EMPTY } from "@/data/ops-desk";

export const Route = createFileRoute("/ops/people")({
  head: () => ({
    meta: [
      { title: "People · Hybrid desk" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PeoplePage,
});

function PeoplePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">People</p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">People</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{PEOPLE_EMPTY}</p>
      <p className="mt-6">
        <Link to="/ops" className="text-sm text-muted hover:text-fg">
          Back to Hybrid desk
        </Link>
      </p>
    </main>
  );
}
