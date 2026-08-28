import { Link, useRouterState } from "@tanstack/react-router";
import { communityNav } from "@/data/community-hub";
import { Container } from "@/components/site/section";
import { cn } from "@/lib/utils";

export function CommunitySubnav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Community sections" className="border-b border-border bg-surface">
      <Container className="flex gap-1 overflow-x-auto py-2">
        {communityNav.map((item) => {
          const active = pathname === item.href || pathname === `${item.href}/`;
          return (
            <Link
              key={item.href}
              to={item.href as "/"}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center rounded-sm px-3 text-sm whitespace-nowrap transition-colors",
                active ? "bg-bg text-accent" : "text-muted hover:text-fg",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </Container>
    </nav>
  );
}
