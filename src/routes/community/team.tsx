import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/community/team")({
  beforeLoad: () => {
    throw redirect({ to: "/community/club/team", replace: true });
  },
  component: () => null,
});
