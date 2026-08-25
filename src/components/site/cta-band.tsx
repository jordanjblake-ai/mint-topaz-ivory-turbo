import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/site/section";

type CtaTo = "/contact" | "/vacations/lanzarote" | "/vacations" | "/travel" | "/coaching";

export function CtaBand({
  title,
  body,
  to,
  label,
  search,
}: {
  title: string;
  body: string;
  to: CtaTo;
  label: string;
  search?: { interest?: string };
}) {
  return (
    <section className="border-t border-border bg-surface">
      <Container className="flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center">
        <div className="max-w-xl">
          <h2 className="font-display text-4xl text-fg sm:text-5xl">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
        </div>
        <Button asChild size="lg">
          {to === "/contact" ? (
            <Link to="/contact" search={search}>
              {label}
            </Link>
          ) : (
            <Link to={to}>{label}</Link>
          )}
        </Button>
      </Container>
    </section>
  );
}
