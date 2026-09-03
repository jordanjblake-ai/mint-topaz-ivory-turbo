/**
 * Court-sport image tags. Do not trust filenames.
 *
 * Misnamed files (these are Padel, not Tennis):
 * - /images/tennis.jpg        glass Padel courts
 * - /images/tennis-open.jpg   glass Padel courts
 *
 * Tennis heroes must show a Tennis court or Tennis player.
 * Padel heroes must show a glass Padel court.
 */

export type CourtSport = "Beach Volleyball" | "Tennis" | "Padel" | "Golf";

export type SportImageRole = "hero" | "play" | "court";

export type SportImage = {
  src: string;
  sport: CourtSport;
  role: SportImageRole;
  alt: string;
};

export const SPORT_IMAGES: SportImage[] = [
  {
    src: "/images/Hv_Lanzarote_2026_Pro_Destination_012.jpg",
    sport: "Beach Volleyball",
    role: "hero",
    alt: "Beach Volleyball on Playa Grande, Lanzarote",
  },
  {
    src: "/images/card-lanzarote.jpg",
    sport: "Beach Volleyball",
    role: "play",
    alt: "Beach Volleyball camp on Playa Grande",
  },
  {
    src: "/images/hero-lanzarote.jpg",
    sport: "Beach Volleyball",
    role: "court",
    alt: "Beach Volleyball in Lanzarote",
  },
  {
    src: "/images/tennis-court.jpg",
    sport: "Tennis",
    role: "hero",
    alt: "Clay tennis court at dusk",
  },
  {
    src: "/images/tennis-player.jpg",
    sport: "Tennis",
    role: "play",
    alt: "Tennis player on a clay court",
  },
  {
    src: "/images/tennis-clay.jpg",
    sport: "Tennis",
    role: "court",
    alt: "Empty clay tennis courts",
  },
  {
    src: "/images/hv_stock_padel_community_45_001.jpg",
    sport: "Padel",
    role: "hero",
    alt: "Padel at the net on a glass court",
  },
  {
    src: "/images/padel.jpg",
    sport: "Padel",
    role: "play",
    alt: "Padel match on a glass court",
  },
  {
    src: "/images/padel-courts.jpg",
    sport: "Padel",
    role: "court",
    alt: "Padel courts in Mallorca",
  },
  {
    src: "/images/padel-play.jpg",
    sport: "Padel",
    role: "play",
    alt: "Padel in play",
  },
  {
    src: "/images/tennis-open.jpg",
    sport: "Padel",
    role: "court",
    alt: "Padel courts. File is misnamed; not Tennis.",
  },
  {
    src: "/images/tennis.jpg",
    sport: "Padel",
    role: "court",
    alt: "Padel courts. File is misnamed; not Tennis.",
  },
  {
    src: "/images/golf.jpg",
    sport: "Golf",
    role: "hero",
    alt: "Golf course greens and bunkers",
  },
];

const BY_SRC = new Map(SPORT_IMAGES.map((item) => [item.src, item]));

const PADEL_ONLY = new Set([
  "/images/hv_stock_padel_community_45_001.jpg",
  "/images/tennis.jpg",
  "/images/tennis-open.jpg",
  "/images/padel.jpg",
  "/images/padel-courts.jpg",
  "/images/padel-play.jpg",
]);

const TENNIS_ONLY = new Set([
  "/images/tennis-player.jpg",
  "/images/tennis-clay.jpg",
  "/images/tennis-court.jpg",
]);

export function sportOfImage(src: string) {
  return BY_SRC.get(src.split("?")[0])?.sport ?? null;
}

export function assertSportImage(src: string, sport: CourtSport) {
  const path = src.split("?")[0];
  const tagged = sportOfImage(path);
  if (tagged && tagged !== sport) {
    throw new Error(`${path} is tagged ${tagged}, not ${sport}`);
  }
  if (sport === "Tennis" && PADEL_ONLY.has(path)) {
    throw new Error(`${path} is a Padel photo and cannot be used for Tennis`);
  }
  if (sport === "Padel" && TENNIS_ONLY.has(path)) {
    throw new Error(`${path} is a Tennis photo and cannot be used for Padel`);
  }
}

export function sportHero(sport: CourtSport) {
  const hit = SPORT_IMAGES.find((item) => item.sport === sport && item.role === "hero");
  if (!hit) throw new Error(`No hero image tagged ${sport}`);
  assertSportImage(hit.src, sport);
  return hit.src;
}

export function sportImageAlt(src: string, fallback: string) {
  return BY_SRC.get(src.split("?")[0])?.alt ?? fallback;
}

for (const src of PADEL_ONLY) {
  if (sportOfImage(src) !== "Padel") {
    throw new Error(`${src} must stay tagged Padel`);
  }
}
for (const src of TENNIS_ONLY) {
  if (sportOfImage(src) !== "Tennis") {
    throw new Error(`${src} must stay tagged Tennis`);
  }
}

assertSportImage(sportHero("Tennis"), "Tennis");
assertSportImage(sportHero("Padel"), "Padel");
