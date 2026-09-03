export const campLevels = [
  {
    name: "Improver",
    who: "You can play. You want structure, not a first lesson.",
    court: "Pass, set, and hit in a rally. You are still building the habits.",
    guide: "Club standard. Roughly UKBT 1★ to 2★ / B3 to B2.",
  },
  {
    name: "Intermediate",
    who: "You train or compete regularly and can play a full match.",
    court: "You can sideout, defend, and take a role in the pair.",
    guide: "Regular competitor. Roughly UKBT 2★ to 3★ / B2 to B1.",
  },
  {
    name: "Advanced",
    who: "You play tournaments and want the week to feel like match pressure.",
    court: "You can run a system, read the block, and play with intent.",
    guide: "Tournament regular. Roughly UKBT 3★ to 4★ / B1 to A3.",
  },
] as const;

export const otherSports = [
  {
    sport: "Tennis",
    body: "Beginner through to county and tournament. We group the week so you are not hitting with the wrong standard.",
  },
  {
    sport: "Padel",
    body: "Beginner through to competition. Tell us honestly on the form and we will place you.",
  },
  {
    sport: "Golf",
    body: "2028 notify only. Handicap bands sit on the form so we know who is waiting.",
  },
] as const;
