import { assertSportImage, sportHero, type CourtSport } from "@/data/sport-images";

export const site = {
  name: "Hybrid Vacations",
  tagline: "Travel Through What You Love",
  positioning: "Sport × Travel × Community × Adventure",
  email: "support@hybridvacations.com",
  instagram: "https://www.instagram.com/hybridvacations/",
  instagramHandle: "@hybridvacations",
  facebook: "https://www.facebook.com/profile.php?id=61573843287750",
};

export const coaches = [
  {
    slug: "mark",
    name: "Mark Garcia-Kidd",
    handle: "@mgarciakidd",
    url: "https://www.instagram.com/mgarciakidd/",
    role: "Founder and coach",
    bio: "Former England Beach Volleyball international and founder of Hybrid. Mark has competed for England on the world circuit and is known as one of the UK's strongest setters and coaches. He built Hybrid around quality coaching, real community, and destinations worth travelling for, from London sessions to weeks on the sand in Lanzarote.",
    image: "/images/coach-mark.jpg",
    imageClass: "object-top",
  },
  {
    slug: "martha",
    name: "Martha Bullen",
    handle: "@_marthab",
    url: "https://www.instagram.com/_marthab/",
    role: "England player and coach",
    bio: "England Beach Volleyball player and Hybrid coach. Martha competes on the UKBT and Beach Pro Tour, has represented England at senior level, and plays indoor for Richmond. Her coaching is direct, purposeful, and focused on the fundamentals that win points.",
    image: "/images/coach-martha.jpg",
    imageClass: "object-top",
  },
  {
    slug: "issa",
    name: "Issa Batrane",
    handle: "@issabatrane",
    url: "https://www.instagram.com/issabatrane/",
    role: "England international",
    bio: "England Beach Volleyball international and Hybrid coach. Issa competes on the Beach Pro Tour with partner Freddie Bialokoz. He brings high-level competitive experience and a clear focus on effort, defence, and player development.",
    image: "/images/coach-issa.jpg",
    imageClass: "object-center",
  },
  {
    slug: "dave",
    name: "Dave Panah",
    handle: "@lifeofdavoud",
    url: "https://www.instagram.com/lifeofdavoud/",
    role: "Coach",
    bio: "Coach with more than twenty years in volleyball and international experience representing Wales. Dave has coached indoor and beach from beginners through to national-level athletes. Sessions are energetic and built around confidence and clear progress.",
    image: "/images/coach-dave.jpg",
    imageClass: "object-top",
  },
  {
    slug: "marco",
    name: "Marco Bonaria",
    handle: "@beachvolleycamps.ch",
    url: "https://www.instagram.com/beachvolleycamps.ch/",
    role: "Swiss coach and camp organiser",
    bio: "Swiss coach and camp organiser with long experience in the European Beach Volleyball scene. Marco brings structure and the Swiss coaching network behind Hybrid's collaboration with beachvolleycamps.ch.",
    image: "/images/coach-marco.jpg",
    imageClass: "object-center",
  },
  {
    slug: "katya",
    name: "Katya Kate",
    handle: "@katyasteps",
    url: "https://www.instagram.com/katyasteps/",
    role: "Hybrid coach",
    bio: "Hybrid coach. On the sand with the group, and part of the camp week.",
    image: "/images/coach-katya.jpg",
    imageClass: "object-top",
  },
  {
    slug: "ella",
    name: "Ella Watson",
    handle: "@umbrellas_ella",
    url: "https://www.instagram.com/umbrellas_ella/",
    role: "England player and coach",
    bio: "England Beach Volleyball player and Hybrid coach. Ella competes on the Beach Pro Tour, has represented England at senior level, and is one of the strongest hitters in the UK group. She is part of the 2027 Performance Squad coaching team.",
    image: "/images/portrait-ella.jpg",
    imageClass: "object-top",
  },
  {
    slug: "david",
    name: "David Silva",
    handle: "",
    url: "",
    role: "Coach",
    bio: "UK Beach Volleyball coach who works across camp providers and domestic programmes. David is part of the 2027 Performance Squad coaching team.",
    image: "",
    imageClass: "",
  },
];

