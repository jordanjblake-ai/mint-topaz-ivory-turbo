import { CAMP_WEEKS, weatherDatesForWeek, weatherForWeeks, weeksPhrase } from "@/data/camp";

export function WeatherOutlook({ weeks }: { weeks: number[] }) {
  const days = weatherForWeeks(weeks);
  if (days.length === 0) return null;

  const present = CAMP_WEEKS.filter((week) => weeks.includes(week.id));

  return (
    <section className="mt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Playa Grande</p>
      <h2 className="mt-2 font-display text-4xl text-fg">Weather for {weeksPhrase(weeks)}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Only the days you are on the island. Warm for training, wind on a couple of days, almost no
        rain. UV still counts. Outlook, not a live hourly forecast.
      </p>
      <div className="mt-6 space-y-8">
        {present.map((week) => {
          const allow = new Set(weatherDatesForWeek(week.id));
          const slice = days.filter((day) => allow.has(day.date));
          if (slice.length === 0) return null;
          return (
            <div key={week.id}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {week.label} · {week.range}
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2 landscape:grid-cols-8 lg:grid-cols-8">
                {slice.map((day) => (
                  <div key={day.date} className="min-w-0 rounded-md bg-surface p-2.5 shadow-border sm:p-3">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                      {day.date.slice(8, 10)} {day.date.startsWith("2027-01") ? "Jan" : "Feb"}
                    </p>
                    <p className="mt-2 font-display text-2xl leading-none text-fg sm:text-3xl lg:text-4xl">{day.high}°</p>
                    <p className="mt-1 text-xs text-muted sm:text-sm">{day.low}° night</p>
                    <p className="mt-2 text-[0.7rem] text-fg sm:text-xs">{day.sky}</p>
                    <p className="mt-1 text-[0.65rem] text-muted sm:text-xs">
                      Wind {day.wind} · UV {day.uv}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}