import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/community/performance")({
  beforeLoad: () => {
    throw redirect({ to: "/community/club/performance", replace: true });
  },
  component: () => null,
});
