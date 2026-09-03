import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  CAMP_NOW,
  coachForGroup,
  currentWeekId,
  groupOf,
  personById,
  type CampPerson,
} from "@/data/camp";
import { clip } from "@/lib/guard";

const Tag = z.enum(["injury", "illness", "other"]);

const NoteInput = z.object({
  fromEmail: z.string().trim().min(3).max(120),
  tag: Tag,
  body: z.string().trim().min(1).max(1000),
  week: z.number().int().min(1).max(3).optional(),
  groupId: z.enum(["a", "b", "c"]).nullable().optional(),
});

const ReplyInput = z.object({
  fromEmail: z.string().trim().min(3).max(120),
  messageId: z.string().trim().min(3).max(80),
  reply: z.string().trim().min(1).max(1000),
  fromId: z.string().trim().min(1).max(40).optional(),
  tag: Tag.optional(),
  body: z.string().trim().max(1000).optional(),
});

export type CampMailReceipt = {
  id: string;
  fromId: string;
  tag: "injury" | "illness" | "other";
  body: string;
  reply?: string;
  at: string;
  mailedTo: string[];
  mailStatus: "sent" | "logged";
};

const MARK = () => personById("mark");

function tagLabel(tag: "injury" | "illness" | "other") {
  if (tag === "injury") return "Injury";
  if (tag === "illness") return "Illness";
  return "Private note";
}

async function rosterPerson(fromEmail: string, roles?: CampPerson["role"][]) {
  const { requireRosterActor } = await import("@/lib/zero-trust.server");
  return requireRosterActor({ claimedEmail: fromEmail, roles });
}

function dedicatedCoach(player: CampPerson, week: number, groupId: string | null) {
  const gid = groupOf(player, week, groupId ? { [player.id]: groupId } : {}, {});
  return gid ? coachForGroup(gid, week) : null;
}

function names(people: CampPerson[]) {
  return people.map((person) => person.name.split(" ")[0]).join(" and ");
}

function uniquePeople(list: (CampPerson | null | undefined)[]) {
  const map = new Map<string, CampPerson>();
  for (const person of list) {
    if (!person?.email) continue;
    map.set(person.email.toLowerCase(), person);
  }
  return [...map.values()];
}

export const postCampNote = createServerFn({ method: "POST" })
  .validator(NoteInput)
  .handler(async ({ data }): Promise<CampMailReceipt> => {
    const sender = await rosterPerson(data.fromEmail, ["player"]);
    if (sender.role !== "player") throw new Error("Players send notes from here.");
    const body = clip(data.body, 1000);
    if (!body) throw new Error("Write a few words first.");

    const week = data.week ?? currentWeekId(CAMP_NOW, sender);
    const groupId = data.groupId ?? sender.groupId;
    const coach = dedicatedCoach(sender, week, groupId);
    const mark = MARK();
    const to = uniquePeople([coach]);
    const cc = uniquePeople([mark]).filter((person) => person.id !== to[0]?.id);
    if (!to.length && mark) to.push(mark);

    const id = `mail-${Date.now()}-${sender.id}`;
    const subject = `Lanzarote camp · ${tagLabel(data.tag)} · ${sender.name}`;
    const recipients = uniquePeople([...to, ...cc]);
    const text = [
      `Hi ${names(to)},`,
      "",
      `${sender.name} sent a private note from the player portal.`,
      "",
      tagLabel(data.tag),
      body,
      "",
      mark ? "Mark is copied on this." : "",
      "Reply in Coaches Corner so they get it there and by email.",
      "",
      `Player: ${sender.name} <${sender.email}>`,
    ]
      .filter(Boolean)
      .join("\n");

    const { getSql } = await import("@/lib/db");
    const { sendMail } = await import("@/lib/mail.server");
    const sql = await getSql();
    await sql`
      insert into camp_messages (id, from_id, tag, body, group_id, week)
      values (${id}, ${sender.id}, ${data.tag}, ${body}, ${groupId}, ${week})
    `;
    const mailed = await sendMail({
      to: to.map((person) => person.email),
      cc: cc.map((person) => person.email),
      replyTo: sender.email,
      subject,
      text,
    });
    await sql`
      insert into camp_mail_log (message_id, kind, recipients, subject, body, status)
      values (
        ${id},
        ${"note"},
        ${recipients.map((person) => person.email).join(", ")},
        ${subject},
        ${text},
        ${mailed.status}
      )
    `;

    return {
      id,
      fromId: sender.id,
      tag: data.tag,
      body,
      at: new Date().toISOString(),
      mailedTo: recipients.map((person) => person.name),
      mailStatus: mailed.status,
    };
  });

