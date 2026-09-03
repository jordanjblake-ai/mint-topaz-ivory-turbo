import { createFileRoute } from "@tanstack/react-router";
import { handleRevocationListRequest } from "@/lib/oauth-revoke";

export const Route = createFileRoute("/api/oauth/revocation-list")({
  server: {
    handlers: {
      GET: async ({ request }) => handleRevocationListRequest(request),
    },
  },
});
