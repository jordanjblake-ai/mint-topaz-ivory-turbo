export type SoundBed =
  | "open"
  | "founding"
  | "lanzarote"
  | "camp"
  | "uk"
  | "london"
  | "champs"
  | "world"
  | "dawn";
export type Cam = "in" | "left" | "right" | "still";
export type Grade = "night" | "island" | "week" | "storm" | "dawn" | "paper";
export type ChapterId = "name" | "island" | "week" | "gold" | "serve";

export const CHAPTERS: Record<
  ChapterId,
  { roman: string; title: string; kicker: string; ink: string }
> = {
  name: { roman: "I", title: "THE NAME", kicker: "June 2025", ink: "126 184 212" },
  island: { roman: "II", title: "THE ISLAND", kicker: "Lanzarote · Jan–Feb 2026", ink: "224 154 72" },
  week: { roman: "III", title: "THE WEEK", kicker: "UK, 2026", ink: "186 206 214" },
  gold: { roman: "IV", title: "GOLDEN SETS", kicker: "June 2026", ink: "255 204 74" },
  serve: { roman: "V", title: "YOUR SERVE", kicker: "2026–27", ink: "232 176 168" },
};

export type Scene = {
  id: string;
  art: string;
  video?: string;
  date: string | null;
  sound: SoundBed;
  cam: Cam;
  grade: Grade;
  chapter: ChapterId;
  still?: boolean;
  cover?: boolean;
  last?: boolean;
  lines: string[];
  closer?: string;
};

export const scenes: Scene[] = [
  {
    id: "cover",
    art: "/art/00-title.jpg",
    date: null,
    sound: "open",
    cam: "still",
    grade: "night",
    chapter: "name",
    still: true,
    cover: true,
    lines: ["Sixteen months from a name to a world-tour court."],
  },
  {
    id: "name",
    art: "/art/02-founding.jpg",
    date: "June 2025",
    sound: "founding",
    cam: "in",
    grade: "paper",
    chapter: "name",
    still: true,
    lines: [
      "A coach gets tired of the gap.",
      "Sport on one side. Travel and people on the other.",
      "He gives the gap a name. Hybrid. Mark Garcia-Kidd.",
    ],
  },
  {
    id: "island",
    art: "/art/04-first-camp.jpg",
    date: "Lanzarote · Jan–Feb 2026",
    sound: "camp",
    cam: "left",
    grade: "island",
    chapter: "island",
    lines: [
      "One month after the name, the island is on the map.",
      "Summer that does not pack up in September.",
      "Strangers fly into Playa Grande. They leave with a week in their legs.",
      "First Hybrid beach volleyball camp, with beachvolleycamps.ch.",
    ],
  },
  {
    id: "week",
    art: "/art/06-uk-tour.jpg",
    video: "/art/06-uk-tour.mp4",
    date: "UK, 2026",
    sound: "uk",
    cam: "still",
    grade: "week",
    chapter: "week",
    still: true,
    lines: [
      "Then the kit comes home.",
      "Same idea, different beaches. Team Hybrid on the UK Beach Tour.",
      "Summer stops being a trip. It becomes a week.",
    ],
  },
  {
    id: "gold",
    art: "/art/08-champions.jpg",
    date: "June 2026",
    sound: "champs",
    cam: "in",
    grade: "storm",
    chapter: "gold",
    lines: [
      "Rain. Wind. Golden sets.",
      "Club champions. Men’s Championship Division.",
      "Europe is suddenly a date in the phone.",
    ],
  },
  {
    id: "serve",
    art: "/art/10-dawn.jpg",
    video: "/art/10-dawn.mp4",
    date: "2026–27",
    sound: "dawn",
    cam: "still",
    grade: "dawn",
    chapter: "serve",
    still: true,
    last: true,
    lines: [
      "The kit learns new airports. World Tour courts.",
      "Sixteen months from a name to that sand.",
      "2027 is still being written.",
    ],
    closer: "Your serve.",
  },
];
