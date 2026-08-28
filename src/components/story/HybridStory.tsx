import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CHAPTERS, scenes, type Cam, type ChapterId, type SoundBed } from "@/data/scenes";
import { hybridSound } from "@/lib/sound";
import { bindPress } from "@/lib/ios-press";

function envelope(
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) {
  if (p <= inStart) return 0;
  if (p < inEnd) return (p - inStart) / (inEnd - inStart);
  if (p < outStart) return 1;
  if (p < outEnd) return 1 - (p - outStart) / (outEnd - outStart);
  return 0;
}

function lineIn(copyO: number, lag: number) {
  return Math.max(0, Math.min(1, (copyO - lag) / 0.38));
}

function camera(kind: Cam, p: number, still?: boolean) {
  if (still || kind === "still") {
    return { x: 0, y: 0, s: 1.045, o: "center center" };
  }
  switch (kind) {
    case "in":
      return { x: p * -1.4, y: p * 2.4, s: 1.06 + p * 0.16, o: "center 40%" };
    case "left":
      return { x: 7 - p * 16, y: p * 1.2, s: 1.14, o: "72% 45%" };
    case "right":
      return { x: -8 + p * 16, y: p * -1, s: 1.14, o: "28% 48%" };
    case "up":
      return { x: p * 1.1, y: 9 - p * 18, s: 1.16, o: "50% 82%" };
    case "down":
      return { x: p * -0.8, y: -5 + p * 14, s: 1.12, o: "50% 18%" };
    default:
      return { x: 0, y: 0, s: 1.08, o: "center center" };
  }
}

