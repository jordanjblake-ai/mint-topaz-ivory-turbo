export type EnquiryKind =
  | "lanzarote"
  | "tennis"
  | "padel"
  | "golf"
  | "coaching"
  | "clinic"
  | "mini-camp"
  | "group"
  | "performance"
  | "travel"
  | "other";

export type EnquiryStatus = "new" | "contacted" | "held" | "booked" | "closed";

export type EnquirySource = "instagram" | "google" | "direct" | "referral" | "site";

export type CampWeek = "week-1" | "week-2" | "week-3" | "";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  kind: EnquiryKind;
  week: CampWeek;
  partySize: number;
  solo: boolean;
  stay: "camp" | "camp-stay" | "";
  message: string;
  source: EnquirySource;
  status: EnquiryStatus;
  createdAt: string;
  notes: { at: string; text: string }[];
  live?: boolean;
};

export const KIND_LABEL: Record<EnquiryKind, string> = {
  lanzarote: "Lanzarote",
  tennis: "Mallorca Tennis",
  padel: "Mallorca Padel",
  golf: "Golf 2028",
  coaching: "UK Coaching",
  clinic: "Clinic",
  "mini-camp": "Mini-Camp",
  group: "Group",
  performance: "Performance Squad",
  travel: "Plan a trip",
  other: "Other",
};

export const STATUS_LABEL: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  held: "Deposit held",
  booked: "Booked",
  closed: "Closed",
};

export const SOURCE_LABEL: Record<EnquirySource, string> = {
  instagram: "Instagram",
  google: "Google",
  direct: "Direct",
  referral: "Referral",
  site: "Site",
};

export const WEEK_LABEL: Record<Exclude<CampWeek, "">, string> = {
  "week-1": "Week 1 · 30 Jan",
  "week-2": "Week 2 · 6 Feb",
  "week-3": "Week 3 · 13 Feb",
};

export const WEEK_CAP = 24;

export const KIND_ORDER: EnquiryKind[] = [
  "lanzarote",
  "tennis",
  "padel",
  "coaching",
  "clinic",
  "mini-camp",
  "group",
  "performance",
  "travel",
  "golf",
  "other",
];

