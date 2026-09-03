import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ClubNav } from "@/components/site/club-nav";

export const Route = createFileRoute("/community/club")({
  component: ClubLayout,
});

function ClubLayout() {
  return (
    <>
      <ClubNav />
      <Outlet />
    </>
  );
}
