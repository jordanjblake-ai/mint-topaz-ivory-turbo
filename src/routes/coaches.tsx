import { createFileRoute } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { coaches } from "@/data/site";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";

export const Route = createFileRoute("/coaches")({ component: CoachesPage });

function CoachesPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/coach-issa.jpg"
        alt="Issa Batrane competing"
        imageClass="object-center"
        kicker="Coaches"
        title="The Hybrid coaches"
        sub="The people you train with, on camp and at home."
      />
      <Section>
        <Container>
          <Kicker>The group</Kicker>
          <Display className="mt-2 text-5xl">Who you train with</Display>
          <div className="mt-12 space-y-16">
            {coaches.map((coach, index) => (
              <article
                key={coach.slug}
                id={coach.slug}
                className="grid items-center gap-8 border-t border-border pt-10 lg:grid-cols-2"
              >
                <Photo
                  src={coach.image}
                  alt={coach.name}
                  className={`aspect-4/5 w-full rounded-lg ${coach.imageClass} ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">{coach.role}</p>
                  <h2 className="mt-2 font-display text-5xl text-fg">{coach.name}</h2>
                  <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">{coach.bio}</p>
                  <a
                    href={coach.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-fg hover:text-accent"
                  >
                    <Instagram className="size-4" />
                    {coach.handle}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand
        title="Want a session in the UK?"
        body="Private, clinic, or mini-camp. Contact us and we will shape it."
        to="/coaching"
        label="UK coaching"
      />
    </main>
  );
}
