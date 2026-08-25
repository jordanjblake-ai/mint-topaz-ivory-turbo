import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Photo } from "@/components/site/photo";
import { WeatherOutlook } from "@/components/camp/weather";
import { LazyMount } from "@/components/site/lazy-mount";
import { Button } from "@/components/ui/button";
import {
  CAMP_META,
  CAMP_WEEKS,
  campStartFor,
  coachForGroup,
  currentWeekId,
  groupById,
  groupOf,
  personNow,
  weeksPhrase,
} from "@/data/camp";
import { useCamp } from "@/lib/camp-store";

export const Route = createFileRoute("/camp/")({
  component: WelcomePage,
});

type Remain = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function remaining(from: Date, to: Date): Remain {
  const ms = to.getTime() - from.getTime();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1_000);
  return { days, hours, minutes, seconds, done: false };
}

function WelcomePage() {
  const me = useCamp((s) => s.me);
  const groups = useCamp((s) => s.groups);
  const weekGroups = useCamp((s) => s.weekGroups);
  const kits = useCamp((s) => s.kits);
  const start = me ? campStartFor(me) : new Date();
  const [clock, setClock] = useState(() => remaining(new Date(), start));

  useEffect(() => {
    const id = window.setInterval(() => setClock(remaining(new Date(), start)), 1000);
    return () => window.clearInterval(id);
  }, [start]);

  if (!me) return null;

  const weekNow = currentWeekId(personNow(me), me);
  const placements = me.weeks.map((week) => {
    const groupId = groupOf(me, week, groups, weekGroups);
    const group = groupById(groupId ?? null);
    const coach = group ? coachForGroup(group.id, week) : null;
    const meta = CAMP_WEEKS.find((item) => item.id === week);
    return { week, group, coach, meta };
  });
  const thisWeek = placements.find((item) => item.week === weekNow) ?? placements[0];
  const first = me.name.split(" ")[0];
  const span = weeksPhrase(me.weeks);

  return (
    <main>
      <section className="relative min-h-[70vh] overflow-hidden">
        <Photo
          src="/images/hero-lanzarote.jpg"
          alt="Playa Grande, Puerto del Carmen"
          className="absolute inset-0 h-full w-full"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-overlay" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {CAMP_META.name} · {span}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl text-fg sm:text-7xl">
            {first}, thank you for picking us
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-fg/90">
            {me.role === "player"
              ? thisWeek?.group && thisWeek.coach
                ? `You have ${span}. This week you are in ${thisWeek.group.name} with ${thisWeek.coach.name}.`
                : `You have ${span}. Mark will lock your group at welcome if it is not set before.`
              : me.id === "dave"
                ? "You are on staff Week 2 and Week 3. Week 1 is yours. Mark has Group C until you land."
                : `You are on staff for ${span}. Thank you. The group is already looking at you.`}
          </p>
        </div>
      </section>

      {me.role === "player" && placements.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Your weeks</p>
          <h2 className="mt-2 font-display text-4xl text-fg">Group and coach</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            {placements.length > 1
              ? "You bought more than one week. Each week can have its own group and coach."
              : "Your group and the coach on it this week."}
          </p>
          <div
            className={`mt-6 grid gap-3 ${
              placements.length >= 3 ? "grid-cols-3" : placements.length === 2 ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {placements.map((item) => (
              <div key={item.week} className="min-w-0 rounded-md bg-surface p-5 shadow-border">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {item.meta?.label} · {item.meta?.range}
                </p>
                <p className="mt-2 font-display text-3xl text-fg">
                  {item.group?.name ?? "Group TBC"}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {item.coach ? item.coach.name : "Coach locked at welcome"}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {!kits[me.id] ? (
        <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
          <div className="rounded-md bg-surface p-5 shadow-border sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Camp kit</p>
            <h2 className="mt-2 font-display text-4xl text-fg">Top, shorts, name, flag</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              Sizes and the print for your camp kit. Takes a minute. We order from what you save.
            </p>
            <Button asChild className="mt-5" size="lg">
              <Link to="/camp/kit">Set my kit</Link>
            </Button>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {clock.done ? "The week is on" : "Until you start"}
        </p>
        <h2 className="mt-2 font-display text-4xl text-fg sm:text-5xl">
          {clock.done ? "See you on Playa Grande" : `Countdown to ${span}`}
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Days", value: clock.days },
            { label: "Hours", value: clock.hours },
            { label: "Minutes", value: clock.minutes },
            { label: "Seconds", value: clock.seconds },
          ].map((item) => (
            <div key={item.label} className="rounded-md bg-surface px-4 py-6 shadow-border">
              <p className="font-display text-6xl tabular-nums leading-none text-fg sm:text-7xl">
                {String(item.value).padStart(2, "0")}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
          Your first Sunday is arrival. Courts are open that day. Welcome and registration is Monday
          08:45. If you booked more than one week, the Sunday in between is a handover, not a fly-home.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/camp/today">Day by day</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/camp/prepare">What to prepare</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/camp/kit">Your kit</Link>
          </Button>
        </div>

        <LazyMount minHeight={280}>
          <WeatherOutlook weeks={me.weeks} />
        </LazyMount>
      </section>
    </main>
  );
}
