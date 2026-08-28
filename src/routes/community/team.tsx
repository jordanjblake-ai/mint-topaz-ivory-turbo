import { createFileRoute } from "@tanstack/react-router";
import { CommunitySubnav } from "@/components/site/community-subnav";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { teamAthletes } from "@/data/community-hub";

export const Route = createFileRoute("/community/team")({
  head: () => ({
    meta: [
      { title: "Team Hybrid · Hybrid Vacations" },
      {
        name: "description",
        content:
          "The athletes who represent Hybrid at home and on tour. Passion, commitment, and community on and off the court.",
      },
    ],
  }),
  component: TeamHybridPage,
});

function AthleteCard({
  name,
  image,
  imageClass,
}: {
  name: string;
  image?: string;
  imageClass?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <article>
      {image ? (
        <Photo src={image} alt={name} className={`aspect-3/4 w-full rounded-md ${imageClass ?? "object-top"}`} />
      ) : (
        <div className="flex aspect-3/4 w-full items-end rounded-md bg-surface p-5 shadow-border">
          <p className="font-display text-5xl text-accent">{initials}</p>
        </div>
      )}
      <p className="mt-3 font-display text-2xl text-fg">{name}</p>
    </article>
  );
}

function TeamHybridPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/group.jpg"
        alt="Hybrid camp group"
        kicker="Community · Team Hybrid"
        title="The people who wear it"
        sub="Athletes who compete at a high level, at home and abroad. For us it is more than results."
      />
      <CommunitySubnav />

      <Section>
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Who they are</Kicker>
            <Display className="mt-2 text-5xl">Team Hybrid</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              These are the individuals, teams and squads who represent what the community is
              about. They compete. They also show up with passion, commitment, positivity, and a
              genuine love for the sport.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              They inspire people around them, support the group, and bring energy to the
              communities they are part of. Ambition without ego. Competition with community.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Individual athlete stories and photography will be added as we have them. The names
              are the start.
            </p>
          </div>
          <Photo
            src="/images/community/40.jpg"
            alt="Hybrid huddle"
            className="aspect-4/5 w-full rounded-lg object-center"
          />
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <Kicker>Beach Volleyball · Men</Kicker>
          <Display className="mt-2 text-5xl">The men</Display>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {teamAthletes.men.map((athlete) => (
              <AthleteCard key={athlete.name} {...athlete} />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Kicker>Beach Volleyball · Women</Kicker>
          <Display className="mt-2 text-5xl">The women</Display>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {teamAthletes.women.map((athlete) => (
              <AthleteCard key={athlete.name} {...athlete} />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Want to train with this group?"
        body="Performance Squad is the UK block. Camps are the weeks away."
        to="/community/performance"
        label="Performance Squad"
      />
    </main>
  );
}
