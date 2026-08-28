import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  COMMUNITY_COLS,
  communityImages,
  communityStory,
  muralRowCount,
  pickCommunitySlots,
} from "@/data/community";
import { Container, Display, Kicker } from "@/components/site/section";

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function defaultSlots() {
  const rows = muralRowCount();
  return communityImages.slice(0, rows * COMMUNITY_COLS);
}

export function CommunityIntro() {
  const [open, setOpen] = useState(false);
  const [slots, setSlots] = useState(defaultSlots);
  const introRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const openedRef = useRef(false);

  useLayoutEffect(() => {
    setSlots(pickCommunitySlots());
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    const scroller = scrollRef.current;
    if (!grid || !scroller || open) return;

    const rows = [...grid.querySelectorAll<HTMLElement>("[data-community-row]")];
    if (rows.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.innerWidth >= 768;
    if (wide) document.documentElement.classList.add("community-lock");

    if (!wide) {
      const centre = () => {
        scroller.scrollLeft = Math.max(0, (scroller.scrollWidth - scroller.clientWidth) / 2);
      };
      centre();
      const centreRaf = window.requestAnimationFrame(centre);
      return () => {
        window.cancelAnimationFrame(centreRaf);
        document.documentElement.classList.remove("community-lock");
      };
    }

    const winsize = { width: window.innerWidth };
    const mouse = { x: winsize.width / 2 };
    const middle = Math.floor(rows.length / 2);
    const styles = rows.map((_, index) => ({
      amt: Math.max(0.1 - Math.abs(index - middle) * 0.03, 0.05),
      x: 0,
      contrast: 100,
      brightness: 100,
    }));
    let raf = 0;
    let running = true;

    const onResize = () => {
      winsize.width = window.innerWidth;
    };
    const onMouse = (event: MouseEvent) => {
      mouse.x = event.clientX;
    };
    const render = () => {
      if (!running) return;
      const mappedX = ((mouse.x / winsize.width) * 2 - 1) * 0.4 * winsize.width;
      const edge = Math.pow(Math.abs((mouse.x / winsize.width) * 2 - 1), 2);
      const mappedContrast = reduced ? 100 : 100 + edge * 230;
      const mappedBrightness = reduced ? 100 : 100 - edge * 85;
      rows.forEach((row, index) => {
        const style = styles[index]!;
        style.x = lerp(style.x, mappedX, style.amt);
        style.contrast = lerp(style.contrast, mappedContrast, style.amt);
        style.brightness = lerp(style.brightness, mappedBrightness, style.amt);
        row.style.transform = `translate3d(${style.x}px, 0, 0)`;
        row.style.filter = `contrast(${style.contrast}%) brightness(${style.brightness}%)`;
      });
      raf = window.requestAnimationFrame(render);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    raf = window.requestAnimationFrame(render);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      document.documentElement.classList.remove("community-lock");
      rows.forEach((row) => {
        row.style.transform = "";
        row.style.filter = "";
      });
    };
  }, [open, slots]);

  useEffect(() => {
    if (open) return;
    const intro = introRef.current;
    const btn = buttonRef.current;
    if (!intro || !btn) return;

    const tap = { x: 0, y: 0, onButton: false };

    const hitButton = (x: number, y: number) => {
      const box = btn.getBoundingClientRect();
      const pad = 12;
      return x >= box.left - pad && x <= box.right + pad && y >= box.top - pad && y <= box.bottom + pad;
    };

    const onStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      tap.x = touch.clientX;
      tap.y = touch.clientY;
      tap.onButton = hitButton(touch.clientX, touch.clientY);
    };

    const onEnd = (event: TouchEvent) => {
      if (!tap.onButton) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - tap.x;
      const dy = touch.clientY - tap.y;
      if (dx * dx + dy * dy > 1600) return;
      event.preventDefault();
      event.stopPropagation();
      explore();
      if (window.location.hash !== "#community-story") {
        window.location.hash = "#community-story";
      }
    };

    intro.addEventListener("touchstart", onStart, { capture: true, passive: true });
    intro.addEventListener("touchend", onEnd, { capture: true, passive: false });
    return () => {
      intro.removeEventListener("touchstart", onStart, true);
      intro.removeEventListener("touchend", onEnd, true);
    };
  }, [open]);

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#community-story") explore();
    };
    window.addEventListener("hashchange", sync);
    sync();
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.remove("community-lock");
    const story = document.getElementById("community-story");
    const id = window.requestAnimationFrame(() => {
      story?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  function explore() {
    if (openedRef.current) return;
    openedRef.current = true;
    document.documentElement.classList.remove("community-lock");
    setOpen(true);
  }

  const cols = COMMUNITY_COLS;
  const rows = Math.max(1, Math.ceil(slots.length / cols));
  const muralStyle = {
    "--mural-cols": cols,
    "--mural-rows": rows,
    "--mural-w": cols * 4,
    "--mural-h": rows * 5,
  } as React.CSSProperties;

  return (
    <>
      <section
        ref={introRef}
        className={`community-intro${open ? " is-open" : ""}`}
        style={muralStyle}
        aria-label="Hybrid community"
      >
        <div ref={scrollRef} className="community-scroller">
          <div ref={gridRef} className="community-grid">
            {Array.from({ length: rows }, (_, row) => (
              <div key={row} className="community-row" data-community-row>
                {Array.from({ length: cols }, (_, col) => {
                  const index = row * cols + col;
                  const src = slots[index];
                  if (!src) return null;
                  return (
                    <div key={`${row}-${col}`} className="community-cell">
                      <div className="community-cell-inner">
                        <img src={src} alt="" className="community-cell-img" draggable={false} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        {open ? null : (
          <a
            ref={buttonRef}
            href="#community-story"
            className="community-explore"
            onClick={explore}
          >
            Explore
          </a>
        )}
      </section>

      <section className={`community-story${open ? " is-visible" : ""}`} id="community-story">
        <Container className="relative z-10 max-w-3xl py-16 sm:py-24">
          <Kicker>Community</Kicker>
          <Display className="mt-3 text-5xl sm:text-7xl">The people that make Hybrid</Display>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Come for the sport. Stay for the people. Leave with memories.
          </p>

          <div className="mt-16 grid gap-16">
            {communityStory.map((block) => (
              <article key={block.title}>
                <Kicker>{block.kicker}</Kicker>
                <h2 className="mt-2 font-display text-4xl text-fg sm:text-5xl">{block.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-muted">{block.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 border-t border-border pt-10">
            <p className="font-display text-3xl text-fg">Come for the sport. Stay for the people.</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">Leave with memories.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/vacations/lanzarote">Book Lanzarote</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">Get in touch</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
