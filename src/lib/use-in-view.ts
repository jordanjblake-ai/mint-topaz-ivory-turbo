import { useCallback, useEffect, useState } from "react";

export function useInView<T extends Element>(immediate = false, rootMargin = "400px 0px") {
  const [node, setNode] = useState<T | null>(null);
  const [shown, setShown] = useState(immediate);
  const ref = useCallback((el: T | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (immediate || shown || !node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [immediate, shown, rootMargin, node]);

  return { ref, shown };
}