function SoundMark({ on }: { on: boolean }) {
  return (
    <span className={on ? "sound-mark is-on" : "sound-mark"} aria-hidden="true">
      <svg viewBox="0 0 28 28" width="22" height="22">
        <circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" strokeWidth="1.4" />
        {on ? (
          <path
            d="M9.2 14.4c1.6-3.2 4.2-5 8.2-6.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ) : null}
      </svg>
    </span>
  );
}

function SoundToggle({
  on,
  live,
  onToggle,
}: {
  on: boolean;
  live: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef(onToggle);
  toggleRef.current = onToggle;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return bindPress(el, () => toggleRef.current());
  }, []);

  const waiting = on && !live;
  const title = waiting ? "Tap for sound" : on ? "Sound on" : "Sound off";
  const note = waiting
    ? "A court, a whistle, wind."
    : on
      ? "A court, a whistle, wind."
      : "Pictures only. The quiet version.";

  return (
    <button
      ref={ref}
      type="button"
      data-sound-toggle="true"
      className={["ink-toggle", on && live ? "is-on" : "", waiting ? "is-wait" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-pressed={on && live}
      aria-label={title}
    >
      <SoundMark on={on && live} />
      <span className="ink-toggle-copy">
        <span className="ink-toggle-title">{title}</span>
        <span className="ink-toggle-note">{note}</span>
      </span>
    </button>
  );
}

export function HybridStory() {
  const [soundOn, setSoundOn] = useState(true);
  const [live, setLive] = useState(false);
  const [runningChapter, setRunningChapter] = useState<ChapterId>(scenes[0].chapter);
  const rootRef = useRef<HTMLElement | null>(null);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);
  const hitOnce = useRef<Set<string>>(new Set());
  const bedRef = useRef<SoundBed | null>(null);
  const soundOnRef = useRef(true);
  const liveRef = useRef(false);
  const ignoreToggleUntil = useRef(0);
  soundOnRef.current = soundOn;
  liveRef.current = live;

  function armAudio() {
    hybridSound.unlock();
    if (!soundOnRef.current) {
      hybridSound.setEnabled(false);
      return;
    }
    hybridSound.setEnabled(true);
    hybridSound.setBed(bedRef.current ?? "open");
  }

  useEffect(() => hybridSound.onRunning(setLive), []);

  useEffect(() => {
    const unlock = () => {
      if (!soundOnRef.current) return;
      if (!liveRef.current) ignoreToggleUntil.current = performance.now() + 900;
      armAudio();
    };
    document.addEventListener("touchstart", unlock, { capture: true, passive: true });
    document.addEventListener("pointerdown", unlock, { capture: true, passive: true });
    document.addEventListener("click", unlock, { capture: true });
    return () => {
      document.removeEventListener("touchstart", unlock, true);
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("click", unlock, true);
    };
  }, []);

  useEffect(() => {
    scenes.forEach((s) => {
      const img = new Image();
      img.src = s.art;
    });
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const storyP = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      rootRef.current?.style.setProperty("--story-p", String(storyP));

      const mid = window.innerHeight * 0.42;
      let activeBed: SoundBed = scenes[0].sound;
      let activeChapter: ChapterId = scenes[0].chapter;

      sceneRefs.current.forEach((el, i) => {
        if (!el) return;
        const scene = scenes[i];
        const rect = el.getBoundingClientRect();
        const travel = el.offsetHeight - window.innerHeight;
        const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
        el.style.setProperty("--p", String(p));
        const dateO = scene.date
          ? envelope(p, 0.06, 0.16, scene.id === "dawn" ? 1.2 : 0.84, scene.id === "dawn" ? 1.3 : 0.96)
          : 0;
        const copyO = envelope(
          p,
          scene.date ? 0.18 : -1,
          scene.date ? 0.3 : 0,
          scene.id === "dawn" ? 1.2 : 0.78,
          scene.id === "dawn" ? 1.3 : 0.92,
        );
        const plateO = scene.plate ? envelope(p, 0.02, 0.2, 0.72, 0.94) : 0;
        const enterV =
          scene.id === "cover" || scene.plate ? 0 : p < 0.1 ? 1 - p / 0.1 : 0;
        const exitV = scene.id === "dawn" ? 0 : p > 0.88 ? (p - 0.88) / 0.12 : 0;
        const cam = camera(scene.cam, p, scene.still);
        el.style.setProperty("--date-o", dateO.toFixed(3));
        el.style.setProperty("--copy-o", copyO.toFixed(3));
        el.style.setProperty("--l0", lineIn(scene.plate ? plateO : copyO, 0).toFixed(3));
        el.style.setProperty("--l1", lineIn(scene.plate ? plateO : copyO, 0.12).toFixed(3));
        el.style.setProperty("--l2", lineIn(scene.plate ? plateO : copyO, 0.24).toFixed(3));
        el.style.setProperty("--lc", lineIn(copyO, 0.28).toFixed(3));
        el.style.setProperty("--lw", lineIn(copyO, 0.38).toFixed(3));
        el.style.setProperty("--veil", Math.max(enterV, exitV).toFixed(3));
        el.style.setProperty("--wx", envelope(p, 0.04, 0.18, 0.86, 0.98).toFixed(3));
        el.style.setProperty("--cx", cam.x.toFixed(3));
        el.style.setProperty("--cy", cam.y.toFixed(3));
        el.style.setProperty("--cs", cam.s.toFixed(3));
        el.style.setProperty("--co", cam.o);
        el.style.setProperty("--mark-o", envelope(p, 0, 0.12, 0.9, 1).toFixed(3));
        el.style.setProperty("--plate-o", plateO.toFixed(3));
        el.style.setProperty("--lit", envelope(p, 0.04, 0.22, 0.7, 0.92).toFixed(3));

        if (rect.top <= mid && rect.bottom > mid) {
          activeBed = scene.sound;
          activeChapter = scene.chapter;
        }

        if (scene.hit && !reduced && p > 0.12 && !hitOnce.current.has(scene.id)) {
          hitOnce.current.add(scene.id);
          el.classList.add("is-hit");
          const art = el.querySelector(".scene-art");
          art?.classList.add("is-hit");
        }
      });

      if (bedRef.current !== activeBed) {
        bedRef.current = activeBed;
        if (hybridSound.isStarted) hybridSound.setBed(activeBed);
      }
      const ink = CHAPTERS[activeChapter].ink;
      rootRef.current?.style.setProperty("--ink", ink);
      setRunningChapter((prev) => (prev === activeChapter ? prev : activeChapter));
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function onSoundPress() {
    const now = performance.now();
    if (!liveRef.current || now < ignoreToggleUntil.current) {
      ignoreToggleUntil.current = now + 600;
      setSoundOn(true);
      soundOnRef.current = true;
      armAudio();
      return;
    }
    const next = !soundOnRef.current;
    setSoundOn(next);
    soundOnRef.current = next;
    if (next) armAudio();
    else hybridSound.setEnabled(false);
  }

  return (
    <main ref={rootRef} className={`hybrid-story bg-charcoal text-paper is-ch-${runningChapter}`}>
      <div className="story-progress" aria-hidden="true" />
      <Link to="/" className="story-home">
        Hybrid
      </Link>
      <p className="chapter-running" aria-live="polite">
        <span>{CHAPTERS[runningChapter].roman}</span>
        {" · "}
        {CHAPTERS[runningChapter].title}
      </p>
      <div className="story-chrome">
        <SoundToggle on={soundOn} live={live} onToggle={onSoundPress} />
      </div>

      {scenes.map((scene, i) => {
        const plate = scene.plate ? CHAPTERS[scene.chapter] : null;
        return (
          <section
            key={scene.id}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            className={[
              "scene",
              `is-${scene.grade}`,
              `is-cam-${scene.cam}`,
              scene.weather ? `is-wx-${scene.weather}` : "",
              scene.still ? "is-still" : "",
              scene.id === "dawn" ? "is-last" : "",
              scene.plate ? "is-plate" : "",
              i === 0 ? "is-cover" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label={
              plate ? `Chapter ${plate.roman}. ${plate.title}` : (scene.date ?? "The story isn’t finished")
            }
          >
            <div className="scene-sticky">
              <div className="scene-art">
                <img src={scene.art} alt="" />
              </div>
              <div className="scene-tint" aria-hidden="true" />
              <div className="scene-light" aria-hidden="true" />
              <div className="scene-tone" aria-hidden="true" />
              <div className="scene-wash" aria-hidden="true" />
              <div className="scene-inkedge" aria-hidden="true" />
              {scene.weather && scene.weather !== "none" ? (
                <div className={`scene-wx is-${scene.weather}`} aria-hidden="true" />
              ) : null}
              <div className="scene-read" aria-hidden="true" />
              <div className="scene-grain" aria-hidden="true" />
              <div className="scene-flash" aria-hidden="true" />
              <div className="scene-veil" aria-hidden="true" />
              {scene.mark && !scene.plate ? (
                <div
                  className={scene.mark === "badge" ? "scene-mark is-badge" : "scene-mark is-wordmark"}
                >
                  <img
                    src={
                      scene.mark === "badge" ? "/logos/logo-badge.png" : "/logos/logo-wordmark.png"
                    }
                    alt=""
                  />
                </div>
              ) : null}
              {plate ? (
                <div className="chapter-plate">
                  <p className="chapter-label">Chapter</p>
                  <p className="chapter-roman">{plate.roman}</p>
                  <h2 className="chapter-title">{plate.title}</h2>
                  <p className="chapter-kicker">{plate.kicker}</p>
                </div>
              ) : (
                <div className="scene-copy">
                  {scene.date ? <h2 className="scene-date">{scene.date}</h2> : null}
                  <div className="scene-body">
                    {scene.lines.map((line, li) => (
                      <p key={line} className={`scene-line is-${li}`}>
                        {line}
                      </p>
                    ))}
                    {scene.closer ? <p className="scene-closer">{scene.closer}</p> : null}
                    {scene.whisper ? <p className="scene-whisper">{scene.whisper}</p> : null}
                  </div>
                </div>
              )}
              {i === 0 ? (
                <div className="scroll-cue" aria-hidden="true">
                  <span>scroll</span>
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
    </main>
  );
}
