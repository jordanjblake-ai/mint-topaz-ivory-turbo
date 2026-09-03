import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { clip, isEmail } from "@/lib/guard";
import {
  emptyMemberProfile,
  MEMBER_SIZES,
  MEMBER_SPORTS,
  splitDisplayName,
  type MemberBooking,
  type MemberBookingKind,
  type MemberProfile,
  type MemberSport,
} from "@/data/member";

const Sport = z.enum(MEMBER_SPORTS.map((item) => item.value) as [MemberSport, ...MemberSport[]]);
const Size = z.enum(["", ...MEMBER_SIZES.map((item) => item.value)] as [string, ...string[]]);

const Input = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(40),
  addressLine: z.string().trim().max(120),
  city: z.string().trim().max(80),
  postcode: z.string().trim().max(20),
  country: z.string().trim().min(1).max(80),
  emergencyFirstName: z.string().trim().max(80),
  emergencyLastName: z.string().trim().max(80),
  emergencyPhone: z.string().trim().max(40),
  emergencyEmail: z.string().trim().max(120),
  medical: z.string().trim().max(1000),
  dietary: z.string().trim().max(1000),
  ukbt: z.string().trim().max(20),
  vestSize: Size,
  shortsSize: Size,
  sports: z.array(Sport).max(4),
});

type Row = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line: string;
  city: string;
  postcode: string;
  country: string;
  emergency_name: string;
  emergency_first_name?: string;
  emergency_last_name?: string;
  emergency_phone: string;
  emergency_phone_alt?: string;
  emergency_email: string;
  medical: string;
  dietary: string;
  ukbt: string;
  vest_size: string;
  shorts_size: string;
  sports: string;
  membership_expires_on: string | null;
  created_at: string;
  updated_at: string;
};

function parseSports(raw: string): MemberSport[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const allowed = new Set(MEMBER_SPORTS.map((item) => item.value));
    return parsed.filter((item): item is MemberSport => typeof item === "string" && allowed.has(item as MemberSport));
  } catch {
    return [];
  }
}

function rowToProfile(row: Row): MemberProfile {
  const split = splitDisplayName(row.emergency_name || "");
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    addressLine: row.address_line,
    city: row.city,
    postcode: row.postcode,
    country: row.country || "United Kingdom",
    emergencyFirstName: row.emergency_first_name || split.firstName,
    emergencyLastName: row.emergency_last_name || split.lastName,
    emergencyPhone: row.emergency_phone,
    emergencyEmail: row.emergency_email,
    medical: row.medical,
    dietary: row.dietary,
    ukbt: row.ukbt,
    vestSize: row.vest_size,
    shortsSize: row.shorts_size,
    sports: parseSports(row.sports),
    membershipExpiresOn: row.membership_expires_on ? String(row.membership_expires_on).slice(0, 10) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function defaultExpiry() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 2);
  return date.toISOString().slice(0, 10);
}

export const getMemberProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<MemberProfile> => {
    const { getSql } = await import("@/lib/db");
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const sql = await getSql();
    const session = await getSessionUser();
    const rows = await sql<Row>`
      select
        first_name, last_name, email, phone, address_line, city, postcode, country,
        emergency_name, emergency_first_name, emergency_last_name, emergency_phone, emergency_email,
        medical, dietary, ukbt, vest_size, shorts_size, sports,
        membership_expires_on::text, created_at::text, updated_at::text
      from member_profiles
      where user_id = ${context.userId}
      limit 1
    `;
    if (rows[0]) return rowToProfile(rows[0]);
    return emptyMemberProfile(session?.email ?? "");
  });

export const saveMemberProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(Input)
  .handler(async ({ context, data }): Promise<MemberProfile> => {
    if (data.emergencyEmail && !isEmail(data.emergencyEmail)) {
      throw new Error("That emergency email does not look right.");
    }
    const { getSql } = await import("@/lib/db");
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const { auditEvent, sessionRoster } = await import("@/lib/zero-trust.server");
    const sql = await getSql();
    const session = await getSessionUser();
    const actor = await sessionRoster();
    const email = session?.email ?? "";
    const sports = JSON.stringify(data.sports);
    const existing = await sql<{ membership_expires_on: string | null }>`
      select membership_expires_on::text from member_profiles where user_id = ${context.userId} limit 1
    `;
    const expires = existing[0]?.membership_expires_on?.slice(0, 10) || defaultExpiry();
    const emergencyName = [data.emergencyFirstName, data.emergencyLastName].filter(Boolean).join(" ");
    const rows = await sql<Row>`
      insert into member_profiles (
        user_id, first_name, last_name, email, phone, address_line, city, postcode, country,
        emergency_name, emergency_first_name, emergency_last_name, emergency_phone, emergency_email,
        medical, dietary, ukbt, vest_size, shorts_size, sports, membership_expires_on, updated_at
      ) values (
        ${context.userId},
        ${clip(data.firstName, 80)},
        ${clip(data.lastName, 80)},
        ${clip(email, 120)},
        ${clip(data.phone, 40)},
        ${clip(data.addressLine, 120)},
        ${clip(data.city, 80)},
        ${clip(data.postcode, 20)},
        ${clip(data.country, 80)},
        ${clip(emergencyName, 160)},
        ${clip(data.emergencyFirstName, 80)},
        ${clip(data.emergencyLastName, 80)},
        ${clip(data.emergencyPhone, 40)},
        ${clip(data.emergencyEmail, 120)},
        ${clip(data.medical, 1000)},
        ${clip(data.dietary, 1000)},
        ${clip(data.ukbt, 20)},
        ${data.vestSize},
        ${data.shortsSize},
        ${sports},
        ${expires},
        now()
      )
      on conflict (user_id) do update set
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        email = excluded.email,
        phone = excluded.phone,
        address_line = excluded.address_line,
        city = excluded.city,
        postcode = excluded.postcode,
        country = excluded.country,
        emergency_name = excluded.emergency_name,
        emergency_first_name = excluded.emergency_first_name,
        emergency_last_name = excluded.emergency_last_name,
        emergency_phone = excluded.emergency_phone,
        emergency_email = excluded.emergency_email,
        medical = excluded.medical,
        dietary = excluded.dietary,
        ukbt = excluded.ukbt,
        vest_size = excluded.vest_size,
        shorts_size = excluded.shorts_size,
        sports = excluded.sports,
        membership_expires_on = coalesce(member_profiles.membership_expires_on, excluded.membership_expires_on),
        updated_at = now()
      returning
        first_name, last_name, email, phone, address_line, city, postcode, country,
        emergency_name, emergency_first_name, emergency_last_name, emergency_phone, emergency_email,
        medical, dietary, ukbt, vest_size, shorts_size, sports,
        membership_expires_on::text, created_at::text, updated_at::text
    `;
    await auditEvent({ action: "member.profile.save", actor, outcome: "allow" });
    return rowToProfile(rows[0]);
  });

