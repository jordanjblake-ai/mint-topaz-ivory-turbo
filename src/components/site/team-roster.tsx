import { useEffect, useState } from "react";
import { cdnUrl } from "@/lib/cdn";
import { cn } from "@/lib/utils";
import {
  teamCardSrc,
  teamHybridAthletes,
  teamHybridKings,
  teamHybridQueens,
  teamHybridValues,
  type TeamAccent,
  type TeamAthlete,
} from "@/data/team-hybrid";

const ACCENT_TEXT: Record<TeamAccent, string> = {
  gold: "text-roster-gold",
  cyan: "text-roster-cyan",
  red: "text-roster-red",
  lime: "text-roster-lime",
  silver: "text-roster-silver",
  pink: "text-roster-pink",
  purple: "text-roster-purple",
  rose: "text-roster-rose",
};

const ACCENT_BAR: Record<TeamAccent, string> = {
  gold: "bg-roster-gold",
  cyan: "bg-roster-cyan",
  red: "bg-roster-red",
  lime: "bg-roster-lime",
  silver: "bg-roster-silver",
  pink: "bg-roster-pink",
  purple: "bg-roster-purple",
  rose: "bg-roster-rose",
};

export function TeamFrame({
  stem,
  alt,
  priority = false,
}: {
  stem: string;
  alt: string;
  priority?: boolean;
}) {
  const wideWebp = cdnUrl(teamCardSrc(stem, "wide", "webp"));
  const wideJpg = cdnUrl(teamCardSrc(stem, "wide", "jpg"));
  const tallWebp = cdnUrl(teamCardSrc(stem, "tall", "webp"));
  const tallJpg = cdnUrl(teamCardSrc(stem, "tall", "jpg"));

  return (
    <div className="team-frame">
      <picture>
        <source media="(min-width: 768px)" type="image/webp" srcSet={wideWebp} />
        <source media="(min-width: 768px)" type="image/jpeg" srcSet={wideJpg} />
        <source type="image/webp" srcSet={tallWebp} />
        <img
          src={tallJpg}
          alt={alt}
          width={1080}
          height={1920}
          className="size-full object-cover object-center"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          decoding="async"
          draggable={false}
        />
      </picture>
    </div>
  );
}

function AthleteCopy({ athlete }: { athlete: TeamAthlete }) {
  const statLine = athlete.stats.map((stat) => `${stat.value} ${stat.label}`).join(", ");
  return (
    <div className="sr-only">
      <h2>{athlete.name}</h2>
      <p>
        {athlete.role}. {athlete.crown}. {athlete.tag}.
      </p>
      <p>
        Overall {athlete.overall}. {statLine}.
      </p>
      <p>{athlete.bio}</p>
      <p>{athlete.badges.join(". ")}</p>
    </div>
  );
}

function DivisionBand({
  id,
  kicker,
  title,
}: {
  id: string;
  kicker: string;
  title: string;
}) {
  return (
    <div id={id} className="scroll-mt-32 border-y border-border bg-surface px-4 py-8 text-center sm:py-10">
      <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">{kicker}</p>
      <h2 className="mt-2 font-display text-5xl tracking-wide text-fg sm:text-6xl">{title}</h2>
    </div>
  );
}

function Chip({
  athlete,
  active,
}: {
  athlete: TeamAthlete;
  active: boolean;
}) {
  return (
    <a
      href={`#${athlete.id}`}
      aria-current={active ? "location" : undefined}
      className={cn(
        "relative inline-flex min-h-11 shrink-0 items-center px-3 text-sm transition-colors duration-150",
        active ? ACCENT_TEXT[athlete.accent] : "text-muted hover:text-fg",
      )}
    >
      {athlete.firstName}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-3 bottom-1 h-0.5 rounded-full transition-opacity duration-150",
          ACCENT_BAR[athlete.accent],
          active ? "opacity-100" : "opacity-0",
        )}
      />
    </a>
  );
}

export function TeamHero() {
  return (
    <section className="relative bg-ink" aria-label="Team Hybrid">
      <TeamFrame
        stem="hero"
        alt="Team Hybrid. The athletes who compete at the highest level, and stand for far more than results. Passion, commitment, community, positivity."
        priority
      />
    </section>
  );
}

export function TeamRoster() {
  const [activeId, setActiveId] = useState(teamHybridAthletes[0]?.id ?? "");

  useEffect(() => {
    const nodes = teamHybridAthletes
      .map((athlete) => document.getElementById(athlete.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.id;
        if (id) setActiveId(id);
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );

    for (const node of nodes) io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const chip = document.querySelector<HTMLElement>(`[data-chip="${activeId}"]`);
    const row = chip?.closest<HTMLElement>(".team-chip-row");
    if (!chip || !row) return;
    const left =
      chip.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft;
    row.scrollTo({ left: left - row.clientWidth / 2 + chip.offsetWidth / 2 });
  }, [activeId]);

  return (
    <>
      <div className="border-b border-border bg-bg">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:px-6 sm:py-8">
          <p className="font-display text-2xl tracking-[0.12em] text-accent uppercase sm:text-3xl">
            {teamHybridValues.join("  ·  ")}
          </p>
          <p className="font-whisper text-xl text-fg/80 sm:text-2xl">
            Ambition without ego. Competition with community.
          </p>
        </div>
      </div>

      <nav
        aria-label="Team Hybrid roster"
        className="sticky top-16 z-30 border-b border-border bg-bg/90 backdrop-blur-md sm:top-[4.5rem]"
      >
        <div className="team-chip-row mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-2 sm:px-4">
          <span className="shrink-0 px-2 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
            Kings
          </span>
          {teamHybridKings.map((athlete) => (
            <span key={athlete.id} data-chip={athlete.id}>
              <Chip athlete={athlete} active={activeId === athlete.id} />
            </span>
          ))}
          <span className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden />
          <span className="shrink-0 px-2 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
            Queens
          </span>
          {teamHybridQueens.map((athlete) => (
            <span key={athlete.id} data-chip={athlete.id}>
              <Chip athlete={athlete} active={activeId === athlete.id} />
            </span>
          ))}
        </div>
      </nav>

      <DivisionBand id="kings" kicker="Beach Volleyball · Men" title="The Kings" />
      {teamHybridKings.map((athlete) => (
        <article key={athlete.id} id={athlete.id} className="scroll-mt-32 bg-ink">
          <TeamFrame
            stem={athlete.stem}
            alt={`${athlete.name}, ${athlete.role}, ${athlete.tag}. Overall ${athlete.overall}. ${athlete.bio}`}
          />
          <AthleteCopy athlete={athlete} />
        </article>
      ))}

      <DivisionBand id="queens" kicker="Beach Volleyball · Women" title="The Queens" />
      {teamHybridQueens.map((athlete) => (
        <article key={athlete.id} id={athlete.id} className="scroll-mt-32 bg-ink">
          <TeamFrame
            stem={athlete.stem}
            alt={`${athlete.name}, ${athlete.role}, ${athlete.tag}. Overall ${athlete.overall}. ${athlete.bio}`}
          />
          <AthleteCopy athlete={athlete} />
        </article>
      ))}

      <section id="roster" className="scroll-mt-32 bg-ink" aria-label="Full Team Hybrid roster">
        <TeamFrame stem="roster" alt="Team Hybrid roster. Nine athletes across the men's and women's divisions." />
      </section>
    </>
  );
}