export const SEED_ENQUIRIES: Enquiry[] = [
  {
    id: "e01",
    name: "Sophie Hart",
    email: "sophie.hart@gmail.com",
    kind: "lanzarote",
    week: "week-1",
    partySize: 2,
    solo: false,
    stay: "camp-stay",
    message: "Coming with my partner. Both around UKBT 2* standard. Prefer a 1-bed.",
    source: "instagram",
    status: "held",
    createdAt: "2026-06-12T09:14:00.000Z",
    notes: [{ at: "2026-06-13T11:00:00.000Z", text: "Deposit in. Sent Moraña options." }],
  },
  {
    id: "e02",
    name: "Tom Ridley",
    email: "tom.ridley@icloud.com",
    kind: "lanzarote",
    week: "week-2",
    partySize: 1,
    solo: true,
    stay: "camp",
    message: "Solo. Need a hitting partner for sessions. Intermediate, play UKBT.",
    source: "instagram",
    status: "booked",
    createdAt: "2026-06-18T16:40:00.000Z",
    notes: [{ at: "2026-06-20T10:22:00.000Z", text: "Camp only. Partner match flagged." }],
  },
  {
    id: "e03",
    name: "Aisha Khan",
    email: "aisha.k@outlook.com",
    kind: "lanzarote",
    week: "week-1",
    partySize: 1,
    solo: true,
    stay: "camp-stay",
    message: "First camp. Can hold my own in social games. Travelling from Manchester.",
    source: "google",
    status: "held",
    createdAt: "2026-07-02T08:05:00.000Z",
    notes: [],
  },
  {
    id: "e04",
    name: "Ben Walsh",
    email: "benwalsh92@gmail.com",
    kind: "lanzarote",
    week: "week-3",
    partySize: 4,
    solo: false,
    stay: "camp-stay",
    message: "Club group of four from Richmond. Want two 2-beds if possible.",
    source: "referral",
    status: "contacted",
    createdAt: "2026-07-09T19:28:00.000Z",
    notes: [{ at: "2026-07-10T09:12:00.000Z", text: "Waiting on one player to confirm." }],
  },
  {
    id: "e05",
    name: "Clara Meier",
    email: "clara.meier@bluewin.ch",
    kind: "lanzarote",
    week: "week-2",
    partySize: 2,
    solo: false,
    stay: "camp-stay",
    message: "Coming from Zurich. Played a Swiss camp last year. Want the same week as Marco's group if that is running.",
    source: "referral",
    status: "held",
    createdAt: "2026-07-14T12:47:00.000Z",
    notes: [],
  },
  {
    id: "e06",
    name: "Owen Blake",
    email: "owen.blake@hotmail.com",
    kind: "lanzarote",
    week: "week-2",
    partySize: 1,
    solo: true,
    stay: "camp",
    message: "Is week 2 still open? I can move to week 3 if needed.",
    source: "instagram",
    status: "new",
    createdAt: "2026-08-19T21:03:00.000Z",
    notes: [],
  },
  {
    id: "e07",
    name: "Nia Roberts",
    email: "nia.roberts@gmail.com",
    kind: "lanzarote",
    week: "week-1",
    partySize: 1,
    solo: true,
    stay: "camp-stay",
    message: "Solo traveller. Want the seafront stay if there is space.",
    source: "site",
    status: "new",
    createdAt: "2026-08-21T07:41:00.000Z",
    notes: [],
  },
  {
    id: "e08",
    name: "James Okonkwo",
    email: "j.okonkwo@gmail.com",
    kind: "lanzarote",
    week: "week-3",
    partySize: 2,
    solo: false,
    stay: "camp",
    message: "Two of us, camp only. We will sort our own apartment.",
    source: "google",
    status: "booked",
    createdAt: "2026-06-29T14:16:00.000Z",
    notes: [],
  },
  {
    id: "e09",
    name: "Freya Cole",
    email: "freya.cole@yahoo.com",
    kind: "tennis",
    week: "",
    partySize: 1,
    solo: true,
    stay: "",
    message: "Pre-register for Mallorca tennis. 4.0 UTR-ish. Travelling from Bristol.",
    source: "instagram",
    status: "contacted",
    createdAt: "2026-07-22T11:09:00.000Z",
    notes: [{ at: "2026-07-23T08:44:00.000Z", text: "On the tennis list. No payment yet." }],
  },
  {
    id: "e10",
    name: "Hugo Bell",
    email: "hugo.bell@gmail.com",
    kind: "tennis",
    week: "",
    partySize: 2,
    solo: false,
    stay: "",
    message: "Myself and a friend. Both club level, not tournament.",
    source: "google",
    status: "new",
    createdAt: "2026-08-16T18:22:00.000Z",
    notes: [],
  },
  {
    id: "e11",
    name: "Lucia Navarro",
    email: "lucia.navarro@gmail.com",
    kind: "padel",
    week: "",
    partySize: 1,
    solo: true,
    stay: "",
    message: "Padel week in April. Intermediate. Can come solo.",
    source: "instagram",
    status: "contacted",
    createdAt: "2026-07-28T09:55:00.000Z",
    notes: [],
  },
  {
    id: "e12",
    name: "Chris Patel",
    email: "chris.patel@outlook.com",
    kind: "padel",
    week: "",
    partySize: 4,
    solo: false,
    stay: "",
    message: "We are a regular four. Want the whole group on the April week.",
    source: "site",
    status: "new",
    createdAt: "2026-08-18T13:07:00.000Z",
    notes: [],
  },
  {
    id: "e13",
    name: "Megan Shaw",
    email: "meg.shaw@gmail.com",
    kind: "coaching",
    week: "",
    partySize: 1,
    solo: true,
    stay: "",
    message: "Looking for 1-to-1 setting work around west London. Tuesday evenings if possible.",
    source: "instagram",
    status: "contacted",
    createdAt: "2026-07-05T17:31:00.000Z",
    notes: [{ at: "2026-07-06T09:00:00.000Z", text: "Offered Tuesday 7pm. Waiting to confirm court." }],
  },
  {
    id: "e14",
    name: "Daniel Frost",
    email: "danfrost@icloud.com",
    kind: "coaching",
    week: "",
    partySize: 2,
    solo: false,
    stay: "",
    message: "Pairs session with my partner before UKBT in September.",
    source: "referral",
    status: "booked",
    createdAt: "2026-07-30T08:18:00.000Z",
    notes: [],
  },
  {
    id: "e15",
    name: "Priya Nair",
    email: "priya.nair@gmail.com",
    kind: "clinic",
    week: "",
    partySize: 6,
    solo: false,
    stay: "",
    message: "Can you run a Sunday clinic for our indoor club? Six players, mixed level.",
    source: "google",
    status: "new",
    createdAt: "2026-08-20T10:12:00.000Z",
    notes: [],
  },
  {
    id: "e16",
    name: "Callum Reid",
    email: "callumreid@hotmail.com",
    kind: "clinic",
    week: "",
    partySize: 8,
    solo: false,
    stay: "",
    message: "Fireball lot. Want a defence clinic before the next 3*.",
    source: "referral",
    status: "contacted",
    createdAt: "2026-08-08T15:44:00.000Z",
    notes: [{ at: "2026-08-09T11:20:00.000Z", text: "Looking at a Saturday morning slot." }],
  },
  {
    id: "e17",
    name: "Hannah Briggs",
    email: "hannah.briggs@gmail.com",
    kind: "mini-camp",
    week: "",
    partySize: 1,
    solo: true,
    stay: "",
    message: "Is there a weekend mini-camp this autumn? I cannot do a full week abroad.",
    source: "instagram",
    status: "new",
    createdAt: "2026-08-17T20:05:00.000Z",
    notes: [],
  },
  {
    id: "e18",
    name: "Luke Martin",
    email: "luke.m.volleyball@gmail.com",
    kind: "mini-camp",
    week: "",
    partySize: 3,
    solo: false,
    stay: "",
    message: "Three of us. Two days, as much court time as you can give us.",
    source: "site",
    status: "contacted",
    createdAt: "2026-08-04T12:29:00.000Z",
    notes: [],
  },
  {
    id: "e19",
    name: "Elena Rossi",
    email: "elena.rossi@gmail.com",
    kind: "travel",
    week: "",
    partySize: 2,
    solo: false,
    stay: "",
    message: "Want extra nights in Lanzarote after week 2. Can you help with the stay, not flights.",
    source: "site",
    status: "contacted",
    createdAt: "2026-07-19T09:40:00.000Z",
    notes: [],
  },
  {
    id: "e20",
    name: "Marcus Hill",
    email: "marcushill@outlook.com",
    kind: "travel",
    week: "",
    partySize: 10,
    solo: false,
    stay: "",
    message: "Club trip. Ten players. Could be Lanzarote or something else in 2027. Need a quote.",
    source: "google",
    status: "new",
    createdAt: "2026-08-15T16:51:00.000Z",
    notes: [],
  },
  {
    id: "e21",
    name: "Sarah Quinn",
    email: "sarahq@gmail.com",
    kind: "golf",
    week: "",
    partySize: 1,
    solo: true,
    stay: "",
    message: "Notify me when golf lands. Handicap 8.",
    source: "instagram",
    status: "closed",
    createdAt: "2026-06-04T07:22:00.000Z",
    notes: [{ at: "2026-06-04T12:00:00.000Z", text: "On the 2028 golf list." }],
  },
  {
    id: "e22",
    name: "Will Chen",
    email: "will.chen@gmail.com",
    kind: "lanzarote",
    week: "week-1",
    partySize: 1,
    solo: true,
    stay: "camp",
    message: "Came last year. Same week if you can. Camp only.",
    source: "direct",
    status: "booked",
    createdAt: "2026-05-28T10:08:00.000Z",
    notes: [],
  },
  {
    id: "e23",
    name: "Amelia Grant",
    email: "amelia.grant@icloud.com",
    kind: "coaching",
    week: "",
    partySize: 1,
    solo: true,
    stay: "",
    message: "Private session for match prep. Can travel in to London.",
    source: "instagram",
    status: "new",
    createdAt: "2026-08-21T18:13:00.000Z",
    notes: [],
  },
  {
    id: "e24",
    name: "Jonny Hale",
    email: "jonnyhale@gmail.com",
    kind: "lanzarote",
    week: "week-2",
    partySize: 2,
    solo: false,
    stay: "camp-stay",
    message: "Me and my sister. Both decent club players. Shared 2-bed is fine.",
    source: "instagram",
    status: "held",
    createdAt: "2026-08-01T11:36:00.000Z",
    notes: [],
  },
  {
    id: "e25",
    name: "Kate Lindholm",
    email: "kate.lindholm@gmail.com",
    kind: "tennis",
    week: "",
    partySize: 1,
    solo: true,
    stay: "",
    message: "Put me on the tennis list. Played county as a junior, rusty now.",
    source: "site",
    status: "closed",
    createdAt: "2026-05-19T13:50:00.000Z",
    notes: [{ at: "2026-05-20T09:00:00.000Z", text: "Added to Mallorca tennis pre-register." }],
  },
];

