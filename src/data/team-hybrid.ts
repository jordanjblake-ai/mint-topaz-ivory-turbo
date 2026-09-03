export const teamHybridValues = [
  "Passion",
  "Commitment",
  "Community",
  "Positivity",
] as const;

export type TeamAccent = "gold" | "cyan" | "red" | "lime" | "silver" | "pink" | "purple" | "rose" | "coral";

export const TEAM_ACCENT_HEX: Record<TeamAccent, string> = {
  gold: "#f5c400",
  cyan: "#2ad6ea",
  red: "#ff3355",
  lime: "#c6f135",
  silver: "#d5d8de",
  pink: "#ff2d8b",
  purple: "#b56bff",
  rose: "#ff7eb6",
  coral: "#ff8a62",
};

/**
 * Team Hybrid card contract. Do not break this.
 *
 * Art files (`public/images/team/{stem}-wide.jpg` and `{stem}-tall.jpg`) are
 * portraits only: athlete, kit, graffiti. No names, roles, hashtags, stats,
 * bios, pills, monograms, or "TEAM HYBRID" / "OVERALL" lettering.
 *
 * Sunglasses: eyes must stay visible through the lenses.
 *
 * Clothing marks: Hybrid only. Never the athlete monogram (KS, TP, KK).
 * Choose the mark that fits the kit:
 *   1. Circular Hybrid Vacations (palm tree in the ring) on chest / shorts.
 *   2. Worded Hybrid, or Hybrid Vacations, if a wordmark sits better.
 *
 * Layout, desktop: type and athlete occupy opposite halves and never overlap.
 * Cards alternate: even place in Kings / Queens = type left, athlete right.
 * Odd place = type right, athlete left.
 * Wide art must paint the athlete on the photo side (the half without type).
 * Tall art: athlete centre-right, type in the lower third.
 *
 * Type is rendered once, in AthleteCard, from this file:
 *   monogram (customised logo), role · crown, division, tag,
 *   firstName (white brush) + lastName (primary accent brush),
 *   overall + stats: numbers in the HYBRID face (Bebas Neue condensed
 *   caps, as on the circular mark), labels in the Vacations script
 *   (Yellowtail), centred in the box,
 *   badges[0] (primary) + badges[1] (secondary) as two calling-card
 *   buttons in Oswald, 50/50 on one row, same width as the stats and bio.
 *
 * New athlete = data row here + two art-only images. Never paint the UI
 * into the picture.
 */
export type TeamAthlete = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  monogram: string;
  role: string;
  crown: "King" | "Queen";
  tag: string;
  division: "men" | "women";
  accent: TeamAccent;
  accentSecondary: TeamAccent;
  overall: number;
  stats: readonly { label: string; value: number | string }[];
  bio: string;
  badges: readonly [string, string];
  stem: string;
  copySide: "left" | "right";
};

