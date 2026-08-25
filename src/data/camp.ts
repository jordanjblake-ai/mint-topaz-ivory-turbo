export const CAMP_NOW = new Date("2027-02-08T08:10:00Z");
export const CAMP_START = new Date("2027-01-31T10:00:00Z");

export type CampRole = "player" | "coach" | "head";
export type CampAudience = "all" | "arrivals" | "departures" | "staying" | "staff-arrive";

export type CampPerson = {
  id: string;
  name: string;
  email: string;
  role: CampRole;
  groupId: string | null;
  weeks: number[];
  level?: string;
  solo?: boolean;
  stay?: "camp" | "camp-stay";
  image?: string;
  leadsGroup?: string;
};

export type CampGroup = {
  id: string;
  name: string;
  coachId: string;
  level: string;
};

export type CampEventKind =
  | "session"
  | "yoga"
  | "social"
  | "meal"
  | "tournament"
  | "break"
  | "arrival"
  | "recovery"
  | "free";

export type CampEvent = {
  id: string;
  start: string;
  end: string;
  title: string;
  place: string;
  kind: CampEventKind;
  groups: string[] | "all";
  coaches: string[];
  detail: string;
  staffNote?: string;
  duty?: string;
  week: number;
  audience?: CampAudience;
};

export type BoardSlot = {
  start: string;
  end: string;
  title: string;
  kind: CampEventKind;
  note?: string;
  allDay?: boolean;
};

export const CAMP_WEEKS = [
  { id: 1, sunday: "2027-01-31", label: "Week 1", range: "31 Jan – 7 Feb" },
  { id: 2, sunday: "2027-02-07", label: "Week 2", range: "7 – 14 Feb" },
  { id: 3, sunday: "2027-02-14", label: "Week 3", range: "14 – 21 Feb" },
];

export const CAMP_META = {
  name: "Lanzarote camp",
  venue: "Playa Grande, Puerto del Carmen",
  stay: "Moraña Apartments",
  hotelUrl: "https://www.lamoranalanzarote.com/",
  courtsUrl:
    "https://www.google.com/maps/search/?api=1&query=Playa+Grande%2C+Avenida+de+Las+Playas%2C+Puerto+del+Carmen%2C+Lanzarote",
  dates: "30 Jan to 21 Feb 2027",
  start: "2027-01-30",
  end: "2027-02-21",
};

export const GROUPS: CampGroup[] = [
  { id: "a", name: "Group A", coachId: "martha", level: "Improver to intermediate" },
  { id: "b", name: "Group B", coachId: "issa", level: "Intermediate" },
  { id: "c", name: "Group C", coachId: "dave", level: "Advanced" },
];

/** Dave is off Week 1. Mark takes Group C that week. */
export const GROUP_LEAD: Record<number, Record<string, string>> = {
  1: { a: "martha", b: "issa", c: "mark" },
  2: { a: "martha", b: "issa", c: "dave" },
  3: { a: "martha", b: "issa", c: "dave" },
};

