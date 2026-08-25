import { createFileRoute } from "@tanstack/react-router";
import { healthHandlers } from "@/lib/health";

export const Route = createFileRoute("/health/live")({
  server: { handlers: healthHandlers("live") },
});
