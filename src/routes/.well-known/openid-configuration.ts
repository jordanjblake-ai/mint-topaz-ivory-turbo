import { createFileRoute } from "@tanstack/react-router";
import { openidConfiguration } from "@/lib/oidc-claims";

export const Route = createFileRoute("/.well-known/openid-configuration")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        return new Response(JSON.stringify(openidConfiguration(origin)), {
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
