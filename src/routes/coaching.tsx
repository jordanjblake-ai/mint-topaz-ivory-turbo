import { createFileRoute, Link } from "@tanstack/react-router";
import { coachingOffers } from "@/data/site";
import { Button } from "@/components/ui/button";
import { EnquireForm } from "@/components/site/enquire-form";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Container, Display, Kicker, Section } from "@/components/site/section";

export const Route = createFileRoute("/coaching")({ component: CoachingPage });

function CoachingPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/coach-mark.jpg"
        alt="Mark Garcia-Kidd coaching on court"
        imageClass="object-top"
        kicker="UK coaching"
        title="Train here. Travel later."
        sub="Private sessions, clinics, and mini-camps around the U.K. Get in touch and we will set the session around you."
        actions={
          <Button asChild size="lg">
            <a href="#contact">Contact us</a>
          </Button>
        }
      />
      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Mark Garcia-Kidd</Kicker>
            <Display className="mt-2 text-5xl">Good to be back coaching.</Display>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Beyond the volleyball, a big part of Hybrid is connecting people through a shared
              passion for the sport. Same here in the U.K. Come train. We'll see you on camp when
              you want the week.
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
          <Display className="mt-2 text-5xl">Private. Clinic. Mini-camp.</Display>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {coachingOffers.map((offer) => (
              <div
                key={offer.title}
                className="rounded-md bg-bg p-6 shadow-border"
              >
                <h3 className="font-display text-3xl text-fg">{offer.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{offer.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
            We run sessions around the U.K. Tell us the format you want.
          </p>
        </Container>
      </Section>
      <Section id="contact">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Contact us</Kicker>
            <Display className="mt-2 text-5xl">Tell us what you need</Display>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We will come back with availability and a clear next step.
            </p>
          </div>
          <EnquireForm defaultInterest="coaching" />
        </Container>
      </Section>
    </main>
  );
}
