import { createFileRoute, Navigate } from "@tanstack/react-router";
import { CampMap } from "@/components/camp/camp-map";
import { useCamp } from "@/lib/camp-store";

export const Route = createFileRoute("/camp/map")({
  head: () => ({
    meta: [
      { title: "The Map · Lanzarote camp" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const me = useCamp((s) => s.me);
  if (!me) return null;
  if (me.role !== "player") return <Navigate to="/camp" replace />;
  return <CampMap />;
}