export const testimonials = [
  {
    quote:
      "Proper training environment. Coaches take you seriously. Sessions were hard, specific, and I left with clear things to work on for the next tournament.",
    name: "Lewis Bunton",
  },
  {
    quote:
      "Not a holiday camp. Real volume, real feedback, and people who care about getting better. Exactly the kind of week you need between events.",
    name: "Bailey Harsum",
  },
  {
    quote:
      "Level of coaching was high. Same coach all week meant the progress actually stuck. Sideout and defence work was proper, not generic drills.",
    name: "Jordan Blake",
  },
  {
    quote:
      "Strong group of players and coaches who know the UK and international scene. Training was sharp and the competitive standard pushed me.",
    name: "Gerda Berštautaitė",
  },
  {
    quote:
      "Came for the standard of coaching and stayed for the atmosphere. Hard sessions, good recovery, and a group that wants to compete. Would go again.",
    name: "Ella Watson",
    image: "/images/portrait-ella.jpg",
  },
];

export type ExperienceStatus = "bookable" | "preregister" | "coming";

export type Experience = {
  slug: string;
  sport: CourtSport;
  title: string;
  destination: string;
  dates: string;
  weeks: string[];
  status: ExperienceStatus;
  priceFrom: string;
  image: string;
  href: "/vacations" | "/vacations/lanzarote" | "/vacations/tennis" | "/vacations/padel" | "/vacations/golf" | "/contact";
  interest?: string;
  cta: string;
  blurb: string;
};

export const experiences: Experience[] = [
  {
    slug: "lanzarote",
    sport: "Beach Volleyball",
    title: "Lanzarote Beach Volleyball Camp",
    destination: "Playa Grande, Puerto del Carmen",
    dates: "Jan – Feb 2027",
    weeks: [
      "Week 1: 30/31 Jan to 6/7 Feb",
      "Week 2: 6/7 Feb to 13/14 Feb",
      "Week 3: 13/14 Feb to 20/21 Feb",
    ],
    status: "bookable",
    priceFrom: "From £425",
    image: sportHero("Beach Volleyball"),
    href: "/vacations/lanzarote",
    cta: "View camp",
    blurb:
      "Train on golden sand with the same dedicated coach all week. Then recover, explore, and play with a European community.",
  },
  {
    slug: "tennis",
    sport: "Tennis",
    title: "Mallorca Tennis Camp",
    destination: "Font de Sa Cala, Capdepera",
    dates: "April 2027",
    weeks: ["April 2027"],
    status: "preregister",
    priceFrom: "Pre-register",
    image: sportHero("Tennis"),
    href: "/vacations/tennis",
    cta: "Pre-register",
    blurb: "Clay courts minutes from the coast. Serious sessions, island living, and a social week around the game.",
  },
  {
    slug: "padel",
    sport: "Padel",
    title: "Mallorca Padel Camp",
    destination: "Capdepera, Mallorca",
    dates: "5 – 9 April 2027",
    weeks: ["5 to 9 April 2027"],
    status: "preregister",
    priceFrom: "Pre-register",
    image: sportHero("Padel"),
    href: "/vacations/padel",
    cta: "Pre-register",
    blurb: "Coaching, match play, and a spring week on Mallorca. Pre-register and we will send the details.",
  },
  {
    slug: "golf",
    sport: "Golf",
    title: "Golf Camp",
    destination: "Hybrid Golf",
    dates: "2028",
    weeks: ["Coming 2028"],
    status: "coming",
    priceFrom: "Coming 2028",
    image: sportHero("Golf"),
    href: "/vacations/golf",
    cta: "Get notified",
    blurb: "Golf, the Hybrid way. Train, travel, community. Destination follows in 2028.",
  },
];

for (const experience of experiences) {
  assertSportImage(experience.image, experience.sport);
}

