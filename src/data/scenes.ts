export type Mark = "badge" | "wordmark";
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
export type Cam = "in" | "left" | "right" | "up" | "down" | "still";
export type SceneFx = "rain" | "sun" | "stars" | "waves" | "mist" | "dust" | "clouds" | "grass" | "sunrise" | "ink" | "lamp";
export type Grade = "night" | "island" | "week" | "storm" | "dawn" | "paper" | "dusk";
export type ChapterId = "name" | "island" | "week" | "gold" | "serve";

export const CHAPTERS: Record<
  ChapterId,
  { roman: string; title: string; kicker: string; ink: string }
> = {
  name: { roman: "I", title: "THE NAME", kicker: "June 2025", ink: "126 184 212" },
  island: { roman: "II", title: "THE ISLAND", kicker: "Lanzarote", ink: "224 154 72" },
  week: { roman: "III", title: "THE WEEK", kicker: "Home courts", ink: "186 206 214" },
  gold: { roman: "IV", title: "GOLDEN SETS", kicker: "June 2026", ink: "255 204 74" },
  serve: { roman: "V", title: "YOUR SERVE", kicker: "2027", ink: "232 176 168" },
};

export type Scene = {
  id: string;
  art: string;
  video?: string;
  date: string | null;
  mark: Mark | null;
  sound: SoundBed;
  cam: Cam;
  grade: Grade;
  chapter: ChapterId;
  plate?: boolean;
  fx?: SceneFx[];
  sun?: { x: string; y: string };
  wave?: { top: string; height: string; left?: string; width?: string };
  hit?: boolean;
  still?: boolean;
  lines: string[];
  whisper?: string;
  closer?: string;
};