export const PEOPLE: CampPerson[] = [
  { id: "mark", name: "Mark Garcia-Kidd", email: "mark@hybridvacations.com", role: "head", groupId: null, weeks: [1, 2, 3], image: "/images/coach-mark.jpg" },
  { id: "martha", name: "Martha Bullen", email: "martha@hybridvacations.com", role: "coach", groupId: "a", leadsGroup: "a", weeks: [1, 2, 3], image: "/images/coach-martha.jpg" },
  { id: "issa", name: "Issa Batrane", email: "issa@hybridvacations.com", role: "coach", groupId: "b", leadsGroup: "b", weeks: [1, 2, 3], image: "/images/coach-issa.jpg" },
  { id: "dave", name: "Dave Panah", email: "dave@hybridvacations.com", role: "coach", groupId: "c", leadsGroup: "c", weeks: [2, 3], image: "/images/coach-dave.jpg" },
  { id: "katya", name: "Katya Kate", email: "katya@hybridvacations.com", role: "coach", groupId: null, weeks: [1, 2, 3], image: "/images/coach-katya.jpg" },

  { id: "jonny", name: "Jonny Hale", email: "jonnyhale@gmail.com", role: "player", groupId: "a", weeks: [1, 2], level: "Club", solo: false, stay: "camp-stay" },
  { id: "ella", name: "Ella Hale", email: "ella.hale@gmail.com", role: "player", groupId: "a", weeks: [1, 2], level: "Club", solo: false, stay: "camp-stay" },
  { id: "priya", name: "Priya Nair", email: "priya.nair@gmail.com", role: "player", groupId: "a", weeks: [1, 2, 3], level: "Improver", solo: true, stay: "camp-stay" },
  { id: "rosa", name: "Rosa Bennett", email: "rosa.bennett@icloud.com", role: "player", groupId: "a", weeks: [1, 2], level: "Club", solo: false, stay: "camp-stay" },
  { id: "ivy", name: "Ivy Shaw", email: "ivy.shaw@gmail.com", role: "player", groupId: "a", weeks: [1], level: "Improver", solo: true, stay: "camp" },
  { id: "noah", name: "Noah Grant", email: "noah.grant@outlook.com", role: "player", groupId: "a", weeks: [1], level: "Club", solo: true, stay: "camp" },
  { id: "hannah", name: "Hannah Briggs", email: "hannah.briggs@gmail.com", role: "player", groupId: "a", weeks: [2], level: "Improver", solo: true, stay: "camp" },
  { id: "sam", name: "Sam Yates", email: "sam.yates@gmail.com", role: "player", groupId: "a", weeks: [2], level: "Improver", solo: true, stay: "camp" },
  { id: "beth", name: "Beth Quinn", email: "beth.quinn@gmail.com", role: "player", groupId: "a", weeks: [3], level: "Club", solo: true, stay: "camp" },
  { id: "omar", name: "Omar Said", email: "omar.said@gmail.com", role: "player", groupId: "a", weeks: [3], level: "Improver", solo: false, stay: "camp-stay" },
  { id: "leo", name: "Leo Hart", email: "leo.hart@gmail.com", role: "player", groupId: "a", weeks: [3], level: "Club", solo: true, stay: "camp" },
  { id: "maya", name: "Maya Singh", email: "maya.singh@gmail.com", role: "player", groupId: "a", weeks: [3], level: "Improver", solo: true, stay: "camp-stay" },
  { id: "finn", name: "Finn Walsh", email: "finn.walsh@icloud.com", role: "player", groupId: "a", weeks: [3], level: "Club", solo: false, stay: "camp" },

  { id: "amy", name: "Amy Brooks", email: "amy.brooks@gmail.com", role: "player", groupId: "b", weeks: [1], level: "Intermediate", solo: true, stay: "camp" },
  { id: "chris", name: "Chris Lang", email: "chris.lang@gmail.com", role: "player", groupId: "b", weeks: [1], level: "Intermediate", solo: false, stay: "camp-stay" },
  { id: "rory", name: "Rory Bell", email: "rory.bell@outlook.com", role: "player", groupId: "b", weeks: [1], level: "Intermediate", solo: true, stay: "camp" },
  { id: "isabel", name: "Isabel Cruz", email: "isabel.cruz@gmail.com", role: "player", groupId: "b", weeks: [1], level: "Intermediate", solo: true, stay: "camp-stay" },
  { id: "nate", name: "Nate Young", email: "nate.young@gmail.com", role: "player", groupId: "b", weeks: [1], level: "Intermediate", solo: false, stay: "camp" },
  { id: "gwen", name: "Gwen Park", email: "gwen.park@icloud.com", role: "player", groupId: "b", weeks: [1], level: "Intermediate", solo: true, stay: "camp" },
  { id: "tom", name: "Tom Ridley", email: "tom.ridley@icloud.com", role: "player", groupId: "b", weeks: [2, 3], level: "UKBT intermediate", solo: true, stay: "camp" },
  { id: "megan", name: "Megan Shaw", email: "meg.shaw@gmail.com", role: "player", groupId: "b", weeks: [2], level: "Intermediate", solo: true, stay: "camp" },
  { id: "luke", name: "Luke Martin", email: "luke.m.volleyball@gmail.com", role: "player", groupId: "b", weeks: [2, 3], level: "Intermediate", solo: false, stay: "camp-stay" },
  { id: "owen", name: "Owen Blake", email: "owen.blake@hotmail.com", role: "player", groupId: "b", weeks: [2], level: "Intermediate", solo: true, stay: "camp" },
  { id: "nina", name: "Nina Cole", email: "nina.cole@gmail.com", role: "player", groupId: "b", weeks: [2], level: "Intermediate", solo: false, stay: "camp-stay" },
  { id: "jack", name: "Jack Ferris", email: "jack.ferris@outlook.com", role: "player", groupId: "b", weeks: [2], level: "Intermediate", solo: true, stay: "camp" },
  { id: "holly", name: "Holly Dean", email: "holly.dean@gmail.com", role: "player", groupId: "b", weeks: [3], level: "Intermediate", solo: true, stay: "camp" },
  { id: "ben", name: "Ben Alvarez", email: "ben.alvarez@gmail.com", role: "player", groupId: "b", weeks: [3], level: "Intermediate", solo: false, stay: "camp-stay" },
  { id: "saskia", name: "Saskia Holm", email: "saskia.holm@gmail.com", role: "player", groupId: "b", weeks: [3], level: "Intermediate", solo: true, stay: "camp" },
  { id: "rafa", name: "Rafa Costa", email: "rafa.costa@gmail.com", role: "player", groupId: "b", weeks: [3], level: "Intermediate", solo: true, stay: "camp" },

  { id: "clara", name: "Clara Meier", email: "clara.meier@bluewin.ch", role: "player", groupId: "c", weeks: [1, 2, 3], level: "Advanced", solo: false, stay: "camp-stay" },
  { id: "marcus", name: "Marcus Hale", email: "marcus.hale@gmail.com", role: "player", groupId: "c", weeks: [1], level: "Advanced", solo: true, stay: "camp" },
  { id: "stef", name: "Stef Bauer", email: "stef.bauer@gmail.com", role: "player", groupId: "c", weeks: [1], level: "Advanced", solo: false, stay: "camp-stay" },
  { id: "yara", name: "Yara Nasser", email: "yara.nasser@gmail.com", role: "player", groupId: "c", weeks: [1], level: "Advanced", solo: true, stay: "camp" },
  { id: "pete", name: "Pete Nolan", email: "pete.nolan@outlook.com", role: "player", groupId: "c", weeks: [1], level: "Advanced", solo: true, stay: "camp" },
  { id: "noor", name: "Noor Rahman", email: "noor.rahman@gmail.com", role: "player", groupId: "c", weeks: [1], level: "Advanced", solo: true, stay: "camp-stay" },
  { id: "daniel", name: "Daniel Frost", email: "danfrost@icloud.com", role: "player", groupId: "c", weeks: [2], level: "Advanced", solo: false, stay: "camp" },
  { id: "callum", name: "Callum Reid", email: "callumreid@hotmail.com", role: "player", groupId: "c", weeks: [2], level: "Advanced", solo: false, stay: "camp" },
  { id: "theo", name: "Theo March", email: "theo.march@gmail.com", role: "player", groupId: "c", weeks: [2], level: "Advanced", solo: true, stay: "camp" },
  { id: "ines", name: "Ines Costa", email: "ines.costa@gmail.com", role: "player", groupId: "c", weeks: [2], level: "Advanced", solo: true, stay: "camp-stay" },
  { id: "will", name: "Will Chen", email: "will.chen@gmail.com", role: "player", groupId: "c", weeks: [2, 3], level: "Advanced", solo: true, stay: "camp" },
  { id: "anika", name: "Anika Bose", email: "anika.bose@gmail.com", role: "player", groupId: "c", weeks: [3], level: "Advanced", solo: true, stay: "camp" },
  { id: "lena", name: "Lena Vogt", email: "lena.vogt@gmail.com", role: "player", groupId: "c", weeks: [3], level: "Advanced", solo: false, stay: "camp-stay" },
  { id: "hugh", name: "Hugh Patel", email: "hugh.patel@gmail.com", role: "player", groupId: "c", weeks: [3], level: "Advanced", solo: true, stay: "camp" },
  { id: "jose", name: "Jose Marin", email: "jose.marin@gmail.com", role: "player", groupId: "c", weeks: [3], level: "Advanced", solo: true, stay: "camp" },
];

