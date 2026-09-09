import { PEOPLE, type CampPerson } from "@/data/camp";

function needle(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

export function playerByEmail(email: string | null | undefined): CampPerson | null {
  const key = needle(email);
  if (!key) return null;
  return PEOPLE.find((person) => person.email.toLowerCase() === key && person.role === "player") ?? null;
}

export function campStaffByEmail(email: string | null | undefined): CampPerson | null {
  const key = needle(email);
  if (!key) return null;
  return PEOPLE.find((person) => person.email.toLowerCase() === key && person.role !== "player") ?? null;
}
