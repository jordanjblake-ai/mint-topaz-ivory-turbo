import { createFileRoute, Link } from "@tanstack/react-router";
import { EnquireForm } from "@/components/site/enquire-form";
import { CommunitySubnav } from "@/components/site/community-subnav";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Button } from "@/components/ui/button";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { headFor } from "@/data/seo";

export const Route = createFileRoute("/community/coaching")({
  head: () => headFor("/community/coaching"),
  component: PrivateCoachingPage,
});

const forWho = [
  "Players who want technical work that a group session cannot hold",
  "Partnerships preparing for a tournament or a camp week",
  "Athletes coming back from a break who need a clear plan",
  "Friends or a small group who want Hybrid without a full camp",
];

const expect = [
  "A Hybrid coach, on a court, with a point to the session",
  "Work built around you, not a template",
  "Honest feedback, in the session and after it",
  "A next step: another session, Performance Squad, or a camp week",
];

function PrivateCoachingPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/coach-mark-action.jpg"
        alt="Mark Garcia-Kidd coaching on the sand"
        imageClass="object-[right_center]"
        kicker="Community · Private Coaching"
        title="Beach Volleyball, up close"
        sub="1-to-1 through to a group of 8. Technical work, match prep, or a reset with a Hybrid coach."
        actions={
          <Button asChild size="lg">
            <a href="#enquire">Enquire</a>
          </Button>
        }
      />
      <CommunitySubnav />

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Kicker>The coaching</Kicker>
            <Display className="mt-2 text-5xl">Private sessions, still Hybrid</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              This is the same coaching that sits under the camps, just closer to home. You bring
              the question. We build the session around it.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Around the U.K. Tell us where you are, who is coming, and what you want out of the
              time.
            </p>
          </div>
          <Photo
            src="/images/coach-mark.jpg"
            alt="Mark Garcia-Kidd"
            className="aspect-4/5 w-full rounded-lg object-top"
          />
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Who it is for</Kicker>
            <Display className="mt-2 text-5xl">If this sounds like you</Display>
            <ul className="mt-8 space-y-4">
              {forWho.map((item) => (
                <li key={item} className="border-t border-border pt-4 text-sm leading-relaxed text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Kicker>What you can expect</Kicker>
            <Display className="mt-2 text-5xl">The session</Display>
            <ul className="mt-8 space-y-4">
              {expect.map((item) => (
                <li key={item} className="border-t border-border pt-4 text-sm leading-relaxed text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Photo
            src="/images/community/35.jpg"
            alt="Hybrid coach on court"
            className="aspect-4/5 w-full rounded-lg object-center"
          />
          <div>
            <Kicker>The coaches</Kicker>
            <Display className="mt-2 text-5xl">People you already know</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Mark, Martha, Issa, Dave, and the rest of the Hybrid group. You can ask for a
              specific coach, or we will match the session to who is free and who fits the work.
            </p>
            <Button asChild variant="secondary" className="mt-8">
              <Link to="/coaches">Meet the coaches</Link>
            </Button>
          </div>
        </Container>
      </Section>

      <Section id="enquire" className="scroll-mt-24 bg-surface">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Enquire</Kicker>
            <Display className="mt-2 text-5xl">Tell us what you need</Display>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Format, level, and roughly where you want to train. We will come back with
              availability and a clear next step.
            </p>
          </div>
          <EnquireForm defaultInterest="coaching" variant="coaching" />
        </Container>
      </Section>
    </main>
  );
}
