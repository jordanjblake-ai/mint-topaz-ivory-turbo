import { liveClinics } from "./site";

export const MEMBER_SPORTS = [
  { value: "beach", label: "Beach Volleyball" },
  { value: "tennis", label: "Tennis" },
  { value: "padel", label: "Padel" },
  { value: "golf", label: "Golf" },
] as const;

export type MemberSport = (typeof MEMBER_SPORTS)[number]["value"];

export const MEMBER_SIZES = [
  { value: "XS", label: "X-Small" },
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "X-Large" },
] as const;

export type MemberSize = (typeof MEMBER_SIZES)[number]["value"];

export const MEMBER_COUNTRIES = [
  "United Kingdom",
  "Ireland",
  "Switzerland",
  "Spain",
  "Germany",
  "France",
  "Netherlands",
  "Italy",
  "United States",
  "Other",
] as const;

export type MemberBookingKind = "camp" | "clinic";

export type MemberBooking = {
  id: string;
  kind: MemberBookingKind;
  product: string;
  title: string;
  detail: string;
  status: string;
  href: "/portal" | "/camp" | "/coaching" | "/community/club/performance" | "/vacations/lanzarote";
};

export type MemberProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  postcode: string;
  country: string;
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyPhone: string;
  emergencyEmail: string;
  medical: string;
  dietary: string;
  ukbt: string;
  vestSize: string;
  shortsSize: string;
  sports: MemberSport[];
  membershipExpiresOn: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export const emptyMemberProfile = (email = ""): MemberProfile => ({
  firstName: "",
  lastName: "",
  email,
  phone: "",
  addressLine: "",
  city: "",
  postcode: "",
  country: "United Kingdom",
  emergencyFirstName: "",
  emergencyLastName: "",
  emergencyPhone: "",
  emergencyEmail: "",
  medical: "",
  dietary: "",
  ukbt: "",
  vestSize: "",
  shortsSize: "",
  sports: [],
  membershipExpiresOn: null,
  createdAt: null,
  updatedAt: null,
});

export function memberCalendar() {
  const clinics = liveClinics().map((clinic) => ({
    date: clinic.dateIso,
    title: clinic.title,
    place: `${clinic.venue} · ${clinic.postcode}`,
    href: "/coaching" as const,
  }));
  return [
    ...clinics,
    {
      date: "2027-01-30",
      title: "Lanzarote Beach Volleyball · Week 1",
      place: "Playa Grande, Puerto del Carmen",
      href: "/vacations/lanzarote" as const,
    },
    {
      date: "2027-02-06",
      title: "Lanzarote Beach Volleyball · Week 2",
      place: "Playa Grande, Puerto del Carmen",
      href: "/vacations/lanzarote" as const,
    },
    {
      date: "2027-02-13",
      title: "Lanzarote Beach Volleyball · Week 3",
      place: "Playa Grande, Puerto del Carmen",
      href: "/vacations/lanzarote" as const,
    },
    {
      date: "2027-04-05",
      title: "Mallorca Padel Camp",
      place: "Mallorca · 5 to 9 April 2027",
      href: "/vacations/padel" as const,
    },
    {
      date: "2027-04-01",
      title: "Mallorca Tennis Camp",
      place: "Mallorca · April 2027",
      href: "/vacations/tennis" as const,
    },
    {
      date: "2027-05-04",
      title: "Performance Squad 2027",
      place: "UK · May to September",
      href: "/community/club/performance" as const,
    },
  ].sort((a, b) => a.date.localeCompare(b.date));
}

export function formatMemberDate(iso: string | null) {
  if (!iso) return "—";
  const date = new Date(`${iso.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export function splitDisplayName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}
