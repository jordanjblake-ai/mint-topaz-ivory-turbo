import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CampShell } from "@/components/camp/camp-shell";

export const Route = createFileRoute("/camp")({
  head: () => ({
    meta: [
      { title: "Lanzarote camp" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CampLayout,
});

function CampLayout() {
  return (
    <CampShell>
      <Outlet />
    </CampShell>
  );
}
