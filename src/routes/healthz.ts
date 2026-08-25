import { createFileRoute } from "@tanstack/react-router";
import { healthHandlers } from "@/lib/health";

export const Route = createFileRoute("/healthz")({
  server: { handlers: healthHandlers("live") },
});
