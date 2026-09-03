import { createFileRoute, Link } from "@tanstack/react-router";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { clubDoors } from "@/data/community-hub";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/community/club/")({
  head: () => headFor("/community/club"),
  component: ClubPage,
});

function ClubPage() {
  return (
    <main>
      <Section>
        <Container>
          <Kicker>The Club</Kicker>
          <Display as="h1" className="mt-2 max-w-3xl text-5xl sm:text-7xl">
            The people inside Hybrid
          </Display>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            Squad, team, and the names who were here first. Pick a door.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            <Link to="/story-time" className="text-fg underline decoration-accent/60 underline-offset-4 hover:text-accent">
              Story Time — how Hybrid got from a name to a world-tour court.
            </Link>
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {clubDoors.map((door) => (
              <Link
                key={door.href}
                to={door.href as "/"}
                className="group overflow-hidden rounded-lg bg-surface shadow-border transition-shadow hover:shadow-border-hover"
              >
                <Photo
                  src={door.image}
                  alt={door.alt}
                  className="aspect-[4/3] w-full transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(min-width: 768px) 30vw, 100vw"
                />
                <div className="p-5">
                  <p className="text-xs font-semibold tracking-widest text-accent uppercase">{door.kicker}</p>
                  <h2 className="mt-2 font-display text-3xl text-fg">{door.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{door.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
