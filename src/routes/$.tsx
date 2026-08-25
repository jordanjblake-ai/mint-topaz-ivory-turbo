import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { wixTarget } from "@/data/wix-redirects";

export const Route = createFileRoute("/$")({
  beforeLoad: ({ location }) => {
    const target = wixTarget(location.pathname);
    if (target) {
      throw redirect({ href: target, statusCode: 301 });
    }
    throw notFound();
  },
});
