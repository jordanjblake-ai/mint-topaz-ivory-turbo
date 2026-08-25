import { createFileRoute } from "@tanstack/react-router";
import { healthHandlers } from "@/lib/health";

export const Route = createFileRoute("/livez")({
  server: { handlers: healthHandlers("live") },
});