export type WeatherDay = {
  date: string;
  high: number;
  low: number;
  wind: number;
  uv: number;
  sky: string;
};

export const WEATHER: WeatherDay[] = [
  { date: "2027-01-30", high: 21, low: 16, wind: 20, uv: 6, sky: "Clear" },
  { date: "2027-01-31", high: 21, low: 16, wind: 22, uv: 6, sky: "Clear" },
  { date: "2027-02-01", high: 22, low: 16, wind: 24, uv: 6, sky: "Sunny" },
  { date: "2027-02-02", high: 21, low: 15, wind: 28, uv: 6, sky: "Wind" },
  { date: "2027-02-03", high: 20, low: 15, wind: 26, uv: 6, sky: "Light cloud" },
  { date: "2027-02-04", high: 22, low: 16, wind: 18, uv: 7, sky: "Clear" },
  { date: "2027-02-05", high: 22, low: 16, wind: 20, uv: 7, sky: "Sunny" },
  { date: "2027-02-06", high: 21, low: 16, wind: 22, uv: 7, sky: "Clear" },
  { date: "2027-02-07", high: 21, low: 16, wind: 20, uv: 7, sky: "Sunny" },
  { date: "2027-02-08", high: 22, low: 16, wind: 18, uv: 7, sky: "Clear" },
  { date: "2027-02-09", high: 22, low: 17, wind: 16, uv: 7, sky: "Sunny" },
  { date: "2027-02-10", high: 21, low: 16, wind: 24, uv: 7, sky: "Wind" },
  { date: "2027-02-11", high: 20, low: 15, wind: 26, uv: 6, sky: "Light cloud" },
  { date: "2027-02-12", high: 21, low: 16, wind: 22, uv: 7, sky: "Clear" },
  { date: "2027-02-13", high: 22, low: 16, wind: 18, uv: 7, sky: "Sunny" },
  { date: "2027-02-14", high: 22, low: 16, wind: 20, uv: 7, sky: "Clear" },
  { date: "2027-02-15", high: 23, low: 17, wind: 16, uv: 8, sky: "Sunny" },
  { date: "2027-02-16", high: 22, low: 16, wind: 22, uv: 7, sky: "Clear" },
  { date: "2027-02-17", high: 21, low: 16, wind: 28, uv: 7, sky: "Wind" },
  { date: "2027-02-18", high: 20, low: 15, wind: 24, uv: 6, sky: "Light cloud" },
  { date: "2027-02-19", high: 22, low: 16, wind: 18, uv: 7, sky: "Sunny" },
  { date: "2027-02-20", high: 22, low: 16, wind: 20, uv: 7, sky: "Clear" },
  { date: "2027-02-21", high: 21, low: 16, wind: 22, uv: 7, sky: "Sunny" },
];

