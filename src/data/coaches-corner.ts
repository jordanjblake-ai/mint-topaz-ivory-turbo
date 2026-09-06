/**
 * Coaches Corner v1 config.
 *
 * Auth model: email → coach map. Hybrid addresses are filled.
 * Personal Google / Microsoft rows stay empty until Jordan adds them —
 * do not invent personal emails.
 *
 * Draft group grid is independent of /camp (camp.ts GROUP_LEAD is left alone).
 */

export type CoachId = "mark" | "martha" | "issa" | "dave" | "katya";

export type CoachAllowlistEntry = {
  id: CoachId;
  name: string;
  shortName: string;
  title: string;
  weeks: number[];
  role: "head" | "coach";
};

export type CoachEmailKind = "hybrid" | "personal";

export type CoachEmailRow = {
  coachId: CoachId;
  /** Empty string = reserved slot. Ignored by coachByEmail. */
  email: string;
  kind: CoachEmailKind;
};

export const COACH_ALLOWLIST: CoachAllowlistEntry[] = [
  {
    id: "mark",
    name: "Mark Garcia-Kidd",
    shortName: "Mark",
    title: "Head coach, all weeks",
    weeks: [1, 2, 3],
    role: "head",
  },
  {
    id: "martha",
    name: "Martha Bullen",
    shortName: "Martha",
    title: "Camp coach",
    weeks: [1, 2, 3],
    role: "coach",
  },
  {
    id: "issa",
    name: "Issa Batrane",
    shortName: "Issa",
    title: "Camp coach",
    weeks: [1, 2, 3],
    role: "coach",
  },
  {
    id: "dave",
    name: "Dave Panah",
    shortName: "Dave",
    title: "Camp coach · Group C, weeks 2–3",
    weeks: [2, 3],
    role: "coach",
  },
  {
    id: "katya",
    name: "Katya Kate",
    shortName: "Katya",
    title: "Camp coach",
    weeks: [1, 2, 3],
    role: "coach",
  },
];

/**
 * Source of truth for Coaches Corner auth.
 * Fill a personal row later by setting `email` — do not invent addresses.
 */
export const COACH_EMAIL_MAP: CoachEmailRow[] = [
  { coachId: "mark", email: "mark@hybridvacations.com", kind: "hybrid" },
  { coachId: "mark", email: "", kind: "personal" },
  { coachId: "martha", email: "martha@hybridvacations.com", kind: "hybrid" },
  { coachId: "martha", email: "", kind: "personal" },
  { coachId: "issa", email: "issa@hybridvacations.com", kind: "hybrid" },
  { coachId: "issa", email: "", kind: "personal" },
  { coachId: "dave", email: "dave@hybridvacations.com", kind: "hybrid" },
  { coachId: "dave", email: "", kind: "personal" },
  { coachId: "katya", email: "katya@hybridvacations.com", kind: "hybrid" },
  { coachId: "katya", email: "", kind: "personal" },
];

export function coachByEmail(email: string | null | undefined): CoachAllowlistEntry | null {
  if (!email) return null;
  const needle = email.trim().toLowerCase();
  if (!needle) return null;
  const row = COACH_EMAIL_MAP.find((item) => item.email.trim().toLowerCase() === needle);
  if (!row) return null;
  return COACH_ALLOWLIST.find((coach) => coach.id === row.coachId) ?? null;
}

export const DRAFT_GRID_LABEL = "DRAFT · Mark assigns closer to camp";

export const GROUP_SIZE_COPY = "4–8 players per court";
export const SESSION_HOURS_COPY = "16+ hours";

export type DraftGroup = "A" | "B" | "C";

export type DraftCell = {
  week: 1 | 2 | 3;
  group: DraftGroup;
  coachId: CoachId | null;
  label: string;
  note?: string;
};

/** Dedicated coach stays with the group for all 9 sessions that week. */
export const DRAFT_GROUP_GRID: DraftCell[] = [
  { week: 1, group: "A", coachId: "martha", label: "Martha" },
  { week: 1, group: "B", coachId: "issa", label: "Issa" },
  { week: 1, group: "C", coachId: null, label: "TBC", note: "beachvolleycamps" },
  { week: 2, group: "A", coachId: "issa", label: "Issa" },
  { week: 2, group: "B", coachId: "martha", label: "Martha" },
  { week: 2, group: "C", coachId: "dave", label: "Dave" },
  { week: 3, group: "A", coachId: "martha", label: "Martha" },
  { week: 3, group: "B", coachId: "issa", label: "Issa" },
  { week: 3, group: "C", coachId: "dave", label: "Dave" },
];

export const DRAFT_WEEKS: { id: 1 | 2 | 3; label: string; range: string }[] = [
  { id: 1, label: "Week 1", range: "31 Jan – 7 Feb" },
  { id: 2, label: "Week 2", range: "7 – 14 Feb" },
  { id: 3, label: "Week 3", range: "14 – 21 Feb" },
];

export const COACH_OWNS = [
  "Progressive 9 sessions with the same group all week",
  "On-sand welfare first response",
  "Soft level check",
  "Monday scramble + Friday camp tournament facilitation",
  "Sunset / dinner / farewell — coach-owned (may take a night off)",
  "Week 1 court setup / Week 3 deconstruction",
  "Wednesday: someone on duty",
];

export const NOT_COACH = [
  "Money, guest email, flights / transfers, apartments",
  "Medical / under-18 — Mark",
  "Photo opt-out",
  "Weekend tournament commercial — coaches’ day off if wanted",
];

export const MARK_OWNS = [
  "Head coach, all weeks",
  "WhatsApp / roster / welfare escalation",
  "On-ground emergency",
];

export const PRO_EXHIBITION_NOTE =
  "Pro exhibitions: real inclusion. Able-to-play is yes / no / maybe — a duty note, not a roster.";

export const ROSTER_PLACEHOLDER = "Opens with the booking. Mark assigns closer to camp.";

export const UNKNOWN_COACH_COPY = "You’re not on the coach list — ask Mark.";

export function cellsForCoach(coachId: CoachId): DraftCell[] {
  return DRAFT_GROUP_GRID.filter((cell) => cell.coachId === coachId);
}

export function dutiesFor(coach: CoachAllowlistEntry): string[] {
  const groups = cellsForCoach(coach.id).map((cell) => `Week ${cell.week} Group ${cell.group}`);

  if (coach.id === "mark") {
    return [
      ...MARK_OWNS,
      "Assigns groups closer to camp",
      "Medical / under-18",
      PRO_EXHIBITION_NOTE,
    ];
  }

  if (coach.id === "dave") {
    return [
      "Group C, weeks 2–3 only — dedicated coach for all 9 sessions those weeks",
      "Not on Week 1",
      ...COACH_OWNS,
      PRO_EXHIBITION_NOTE,
    ];
  }

  if (coach.id === "katya") {
    return [
      "Camp coach — Mark assigns the week-by-week picture closer to camp",
      "Not a Hybrid group lead on this draft grid",
      ...COACH_OWNS,
      PRO_EXHIBITION_NOTE,
    ];
  }

  return [
    groups.length
      ? `Your draft groups: ${groups.join(" · ")} — same group for all 9 sessions that week`
      : "Mark assigns your group closer to camp",
    ...COACH_OWNS,
    PRO_EXHIBITION_NOTE,
  ];
}
