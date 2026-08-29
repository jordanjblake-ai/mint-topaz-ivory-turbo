export const communityNav = [
  { label: "Performance Squad", href: "/community/performance" },
  { label: "Team Hybrid", href: "/community/team" },
  { label: "Partners", href: "/community/partners" },
  { label: "Coaches", href: "/coaches" },
  { label: "Private Coaching", href: "/community/coaching" },
  { label: "Clinics & Mini-Camps", href: "/coaching" },
  { label: "Hall of Fame", href: "/community/hall-of-fame" },
  { label: "Story Time", href: "/story-time" },
] as const;

export const squadFacts = [
  { value: "1", label: "Court" },
  { value: "8", label: "Players" },
  { value: "2 hrs", label: "Each session" },
];

export const squadPurpose = [
  "Players regularly competing at UKBT 4★ and above",
  "Athletes who want a true performance environment",
  "Players ready to train with intent, structure, and accountability",
  "Competitors who care about tactics, not just volume",
];

export const squadDifference = [
  "Train only with players of a similar level",
  "Coached by people who still compete at the top of the UK game",
  "A coach who is invested in your results across the season, not one session",
  "Work built around decision-making, tactics, and match execution. Not generic drills",
];

export const squadExpect = [
  {
    title: "High-performance training",
    points: [
      "Two-hour sessions built to feel like match conditions",
      "Coaches who know what UKBT 4★ and above actually asks of you",
      "Every session has a tactical and performance focus. Nothing is filler",
    ],
  },
  {
    title: "Tactical and competitive development",
    points: [
      "Decision-making under pressure",
      "Game-specific scenarios that show up on tour",
      "Training with a purpose, not a drill circuit",
    ],
  },
  {
    title: "Individual and partnership feedback",
    points: [
      "Live, on-court feedback during the session",
      "Out-of-court reviews to keep the season moving",
      "Partnership coaching, so both players develop together",
    ],
  },
  {
    title: "The squad",
    points: [
      "A dedicated group with the same standards",
      "A team mentality between you, your partner, and your coach",
      "A community that cares about the result and the work behind it",
    ],
  },
];

export const squadPerks = [
  "Official training shirt",
  "Priority access to Hybrid trips, tournaments, and competitive extras",
  "Third-party playing opportunities in the sport you love",
];

export const squadSchedule = [
  { label: "Start", body: "Tuesday 4 May or Wednesday 5 May 2027" },
  { label: "Duration", body: "18-week performance programme" },
  { label: "End", body: "Tuesday 31 August or Wednesday 1 September 2027" },
  {
    label: "Why those dates",
    body: "The block finishes just before the UKBT Tour Finals, so the work lands when it matters.",
  },
  { label: "Days", body: "Tuesday or Wednesday" },
  { label: "Time", body: "6:30pm to 8:30pm. Two hours." },
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
  men: [
    { name: "Stuart Perry" },
    { name: "Theo Plaza" },
    { name: "Lewis Bunton" },
    { name: "Bailey Harsum" },
    { name: "Jan-Joost Van Der Bogert" },
  ],
  women: [
    { name: "Ella Watson", image: "/images/portrait-ella.jpg", imageClass: "object-top" },
    { name: "Martha Bullen", image: "/images/coach-martha.jpg", imageClass: "object-top" },
    { name: "Francesca Billato" },
    { name: "Lucy Knott" },
  ],
};

export const partners = [
  {
    name: "Fireball Beach Volleyball",
    href: null as string | null,
    image: "/images/community/40.jpg",
    intro: "London Beach Volleyball. A club that treats training, competing, and the people around the court as the same job.",
    what: "Domestic Beach Volleyball: sessions, squads, and a club culture that Hybrid players already know.",
    withHybrid:
      "We put the first domestic performance group together with Fireball London for summer 2026. In June 2026 the Fireball / Hybrid men's team won the UK Beach Tour Club Championships, Men's Championship Division, and qualified for Europe.",
  },
  {
    name: "beachvolleycamps.ch",
    href: "https://beachvolleycamps.ch/",
    image: "/images/partner-1.jpg",
    intro: "Swiss coaches and camp organisers. Long experience on the European Beach Volleyball circuit.",
    what: "Camps, coaching networks, and the Swiss standard Hybrid wanted next to our own.",
    withHybrid:
      "We ran the first Lanzarote Beach Volleyball camp with them in January and February 2026. The week still sits on that partnership: their network, our group, one camp.",
  },
];

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
