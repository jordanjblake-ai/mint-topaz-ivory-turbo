import { createFileRoute } from "@tanstack/react-router";
import { handleRevokeRequest } from "@/lib/oauth-revoke";

export const Route = createFileRoute("/api/oauth/revoke")({
  server: {
    handlers: {
      POST: async ({ request }) => handleRevokeRequest(request),
    },
  },
});