export const scenes: Scene[] = [
  {
    id: "cover",
    art: "/art/00-title.jpg",
    date: null,
    mark: "wordmark",
    sound: "open",
    cam: "in",
    grade: "night",
    chapter: "name",
    fx: ["stars"],
    lines: ["The story isn’t finished."],
    whisper: "A visual history. Scroll when you are ready.",
  },
  {
    id: "ch-name",
    art: "/art/ch-01.jpg",
    date: null,
    mark: "badge",
    sound: "open",
    cam: "in",
    grade: "night",
    chapter: "name",
    plate: true,
    still: true,
    fx: ["stars"],
    lines: [],
  },
  {
    id: "open",
    art: "/art/01-last-summer.jpg",
    date: "LAST SUMMER",
    mark: null,
    sound: "open",
    cam: "in",
    grade: "paper",
    chapter: "name",
    still: true,
    fx: [],
    lines: [
      "This kit didn’t exist.",
      "Sixteen months.",
      "That’s the whole story so far.",
    ],
  },
  {
    id: "founding",
    art: "/art/02-founding.jpg",
    date: "JUNE 2025",
    mark: "badge",
    sound: "founding",
    cam: "in",
    grade: "paper",
    chapter: "name",
    fx: ["clouds", "ink"],
    still: true,
    lines: [
      "A coach gets tired of the gap.",
      "Sport on one side. Travel, people, the rest of life on the other.",
      "He gives the gap a name.",
    ],
    whisper: "Hybrid. Founded by Mark Garcia-Kidd.",
  },
  {
    id: "ch-island",
    art: "/art/ch-02.jpg",
    date: null,
    mark: "wordmark",
    sound: "lanzarote",
    cam: "right",
    grade: "island",
    chapter: "island",
    plate: true,
    still: true,
    fx: ["sun"],
    sun: { x: "20%", y: "24%" },
    lines: [],
  },
  {
    id: "lanzarote",
    art: "/art/03-lanzarote.jpg",
    date: "JULY 2025",
    mark: "wordmark",
    sound: "lanzarote",
    cam: "right",
    grade: "island",
    chapter: "island",
    fx: ["sun", "waves"],
    sun: { x: "16%", y: "20%" },
    wave: { top: "34%", height: "26%", left: "48%", width: "54%" },
    lines: [
      "One month later the island is on the map.",
      "Lanzarote. Released.",
      "Summer that doesn’t pack up in September.",
    ],
  },
  {
    id: "camp",
    art: "/art/04-first-camp.jpg",
    date: "JAN · FEB 2026",
    mark: "badge",
    sound: "camp",
    cam: "left",
    grade: "island",
    chapter: "island",
    fx: ["sun", "waves"],
    sun: { x: "18%", y: "28%" },
    wave: { top: "26%", height: "30%" },
    lines: [
      "Strangers fly in.",
      "They leave with a week in their legs.",
      "First Hybrid Beach Volleyball Camp.",
    ],
    whisper: "Built with Beachvolleycamps.ch on the sand at Playa Grande.",
  },
  {
    id: "performance",
    art: "/art/05-performance.jpg",
    date: "FEB 2026",
    mark: null,
    sound: "camp",
    cam: "in",
    grade: "island",
    chapter: "island",
    fx: ["dust"],
    lines: [
      "Some people came for a holiday.",
      "Some people stayed for the extra hour.",
      "Same sand. Different temperature.",
    ],
    whisper: "First Beach Volleyball Performance Camp.",
  },
  {
    id: "ch-week",
    art: "/art/ch-03.jpg",
    date: null,
    mark: "badge",
    sound: "uk",
    cam: "up",
    grade: "week",
    chapter: "week",
    plate: true,
    still: true,
    fx: ["rain"],
    lines: [],
  },
  {
    id: "uk",
    art: "/art/06-uk-tour.jpg",
    video: "/art/06-uk-tour.mp4",
    date: "2026",
    mark: "badge",
    sound: "uk",
    cam: "still",
    grade: "week",
    chapter: "week",
    still: true,
    fx: [],
    lines: [
      "Then the kit leaves the island.",
      "Team Hybrid on the UK Beach Tour.",
      "Different beaches. Same idea.",
    ],
  },
  {
    id: "london",
    art: "/art/07-london.jpg",
    date: "MAY — SEP 2026",
    mark: null,
    sound: "london",
    cam: "right",
    grade: "week",
    chapter: "week",
    fx: [],
    lines: [
      "Summer stops being a trip.",
      "It becomes a week.",
      "First domestic performance group.",
    ],
    whisper: "Hybrid × Fireball London. Train like you mean October.",
  },
  {
    id: "ch-gold",
    art: "/art/ch-04.jpg",
    date: null,
    mark: "badge",
    sound: "champs",
    cam: "in",
    grade: "storm",
    chapter: "gold",
    plate: true,
    still: true,
    fx: ["rain"],
    lines: [],
  },
  {
    id: "champs",
    art: "/art/08-champions.jpg",
    date: "JUNE 2026",
    mark: "badge",
    sound: "champs",
    cam: "in",
    grade: "storm",
    chapter: "gold",
    hit: true,
    lines: [
      "Rain. Wind. Golden sets.",
      "Club champions.",
      "Fireball / Hybrid. Men’s Championship Division.",
    ],
    whisper: "Europe is suddenly a date in the phone.",
  },
  {
    id: "ch-serve",
    art: "/art/ch-05.jpg",
    date: null,
    mark: "wordmark",
    sound: "world",
    cam: "still",
    grade: "dawn",
    chapter: "serve",
    plate: true,
    still: true,
    fx: ["stars"],
    lines: [],
  },
  {
    id: "world",
    art: "/art/09-world-tour.jpg",
    date: "JUN — OCT 2026",
    mark: "wordmark",
    sound: "world",
    cam: "left",
    grade: "dusk",
    chapter: "serve",
    fx: ["sun", "waves"],
    sun: { x: "17%", y: "25%" },
    wave: { top: "36%", height: "26%" },
    lines: [
      "The kit learns new airports.",
      "FIVB World Tour.",
      "Sixteen months from a name to a world-tour court.",
    ],
  },
  {
    id: "dawn",
    art: "/art/10-2027.jpg",
    date: "2027",
    mark: "wordmark",
    sound: "dawn",
    cam: "still",
    grade: "dawn",
    chapter: "serve",
    still: true,
    fx: [],
    lines: [
      "More to come.",
      "History to be made.",
      "The court is still empty on purpose.",
    ],
    closer: "YOUR SERVE.",
    whisper: "Come for the sport. Stay for the people. Leave with memories.",
  },
];