export const replyCampNote = createServerFn({ method: "POST" })
  .validator(ReplyInput)
  .handler(async ({ data }): Promise<CampMailReceipt> => {
    const staff = await rosterPerson(data.fromEmail, ["coach", "head"]);
    if (staff.role === "player") throw new Error("Players cannot reply here.");
    const reply = clip(data.reply, 1000);
    if (!reply) throw new Error("Write a reply first.");

    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      from_id: string;
      tag: "injury" | "illness" | "other";
      body: string;
      group_id: string | null;
      week: number | null;
      created_at: string;
    }>`select id, from_id, tag, body, group_id, week, created_at from camp_messages where id = ${data.messageId} limit 1`;
    let row = rows[0];
    if (!row && data.fromId && data.tag && data.body) {
      const playerSeed = personById(data.fromId);
      if (!playerSeed) throw new Error("That player is not on this camp.");
      const week = currentWeekId(CAMP_NOW, playerSeed);
      await sql`
        insert into camp_messages (id, from_id, tag, body, group_id, week)
        values (${data.messageId}, ${data.fromId}, ${data.tag}, ${data.body}, ${playerSeed.groupId}, ${week})
      `;
      row = {
        id: data.messageId,
        from_id: data.fromId,
        tag: data.tag,
        body: data.body,
        group_id: playerSeed.groupId,
        week,
        created_at: new Date().toISOString(),
      };
    }
    if (!row) throw new Error("That note is not here.");
    const player = personById(row.from_id);
    if (!player) throw new Error("That player is not on this camp.");

    const week = row.week ?? currentWeekId(CAMP_NOW, player);
    const coach = dedicatedCoach(player, week, row.group_id);
    const mark = MARK();
    const to = uniquePeople([player]);
    const cc = uniquePeople([mark, coach, staff]).filter((person) => person.id !== player.id);

    const subject = `Re: Lanzarote camp · ${tagLabel(row.tag)} · ${player.name}`;
    const text = [
      `Hi ${player.name.split(" ")[0]},`,
      "",
      `${staff.name} replied to your note.`,
      "",
      reply,
      "",
      mark ? "Mark is copied on this." : "",
      "",
      "Your original note:",
      row.body,
    ]
      .filter(Boolean)
      .join("\n");

    await sql`
      update camp_messages
      set reply = ${reply}, replied_by = ${staff.id}, replied_at = now()
      where id = ${data.messageId}
    `;
    const { sendMail } = await import("@/lib/mail.server");
    const mailed = await sendMail({
      to: to.map((person) => person.email),
      cc: cc.map((person) => person.email),
      replyTo: staff.email,
      subject,
      text,
    });
    await sql`
      insert into camp_mail_log (message_id, kind, recipients, subject, body, status)
      values (
        ${data.messageId},
        ${"reply"},
        ${[...to, ...cc].map((person) => person.email).join(", ")},
        ${subject},
        ${text},
        ${mailed.status}
      )
    `;

    return {
      id: row.id,
      fromId: row.from_id,
      tag: row.tag,
      body: row.body,
      reply,
      at: row.created_at,
      mailedTo: uniquePeople([...to, ...cc]).map((person) => person.name),
      mailStatus: mailed.status,
    };
  });

export const listCampMail = createServerFn({ method: "GET" }).handler(async () => {
  const { requireStaffActor, auditEvent } = await import("@/lib/zero-trust.server");
  const staff = await requireStaffActor();
  await auditEvent({ action: "camp.mail.list", actor: staff, outcome: "allow" });
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  return sql<{
    id: number;
    message_id: string;
    kind: string;
    recipients: string;
    subject: string;
    status: string;
    created_at: string;
  }>`select id, message_id, kind, recipients, subject, status, created_at from camp_mail_log order by created_at desc limit 40`;
});
