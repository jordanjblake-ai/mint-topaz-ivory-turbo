export const FORM_SPORTS = [
  { value: "beach", label: "Beach Volleyball" },
  { value: "tennis", label: "Tennis" },
  { value: "padel", label: "Padel" },
  { value: "golf", label: "Golf" },
  { value: "other", label: "Not Listed" },
] as const;

export type FormSport = (typeof FORM_SPORTS)[number]["value"];

export const LEVELS_BY_SPORT = {
  beach: [
    { value: "ukbt-1-b3", label: "UKBT 1* / B3 - Level" },
    { value: "ukbt-2-b2", label: "UKBT 2* / B2 - Level" },
    { value: "ukbt-3-b1", label: "UKBT 3* / B1 - Level" },
    { value: "ukbt-45-b1-a3", label: "UKBT 4*|5* / B1|A3 - Level" },
  ],
  tennis: [
    { value: "tennis-beginner", label: "Beginner" },
    { value: "tennis-intermediate", label: "Intermediate" },
    { value: "tennis-advanced", label: "Advanced" },
    { value: "tennis-county", label: "County / Tournament" },
  ],
  padel: [
    { value: "padel-beginner", label: "Beginner" },
    { value: "padel-intermediate", label: "Intermediate" },
    { value: "padel-advanced", label: "Advanced" },
    { value: "padel-competition", label: "Competition" },
  ],
  golf: [
    { value: "golf-beginner", label: "Beginner / New To Golf" },
    { value: "golf-high", label: "High Handicap (18+)" },
    { value: "golf-mid", label: "Mid Handicap (10-17)" },
    { value: "golf-low", label: "Low Handicap (0-9)" },
    { value: "golf-scratch", label: "Scratch / Plus" },
  ],
  other: [
    { value: "other-beginner", label: "Beginner" },
    { value: "other-intermediate", label: "Intermediate" },
    { value: "other-advanced", label: "Advanced" },
    { value: "other-not-listed", label: "Not Listed" },
  ],
} as const;

export const PERFORMANCE_LEVELS = LEVELS_BY_SPORT.beach;

export const ALL_LEVELS = [
  ...LEVELS_BY_SPORT.beach,
  ...LEVELS_BY_SPORT.tennis,
  ...LEVELS_BY_SPORT.padel,
  ...LEVELS_BY_SPORT.golf,
  ...LEVELS_BY_SPORT.other,
] as const;

export const PERFORMANCE_SIZES = [
  { value: "XS", label: "X-Small" },
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "X-Large" },
] as const;

export const PERFORMANCE_GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "group", label: "Group" },
] as const;

export const ALL_TOPS = [
  { value: "vest", label: "Vest" },
  { value: "t-shirt", label: "T-Shirt" },
  { value: "sports-bra", label: "Sports Bra" },
] as const;

export const PERFORMANCE_TOPS = ALL_TOPS;

export const CAMP_WEEKS = [
  { value: "", label: "Not Sure Yet" },
  { value: "week-1", label: "Week 1 · 30/31 Jan to 6/7 Feb" },
  { value: "week-2", label: "Week 2 · 6/7 Feb to 13/14 Feb" },
  { value: "week-3", label: "Week 3 · 13/14 Feb to 20/21 Feb" },
] as const;

export const COACHING_FORMATS = [
  { value: "private", label: "Private Session" },
  { value: "clinic", label: "Clinic" },
  { value: "mini-camp", label: "Mini-Camp" },
] as const;

export type PerformanceLevel = (typeof ALL_LEVELS)[number]["value"];
export type PerformanceSize = (typeof PERFORMANCE_SIZES)[number]["value"];
export type PerformanceGender = (typeof PERFORMANCE_GENDERS)[number]["value"];
export type PerformanceTop = (typeof ALL_TOPS)[number]["value"];

export type PerformanceApplication = {
  firstName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  sport: FormSport;
  gender: PerformanceGender;
  level: PerformanceLevel;
  topStyle: PerformanceTop;
  topSize: PerformanceSize;
  hasPartner: boolean;
  partnerFirstName: string;
  partnerLastName: string;
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyPhone: string;
  message: string;
  submittedAt?: string;
  updatedAt?: string;
};

export function labelOf(
  options: readonly { value: string; label: string }[],
  value: string,
) {
  return options.find((item) => item.value === value)?.label ?? value;
}

export function levelsForSport(sport: FormSport) {
  return LEVELS_BY_SPORT[sport];
}

export function defaultLevelForSport(sport: FormSport): PerformanceLevel {
  return LEVELS_BY_SPORT[sport][0].value;
}

export function isLevelForSport(sport: FormSport, level: string) {
  return LEVELS_BY_SPORT[sport].some((item) => item.value === level);
}

export function usesVest(sport: FormSport) {
  return sport === "beach";
}

export function topsForSport(sport: FormSport) {
  const shirt = usesVest(sport)
    ? ALL_TOPS.find((item) => item.value === "vest")!
    : ALL_TOPS.find((item) => item.value === "t-shirt")!;
  const bra = ALL_TOPS.find((item) => item.value === "sports-bra")!;
  return [shirt, bra];
}

export function defaultTopForSport(sport: FormSport, gender: PerformanceGender): PerformanceTop {
  if (gender === "female") return "sports-bra";
  return usesVest(sport) ? "vest" : "t-shirt";
}

export function maleTopForSport(sport: FormSport): PerformanceTop {
  return usesVest(sport) ? "vest" : "t-shirt";
}

export function forcedSportFromInterest(interest: string): FormSport | null {
  if (interest === "tennis") return "tennis";
  if (interest === "padel") return "padel";
  if (interest === "golf") return "golf";
  if (interest === "lanzarote" || interest === "performance") return "beach";
  return null;
}

export function sportFromInterest(interest: string): FormSport {
  return forcedSportFromInterest(interest) ?? "beach";
}

export function partnerLegend(sport: FormSport) {
  if (sport === "tennis") return "Tennis Partner";
  if (sport === "padel") return "Padel Partner";
  if (sport === "golf") return "Golf Partner";
  if (sport === "other") return "Playing Partner";
  return "Beach Partner";
}

export function partnerFirstNameLabel(sport: FormSport) {
  return `${partnerLegend(sport)}'s First Name`;
}

export function partnerLastNameLabel(sport: FormSport) {
  return `${partnerLegend(sport)}'s Last Name`;
}

export function partnerFullName(first: string, last: string) {
  return `${first.trim()} ${last.trim()}`.trim();
}

export function splitDisplayName(displayName: string | null | undefined, email?: string | null) {
  const parts = (displayName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
  }
  if (parts[0]) return { firstName: parts[0], lastName: "" };
  const local = (email ?? "").split("@")[0] ?? "";
  return { firstName: local, lastName: "" };
}

export function normalisePhone(value: string) {
  return value.replace(/[()\s-]/g, "").trim();
}

export function isIntlPhone(value: string) {
  return /^\+[1-9]\d{6,14}$/.test(normalisePhone(value));
}