function bookingHref(kind: string, product: string): MemberBooking["href"] {
  if (kind === "clinic" || product === "coaching") return "/coaching";
  if (product === "performance") return "/community/club/performance";
  if (product === "lanzarote" || kind === "camp") return "/camp";
  return "/portal";
}

function toBooking(row: {
  id: string;
  kind: string;
  product: string;
  title: string;
  detail: string;
  status: string;
}): MemberBooking {
  const kind: MemberBookingKind = row.kind === "clinic" ? "clinic" : "camp";
  return {
    id: row.id,
    kind,
    product: row.product,
    title: row.title,
    detail: row.detail,
    status: row.status === "paid" ? "Paid" : row.status,
    href: bookingHref(kind, row.product),
  };
}

export async function recordPaidBooking(opts: {
  id?: string;
  userId?: string | null;
  email: string;
  kind: MemberBookingKind;
  product: string;
  packageId?: string;
  weeks?: string[];
  partySize?: number;
  payment?: "deposit" | "paid_in_full";
  amountCharged?: number;
  title: string;
  detail: string;
}) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const email = opts.email.trim().toLowerCase();
  const id = (opts.id || `${opts.product}-${email}-${(opts.weeks ?? []).join("-") || "open"}`).slice(0, 120);
  const payment = opts.payment === "paid_in_full" ? "paid_in_full" : "deposit";
  const amountCharged = Math.max(0, opts.amountCharged ?? 0);
  await sql`
    insert into member_bookings (
      id, user_id, email, kind, product, package_id, weeks, party_size, payment, amount_charged, title, detail, status
    ) values (
      ${id},
      ${opts.userId ?? null},
      ${email},
      ${opts.kind},
      ${opts.product},
      ${opts.packageId ?? ""},
      ${JSON.stringify(opts.weeks ?? [])},
      ${opts.partySize ?? 1},
      ${payment},
      ${amountCharged},
      ${opts.title.slice(0, 160)},
      ${opts.detail.slice(0, 240)},
      ${"paid"}
    )
    on conflict (id) do update set
      user_id = coalesce(excluded.user_id, member_bookings.user_id),
      package_id = excluded.package_id,
      payment = excluded.payment,
      amount_charged = excluded.amount_charged,
      title = excluded.title,
      detail = excluded.detail,
      status = ${"paid"}
  `;
}

export const getMemberBookings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<MemberBooking[]> => {
    const { getSql } = await import("@/lib/db");
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const { personByEmail } = await import("@/data/camp");
    const sql = await getSql();
    const session = await getSessionUser();
    const email = session?.email?.trim().toLowerCase() ?? "";
    if (email) {
      await sql`
        update member_bookings
        set user_id = ${context.userId}
        where user_id is null and lower(email) = ${email}
      `;
    }
    const rows = await sql<{
      id: string;
      kind: string;
      product: string;
      title: string;
      detail: string;
      status: string;
    }>`
      select id, kind, product, title, detail, status
      from member_bookings
      where user_id = ${context.userId} or (${email} <> '' and lower(email) = ${email})
      order by created_at desc
    `;
    const bookings = rows.map(toBooking);
    const person = email ? personByEmail(email) : null;
    if (person?.role === "player" && !bookings.some((item) => item.product === "lanzarote")) {
      const weeks = person.weeks.map((week) => `Week ${week}`).join(", ");
      bookings.unshift({
        id: `roster-lanzarote-${person.id}`,
        kind: "camp",
        product: "lanzarote",
        title: "Lanzarote Beach Volleyball 2027",
        detail: [weeks, person.stay === "camp-stay" ? "Camp and stay" : "Camp only"].filter(Boolean).join(" · "),
        status: "Booked",
        href: "/camp",
      });
    }
    return bookings;
  });
