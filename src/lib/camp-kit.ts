import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { personByEmail, personById } from "@/data/camp";
import { KIT_COUNTRIES, KIT_SIZES, printNameOf, type KitChoice, type KitSize } from "@/data/kit";

const Size = z.enum(KIT_SIZES);
const Country = z.enum(KIT_COUNTRIES.map((item) => item.code) as [string, ...string[]]);

const KitInput = z.object({
  fromEmail: z.string().trim().min(3).max(120),
  top: Size,
  shorts: Size,
  printName: z.string().trim().min(1).max(14),
  country: Country,
});

async function rosterPerson(fromEmail: string) {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const session = await getSessionUser();
  const fromSession = session?.email ? personByEmail(session.email) : null;
  const person = fromSession ?? personByEmail(fromEmail);
  if (!person) throw new Error("That email is not on this camp.");
  return person;
}

function rowToKit(row: {
  person_id: string;
  top_size: string;
  shorts_size: string;
  print_name: string;
  country: string;
  updated_at: string;
}): KitChoice {
  return {
    personId: row.person_id,
    top: row.top_size as KitSize,
    shorts: row.shorts_size as KitSize,
    printName: row.print_name,
    country: row.country,
    updatedAt: row.updated_at,
  };
}

export const saveCampKit = createServerFn({ method: "POST" })
  .validator(KitInput)
  .handler(async ({ data }): Promise<KitChoice> => {
    const person = await rosterPerson(data.fromEmail);
    const printName = printNameOf(data.printName);
    if (!printName) throw new Error("Add the name that goes on the kit.");
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      insert into camp_kit (person_id, top_size, shorts_size, print_name, country, updated_at)
      values (${person.id}, ${data.top}, ${data.shorts}, ${printName}, ${data.country}, now())
      on conflict (person_id) do update set
        top_size = excluded.top_size,
        shorts_size = excluded.shorts_size,
        print_name = excluded.print_name,
        country = excluded.country,
        updated_at = now()
    `;
    return {
      personId: person.id,
      top: data.top,
      shorts: data.shorts,
      printName,
      country: data.country,
      updatedAt: new Date().toISOString(),
    };
  });

export const listCampKits = createServerFn({ method: "GET" }).handler(async () => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{
    person_id: string;
    top_size: string;
    shorts_size: string;
    print_name: string;
    country: string;
    updated_at: string;
  }>`select person_id, top_size, shorts_size, print_name, country, updated_at from camp_kit order by updated_at desc`;
  return rows
    .map(rowToKit)
    .filter((kit) => personById(kit.personId));
});
