import { createFileRoute } from "@tanstack/react-router";
import { handlePurgeRequest } from "@/lib/cache-purge";

export const Route = createFileRoute("/api/cache/purge")({
  server: {
    handlers: {
      POST: async ({ request }) => handlePurgeRequest(request),
    },
  },
});
