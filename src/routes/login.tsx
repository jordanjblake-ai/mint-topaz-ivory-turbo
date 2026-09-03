import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Container, Display, Kicker } from "@/components/site/section";

const allowedNext = new Set([
  "/portal",
  "/account",
  "/coaches-corner",
  "/camp",
  "/camp/map",
  "/",
  "/community/club/performance",
  "/community/coaching",
  "/community/club/team",
  "/story-time",
  "/contact",
  "/vacations/lanzarote",
  "/vacations/tennis",
  "/vacations/padel",
  "/vacations/golf",
  "/travel",
]);

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" && allowedNext.has(search.next) ? search.next : "/account",
  }),
  head: () => ({
    meta: [
      { title: "Sign in · Hybrid Vacations" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { next } = Route.useSearch();

  return (
    <main className="min-h-[70vh]">
      <Container className="flex min-h-[70vh] max-w-md flex-col justify-center py-24">
        <Kicker>Account</Kicker>
        <Display as="h1" className="mt-2 text-5xl">
          Sign in
        </Display>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Player Portal, Coaches Corner, and your Member Dashboard use the Google account that
          matches the email we have on your booking.
        </p>
        <div className="mt-8 grid gap-3">
          {authEnabled ? (
            GROK_PROVIDERS.filter((item) => item.idp === "google" || item.idp === "microsoft").map((item) => (
              <Button
                key={item.providerId}
                type="button"
                size="lg"
                onClick={() =>
                  void signIn(item.providerId, { callbackURL: next, errorCallbackURL: "/login" })
                }
              >
                Sign in with {item.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
        <Link to="/" className="mt-8 text-sm text-muted hover:text-fg">
          Back to the public site
        </Link>
      </Container>
    </main>
  );
}
