import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Container, Display, Kicker } from "@/components/site/section";

export const Route = createFileRoute("/book/thanks")({
  head: () => ({
    meta: [
      { title: "Place held · Hybrid Vacations" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ThanksPage,
});

function ThanksPage() {
  return (
    <main className="min-h-[70vh]">
      <Container className="flex min-h-[70vh] flex-col justify-center py-24">
        <Kicker>Lanzarote 2027</Kicker>
        <Display className="mt-2 max-w-2xl text-6xl">You are on the list</Display>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
          Deposit received. We will email confirmation from support@hybridvacations.com with the
          week, the package, and when the balances are due. Player Portal opens with that same email
          once Mark has you on the camp list.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/portal">Player Portal</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/vacations/lanzarote">Back to the camp</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}