export const teamHybridAthletes: readonly TeamAthlete[] = [
  {
    id: "stuart-perry",
    name: "Stuart Perry",
    firstName: "Stuart",
    lastName: "Perry",
    monogram: "SP",
    role: "Net Anchor",
    crown: "King",
    tag: "#KINGOFTHENET",
    division: "men",
    accent: "gold",
    accentSecondary: "silver",
    overall: 94,
    stats: [
      { label: "Block", value: 96 },
      { label: "Serve", value: 92 },
    ],
    bio: "National ranking lead anchor on the UK Beach Tour. Impenetrable at the net, huge vertical, jump-serve that snaps rallies in half.",
    badges: ["Block Master+", "Ace Jump Serve"],
    stem: "stuart",
    copySide: "left",
  },
  {
    id: "theo-plaza",
    name: "Theo Plaza",
    firstName: "Theo",
    lastName: "Plaza",
    monogram: "TP",
    role: "Back-Row Spark",
    crown: "King",
    tag: "#SANDLIGHTNING",
    division: "men",
    accent: "cyan",
    accentSecondary: "gold",
    overall: 93,
    stats: [
      { label: "Digs", value: 97 },
      { label: "Sets", value: 91 },
    ],
    bio: "Coach and court spark. Relentless diving range through heavy sand, then a lightning transition set that starts the counter.",
    badges: ["Sand Digs+", "Transition Set"],
    stem: "theo",
    copySide: "right",
  },
  {
    id: "lewis-bunton",
    name: "Lewis Bunton",
    firstName: "Lewis",
    lastName: "Bunton",
    monogram: "LB",
    role: "Primary Hitter",
    crown: "King",
    tag: "#HEAVYCANNON",
    division: "men",
    accent: "red",
    accentSecondary: "gold",
    overall: 91,
    stats: [
      { label: "Spike", value: 98 },
      { label: "Hang", value: 89 },
    ],
    bio: "Primary offensive powerhouse. Wrist-snap kills that beat the single block and bury the line in heavy sand at tour pace.",
    badges: ["Heavy Spiker", "High Velocity"],
    stem: "lewis",
    copySide: "left",
  },
  {
    id: "bailey-harsum",
    name: "Bailey Harsum",
    firstName: "Bailey",
    lastName: "Harsum",
    monogram: "BH",
    role: "Serve Technician",
    crown: "King",
    tag: "#TACTICALSERVE",
    division: "men",
    accent: "lime",
    accentSecondary: "cyan",
    overall: 90,
    stats: [
      { label: "Serve", value: 93 },
      { label: "IQ", value: 90 },
    ],
    bio: "Clutch server and net technician. Float variations and deceptive cut shots that scramble a defence before the rally starts.",
    badges: ["Float Ace+", "Cut Shot"],
    stem: "bailey",
    copySide: "right",
  },
  {
    id: "jan-joost",
    name: "Jan-Joost Van Der Bogert",
    firstName: "Jan-Joost",
    lastName: "Van Der Bogert",
    monogram: "JJ",
    role: "Net Fortress",
    crown: "King",
    tag: "#THEWALL",
    division: "men",
    accent: "silver",
    accentSecondary: "cyan",
    overall: 89,
    stats: [
      { label: "Wall", value: 95 },
      { label: "Reach", value: 91 },
    ],
    bio: "6'4\" Dutch presence at the tape. Textbook timing and long-arm coverage that shuts the cross-court and forces errors.",
    badges: ["Imposing Wall", "High Elevation"],
    stem: "janjoost",
    copySide: "left",
  },
  {
    id: "ella-watson",
    name: "Ella Watson",
    firstName: "Ella",
    lastName: "Watson",
    monogram: "EW",
    role: "Offensive Ace",
    crown: "Queen",
    tag: "#QUEENOFSPIKES",
    division: "women",
    accent: "pink",
    accentSecondary: "gold",
    overall: 94,
    stats: [
      { label: "Spike", value: 96 },
      { label: "Float", value: 93 },
    ],
    bio: "Volleyball World Beach Pro Tour Futures, England. High-line scoring trajectory, jump-float heat, fearless on the big points.",
    badges: ["Spike Ace+", "World Pro Tour"],
    stem: "ella",
    copySide: "left",
  },
  {
    id: "martha-bullen",
    name: "Martha Bullen",
    firstName: "Martha",
    lastName: "Bullen",
    monogram: "MB",
    role: "Defensive Anchor",
    crown: "Queen",
    tag: "#SANDMASTER",
    division: "women",
    accent: "gold",
    accentSecondary: "rose",
    overall: 93,
    stats: [
      { label: "Digs", value: 97 },
      { label: "React", value: 92 },
    ],
    bio: "International tour defender. Lightning anticipation, roll recoveries, and the kind of passing that lets hitters cook.",
    badges: ["Sand Master+", "88% Dig Conv."],
    stem: "martha",
    copySide: "right",
  },
  {
    id: "francesca-billato",
    name: "Francesca Billato",
    firstName: "Francesca",
    lastName: "Billato",
    monogram: "FB",
    role: "Playmaker",
    crown: "Queen",
    tag: "#COURTMAESTRO",
    division: "women",
    accent: "purple",
    accentSecondary: "pink",
    overall: 91,
    stats: [
      { label: "Sets", value: 97 },
      { label: "Dump", value: 90 },
    ],
    bio: "Surgical playmaker. Soft hands, tempo variation, pinpoint sets, and a second-touch dump when the block overcommits.",
    badges: ["Butter Sets", "Deceptive Tempo"],
    stem: "francesca",
    copySide: "left",
  },
  {
    id: "lucy-knott",
    name: "Lucy Knott",
    firstName: "Lucy",
    lastName: "Knott",
    monogram: "LK",
    role: "Court Anchor",
    crown: "Queen",
    tag: "#LINESHOTSPECIALIST",
    division: "women",
    accent: "rose",
    accentSecondary: "gold",
    overall: 90,
    stats: [
      { label: "Line", value: 94 },
      { label: "Clutch", value: 89 },
    ],
    bio: "Line-shot specialist. Relentless coverage, sharp angle attacks down the line, and the clutch serve that flips a tight set.",
    badges: ["Line Shot+", "Clutch Gene"],
    stem: "lucy",
    copySide: "right",
  },
  {
    id: "kirsty-starr",
    name: "Kirsty Starr",
    firstName: "Kirsty",
    lastName: "Starr",
    monogram: "KS",
    role: "Rally Engine",
    crown: "Queen",
    tag: "#STARRQUALITY",
    division: "women",
    accent: "cyan",
    accentSecondary: "gold",
    overall: 90,
    stats: [
      { label: "Hustle", value: 94 },
      { label: "Serve", value: 88 },
    ],
    bio: "First to the ball and last to leave the point. Connects the court, talks the rally, and makes the people around her better.",
    badges: ["Rally Engine+", "Team Pulse"],
    stem: "kirsty",
    copySide: "left",
  },
  {
    id: "katie-keefe",
    name: "Katie Keefe",
    firstName: "Katie",
    lastName: "Keefe",
    monogram: "KK",
    role: "Two-Way Threat",
    crown: "Queen",
    tag: "#QUEENKEEFE",
    division: "women",
    accent: "coral",
    accentSecondary: "gold",
    overall: 89,
    stats: [
      { label: "Attack", value: 91 },
      { label: "Block", value: 88 },
    ],
    bio: "Plays both sides of the tape. Attacks with intent, closes space at the net, and keeps the standard high when the set is tight.",
    badges: ["Two-Way+", "Compete Gene"],
    stem: "katie",
    copySide: "right",
  },
];

export const teamHybridKings = teamHybridAthletes.filter((athlete) => athlete.division === "men");
export const teamHybridQueens = teamHybridAthletes.filter((athlete) => athlete.division === "women");

/** Bump when card art changes so phones do not keep a cached older plate. */
export const TEAM_ART_VERSION = "20260903";

export function teamCardSrc(stem: string, frame: "wide" | "tall", format: "jpg" | "webp" = "jpg") {
  return `/images/team/${stem}-${frame}.${format}?v=${TEAM_ART_VERSION}`;
}
