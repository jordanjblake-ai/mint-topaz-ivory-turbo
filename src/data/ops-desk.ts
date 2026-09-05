/**
 * Hybrid desk v0 config.
 *
 * Allowlist emails are the only thing that grants the Mark/ops view after
 * real Google / Microsoft sign-in. Append staff Google or Microsoft
 * addresses to `OPS_ALLOWLIST_EMAILS` later — do not invent them here.
 *
 * Draft group grid lives in coaches-corner.ts. Import it. Do not duplicate.
 * Do not invent booking counts, guest names, occupancy, or money figures.
 */

export const OPS_ALLOWLIST_EMAILS = [
  "mark@hybridvacations.com",
  "support@hybridvacations.com",
] as const;

export function isOpsEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const needle = email.trim().toLowerCase();
  return OPS_ALLOWLIST_EMAILS.some((item) => item.toLowerCase() === needle);
}

export const UNKNOWN_OPS_COPY = "You’re not on the ops list — ask Mark.";

export const DESK_TITLE = "Hybrid desk · Lanzarote 2027";
export const DESK_SUB =
  "Bookings, money, roster, welfare, and day-of — Mark/ops only.";

export type WeekFilter = "all" | 1 | 2 | 3;

export const WEEK_FILTERS: { id: WeekFilter; chip: string }[] = [
  { id: "all", chip: "All" },
  { id: 1, chip: "W1 (30/31 Jan–6/7 Feb)" },
  { id: 2, chip: "W2 (6/7–13/14 Feb)" },
  { id: 3, chip: "W3 (13/14–20/21 Feb)" },
];

export const BOOKING_PULSE_LABELS = [
  "Paid in full",
  "Deposit held",
  "Balance due",
  "Cancelled",
  "Camp-only",
  "Camp+stay",
] as const;

export const BOOKING_EMPTY =
  "Booking feed not wired yet. Connect Stripe / booking source — do not show fake numbers.";

export const MONEY_LOCKS = [
  "Accommodation balance 1 January 2027",
  "Camp balance 15 January 2027",
  "£100 deposit under cancellation 15/40/70/100",
] as const;

export const MONEY_EMPTY =
  "No balance rows until payments sync. Failed payments will list here.";

export const ROSTER_GUEST_EMPTY =
  "Guest names open with the booking feed. Under-18 / medical flags stay on this desk only.";

export const WELFARE_EMPTY =
  "No open notes. Coaches escalate here; Mark owns medical / under-18 / on-ground emergency.";

export const COMMS_EMPTY =
  "WhatsApp / email queues not wired. Guest email stays on ops — do not dump onto coaches.";

export const OPS_CHECKLIST = [
  "W1 court setup owner",
  "Wednesday duty cover",
  "Apartments / transfers (staff, not coaches)",
  "W3 deconstruction owner",
  "Pro exhibitions: able-to-play yes/no/maybe tracking",
] as const;

export const DAY_OF_EMPTY =
  "Court boards, no-shows, and weather call appear when camp week is live.";

export const FOOTER_SOURCE_NOTE =
  "Source of truth for money later = Stripe/Xero; do not invent.";

export const ASSIGN_COACH_COMING = "Coming";

export const PEOPLE_EMPTY = "People feed not wired yet. Guest names open with the booking feed.";
