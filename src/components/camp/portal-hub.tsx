import { Link } from "@tanstack/react-router";
import { portalCamps } from "@/data/portals";

export function PortalHub({ variant }: { variant: "player" | "coach" }) {
  const player = variant === "player";

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {player ? "Player Portal" : "Coaches Corner"}
      </p>
      <h1 className="mt-3 font-display text-6xl text-fg">
        {player ? "Your camps" : "Your weeks on staff"}
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
        {player
          ? "One door for every Hybrid week you have booked. Lanzarote is live. Tennis, Padel, and one-off bookings will sit here when they open."
          : "Groups, duties, and the players in front of you. Lanzarote is live. Other camps will use this same corner when they run."}
      </p>

      <ul className="mt-10 grid gap-3">
        {portalCamps.map((camp) => {
          const inner = (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {camp.status === "open" ? "Open" : "Opens with the booking"}
              </p>
              <p className="mt-2 font-display text-3xl text-fg">{camp.name}</p>
              <p className="mt-1 text-sm text-muted">
                {camp.place} · {camp.dates}
              </p>
            </>
          );
          if (camp.href) {
            return (
              <a
                key={camp.id}
                href={`${camp.href}?gate=${player ? "player" : "coach"}`}
                className="block rounded-md bg-surface p-5 shadow-border hover:shadow-border-hover"
              >
                {inner}
              </a>
            );
          }
          return (
            <li key={camp.id} className="rounded-md bg-surface/60 p-5 shadow-border">
              {inner}
            </li>
          );
        })}
      </ul>

      <Link to="/" className="mt-10 text-sm text-muted hover:text-fg">
        Back to the public site
      </Link>
    </main>
  );
}
