import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container, Display, Kicker } from "@/components/site/section";
import { confirmCampDeposit } from "@/lib/checkout";

type ThanksSearch = { session_id?: string; payment?: string };

export const Route = createFileRoute("/book/thanks")({
  validateSearch: (search: Record<string, unknown>): ThanksSearch => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
    payment: typeof search.payment === "string" ? search.payment : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Place held · Hybrid Vacations" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ThanksPage,
});

function ThanksPage() {
  const { session_id: sessionId, payment } = Route.useSearch();
  const [fullPay, setFullPay] = useState(payment === "paid_in_full");

  useEffect(() => {
    if (!sessionId) return;
    void confirmCampDeposit({ data: { sessionId } })
      .then((result) => {
        if (result.payment === "paid_in_full") setFullPay(true);
      })
      .catch(() => {});
  }, [sessionId]);

  return (
    <main className="min-h-[70vh]">
      <Container className="flex min-h-[70vh] flex-col justify-center py-24">
        <Kicker>Lanzarote 2027</Kicker>
        <Display className="mt-2 max-w-2xl text-6xl">You are on the list</Display>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
          {fullPay
            ? "Paid in full. Nothing further due for this week. We will email confirmation from support@hybridvacations.com with the week and the package. Player Portal opens with that same email once Mark has you on the camp list."
            : "Deposit received. Camp balance 15 January. Stay balance 1 January if you took an apartment. We will email confirmation from support@hybridvacations.com with the week, the package, and when the balances are due. Player Portal opens with that same email once Mark has you on the camp list."}
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