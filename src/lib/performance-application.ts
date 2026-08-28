import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  ALL_LEVELS,
  ALL_TOPS,
  FORM_SPORTS,
  PERFORMANCE_GENDERS,
  PERFORMANCE_SIZES,
  defaultTopForSport,
  isIntlPhone,
  isLevelForSport,
  maleTopForSport,
  normalisePhone,
  partnerFirstNameLabel,
  partnerFullName,
  splitDisplayName,
  type FormSport,
  type PerformanceApplication,
  type PerformanceGender,
} from "@/data/performance";
import { isEmail } from "@/lib/guard";

const Gender = z.enum(PERFORMANCE_GENDERS.map((item) => item.value) as [string, ...string[]]);
const Level = z.enum(ALL_LEVELS.map((item) => item.value) as [string, ...string[]]);
const Size = z.enum(PERFORMANCE_SIZES.map((item) => item.value) as [string, ...string[]]);
const Top = z.enum(ALL_TOPS.map((item) => item.value) as [string, ...string[]]);
const Sport = z.enum(FORM_SPORTS.map((item) => item.value) as [string, ...string[]]);

const ApplicationInput = z
  .object({
    details: z.enum(["full", "group", "minimal"]),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().min(3).max(120),
    contactPhone: z.string().trim().max(24),
    sport: Sport,
    gender: Gender,
    level: Level,
    topStyle: Top,
    topSize: Size,
    hasPartner: z.boolean(),
    partnerFirstName: z.string().trim().max(80),
    partnerLastName: z.string().trim().max(80),
    emergencyFirstName: z.string().trim().max(80),
    emergencyLastName: z.string().trim().max(80),
    emergencyPhone: z.string().trim().max(24),
    message: z.string().trim().max(1500),
  })
  .superRefine((value, ctx) => {
    if (!isEmail(value.email)) {
      ctx.addIssue({ code: "custom", message: "That email does not look right.", path: ["email"] });
    }
    if (value.contactPhone && !isIntlPhone(value.contactPhone)) {
      ctx.addIssue({
        code: "custom",
        message: "Use an international number, e.g. +44...",
        path: ["contactPhone"],
      });
    }
    if (value.details === "minimal") return;
    if (!isLevelForSport(value.sport as FormSport, value.level)) {
      ctx.addIssue({ code: "custom", message: "Pick a level for that sport.", path: ["level"] });
    }
    if (value.details === "group") return;
    if (value.gender === "male" && value.topStyle !== maleTopForSport(value.sport as FormSport)) {
      ctx.addIssue({
        code: "custom",
        message: `Male players wear a ${maleTopForSport(value.sport as FormSport) === "vest" ? "vest" : "T-Shirt"}.`,
        path: ["topStyle"],
      });
    }
    if (value.hasPartner && (!value.partnerFirstName.trim() || !value.partnerLastName.trim())) {
      ctx.addIssue({
        code: "custom",
        message: `Add ${partnerFirstNameLabel(value.sport as FormSport)} and last name.`,
        path: ["partnerFirstName"],
      });
    }
    if (!value.emergencyFirstName.trim() || !value.emergencyLastName.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Emergency contact first and last name are required.",
        path: ["emergencyFirstName"],
      });
    }
    if (!isIntlPhone(value.emergencyPhone)) {
      ctx.addIssue({
        code: "custom",
        message: "Use an international number, e.g. +44...",
        path: ["emergencyPhone"],
      });
    }
  });

type ApplicationRow = {
  first_name: string;
  last_name: string;
  email: string;
  contact_phone: string;
  sport: string;
  gender: string;
  level: string;
  top_style: string;
  top_size: string;
  has_partner: boolean;
  partner_name: string;
  partner_first_name: string;
  partner_last_name: string;
  emergency_first_name: string;
  emergency_last_name: string;
  emergency_phone: string;
  message: string;
  submitted_at: string;
  updated_at: string;
};

