export const teamHybridValues = [
  "Passion",
  "Commitment",
  "Community",
  "Positivity",
] as const;

export type TeamAccent = "gold" | "cyan" | "red" | "lime" | "silver" | "pink" | "purple" | "rose";

export type TeamAthlete = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  crown: "King" | "Queen";
  tag: string;
  division: "men" | "women";
  accent: TeamAccent;
  overall: number;
  stats: readonly { label: string; value: number | string }[];
  bio: string;
  badges: readonly string[];
  stem: string;
};

export const teamHybridAthletes: readonly TeamAthlete[] = [
  {
    id: "stuart-perry",
    name: "Stuart Perry",
    firstName: "Stuart",
    lastName: "Perry",
    role: "Net Anchor",
    crown: "King",
    tag: "#KINGOFTHENET",
    division: "men",
    accent: "gold",
    overall: 94,
    stats: [
      { label: "Block", value: 96 },
      { label: "Serve", value: 92 },
    ],
    bio: "National ranking lead anchor on the UK Beach Tour. Impenetrable at the net, huge vertical, jump-serve that snaps rallies in half.",
    badges: ["Block Master+", "Ace Jump Serve"],
    stem: "stuart",
  },
  {
    id: "theo-plaza",
    name: "Theo Plaza",
    firstName: "Theo",
    lastName: "Plaza",
    role: "Back-Row Spark",
    crown: "King",
    tag: "#SANDLIGHTNING",
    division: "men",
    accent: "cyan",
    overall: 93,
    stats: [
      { label: "Digs", value: 97 },
      { label: "Sets", value: 91 },
    ],
    bio: "Coach and court spark. Relentless diving range through heavy sand, then a lightning transition set that starts the counter.",
    badges: ["Sand Digs+", "Transition Set"],
    stem: "theo",
  },
  {
    id: "lewis-bunton",
    name: "Lewis Bunton",
    firstName: "Lewis",
    lastName: "Bunton",
    role: "Primary Hitter",
    crown: "King",
    tag: "#HEAVYCANNON",
    division: "men",
    accent: "red",
    overall: 91,
    stats: [
      { label: "Spike", value: 98 },
      { label: "Hang", value: 89 },
    ],
    bio: "Primary offensive powerhouse. Wrist-snap kills that beat the single block and bury the line in heavy sand at tour pace.",
    badges: ["Heavy Spiker", "High Velocity"],
    stem: "lewis",
  },
  {
    id: "bailey-harsum",
    name: "Bailey Harsum",
    firstName: "Bailey",
    lastName: "Harsum",
    role: "Serve Technician",
    crown: "King",
    tag: "#TACTICALSERVE",
    division: "men",
    accent: "lime",
    overall: 90,
    stats: [
      { label: "Serve", value: 93 },
      { label: "IQ", value: 90 },
    ],
    bio: "Clutch server and net technician. Float variations and deceptive cut shots that scramble a defence before the rally starts.",
    badges: ["Float Ace+", "Cut Shot"],
    stem: "bailey",
  },
  {
    id: "jan-joost",
    name: "Jan-Joost Van Der Bogert",
    firstName: "Jan-Joost",
    lastName: "Van Der Bogert",
    role: "Net Fortress",
    crown: "King",
    tag: "#THEWALL",
    division: "men",
    accent: "silver",
    overall: 89,
    stats: [
      { label: "Wall", value: 95 },
      { label: "Reach", value: 91 },
    ],
    bio: "6'4\" Dutch presence at the tape. Textbook timing and long-arm coverage that shuts the cross-court and forces errors.",
    badges: ["Imposing Wall", "High Elevation"],
    stem: "janjoost",
  },
  {
    id: "ella-watson",
    name: "Ella Watson",
    firstName: "Ella",
    lastName: "Watson",
    role: "Offensive Ace",
    crown: "Queen",
    tag: "#QUEENOFSPIKES",
    division: "women",
    accent: "pink",
    overall: 94,
    stats: [
      { label: "Spike", value: 96 },
      { label: "Float", value: 93 },
    ],
    bio: "Volleyball World Beach Pro Tour Futures, England. High-line scoring trajectory, jump-float heat, fearless on the big points.",
    badges: ["Spike Ace+", "World Pro Tour"],
    stem: "ella",
  },
  {
    id: "martha-bullen",
    name: "Martha Bullen",
    firstName: "Martha",
    lastName: "Bullen",
    role: "Defensive Anchor",
    crown: "Queen",
    tag: "#SANDMASTER",
    division: "women",
    accent: "gold",
    overall: 93,
    stats: [
      { label: "Digs", value: 97 },
      { label: "React", value: 92 },
    ],
    bio: "International tour defender. Lightning anticipation, roll recoveries, and the kind of passing that lets hitters cook.",
    badges: ["Sand Master+", "88% Dig Conv."],
    stem: "martha",
  },
  {
    id: "francesca-billato",
    name: "Francesca Billato",
    firstName: "Francesca",
    lastName: "Billato",
    role: "Playmaker",
    crown: "Queen",
    tag: "#COURTMAESTRO",
    division: "women",
    accent: "purple",
    overall: 91,
    stats: [
      { label: "Sets", value: 97 },
      { label: "Dump", value: 90 },
    ],
    bio: "Surgical playmaker. Soft hands, tempo variation, pinpoint sets, and a second-touch dump when the block overcommits.",
    badges: ["Butter Sets", "Deceptive Tempo"],
    stem: "francesca",
  },
  {
    id: "lucy-knott",
    name: "Lucy Knott",
    firstName: "Lucy",
    lastName: "Knott",
    role: "Court Anchor",
    crown: "Queen",
    tag: "#LINESHOTSPECIALIST",
    division: "women",
    accent: "rose",
    overall: 90,
    stats: [
      { label: "Line", value: 94 },
      { label: "Clutch", value: 89 },
    ],
    bio: "Line-shot specialist. Relentless coverage, sharp angle attacks down the line, and the clutch serve that flips a tight set.",
    badges: ["Line Shot+", "Clutch Gene"],
    stem: "lucy",
  },
];

export const teamHybridKings = teamHybridAthletes.filter((athlete) => athlete.division === "men");
export const teamHybridQueens = teamHybridAthletes.filter((athlete) => athlete.division === "women");

export function teamCardSrc(stem: string, frame: "wide" | "tall", format: "jpg" | "webp" = "jpg") {
  return `/images/team/${stem}-${frame}.${format}`;
}
