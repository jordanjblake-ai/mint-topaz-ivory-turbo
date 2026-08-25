import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>
  );
}

export function Section({
  className,
  children,
  id,
  defer = false,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  defer?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("py-16 sm:py-24", defer && !id && "[content-visibility:auto] [contain-intrinsic-size:auto_36rem]", className)}
    >
      {children}
    </section>
  );
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{children}</p>
  );
}

export function Display({
  as: Tag = "h2",
  children,
  className,
}: {
  as?: "h1" | "h2" | "h3";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tag className={cn("font-display tracking-wide text-fg", className)}>{children}</Tag>
  );
}
