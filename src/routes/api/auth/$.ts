import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";
import { withPublicOrigin } from "@/lib/auth/public-origin.server";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(withPublicOrigin(request)),
      POST: ({ request }) => auth.handler(withPublicOrigin(request)),
    },
  },
});