export const lanzarote = {
  included: [
    "9 structured training sessions (16+ hours) with the same dedicated coach",
    "2 afternoon social tournaments",
    "Welcome pack plus Lanzarote vest top or sports bra",
    "Coach-led sunset stretches",
    "Pro exhibition games",
    "Camp dinner and farewell party",
    "Training balls provided",
  ],
  optional: [
    "Weekend tournament with local club partner Playa Grande Volley",
    "Custom playing shorts (£50 extra)",
    "Wednesday evening camp excursion",
    "Airport transfers",
  ],
  notIncluded: [
    "Flights",
    "Travel insurance",
    "Visas if required",
    "Transport to Lanzarote unless arranged separately",
  ],
  packages: [
    {
      id: "camp",
      name: "Camp only",
      price: "From £425 per person",
      note: "Training and camp extras. You arrange your own stay.",
    },
    {
      id: "stay-2bed-4",
      name: "2-bedroom apartment · 4 people",
      price: "From £780 per person",
      note: "Two bedrooms. One bed each.",
    },
    {
      id: "stay-2bed-3",
      name: "2-bedroom apartment · 3 people",
      price: "£850 per person",
      note: "Two bedrooms. One bed each.",
    },
    {
      id: "stay-1bed-2",
      name: "1-bedroom apartment · 2 people",
      price: "£870 per person",
      note: "Twin beds. Own bed, shared apartment.",
    },
    {
      id: "stay-1bed-1",
      name: "1-bedroom apartment · solo",
      price: "£1,215 per person",
      note: "The apartment to yourself.",
    },
  ],
  payment: [
    "£100 deposit holds the place under the cancellation schedule 15/40/70/100 (more than 12 weeks 15% or the deposit if higher; 8–12 weeks 40%; 4–8 weeks 70%; inside 4 weeks 100%).",
    "Accommodation balance due 1 January 2027",
    "Camp balance due 15 January 2027",
  ],
  partners: [
    {
      name: "beachvolleycamps.ch",
      href: "https://beachvolleycamps.ch/",
      note: "Swiss partner. We run Lanzarote with their coaching network.",
    },
    {
      name: "Playa Grande Volley",
      href: null,
      note: "Local club. Optional weekend tournament.",
    },
    {
      name: "Moraña Apartments",
      href: "https://www.lamoranalanzarote.com/",
      note: "Seafront stay in Puerto del Carmen. Check-in from 14:00, Saturday to Saturday.",
    },
  ],
  stay: [
    "Check-in from 14:00. Check-out before 11:00.",
    "Seven nights is Saturday to Saturday.",
    "Heated winter pool, seafront, a walk from Playa Grande.",
  ],
  faqs: [
    {
      q: "Are flights included?",
      a: "No. Book your own, or ask us to arrange them.",
    },
    {
      q: "Can I come solo?",
      a: "Yes. Plenty of players arrive on their own. We match partners in sessions and the group is built for it.",
    },
    {
      q: "What level do I need?",
      a: "Improver through to advanced. Groups are split so you train with the right people.",
      href: "/playing-levels" as const,
      link: "Read the playing levels guide",
    },
    {
      q: "Is it the same coach all week?",
      a: "Yes. Nine sessions with the same dedicated coach, so the work builds instead of resetting every morning.",
    },
    {
      q: "How many players in a group?",
      a: "Six. Same dedicated coach, all week.",
    },
    {
      q: "Do I need to bring equipment?",
      a: "Training balls are provided. Bring kit you can train in twice a day, a bottle, sun cream, and tape if you use it. Barefoot or sand socks, your call.",
    },
    {
      q: "How do I get there?",
      a: "Fly into ACE. Puerto del Carmen is a short transfer. Flights are not in the camp. If you want us to arrange transfers, say so when you book.",
    },
    {
      q: "What is a typical day?",
      a: "Two sessions most days, a long lunch, sunset stretch some evenings. Wednesday is lighter so you can see the island. Monday scramble, Friday camp tournament, Saturday free.",
    },
    {
      q: "What if the weather is bad?",
      a: "Lanzarote in February is usually playable. If wind or rain hits, we move times, adapt the session, or wait it out. Weather is not a refund on its own.",
    },
    {
      q: "How do I hold a place?",
      a: "The £100 deposit holds the place under the cancellation schedule 15/40/70/100 (more than 12 weeks 15% or the deposit if higher; 8–12 weeks 40%; 4–8 weeks 70%; inside 4 weeks 100%).",
    },
  ],
};

export const coachingOffers = [
  {
    title: "Clinics",
    body: "Short, focused group sessions. A way in for clubs, friends, and players who want Hybrid without a full camp week.",
  },
  {
    title: "Mini-camps",
    body: "A longer UK block. The camp rhythm, closer to home. Train, recover, come back the next day.",
  },
];

