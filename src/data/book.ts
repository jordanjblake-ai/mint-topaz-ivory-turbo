export const BOOK_WEEKS = [
  { id: "week-1", label: "Week 1", range: "30/31 Jan to 6/7 Feb" },
  { id: "week-2", label: "Week 2", range: "6/7 Feb to 13/14 Feb" },
  { id: "week-3", label: "Week 3", range: "13/14 Feb to 20/21 Feb" },
] as const;

export type BookWeekId = (typeof BOOK_WEEKS)[number]["id"];

export const BOOK_PACKAGES = [
  {
    id: "camp",
    name: "Camp only",
    note: "Training and camp extras. You arrange your own stay.",
    priceEach: 42500,
    stay: "camp" as const,
  },
  {
    id: "stay-2bed-4",
    name: "2-bedroom apartment · 4 people",
    note: "Two bedrooms. One bed each.",
    priceEach: 78000,
    stay: "camp-stay" as const,
  },
  {
    id: "stay-2bed-3",
    name: "2-bedroom apartment · 3 people",
    note: "Two bedrooms. One bed each.",
    priceEach: 85000,
    stay: "camp-stay" as const,
  },
  {
    id: "stay-1bed-2",
    name: "1-bedroom apartment · 2 people",
    note: "Twin beds. Own bed, shared apartment.",
    priceEach: 87000,
    stay: "camp-stay" as const,
  },
  {
    id: "stay-1bed-1",
    name: "1-bedroom apartment · solo",
    note: "The apartment to yourself.",
    priceEach: 121500,
    stay: "camp-stay" as const,
  },
] as const;

export type BookPackageId = (typeof BOOK_PACKAGES)[number]["id"];

export const DEPOSIT_PENCE = 10_000;

export type BookPayment = "deposit" | "paid_in_full";

export function pounds(pence: number) {
  return `£${(pence / 100).toLocaleString("en-GB")}`;
}

export function packageById(id: string) {
  return BOOK_PACKAGES.find((item) => item.id === id) ?? BOOK_PACKAGES[0];
}

export function depositTotal(people: number, weeks: string[]) {
  const n = Math.min(8, Math.max(1, people));
  const w = Math.max(1, weeks.length);
  return DEPOSIT_PENCE * n * w;
}

export function campTotal(packageId: string, people: number, weeks: string[]) {
  const pack = packageById(packageId);
  const n = Math.min(8, Math.max(1, people));
  const w = Math.max(1, weeks.length);
  return pack.priceEach * n * w;
}

export function chargeTotal(
  packageId: string,
  people: number,
  weeks: string[],
  payment: BookPayment,
) {
  return payment === "paid_in_full"
    ? campTotal(packageId, people, weeks)
    : depositTotal(people, weeks);
}
