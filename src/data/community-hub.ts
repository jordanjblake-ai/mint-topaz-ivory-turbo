import { teamHybridKings, teamHybridQueens } from "@/data/team-hybrid";

export const communityNav = [
  { label: "The Club", href: "/community/club" },
  { label: "Partners", href: "/community/partners" },
  { label: "Coaches", href: "/coaches" },
  { label: "Private Coaching", href: "/community/coaching" },
  { label: "Clinics & Mini-Camps", href: "/coaching" },
] as const;

export const clubNav = [
  { label: "The Club", href: "/community/club" },
  { label: "Performance Squad", href: "/community/club/performance" },
  { label: "Team Hybrid", href: "/community/club/team" },
  { label: "Hall of Fame", href: "/community/club/hall-of-fame" },
] as const;

export const clubDoors = [
  {
    title: "Performance Squad",
    kicker: "2027",
    body: "An 18-week UKBT 4★ Beach Volleyball programme. Enquire first.",
    href: "/community/club/performance",
    image: "/images/club/performance-door.jpg?v=20260903",
    alt: "Performance Squad",
  },
  {
    title: "Team Hybrid",
    kicker: "Athletes",
    body: "The Kings and Queens who compete and stand for the club.",
    href: "/community/club/team",
    image: "/images/team/door.jpg?v=20260903",
    alt: "Team Hybrid",
  },
  {
    title: "Hall of Fame",
    kicker: "The first to believe",
    body: "The people who showed up first and helped start Hybrid.",
    href: "/community/club/hall-of-fame",
    image: "/images/club/hall-door.jpg?v=20260903",
    alt: "Hall of Fame",
  },
] as const;

export const squadFacts = [
  { value: "1", label: "Court" },
  { value: "8", label: "Players" },
  { value: "2 hrs", label: "Each session" },
];

export const squadPurpose = [
  "Players competing at UKBT 4★ and above",
  "A small group. One court. Two hours",
  "Work with people of a similar standard, not a mixed drop-in",
];

export const squadDifference = [
  "A season-long squad, not one-off sessions",
  "Coaches who still compete at the top of the UK game",
  "Guest coaches through the summer",
];

export const squadPerks = [
  "Official training shirt",
  "Priority access to Hybrid trips and tournaments once the week is locked",
];

export const squadShape = [
  { label: "When", body: "May to September 2027. Eighteen weeks." },
  { label: "Who", body: "UKBT 4★ and above. Pair, individual, or a group of 8." },
  { label: "Ask by", body: "Wednesday 25 March 2027." },
];

export const squadCoaches = [
  {
    name: "Mark Garcia-Kidd",
    role: "Programme lead coach",
    body: "Head of Hybrid and former England international. Elite experience, and the person who sets the standard for the group.",
    image: "/images/coach-mark.jpg",
    imageClass: "object-top",
  },
  {
    name: "Issa Batrane",
    role: "Support coach",
    body: "Multiple World Tour medallist and current England international, competing at the top of the game.",
    image: "/images/coach-issa.jpg",
    imageClass: "object-center",
  },
  {
    name: "Ella Watson",
    role: "Support coach",
    body: "England international and World Tour player. One of the strongest coaches in the UK.",
    image: "/images/portrait-ella.jpg",
    imageClass: "object-top",
  },
  {
    name: "David Silva",
    role: "Support coach",
    body: "Works across camp providers and has built a coaching style that holds up at the highest UK level.",
    image: null,
    imageClass: "",
  },
];

export const teamAthletes = {
  men: teamHybridKings.map((athlete) => ({ name: athlete.name })),
  women: teamHybridQueens.map((athlete) => ({ name: athlete.name })),
};

export const featuredPartners = [
  {
    id: "fireball",
    name: "Fireball Beach Volleyball",
    href: null as string | null,
    logo: "/logos/partners/fireball.png",
    mark: "badge" as const,
    image: "/images/community/40.jpg",
    intro:
      "London Beach Volleyball. A club that treats training, competing, and the people around the court as the same job.",
    what: "Domestic Beach Volleyball: sessions, squads, and a club culture that Hybrid players already know.",
    withHybrid:
      "We put the first domestic performance group together with Fireball London for summer 2026. In June 2026 the Fireball / Hybrid men's team won the UK Beach Tour Club Championships, Men's Championship Division, and qualified for Europe.",
  },
  {
    id: "beachvolleycamps",
    name: "beachvolleycamps.ch",
    href: "https://beachvolleycamps.ch/",
    logo: "/logos/partners/beachvolleycamps.png",
    mark: "wordmark" as const,
    image: "/images/partner-1.jpg",
    intro: "Swiss coaches and camp organisers. Long experience on the European Beach Volleyball circuit.",
    what: "Camps, coaching networks, and the Swiss standard Hybrid wanted next to our own.",
    withHybrid:
      "We ran the first Lanzarote Beach Volleyball camp with them in January and February 2026. The week still sits on that partnership: their network, our group, one camp.",
  },
] as const;

