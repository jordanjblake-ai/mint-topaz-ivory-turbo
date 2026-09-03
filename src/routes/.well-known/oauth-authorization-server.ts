import { createFileRoute } from "@tanstack/react-router";
import { authorizationServerMetadata } from "@/lib/token-introspection";

export const Route = createFileRoute("/.well-known/oauth-authorization-server")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        return new Response(JSON.stringify(authorizationServerMetadata(origin)), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
});
