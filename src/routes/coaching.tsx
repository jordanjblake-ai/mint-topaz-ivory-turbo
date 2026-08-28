import { createFileRoute, Link } from "@tanstack/react-router";
import { coachingOffers } from "@/data/site";
import { Button } from "@/components/ui/button";
import { EnquireForm } from "@/components/site/enquire-form";
import { CommunitySubnav } from "@/components/site/community-subnav";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";

export const Route = createFileRoute("/coaching")({
  head: () => ({
    meta: [
      { title: "Clinics & Mini-Camps · Hybrid Vacations" },
      {
        name: "description",
        content:
          "Hybrid clinics and mini-camps around the U.K. Group sessions and longer blocks, closer to home.",
      },
    ],
  }),
  component: CoachingPage,
});

const clinicPoints = [
  "A few hours, a clear theme, a group that wants the same work",
  "Good for clubs, friends, and players trying Hybrid for the first time",
  "Defence, serving, setting, or match play. You tell us the focus",
];

const miniCampPoints = [
  "More than one session. The camp rhythm without the flight",
  "Same coach through the block, so the work builds",
  "Built around a weekend or a short run of days in the U.K.",
];

function CoachingPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/coach-mark.jpg"
        alt="Mark Garcia-Kidd coaching on court"
        imageClass="object-top"
        kicker="Community · Clinics & Mini-Camps"
        title="Train here. Travel later."
        sub="Group clinics and mini-camps around the U.K. Hybrid coaching, closer to home."
        actions={
          <Button asChild size="lg">
            <a href="#contact">Enquire</a>
          </Button>
        }
      />
      <CommunitySubnav />

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Kicker>In the U.K.</Kicker>
            <Display className="mt-2 text-5xl">The camp idea, without the week away</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Clinics and mini-camps sit under the same coaching as the travel weeks. Come for a
              session, or a short block. Then, if you want the island, we will see you on camp.
            </p>
            <Button asChild variant="secondary" className="mt-8">
              <Link to="/coaches">Meet the coaches</Link>
            </Button>
          </div>
          <Photo
            src="/images/coach-mark-action.jpg"
            alt="Mark Garcia-Kidd coaching a Hybrid session"
            className="aspect-4/5 w-full rounded-lg object-[right_center]"
          />
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <Kicker>What we run</Kicker>
          <Display className="mt-2 text-5xl">Clinic or mini-camp</Display>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {coachingOffers.map((offer) => (
              <div key={offer.title} className="rounded-md bg-bg p-6 shadow-border">
                <h3 className="font-display text-3xl text-fg">{offer.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{offer.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Clinics</Kicker>
            <Display className="mt-2 text-5xl">Short. Specific. Group work.</Display>
            <ul className="mt-8 space-y-4">
              {clinicPoints.map((item) => (
                <li key={item} className="border-t border-border pt-4 text-sm leading-relaxed text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Kicker>Mini-camps</Kicker>
            <Display className="mt-2 text-5xl">A block, not a one-off</Display>
            <ul className="mt-8 space-y-4">
              {miniCampPoints.map((item) => (
                <li key={item} className="border-t border-border pt-4 text-sm leading-relaxed text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Photo
            src="/images/action-2.jpg"
            alt="Players in a Hybrid group session"
            className="aspect-4/5 w-full rounded-lg object-center"
          />
          <div>
            <Kicker>How it works</Kicker>
            <Display className="mt-2 text-5xl">Tell us the group and the date</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              We run these around the U.K. You bring the people, or we help fill a clinic. Format,
              level, and location come from you. We come back with a coach and a plan.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Looking for 1-to-1 or a small private group? That sits on{" "}
              <Link to="/community/coaching" className="text-fg underline-offset-4 hover:text-accent hover:underline">
                Private Coaching
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>

      <Section id="contact" className="scroll-mt-24">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Enquire</Kicker>
            <Display className="mt-2 text-5xl">Tell us what you need</Display>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Clinic or mini-camp, roughly where, and who is coming. We will come back with
              availability and a clear next step.
            </p>
          </div>
          <EnquireForm defaultInterest="coaching" />
        </Container>
      </Section>
    </main>
  );
}
