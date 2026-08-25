import { CAMP_WEEKS, weatherForWeeks, weekIdOnDate, weeksPhrase } from "@/data/camp";

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
          const slice = days.filter((day) => weekIdOnDate(day.date, weeks) === week.id);
          if (slice.length === 0) return null;
          return (
            <div key={week.id}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {week.label} · {week.range}
              </p>
              <div className="-mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <div className="flex gap-2">
                  {slice.map((day) => (
                    <div key={day.date} className="w-28 shrink-0 rounded-md bg-surface p-4 shadow-border">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                        {day.date.slice(8, 10)} {day.date.startsWith("2027-01") ? "Jan" : "Feb"}
                      </p>
                      <p className="mt-3 font-display text-4xl leading-none text-fg">{day.high}°</p>
                      <p className="mt-1 text-sm text-muted">{day.low}° night</p>
                      <p className="mt-3 text-xs text-fg">{day.sky}</p>
                      <p className="mt-1 text-xs text-muted">
                        Wind {day.wind} km/h · UV {day.uv}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