export const supportingPartners = [
  {
    id: "playa-grande",
    name: "Playa Grande Volley",
    href: null as string | null,
    logo: "/logos/partners/playa-grande.png",
    mark: "badge" as const,
    intro: "The local club in Puerto del Carmen.",
    withHybrid: "Optional weekend tournament with the club next to camp, if you want a match that is not Hybrid-only.",
  },
  {
    id: "la-morana",
    name: "La Moraña Apartments",
    href: "https://www.lamoranalanzarote.com/",
    logo: "/logos/partners/la-morana.png",
    mark: "wordmark" as const,
    intro: "Seafront stay in Puerto del Carmen.",
    withHybrid: "Check-in from 14:00, Saturday to Saturday. Heated winter pool, a walk from Playa Grande.",
  },
] as const;

export const partners = [...featuredPartners, ...supportingPartners];

export const hallItems = [
  {
    title: "First Beach Volleyball Camp",
    when: "Lanzarote, January to February 2026",
    image: "/images/group.jpg",
    body: "The first Hybrid week on the sand. The people in this photograph took a chance on an idea that did not have a history yet.",
  },
  {
    title: "First Beach Volleyball Performance Camp",
    when: "February 2026",
    image: "/images/action-2.jpg",
    body: "A higher standard, a smaller group, and the first time Hybrid ran a performance week as its own product.",
  },
  {
    title: "First Domestic Performance Training Group",
    when: "May to September 2026, with Fireball London",
    image: "/images/community/01.jpg",
    body: "The first Hybrid group that trained at home, week after week, not just for one camp.",
  },
  {
    title: "First Padel Camp",
    when: "Mallorca, April 2027",
    image: "/images/tennis-clay.jpg",
    body: "Names and photographs will sit here once the first Padel week has been played.",
    coming: true,
  },
  {
    title: "First Tennis Camp",
    when: "Mallorca, April 2027",
    image: "/images/tennis-open.jpg",
    body: "Names and photographs will sit here once the first Tennis week has been played.",
    coming: true,
  },
];

export const historyItems = [
  {
    when: "June 2025",
    title: "Hybrid founded",
    body: "Mark Garcia-Kidd starts Hybrid.",
    image: "/images/coach-mark-hero.jpg",
  },
  {
    when: "July 2025",
    title: "Lanzarote released",
    body: "The first camp goes on sale.",
    image: "/images/card-lanzarote.jpg",
  },
  {
    when: "January / February 2026",
    title: "First Beach Volleyball Camp",
    body: "Lanzarote, with beachvolleycamps.ch.",
    image: "/images/group.jpg",
  },
  {
    when: "February 2026",
    title: "First Performance Camp",
    body: "The first Beach Volleyball performance week.",
    image: "/images/action-2.jpg",
  },
  {
    when: "2026",
    title: "Team Hybrid on the UK Beach Tour",
    body: "Athletes in Hybrid colours, competing at home.",
    image: "/images/spike.jpg",
  },
  {
    when: "May to September 2026",
    title: "First domestic performance group",
    body: "Summer training in partnership with Fireball London.",
    image: "/images/coach-mark-action.jpg",
  },
  {
    when: "June 2026",
    title: "Club Championships",
    body: "Fireball / Hybrid men win the UK Beach Tour Club Championships, Men's Championship Division, and qualify for Europe.",
    image: "/images/community/40.jpg",
  },
  {
    when: "June to October 2026",
    title: "World Tour",
    body: "Team Hybrid athletes compete on the FIVB World Tour.",
    image: "/images/coach-issa.jpg",
  },
  {
    when: "2027",
    title: "More to come",
    body: "History still being written.",
    image: "/images/sunset.jpg",
  },
];
