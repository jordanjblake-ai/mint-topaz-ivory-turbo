import { createFileRoute, Outlet } from "@tanstack/react-router";
import { StaffShell } from "@/components/ops/staff-shell";

export const Route = createFileRoute("/ops")({
  head: () => ({
    meta: [
      { title: "Hybrid desk" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OpsLayout,
});

function OpsLayout() {
  return (
    <StaffShell>
      <Outlet />
    </StaffShell>
  );
}
