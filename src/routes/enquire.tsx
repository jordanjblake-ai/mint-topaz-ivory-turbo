import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/enquire")({
  validateSearch: (search: Record<string, unknown>) => ({
    interest: typeof search.interest === "string" ? search.interest : undefined,
  }),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/contact", search });
  },
});
