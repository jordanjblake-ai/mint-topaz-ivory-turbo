import { createFileRoute } from "@tanstack/react-router";
import { handleUserInfoRequest } from "@/lib/oidc-userinfo";

export const Route = createFileRoute("/api/oauth/userinfo")({
  server: {
    handlers: {
      GET: async ({ request }) => handleUserInfoRequest(request),
      POST: async ({ request }) => handleUserInfoRequest(request),
    },
  },
});