function addDays(ymd: string, days: number) {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DAYS = CAMP_WEEKS.flatMap((week) => {
  const startOffset = week.id === 1 ? -1 : 0;
  const count = week.id === 1 ? 9 : 8;
  return Array.from({ length: count }, (_, i) => {
    const offset = startOffset + i;
    const date = addDays(week.sunday, offset);
    const day = new Date(`${date}T00:00:00Z`).getUTCDay();
    const tags: Record<number, string> = {
      [-1]: "Setup",
      0: "Arrival",
      1: "Day 1",
      2: "Day 2",
      3: "Rest day",
      4: "Day 4",
      5: "Day 5",
      6: "Free day",
      7: week.id === 3 ? "Departure" : "Handover",
    };
    return {
      date,
      label: `${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day]} ${Number(date.slice(8, 10))} ${date.startsWith("2027-01") ? "Jan" : "Feb"}`,
      tag: tags[offset] ?? "Camp",
      dow: DOW[day],
      week: week.id,
    };
  });
}).filter((day, index, all) => all.findIndex((item) => item.date === day.date) === index);

export const BOARD_SLOTS: { offset: number; slots: BoardSlot[] }[] = [
  {
    offset: 0,
    slots: [
      {
        start: "10:00",
        end: "18:00",
        title: "Arrival",
        kind: "arrival",
        allDay: true,
        note: "Come down to the beach when you land. Courts are open. Meet the group.",
      },
    ],
  },
  {
    offset: 1,
    slots: [
      { start: "08:45", end: "09:30", title: "Welcome and registration", kind: "social" },
      { start: "09:45", end: "11:15", title: "Session 1", kind: "session" },
      { start: "11:15", end: "14:45", title: "Lunch and free play", kind: "free" },
      { start: "14:45", end: "16:15", title: "Session 2", kind: "session" },
      { start: "16:30", end: "18:00", title: "Scramble tournament", kind: "tournament" },
    ],
  },
  {
    offset: 2,
    slots: [
      { start: "09:00", end: "11:30", title: "Session 3", kind: "session" },
      { start: "11:30", end: "15:30", title: "Lunch and free play", kind: "free" },
      { start: "15:30", end: "17:30", title: "Session 4", kind: "session" },
      { start: "17:30", end: "18:15", title: "Sunset stretch", kind: "recovery" },
      { start: "20:00", end: "22:00", title: "Camp dinner", kind: "meal" },
    ],
  },
  {
    offset: 3,
    slots: [
      { start: "09:00", end: "09:45", title: "Morning yoga", kind: "yoga" },
      { start: "10:00", end: "12:00", title: "Session 5", kind: "session" },
      { start: "12:00", end: "15:30", title: "Afternoon off", kind: "free", note: "Island or beach. No session." },
      { start: "15:30", end: "18:00", title: "Optional excursion", kind: "social" },
    ],
  },
  {
    offset: 4,
    slots: [
      { start: "09:30", end: "11:30", title: "Session 6", kind: "session" },
      { start: "11:30", end: "15:30", title: "Lunch and free play", kind: "free" },
      { start: "15:30", end: "17:30", title: "Session 7", kind: "session" },
      { start: "17:30", end: "18:15", title: "Sunset stretch", kind: "recovery" },
    ],
  },
  {
    offset: 5,
    slots: [
      { start: "09:30", end: "11:30", title: "Session 8", kind: "session" },
      { start: "11:30", end: "14:30", title: "Lunch and free play", kind: "free" },
      { start: "14:30", end: "16:30", title: "Session 9", kind: "session" },
      { start: "16:45", end: "18:00", title: "Camp tournament", kind: "tournament" },
      { start: "20:00", end: "23:00", title: "Awards and party", kind: "meal" },
    ],
  },
  {
    offset: 6,
    slots: [
      {
        start: "09:00",
        end: "17:00",
        title: "Free day",
        kind: "free",
        allDay: true,
        note: "Courts open. Island if you want it. Saturday is also a departure day.",
      },
      { start: "09:00", end: "17:00", title: "Optional local tournament", kind: "tournament" },
    ],
  },
];

export function weekBoard(weekId: number) {
  const week = CAMP_WEEKS.find((item) => item.id === weekId);
  if (!week) return [];
  return BOARD_SLOTS.map((day) => ({
    date: addDays(week.sunday, day.offset),
    slots: day.slots,
  }));
}

export const WEEK_BOARD = weekBoard(2);

function iso(date: string, time: string) {
  return `${date}T${time}:00Z`;
}

function event(row: Omit<CampEvent, "id"> & { id?: string }): CampEvent {
  const start = row.start.replace(/[-:]/g, "");
  const slug = row.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return { ...row, id: row.id ?? `ev-${start}-${slug}` };
}

function staffFor(weekId: number) {
  const leads = Object.values(GROUP_LEAD[weekId]);
  return Array.from(new Set(["mark", ...leads, "katya"]));
}

function eventsForWeek(weekId: number): CampEvent[] {
  const sunday = CAMP_WEEKS.find((item) => item.id === weekId)!.sunday;
  const d = (offset: number) => addDays(sunday, offset);
  const staff = staffFor(weekId);
  const cCoach = GROUP_LEAD[weekId].c;
  const hitCoach = weekId === 1 ? "issa" : "dave";
  const rows: CampEvent[] = [];

  const session = (offset: number, start: string, end: string, n: number, detail: string) => {
    GROUPS.forEach((group) => {
      const lead = GROUP_LEAD[weekId][group.id];
      rows.push(
        event({
          start: iso(d(offset), start),
          end: iso(d(offset), end),
          title: `Session ${n} · ${group.name}`,
          place: "Playa Grande",
          kind: "session",
          groups: [group.id],
          coaches: lead === "mark" ? ["mark"] : [lead, "mark"],
          detail,
          week: weekId,
        }),
      );
    });
  };

  const brk = (offset: number, start: string, end: string, coaches: string[], detail: string) => {
    rows.push(
      event({
        start: iso(d(offset), start),
        end: iso(d(offset), end),
        title: "Break",
        place: "Off court",
        kind: "break",
        groups: [],
        coaches,
        detail,
        duty: "Break",
        week: weekId,
      }),
    );
  };

  rows.push(
    event({
      start: iso(d(-1), "09:00"),
      end: iso(d(-1), "13:00"),
      title: "Court setup",
      place: "Playa Grande",
      kind: "social",
      groups: [],
      coaches: staff,
      detail: "Nets, lines, balls. Courts ready before anyone lands.",
      duty: "Court setup",
      week: weekId,
      audience: "staff-arrive",
    }),
  );
  brk(-1, "13:00", "14:00", staff, "Short break. Back on the sand for early arrivals.");
  rows.push(
    event({
      start: iso(d(-1), "14:00"),
      end: iso(d(-1), "18:00"),
      title: "Welcome arriving players",
      place: "Playa Grande",
      kind: "social",
      groups: [],
      coaches: staff,
      detail: "Some land Saturday. Meet them, point them at Moraña, keep the courts open.",
      duty: "Welcome",
      week: weekId,
      audience: "staff-arrive",
    }),
  );

  rows.push(
    event({
      start: iso(d(0), "10:00"),
      end: iso(d(0), "18:00"),
      title: "Arrival and free play",
      place: "Playa Grande",
      kind: "arrival",
      groups: "all",
      coaches: staff,
      detail: "Come down once you have dropped bags. Courts are open. Meet the group. No session.",
      week: weekId,
      audience: "arrivals",
    }),
    event({
      start: iso(d(0), "10:00"),
      end: iso(d(0), "18:00"),
      title: "Stay on",
      place: "Playa Grande",
      kind: "free",
      groups: "all",
      coaches: staff,
      detail: "You are already here. New arrivals today. Courts stay open.",
      week: weekId,
      audience: "staying",
    }),
  );

  rows.push(
    event({
      start: iso(d(1), "08:45"),
      end: iso(d(1), "09:30"),
      title: "Welcome and registration",
      place: "Playa Grande",
      kind: "social",
      groups: "all",
      coaches: staff,
      detail: "Start of the week. Groups are confirmed if they were still open. Then you are with your coach.",
      staffNote: "Mark hosts welcome and registration. You are on the desk. Lock any group that is still open.",
      duty: "Welcome",
      week: weekId,
      audience: "arrivals",
    }),
  );
  session(1, "09:45", "11:15", 1, "First look. Serving, sideout, how the group moves.");
  rows.push(
    event({
      start: iso(d(1), "11:15"),
      end: iso(d(1), "14:45"),
      title: "Lunch and free play",
      place: "Playa Grande",
      kind: "free",
      groups: "all",
      coaches: [],
      detail: "Eat. Then the courts are open if you want touches. Not a session.",
      week: weekId,
    }),
  );
  brk(1, "11:15", "14:45", staff, "Long break. Back for session 2.");
  session(1, "14:45", "16:15", 2, "Defence and first match play in groups.");
  rows.push(
    event({
      start: iso(d(1), "16:30"),
      end: iso(d(1), "18:00"),
      title: "Scramble tournament",
      place: "Playa Grande",
      kind: "tournament",
      groups: "all",
      coaches: ["issa", "katya", "mark"].filter((id) => staff.includes(id)),
      detail: "Mixed, social, still a game.",
      staffNote: "Issa runs the scramble. Katya on support.",
      duty: "Scramble tournament",
      week: weekId,
    }),
  );
  brk(1, "16:30", "18:00", ["martha", cCoach].filter((id, i, arr) => arr.indexOf(id) === i && id !== "mark"), "Scramble is covered. You are off.");

  session(2, "09:00", "11:30", 3, "Sideout under pressure. Same coach as yesterday.");
  rows.push(
    event({
      start: iso(d(2), "11:30"),
      end: iso(d(2), "15:30"),
      title: "Lunch and free play",
      place: "Playa Grande",
      kind: "free",
      groups: "all",
      coaches: [],
      detail: "Heat window. Eat, swim, rest. Courts stay open.",
      week: weekId,
    }),
  );
  brk(2, "11:30", "15:30", staff, "Break. Session 4 is 15:30.");
  session(2, "15:30", "17:30", 4, "Serving plus live games inside your group.");
  rows.push(
    event({
      start: iso(d(2), "17:30"),
      end: iso(d(2), "18:15"),
      title: "Sunset stretch",
      place: "Playa Grande",
      kind: "recovery",
      groups: "all",
      coaches: ["mark"],
      detail: "Short, on the sand. Optional if you are cooked.",
      staffNote: "Mark leads sunset stretch.",
      duty: "Sunset stretch",
      week: weekId,
    }),
    event({
      start: iso(d(2), "20:00"),
      end: iso(d(2), "22:00"),
      title: "Camp dinner",
      place: "Puerto del Carmen",
      kind: "meal",
      groups: "all",
      coaches: ["mark", "martha"],
      detail: "The sit-down night. Come along if you can.",
      staffNote: "Martha hosts dinner. Mark is in the room. Other coaches are off unless they choose to join.",
      duty: "Camp dinner",
      week: weekId,
    }),
  );
  brk(2, "20:00", "22:00", staff.filter((id) => id !== "mark" && id !== "martha"), "Dinner is covered. Take the night.");

  rows.push(
    event({
      start: iso(d(3), "09:00"),
      end: iso(d(3), "09:45"),
      title: "Morning yoga",
      place: "Playa Grande",
      kind: "yoga",
      groups: "all",
      coaches: ["katya"],
      detail: "Optional. Hips and shoulders before the shorter session.",
      staffNote: "Katya leads morning yoga.",
      duty: "Morning yoga",
      week: weekId,
    }),
  );
  session(3, "10:00", "12:00", 5, "Lighter technical. Wednesday on purpose.");
  rows.push(
    event({
      start: iso(d(3), "12:00"),
      end: iso(d(3), "15:30"),
      title: "Afternoon off",
      place: "Lanzarote",
      kind: "free",
      groups: "all",
      coaches: [],
      detail: "Rest day. Explore the island or stay on the beach. No session.",
      week: weekId,
    }),
  );
  brk(3, "12:00", "15:30", staff, "Rest afternoon. Excursion is optional.");
  rows.push(
    event({
      start: iso(d(3), "15:30"),
      end: iso(d(3), "18:00"),
      title: "Optional excursion",
      place: "Lanzarote",
      kind: "social",
      groups: "all",
      coaches: ["mark"],
      detail: "Volcano or coast if it is on. Optional.",
      staffNote: "Mark is the point of contact. Other coaches are off.",
      duty: "Excursion",
      week: weekId,
    }),
  );
  brk(3, "15:30", "18:00", staff.filter((id) => id !== "mark"), "You are off unless you choose to join.");

  session(4, "09:30", "11:30", 6, "Sharp morning. Same coach.");
  rows.push(
    event({
      start: iso(d(4), "11:30"),
      end: iso(d(4), "15:30"),
      title: "Lunch and free play",
      place: "Playa Grande",
      kind: "free",
      groups: "all",
      coaches: [],
      detail: "Eat. Courts open. Back at 15:30.",
      week: weekId,
    }),
  );
  brk(4, "11:30", "15:30", staff, "Break.");
  session(4, "15:30", "17:30", 7, "Match play. Winner stays on, still inside the group.");
  rows.push(
    event({
      start: iso(d(4), "17:30"),
      end: iso(d(4), "18:15"),
      title: "Sunset stretch",
      place: "Playa Grande",
      kind: "recovery",
      groups: "all",
      coaches: ["mark"],
      detail: "Ten to twenty minutes, then you are free. Optional if you are cooked.",
      staffNote: "Mark leads sunset stretch.",
      duty: "Sunset stretch",
      week: weekId,
    }),
  );

  session(5, "09:30", "11:30", 8, "Last morning session. Take into it what you actually use.");
  rows.push(
    event({
      start: iso(d(5), "11:30"),
      end: iso(d(5), "14:30"),
      title: "Lunch and free play",
      place: "Playa Grande",
      kind: "free",
      groups: "all",
      coaches: [],
      detail: "Shorter break. Session 9 is 14:30.",
      week: weekId,
    }),
  );
  brk(5, "11:30", "14:30", staff, "Break before session 9.");
  session(5, "14:30", "16:30", 9, "Last numbered session. Then the camp tournament.");
  rows.push(
    event({
      start: iso(d(5), "16:45"),
      end: iso(d(5), "18:00"),
      title: "Camp tournament",
      place: "Playa Grande",
      kind: "tournament",
      groups: "all",
      coaches: ["issa", "katya"],
      detail: "The camp one. Mixed.",
      staffNote: "Issa runs the tournament. Katya on support and scoring.",
      duty: "Camp tournament",
      week: weekId,
    }),
  );
  brk(5, "16:45", "18:00", staff.filter((id) => id !== "issa" && id !== "katya"), "Tournament is Issa and Katya. You are off until the party.");
  rows.push(
    event({
      start: iso(d(5), "20:00"),
      end: iso(d(5), "23:00"),
      title: "Awards and party",
      place: "Puerto del Carmen",
      kind: "meal",
      groups: "all",
      coaches: staff,
      detail: "End of this camp week. Come along.",
      staffNote: "All coaches are on. Mark hosts.",
      duty: "Awards and party",
      week: weekId,
    }),
  );

  rows.push(
    event({
      start: iso(d(6), "09:00"),
      end: iso(d(6), "17:00"),
      title: "Free day",
      place: "Playa Grande",
      kind: "free",
      groups: "all",
      coaches: [hitCoach],
      detail: "Courts open if you want a hit. Explore the island. Saturday is also a departure day.",
      staffNote: "Optional hit if you want to be on the sand. Otherwise you are off.",
      duty: "Optional hit",
      week: weekId,
    }),
    event({
      start: iso(d(6), "09:00"),
      end: iso(d(6), "17:00"),
      title: "Optional local tournament",
      place: "Playa Grande",
      kind: "tournament",
      groups: "all",
      coaches: ["katya"],
      detail: "Organised by Playa Grande Volley. Optional.",
      staffNote: "Katya is the Hybrid contact if anyone plays.",
      duty: "Local tournament",
      week: weekId,
    }),
  );
  brk(6, "09:00", "17:00", staff.filter((id) => id !== hitCoach && id !== "katya"), "Free day. You are off unless you choose to be on the sand.");

  rows.push(
    event({
      start: iso(d(7), "08:00"),
      end: iso(d(7), "12:00"),
      title: "Departure",
      place: "Puerto del Carmen",
      kind: "arrival",
      groups: "all",
      coaches: ["mark"],
      detail: "Flights are yours unless we arranged them. Leave keys if you were in Moraña.",
      staffNote: "Mark is the contact for departures.",
      week: weekId,
      audience: "departures",
    }),
  );

  return rows;
}

export const EVENTS: CampEvent[] = CAMP_WEEKS.flatMap((week) => eventsForWeek(week.id));

export const PREPARE = [
  {
    title: "What to pack",
    body: "Two or three training kits you can wash, a long-sleeve for wind, flip-flops, a cap, reef-safe sun cream, tape, a water bottle you will actually refill, and something warm for the evening. Courts are sand. Barefoot or sand socks, your call.",
  },
  {
    title: "Getting there",
    body: "Flights are not in the camp. ACE is the airport. Puerto del Carmen is a short transfer. If we arranged your stay, La Moraña is on Calle Guanapay, seafront, a walk from the courts. If you booked your own place, come down to Playa Grande on Sunday when you land. Welcome is Monday morning.",
    links: [
      { label: "La Moraña Apartments", href: "https://www.lamoranalanzarote.com/" },
      {
        label: "Playa Grande courts",
        href: "https://www.google.com/maps/search/?api=1&query=Playa+Grande%2C+Avenida+de+Las+Playas%2C+Puerto+del+Carmen%2C+Lanzarote",
      },
    ],
  },
  {
    title: "First afternoon",
    body: "Sunday is arrival. Courts are open all day. No session. Welcome and registration is Monday 08:45. If you are staying on for another week, Sunday is a handover. New faces, same courts.",
  },
  {
    title: "How the week is built",
    body: "Nine sessions with the same dedicated coach that week. Monday scramble, Tuesday dinner, Wednesday lighter with yoga and an optional excursion, Friday camp tournament then the party. Saturday is a free day. Some people book two or three weeks. Solo players are matched inside the group of six.",
  },
  {
    title: "If something is wrong",
    body: "Injury, illness, a travel delay, or you need to move groups: message the coaches from this camp site. It goes to your group coach and to Mark. Do not wait until you are on the sand.",
  },
];

export const FUEL = [
  {
    title: "Heat first",
    body: "You are training twice most days on sand in winter sun that still hits. Drink before you are thirsty. Pale urine by the evening is the check. Dark urine after lunch means you are already behind for the second session.",
  },
  {
    title: "How much to drink",
    body: "On a two-session day most people need about 4 to 5 litres, including what is in food and coffee. That is four or five fills of a 1 litre bottle. If you soak through kit or you are a heavy sweater, closer to 6 litres. Do not force 6 litres of plain water. Wednesday is less.",
    looksLike: [
      "Breakfast: finish a bottle.",
      "Morning session: another bottle, sipped, not downed at the end.",
      "Lunch: a bottle with food.",
      "Afternoon session: another bottle.",
      "Evening: one more if your urine is still dark. That is five fills. Six only if you are still thirsty and still salty.",
    ],
  },
  {
    title: "Electrolytes",
    body: "Sweat on sand takes sodium with it. A typical tablet is about 250 to 350mg of sodium. Two tablets on their own is not enough for this week. Put one in the morning bottle, one in the afternoon bottle, and eat something salty at lunch. That is the replacement. More plain water with no salt is how people cramp and fade.",
    looksLike: [
      "Two standard tablets in bottles through the day, plus salt on lunch. Not two tablets instead of food.",
      "If you use a stronger mix, around 1,000mg in a litre, one bottle in the morning and one in the afternoon is plenty. Still eat the salty lunch.",
      "White marks on kit, headache, or cramp: more salt in the food, not another litre of tap water.",
    ],
  },
  {
    title: "Before the morning session",
    body: "Eat. Toast, yoghurt, eggs, fruit. Do not turn up fasted. Caffeine is fine. A huge coffee and nothing else is not.",
  },
  {
    title: "The extra calories",
    body: "A two-session day on sand is not a normal day. Most people need about 700 to 1,000 extra calories on top of what they already eat. Bigger bodies, and Monday or Friday with a tournament, closer to 1,200. Wednesday, roughly half. Three bananas is only about 300 calories. That is a snack, not the extra.",
    looksLike: [
      "A filled baguette and a yoghurt. About 700.",
      "An açaí bowl with granola and nut butter. About 550 to 700.",
      "Chocolate milk, two bananas, and a large handful of nuts. About 700.",
    ],
  },
  {
    title: "The long break",
    body: "This is lunch, not a snack. Carbs plus something salty. Then get out of the sun. The afternoon session is where people fade if they have picked at a salad and sat on the wall for three hours.",
  },
  {
    title: "After the last session",
    body: "Eat again within an hour. Sunset stretch is short on purpose so you can go and do that. Camp dinner is Tuesday. The Friday party is later. You do not need a perfect plate. You need enough.",
  },
  {
    title: "Alcohol",
    body: "There will be a drink at dinner. Fine. The morning session the next day is not a recovery session. Alcohol pulls water the other way, so the bottle still has to happen. If you are ill or already carrying something, skip the drink and message us.",
  },
];

export const KIND_LABEL: Record<CampEventKind, string> = {
  session: "Session",
  yoga: "Optional",
  social: "Camp",
  meal: "Meal",
  tournament: "Tournament",
  break: "Break",
  arrival: "Travel",
  recovery: "Recovery",
  free: "Free play",
};

export function datesForWeeks(weeks: number[]) {
  const allow = new Set<string>();
  for (const id of [...new Set(weeks)].sort()) {
    const week = CAMP_WEEKS.find((item) => item.id === id);
    if (!week) continue;
    const start = addDays(week.sunday, -1);
    const end = addDays(week.sunday, 7);
    let cursor = start;
    while (cursor <= end) {
      allow.add(cursor);
      cursor = addDays(cursor, 1);
    }
  }
  return [...allow].sort();
}

export function weatherForWeeks(weeks: number[]) {
  const allow = new Set(datesForWeeks(weeks));
  return WEATHER.filter((day) => allow.has(day.date));
}

export function weekIdOnDate(date: string, weeks: number[]) {
  const hits = CAMP_WEEKS.filter((week) => {
    if (!weeks.includes(week.id)) return false;
    const start = addDays(week.sunday, -1);
    const end = addDays(week.sunday, 7);
    return date >= start && date <= end;
  });
  return hits[hits.length - 1]?.id ?? hits[0]?.id ?? null;
}

export function weeksPhrase(weeks: number[]) {
  const unique = [...new Set(weeks)].sort();
  if (unique.length === 3) return "all three weeks";
  if (unique.length === 1) return `Week ${unique[0]}`;
  return unique.map((week) => `Week ${week}`).join(" and ");
}

export function firstDayFor(person: CampPerson) {
  const first = Math.min(...person.weeks);
  const week = CAMP_WEEKS.find((item) => item.id === first)!;
  if (person.role === "player") return week.sunday;
  return addDays(week.sunday, -1);
}

export function lastDayFor(person: CampPerson) {
  const last = Math.max(...person.weeks);
  const week = CAMP_WEEKS.find((item) => item.id === last)!;
  return addDays(week.sunday, 7);
}

export function calendarDate(value = new Date()) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isCalendarToday(isoDate: string) {
  return isoDate === calendarDate();
}

export function dayTitle(isoDate: string) {
  if (isCalendarToday(isoDate)) return "Today";
  return DAYS.find((day) => day.date === isoDate)?.label ?? isoDate;
}

export function personNow(person: CampPerson) {
  const first = new Date(`${firstDayFor(person)}T08:10:00Z`);
  const last = new Date(`${lastDayFor(person)}T20:00:00Z`);
  const now = new Date();
  if (now < first) return first;
  if (now > last) return last;
  return now;
}

export function campStartFor(person: CampPerson) {
  return new Date(`${firstDayFor(person)}T10:00:00Z`);
}

export function currentWeekId(now = CAMP_NOW, person?: CampPerson) {
  const date = now.toISOString().slice(0, 10);
  const weeks = person ? CAMP_WEEKS.filter((week) => person.weeks.includes(week.id)) : CAMP_WEEKS;
  const hit = [...weeks].reverse().find((week) => {
    const start = addDays(week.sunday, -1);
    const end = addDays(week.sunday, 7);
    return date >= start && date <= end;
  });
  return hit?.id ?? weeks[0]?.id ?? 1;
}

export function coachForGroup(groupId: string, weekId: number) {
  return personById(GROUP_LEAD[weekId]?.[groupId] ?? GROUPS.find((g) => g.id === groupId)?.coachId ?? "");
}

export function dayIndex(isoDate: string) {
  return DAYS.findIndex((day) => day.date === isoDate.slice(0, 10));
}

export function personByEmail(email: string) {
  const needle = email.trim().toLowerCase();
  return PEOPLE.find((person) => person.email.toLowerCase() === needle) ?? null;
}

export function groupById(id: string | null) {
  if (!id) return null;
  return GROUPS.find((group) => group.id === id) ?? null;
}

export function personById(id: string) {
  return PEOPLE.find((person) => person.id === id) ?? null;
}

export type GroupMap = Record<string, string | null>;
export type WeekGroupMap = Record<string, Partial<Record<number, string | null>>>;

export function groupOf(
  person: CampPerson,
  week: number,
  groups: GroupMap = {},
  weekGroups: WeekGroupMap = {},
) {
  if (person.role !== "player") return person.leadsGroup ?? person.groupId;
  return weekGroups[person.id]?.[week] ?? groups[person.id] ?? person.groupId;
}

function matchesAudience(person: CampPerson, event: CampEvent) {
  const audience = event.audience ?? "all";
  if (audience === "all") return true;
  const first = Math.min(...person.weeks);
  const last = Math.max(...person.weeks);
  if (audience === "arrivals") return first === event.week;
  if (audience === "departures") return last === event.week;
  if (audience === "staying") return person.weeks.includes(event.week) && first !== event.week;
  if (audience === "staff-arrive") return person.role !== "player" && first === event.week;
  return true;
}

export function visibleEvents(
  person: CampPerson,
  groupMap: GroupMap,
  weekGroups: WeekGroupMap = {},
  events = EVENTS,
) {
  return events.filter((event) => {
    if (!person.weeks.includes(event.week)) return false;
    if (!matchesAudience(person, event)) return false;
    if (person.role === "player") {
      if (event.kind === "break") return false;
      if (event.groups === "all") return true;
      const groupId = groupOf(person, event.week, groupMap, weekGroups);
      if (!groupId) return false;
      return event.groups.includes(groupId);
    }
    if (event.coaches.includes(person.id)) return true;
    if (person.role === "head" && event.kind === "session") return true;
    return false;
  });
}

export function upcoming(events: CampEvent[], now = CAMP_NOW) {
  return [...events].filter((event) => new Date(event.end) >= now).sort((a, b) => a.start.localeCompare(b.start));
}

export function onDay(events: CampEvent[], date: string) {
  return events.filter((event) => event.start.slice(0, 10) === date).sort((a, b) => a.start.localeCompare(b.start));
}

export function coachDutyLabel(event: CampEvent, optional = false) {
  if (optional) return `Optional · Join us for ${event.title.toLowerCase()}`;
  if (event.kind === "session") {
    const letter = Array.isArray(event.groups) ? event.groups[0]?.toUpperCase() : "";
    const n = event.title.match(/Session (\d+)/)?.[1] ?? "";
    return `Session ${n} · Coach Group ${letter}`;
  }
  if (event.kind === "break") return "Break";
  if (event.kind === "tournament") return "Tournament support";
  if (event.kind === "yoga") return event.title;
  if (event.kind === "recovery") return event.title;
  if (event.kind === "meal") return event.title;
  return event.duty ?? event.title;
}

export function isCoachDuty(person: CampPerson, event: CampEvent) {
  if (!person.weeks.includes(event.week)) return false;
  if (!matchesAudience(person, event)) return false;
  if (event.kind === "session") {
    const groupId = Array.isArray(event.groups) ? event.groups[0] : null;
    if (!groupId) return false;
    return GROUP_LEAD[event.week]?.[groupId] === person.id;
  }
  return event.coaches.includes(person.id);
}

export function coachDutiesOn(person: CampPerson, date: string) {
  const rows = EVENTS.filter((event) => event.start.slice(0, 10) === date && isCoachDuty(person, event)).sort((a, b) =>
    a.start.localeCompare(b.start),
  );
  const listed = rows.map((event) => ({
    event,
    label: coachDutyLabel(event),
    optional: false,
  }));
  const dinner = EVENTS.find(
    (event) =>
      event.start.slice(0, 10) === date &&
      event.kind === "meal" &&
      person.weeks.includes(event.week) &&
      !rows.some((row) => row.id === event.id),
  );
  if (dinner) {
    listed.push({ event: dinner, label: coachDutyLabel(dinner, true), optional: true });
  }
  return listed.sort((a, b) => a.event.start.localeCompare(b.event.start));
}

export function collapseSessions(events: CampEvent[], collapse: boolean) {
  if (!collapse) return events;
  const seen = new Set<string>();
  return events
    .filter((event) => {
      if (event.kind !== "session" || event.groups === "all") return true;
      if (seen.has(event.start)) return false;
      seen.add(event.start);
      return true;
    })
    .map((event) =>
      event.kind === "session" && event.groups !== "all"
        ? { ...event, title: event.title.replace(/ · Group .*/, " · all groups") }
        : event,
    );
}

export function playersOnWeek(weekId: number, groupMap: GroupMap = {}, weekGroups: WeekGroupMap = {}) {
  return PEOPLE.filter((person) => person.role === "player" && person.weeks.includes(weekId)).map((person) => ({
    ...person,
    groupId: groupOf(person, weekId, groupMap, weekGroups),
  }));
}