export const upcomingClinics = [
  {
    id: "sideout-worthing-2026-09-05",
    title: "Skills Clinic with Mark Garcia-Kidd",
    host: "SideOut Beach Volleyball Club",
    level: "Intermediate and advanced",
    dateLabel: "Saturday 5 September 2026",
    dateIso: "2026-09-05",
    time: "10:00 to 17:00",
    endsAt: "2026-09-05T17:00",
    venue: "SideOut Worthing",
    postcode: "BN11 2FG",
    cost: "£40 per person",
    body: "Morning sessions on sideout and attack. Afternoon sessions on defence and transition.",
    bookHref: "https://registration.sideout.co.uk/user/events/1382",
    infoHref: "https://www.sideout.co.uk/beach-volleyball/train/skills-clinics",
    logo: "/logos/partners/sideout.png",
    notes: [
      "Spaces are limited. First come, first served. Your place is confirmed when SideOut have the entry and payment.",
      "Booking and refunds sit with SideOut. Cancel 7 days or more before the clinic for a full refund: email info@sideout.co.uk. Within 7 days, a refund only if the clinic is full and they replace you from the waiting list. No refund within 48 hours of the start.",
    ],
  },
] as const;

export function londonStamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function liveClinics(now = new Date()) {
  const stamp = londonStamp(now);
  return upcomingClinics.filter((clinic) => stamp < clinic.endsAt);
}

export const nav = [
  {
    label: "Vacations",
    href: "/vacations",
    children: [
      { label: "Lanzarote Beach Volleyball", href: "/vacations/lanzarote", note: "Jan to Feb 2027" },
      { label: "Mallorca Tennis", href: "/vacations/tennis", note: "April 2027" },
      { label: "Mallorca Padel", href: "/vacations/padel", note: "5 to 9 April 2027" },
      { label: "Golf", href: "/vacations/golf", note: "2028" },
      { label: "Vacations Player Portal", href: "/portal" },
    ],
  },
  {
    label: "Community",
    href: "/community",
    children: [
      { label: "The Club", href: "/community/club", note: "Squad, Team, Hall of Fame" },
      { label: "Partners", href: "/community/partners" },
      { label: "Coaches", href: "/coaches" },
      { label: "Private Coaching", href: "/community/coaching" },
      { label: "Clinics & Mini-Camps", href: "/coaching" },
    ],
  },
  { label: "About", href: "/about" },
] as const;

export function primaryCta(pathname: string) {
  if (pathname.startsWith("/vacations/lanzarote") || pathname.startsWith("/book")) {
    return { label: "Book", href: "/book" as const };
  }
  if (pathname.startsWith("/vacations/tennis")) {
    return { label: "Pre-register", href: "/vacations/tennis" as const };
  }
  if (pathname.startsWith("/vacations/padel")) {
    return { label: "Pre-register", href: "/vacations/padel" as const };
  }
  if (pathname.startsWith("/vacations/golf")) {
    return { label: "Enquire", href: "/contact" as const, search: { interest: "golf" } };
  }
  if (pathname.startsWith("/community/coaching")) {
    return { label: "Enquire", href: "/community/coaching" as const };
  }
  if (pathname.startsWith("/coaching")) {
    return { label: "Enquire", href: "/coaching" as const };
  }
  if (pathname.startsWith("/community/club/performance") || pathname.startsWith("/community/performance")) {
    return { label: "Enquire", href: "/contact" as const, search: { interest: "performance" } };
  }
  return { label: "Enquire", href: "/contact" as const };
}

export const enquireInterests = [
  { value: "lanzarote", label: "Lanzarote Beach Volleyball 2027" },
  { value: "tennis", label: "Mallorca Tennis 2027" },
  { value: "padel", label: "Mallorca Padel 2027" },
  { value: "golf", label: "Golf 2028" },
  { value: "coaching", label: "Clinics & Mini-Camps" },
  { value: "performance", label: "Performance Squad 2027" },
  { value: "travel", label: "Travel / Flights / Stay" },
  { value: "other", label: "Something Else" },
] as const;