export type DailyTraffic = {
  date: string;
  views: number;
  uniques: number;
  enquiries: number;
};

export const TOP_PAGES = [
  { path: "/", label: "Home", views: 1840 },
  { path: "/vacations/lanzarote", label: "Lanzarote", views: 1522 },
  { path: "/vacations", label: "Camps", views: 974 },
  { path: "/coaches", label: "Coaches", views: 611 },
  { path: "/coaching", label: "UK coaching", views: 508 },
  { path: "/vacations/tennis", label: "Tennis", views: 366 },
  { path: "/vacations/padel", label: "Padel", views: 341 },
  { path: "/contact", label: "Contact us", views: 290 },
];

export const TOP_SOURCES = [
  { source: "Instagram", views: 2140, share: 41 },
  { source: "Direct", views: 1288, share: 25 },
  { source: "Google", views: 1094, share: 21 },
  { source: "Referral", views: 680, share: 13 },
];

function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function buildTraffic(days: number, end = new Date("2026-08-22T12:00:00Z")): DailyTraffic[] {
  const rows: DailyTraffic[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dow = d.getUTCDay();
    const weekend = dow === 0 || dow === 6;
    const spike =
      key.startsWith("2026-06") || key === "2026-08-01" || key === "2026-07-15" ? 1.35 : 1;
    const base = (weekend ? 48 : 82) * spike;
    const views = Math.round(base + hash(i + 3) * 40);
    const uniques = Math.round(views * (0.62 + hash(i + 9) * 0.12));
    const enquiries = Math.round(hash(i + 21) * (weekend ? 1.2 : 2.4));
    rows.push({ date: key, views, uniques, enquiries });
  }
  return rows;
}

export function kindFromInterest(interest: string, coachingFormat?: string, gender?: string): EnquiryKind {
  if (interest === "coaching") {
    if (gender === "group") return "group";
    if (coachingFormat === "clinic") return "clinic";
    if (coachingFormat === "mini-camp") return "mini-camp";
    return "coaching";
  }
  if (interest in KIND_LABEL) return interest as EnquiryKind;
  return "other";
}
