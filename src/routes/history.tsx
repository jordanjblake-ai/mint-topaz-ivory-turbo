import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/history")({
  beforeLoad: () => {
    throw redirect({ to: "/story-time", replace: true });
  },
  component: () => null,
});
