import { createFileRoute } from "@tanstack/react-router";
import { handleIntrospectRequest } from "@/lib/token-introspection";

export const Route = createFileRoute("/api/oauth/introspect")({
  server: {
    handlers: {
      POST: async ({ request }) => handleIntrospectRequest(request),
    },
  },
});
