import communityImageMeta from "./community-images.json";

/** Hamming distance at or below this treats two photos as the same frame. */
const VISUAL_DUP_LIMIT = 8;

function hammingHex(a: string, b: string) {
  let bits = BigInt(`0x${a}`) ^ BigInt(`0x${b}`);
  let distance = 0;
  while (bits) {
    bits &= bits - 1n;
    distance += 1;
  }
  return distance;
}

/** Unique mural photos. Visual lookalikes are dropped even when the filename differs. */
export const communityImages = communityImageMeta
  .filter((item, index, list) => {
    if (list.findIndex((other) => other.src === item.src) !== index) return false;
    return !list
      .slice(0, index)
      .some((other) => hammingHex(other.dhash, item.dhash) <= VISUAL_DUP_LIMIT);
  })
  .map((item) => item.src);

export const COMMUNITY_COLS = 8;
export const COMMUNITY_MAX_ROWS = 5;
export const COMMUNITY_ROWS = COMMUNITY_MAX_ROWS;

export function muralRowCount(imageCount = communityImages.length) {
  return Math.max(1, Math.min(COMMUNITY_MAX_ROWS, Math.floor(imageCount / COMMUNITY_COLS)));
}

export function pickCommunitySlots() {
  const pool = [...communityImages];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = current;
  }
  const rows = muralRowCount(pool.length);
  return pool.slice(0, rows * COMMUNITY_COLS);
}

export const communityStory = [
  {
    kicker: "About Hybrid",
    title: "Sport brings us together",
    body: "That is the simple bit. We run camps and trips around good coaching, a place worth the flight, and a group you want to spend the week with. The sessions matter. So do the people, the island, and what you do when you are off court.",
  },
  {
    kicker: "The group",
    title: "More than a sports camp",
    body: "Campers, coaches, partners and players make Hybrid what it is. We want you to feel welcomed and known, not like another name on a list. That shows up in how we meet you, how the week is put together, and how we talk about the people in it.",
  },
  {
    kicker: "The work",
    title: "Quality at the core",
    body: "Community only works if the coaching is real. Experienced coaches. Structured sessions. Improver through to advanced, same care either way. You should leave feeling the week was worth the time and the money.",
  },
  {
    kicker: "The place",
    title: "Somewhere worth remembering",
    body: "We do not pick a court and wrap a camp around it. We look for places you can train, rest, wander and sit together. You remember the work. You also remember where you were, and who you were with.",
  },
  {
    kicker: "Who it is for",
    title: "Everyone has a place",
    body: "There is no single Hybrid type. Competitive players train next to ambitious amateurs. Beginners try a sport for the first time. People arrive alone and leave with a group they want to see again. Shared sport is the starting point. The rest comes from putting people in the same week.",
  },
  {
    kicker: "The sports",
    title: "Sport is the connector",
    body: "Beach Volleyball is home. That is where Hybrid started, and it still shapes a lot of the club. We are adding Padel and Tennis, and more sports where you play with people, not past them. Different sports. Different places. Same community.",
  },
  {
    kicker: "The name",
    title: "Why Hybrid",
    body: "It began as sport, travel, rest and culture in one trip. It still is that. It is also the mix of people: solo travellers, friends, athletes, coaches, and anyone trying something new. Training matters. So does dinner, the tournament, and the week you keep talking about.",
  },
  {
    kicker: "Who builds it",
    title: "Built by the community",
    body: "Mark Garcia-Kidd started Hybrid after years competing and travelling. It has always been bigger than one person. The coaches, the players who come back, and the people who join for the first time set the tone. That stays true as we grow.",
  },
  {
    kicker: "Next",
    title: "Where we are going",
    body: "More camps abroad, more sports, Team Hybrid and UK sessions at home. We are not chasing size for its own sake. We want a club you can come back to, whether you travel alone or with friends. A place you feel part of.",
  },
] as const;
