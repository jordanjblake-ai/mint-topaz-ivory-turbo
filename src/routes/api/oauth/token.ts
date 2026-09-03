import { createFileRoute } from "@tanstack/react-router";
import { handleTokenRequest } from "@/lib/oauth-grants";

export const Route = createFileRoute("/api/oauth/token")({
  server: {
    handlers: {
      POST: async ({ request }) => handleTokenRequest(request),
    },
  },
});