function rowToApplication(row: ApplicationRow): PerformanceApplication {
  const sport = (FORM_SPORTS.some((item) => item.value === row.sport) ? row.sport : "beach") as FormSport;
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    contactPhone: row.contact_phone ?? "",
    sport,
    gender: row.gender as PerformanceApplication["gender"],
    level: row.level as PerformanceApplication["level"],
    topStyle: row.top_style as PerformanceApplication["topStyle"],
    topSize: row.top_size as PerformanceApplication["topSize"],
    hasPartner: Boolean(row.has_partner),
    partnerFirstName: row.partner_first_name || splitDisplayName(row.partner_name).firstName,
    partnerLastName: row.partner_last_name || splitDisplayName(row.partner_name).lastName,
    emergencyFirstName: row.emergency_first_name,
    emergencyLastName: row.emergency_last_name,
    emergencyPhone: row.emergency_phone,
    message: row.message,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
  };
}

export const getPerformanceApplication = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<PerformanceApplication | null> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<ApplicationRow>`
      select
        first_name, last_name, email, contact_phone, sport, gender, level, top_style, top_size,
        has_partner, partner_name, partner_first_name, partner_last_name,
        emergency_first_name, emergency_last_name,
        emergency_phone, message, submitted_at, updated_at
      from performance_applications
      where user_id = ${context.userId}
      limit 1
    `;
    return rows[0] ? rowToApplication(rows[0]) : null;
  });

export const savePerformanceApplication = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(ApplicationInput)
  .handler(async ({ context, data }): Promise<PerformanceApplication> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const partnerFirstName = data.hasPartner ? data.partnerFirstName.trim() : "";
    const partnerLastName = data.hasPartner ? data.partnerLastName.trim() : "";
    const partnerName = partnerFullName(partnerFirstName, partnerLastName);
    const emergencyPhone = data.emergencyPhone ? normalisePhone(data.emergencyPhone) : "";
    const contactPhone = data.contactPhone ? normalisePhone(data.contactPhone) : "";
    const sport = data.sport as FormSport;
    const gender = data.gender as PerformanceGender;
    const topStyle =
      data.details === "minimal" || data.details === "group"
        ? defaultTopForSport(sport, gender)
        : gender === "male"
          ? maleTopForSport(sport)
          : data.topStyle;
    const rows = await sql<ApplicationRow>`
      insert into performance_applications (
        user_id, first_name, last_name, email, contact_phone, sport, gender, level, top_style, top_size,
        has_partner, partner_name, partner_first_name, partner_last_name,
        emergency_first_name, emergency_last_name,
        emergency_phone, message, submitted_at, updated_at
      )
      values (
        ${context.userId}, ${data.firstName}, ${data.lastName}, ${data.email}, ${contactPhone},
        ${data.sport}, ${data.gender}, ${data.level}, ${topStyle}, ${data.topSize},
        ${data.hasPartner}, ${partnerName}, ${partnerFirstName}, ${partnerLastName},
        ${data.emergencyFirstName}, ${data.emergencyLastName}, ${emergencyPhone}, ${data.message}, now(), now()
      )
      on conflict (user_id) do update set
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        email = excluded.email,
        contact_phone = excluded.contact_phone,
        sport = excluded.sport,
        gender = excluded.gender,
        level = excluded.level,
        top_style = excluded.top_style,
        top_size = excluded.top_size,
        has_partner = excluded.has_partner,
        partner_name = excluded.partner_name,
        partner_first_name = excluded.partner_first_name,
        partner_last_name = excluded.partner_last_name,
        emergency_first_name = excluded.emergency_first_name,
        emergency_last_name = excluded.emergency_last_name,
        emergency_phone = excluded.emergency_phone,
        message = excluded.message,
        updated_at = now()
      returning
        first_name, last_name, email, contact_phone, sport, gender, level, top_style, top_size,
        has_partner, partner_name, partner_first_name, partner_last_name,
        emergency_first_name, emergency_last_name,
        emergency_phone, message, submitted_at, updated_at
    `;
    const saved = rows[0];
    if (!saved) throw new Error("That application did not save.");
    return rowToApplication(saved);
  });
