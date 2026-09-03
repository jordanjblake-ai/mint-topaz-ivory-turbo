import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/community/hall-of-fame")({
  beforeLoad: () => {
    throw redirect({ to: "/community/club/hall-of-fame", replace: true });
  },
  component: () => null,
});
