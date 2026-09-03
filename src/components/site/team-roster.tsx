import { useEffect, useState } from "react";
import { cdnUrl } from "@/lib/cdn";
import { cn } from "@/lib/utils";
import {
  TEAM_ACCENT_HEX,
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
  coral: "text-roster-coral",
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
  coral: "bg-roster-coral",
};

function TeamArt({
  stem,
  alt,
  priority = false,
  position = "center",
}: {
  stem: string;
  alt: string;
  priority?: boolean;
  position?: "center" | "left" | "right";
}) {
  const wideWebp = cdnUrl(teamCardSrc(stem, "wide", "webp"));
  const wideJpg = cdnUrl(teamCardSrc(stem, "wide", "jpg"));
  const tallWebp = cdnUrl(teamCardSrc(stem, "tall", "webp"));
  const tallJpg = cdnUrl(teamCardSrc(stem, "tall", "jpg"));

  return (
    <picture>
      <source media="(min-width: 768px)" type="image/webp" srcSet={wideWebp} />
      <source media="(min-width: 768px)" type="image/jpeg" srcSet={wideJpg} />
      <source type="image/webp" srcSet={tallWebp} />
      <img
        src={tallJpg}
        alt={alt}
        width={1080}
        height={1920}
        className={cn(
          "size-full object-cover object-center",
          position === "right" && "md:object-[80%_center]",
          position === "left" && "md:object-[20%_center]",
        )}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}

function AthleteCard({
  athlete,
  priority = false,
}: {
  athlete: TeamAthlete;
  priority?: boolean;
}) {
  // Type is HTML only. Art files must not include names, stats, or pills.
  const flip = athlete.copySide === "right";
  const primary = ACCENT_TEXT[athlete.accent];
  const primaryFill = ACCENT_BAR[athlete.accent];
  const secondaryFill = ACCENT_BAR[athlete.accentSecondary];
  const primaryHex = TEAM_ACCENT_HEX[athlete.accent];
  const secondaryHex = TEAM_ACCENT_HEX[athlete.accentSecondary];
  const division = athlete.division === "men" ? "Men's Division" : "Women's Division";
  const stats = [{ label: "Ovr", value: athlete.overall }, ...athlete.stats];
  const longName = athlete.lastName.length > 10;
  const strokeKicker = ["stuart-perry", "lewis-bunton", "kirsty-starr", "lucy-knott"].includes(athlete.id);

  return (
    <article id={athlete.id} className="scroll-mt-32 bg-ink">
      <div className={cn("team-frame team-card", flip && "team-card-flip")}>
        <div className="team-card-art">
          <TeamArt
            stem={athlete.stem}
            alt=""
            priority={priority}
            position={flip ? "left" : "right"}
          />
        </div>
        <div className="team-card-scrim" aria-hidden />
        <div className="team-card-copy">
          <header className={cn("team-card-kicker", strokeKicker && "team-card-kicker-stroke")}>
            <span
              className={cn("team-card-mono", primary)}
              style={{ borderColor: secondaryHex, color: primaryHex }}
              aria-hidden
            >
              {athlete.monogram}
            </span>
            <div>
              <p className={cn("team-card-role", primary)}>
                {athlete.role} · {athlete.crown}
              </p>
              <p className="team-card-div mt-1 text-[10px] font-semibold tracking-[0.18em] text-white/80 uppercase sm:text-xs">
                {division} <span className={primary}>{athlete.tag}</span>
              </p>
            </div>
          </header>

          <div className="team-card-body">
            <h2 className="team-card-name">
              <span className="team-card-first">{athlete.firstName}</span>
              <span
                className={cn("team-card-last", primary, longName && "team-card-last-long")}
                style={{ textDecorationColor: primaryHex }}
              >
                {athlete.lastName}
              </span>
            </h2>

            <div className="team-card-stats">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="team-card-stat"
                  style={{ borderColor: primaryHex }}
                >
                  <span className={cn("team-card-stat-value", primary)}>{stat.value}</span>
                  <span className="team-card-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            <p className="team-card-bio">{athlete.bio}</p>

            <div className="team-card-pills">
              <span className={cn("team-card-pill text-ink", primaryFill)}>{athlete.badges[0]}</span>
              <span className={cn("team-card-pill text-ink", secondaryFill)}>{athlete.badges[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
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
  onSelect,
}: {
  athlete: TeamAthlete;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <a
      href={`#${athlete.id}`}
      aria-current={active ? "location" : undefined}
      onClick={onSelect}
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

export function TeamRoster() {
  const [activeId, setActiveId] = useState(teamHybridAthletes[0]?.id ?? "");

  useEffect(() => {
    const nodes = teamHybridAthletes
      .map((athlete) => document.getElementById(athlete.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const pick = () => {
      const nav = document.querySelector<HTMLElement>("[data-team-chip-nav]");
      const spyY = (nav?.getBoundingClientRect().bottom ?? 112) + 12;
      let current = nodes[0]?.id ?? "";
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= spyY) current = node.id;
        else break;
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    window.addEventListener("hashchange", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
      window.removeEventListener("hashchange", pick);
    };
  }, []);

  useEffect(() => {
    const chip = document.querySelector<HTMLElement>(`[data-chip="${activeId}"]`);
    const row = chip?.closest<HTMLElement>(".team-chip-row");
    if (!chip || !row) return;
    const left =
      chip.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft;
    row.scrollTo({ left: left - row.clientWidth / 2 + chip.offsetWidth / 2, behavior: "smooth" });
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
          <p className="text-[10px] leading-snug text-muted sm:text-[11px]">
            * Overall ratings and stats on these cards are unofficial.
          </p>
        </div>
      </div>

      <nav
        data-team-chip-nav
        aria-label="Team Hybrid roster"
        className="sticky top-16 z-30 border-b border-border bg-bg/90 backdrop-blur-md sm:top-[4.5rem]"
      >
        <div className="team-chip-row mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-2 sm:px-4">
          <span className="shrink-0 px-2 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
            Kings
          </span>
          {teamHybridKings.map((athlete) => (
            <span key={athlete.id} data-chip={athlete.id}>
              <Chip
                athlete={athlete}
                active={activeId === athlete.id}
                onSelect={() => setActiveId(athlete.id)}
              />
            </span>
          ))}
          <span className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden />
          <span className="shrink-0 px-2 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
            Queens
          </span>
          {teamHybridQueens.map((athlete) => (
            <span key={athlete.id} data-chip={athlete.id}>
              <Chip
                athlete={athlete}
                active={activeId === athlete.id}
                onSelect={() => setActiveId(athlete.id)}
              />
            </span>
          ))}
        </div>
      </nav>

      <DivisionBand id="kings" kicker="Beach Volleyball · Men" title="The Kings" />
      {teamHybridKings.map((athlete, index) => (
        <AthleteCard key={athlete.id} athlete={athlete} priority={index === 0} />
      ))}

      <DivisionBand id="queens" kicker="Beach Volleyball · Women" title="The Queens" />
      {teamHybridQueens.map((athlete) => (
        <AthleteCard key={athlete.id} athlete={athlete} />
      ))}
    </>
  );
}
