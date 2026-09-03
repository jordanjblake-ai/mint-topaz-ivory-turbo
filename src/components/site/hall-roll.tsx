import { hallNameColumns } from "@/data/hall-of-fame";
import { cn } from "@/lib/utils";
import { Container, Display, Kicker } from "@/components/site/section";

export function HallRoll() {
  const columns = hallNameColumns();

  return (
    <section className="border-y border-border bg-paper text-ink" aria-label="Hall of Fame names">
      <Container className="py-16 sm:py-24">
        <Kicker>The names</Kicker>
        <Display className="mt-2 text-4xl text-ink sm:text-5xl">Present</Display>
        <ol className="mt-12 grid list-none grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column, index) => (
            <li
              key={column.roman}
              className={cn(
                "min-w-0 border-ink/10 px-1 py-8 md:px-8",
                index > 0 && "border-t md:border-t-0",
                index % 2 === 1 && "md:border-l",
                index > 0 && "xl:border-l",
                index >= 2 && "md:border-t xl:border-t-0",
              )}
            >
              <p className="mb-8 font-display text-sm tracking-[0.28em] text-ink/40">{column.roman}</p>
              <ol className="list-none space-y-5">
                {column.names.map((name) => (
                  <li key={name} className={column.className}>
                    {name}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
