import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { coachingOffers, liveClinics } from "@/data/site";
import { headFor } from "@/data/seo";
import { Button } from "@/components/ui/button";
import { EnquireForm } from "@/components/site/enquire-form";
import { CommunitySubnav } from "@/components/site/community-subnav";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { cdnUrl } from "@/lib/cdn";

export const Route = createFileRoute("/coaching")({
  head: () => headFor("/coaching"),
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
  const clinics = liveClinics();
  const next = clinics[0];

  return (
    <main>
      <PageHero
        compact
        image="/images/coach-mark.jpg"
        alt="Mark Garcia-Kidd coaching on court"
        imageClass="object-top"
        kicker="Community · Clinics & Mini-Camps"
        title="Train here. Travel later."
        sub={
          next
            ? `${next.title}. ${next.venue}, ${next.dateLabel}. Then enquire for the next Hybrid clinic or mini-camp.`
            : "Group clinics and mini-camps around the U.K. Hybrid coaching, closer to home."
        }
        actions={
          <>
            {next ? (
              <Button asChild size="lg">
                <a href="#upcoming">Book Worthing</a>
              </Button>
            ) : null}
            <Button asChild size="lg" variant={next ? "secondary" : "primary"}>
              <a href="#contact">Enquire</a>
            </Button>
          </>
        }
      />
      <CommunitySubnav />

      {clinics.length ? (
        <Section id="upcoming" className="scroll-mt-24 bg-surface">
          <Container>
            <Kicker>Upcoming</Kicker>
            <Display className="mt-2 text-5xl sm:text-6xl">Next clinic</Display>
            <div className="mt-10 space-y-8">
              {clinics.map((clinic) => (
                <article
                  key={clinic.id}
                  className="overflow-hidden rounded-lg bg-bg shadow-border"
                >
                  <div className="grid items-stretch lg:grid-cols-[minmax(0,16rem)_1fr]">
                    <div className="flex flex-col items-center justify-center gap-4 bg-paper px-6 py-10 text-ink">
                      <img
                        src={cdnUrl(clinic.logo)}
                        alt={clinic.host}
                        width={420}
                        height={224}
                        className="h-16 w-auto max-w-52 object-contain sm:h-20 sm:max-w-56"
                      />
                      <p className="text-center text-xs font-semibold tracking-[0.16em] text-ink/55 uppercase">
                        {clinic.host}
                      </p>
                    </div>
                    <div className="flex flex-col gap-6 p-6 sm:p-8">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
                          {clinic.level}
                        </p>
                        <h3 className="mt-2 font-display text-3xl text-fg sm:text-4xl">{clinic.title}</h3>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{clinic.body}</p>
                      </div>
                      <dl className="grid gap-4 sm:grid-cols-2">
                        {[
                          ["Date", clinic.dateLabel],
                          ["Time", clinic.time],
                          ["Venue", `${clinic.venue} · ${clinic.postcode}`],
                          ["Cost", clinic.cost],
                        ].map(([label, value]) => (
                          <div key={label} className="border-t border-border pt-3">
                            <dt className="text-xs font-semibold tracking-widest text-muted uppercase">{label}</dt>
                            <dd className="mt-1 text-sm text-fg">{value}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button asChild>
                          <a href={clinic.bookHref} target="_blank" rel="noopener noreferrer">
                            Book with SideOut
                            <ArrowUpRight className="size-4" />
                          </a>
                        </Button>
                        <a
                          href={clinic.infoHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-1 text-sm text-muted hover:text-accent"
                        >
                          More from SideOut
                          <ArrowUpRight className="size-3.5" />
                        </a>
                      </div>
                      <div className="space-y-2 border-t border-border pt-4">
                        {clinic.notes.map((note) => (
                          <p key={note} className="text-xs leading-relaxed text-muted">
                            {note}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

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
            src="/images/DSC_2551.jpg"
            alt="Players at the net in a Hybrid session"
            className="aspect-[3/2] w-full rounded-lg object-cover"
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
        <Container>
          <div className="max-w-2xl">
            <Kicker>Enquire</Kicker>
            <Display className="mt-2 text-5xl">Tell us what you need</Display>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Clinic or mini-camp, roughly where, and who is coming. We will come back with
              availability and a clear next step.
            </p>
          </div>
          <div className="mt-10 max-w-3xl">
            <EnquireForm defaultInterest="coaching" variant="coaching" />
          </div>
        </Container>
      </Section>
    </main>
  );
}
