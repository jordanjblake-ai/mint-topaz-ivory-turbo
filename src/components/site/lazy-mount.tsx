import type { ReactNode } from "react";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

export function LazyMount({
  children,
  className,
  minHeight = 12,
  rootMargin = "480px 0px",
}: {
  children: ReactNode;
  className?: string;
  minHeight?: number;
  rootMargin?: string;
}) {
  const { ref, shown } = useInView<HTMLDivElement>(false, rootMargin);
  return (
    <div ref={ref} className={cn(className)} style={shown ? undefined : { minHeight }}>
      {shown ? children : null}
    </div>
  );
}
