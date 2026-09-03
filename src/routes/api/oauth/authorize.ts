import { createFileRoute } from "@tanstack/react-router";
import { handleAuthorizeRequest } from "@/lib/oidc-flows";

export const Route = createFileRoute("/api/oauth/authorize")({
  server: {
    handlers: {
      GET: async ({ request }) => handleAuthorizeRequest(request),
      POST: async ({ request }) => handleAuthorizeRequest(request),
    },
  },
});
