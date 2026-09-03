import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CHAPTERS, scenes, type Cam, type ChapterId, type SoundBed } from "@/data/scenes";
import { hybridSound } from "@/lib/sound";
import { bindPress } from "@/lib/ios-press";
import "./story.css";

const CHAPTER_ORDER: ChapterId[] = ["name", "island", "week", "gold", "serve"];
const SOUND_KEY = "hybrid-story-sound";

function camera(kind: Cam, p: number, still?: boolean) {
  if (still || kind === "still") return { x: 0, y: 0, s: 1.03, o: "center center" };
  if (kind === "left") return { x: 4 - p * 8, y: p * 0.6, s: 1.06, o: "62% 46%" };
  if (kind === "right") return { x: -4 + p * 8, y: p * -0.4, s: 1.06, o: "38% 48%" };
  return { x: p * -0.6, y: p * 1.2, s: 1.04 + p * 0.06, o: "center 42%" };
}

function persistSound(on: boolean) {
  try {
    if (on) sessionStorage.setItem(SOUND_KEY, "1");
    else sessionStorage.removeItem(SOUND_KEY);
  } catch {
    /* private mode */
  }
}

function SoundToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef(onToggle);
  toggleRef.current = onToggle;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return bindPress(el, () => toggleRef.current());
  }, []);

  const label = on ? "Sound on" : "Sound";

  return (
    <button
      ref={ref}
      type="button"
      data-sound-toggle="true"
      className={on ? "ink-toggle is-on" : "ink-toggle"}
      aria-pressed={on}
      aria-label={label}
    >
      <span className={on ? "sound-mark is-on" : "sound-mark"} aria-hidden="true">
        <svg viewBox="0 0 28 28" width="20" height="20">
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
      <span className="ink-toggle-title">{label}</span>
    </button>
  );
}

function RailMark({
  id,
  active,
  onJump,
}: {
  id: ChapterId;
  active: boolean;
  onJump: (id: ChapterId) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const jumpRef = useRef(onJump);
  jumpRef.current = onJump;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return bindPress(el, () => jumpRef.current(id));
  }, [id]);

  return (
    <button ref={ref} type="button" className={active ? "is-now" : ""} aria-current={active ? "true" : undefined}>
      {CHAPTERS[id].roman}
    </button>
  );
}

export function HybridStory() {
  const [soundOn, setSoundOn] = useState(false);
  const [runningChapter, setRunningChapter] = useState<ChapterId>(scenes[0].chapter);
  const rootRef = useRef<HTMLElement | null>(null);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);
  const bedRef = useRef<SoundBed | null>(null);
  const soundOnRef = useRef(false);
  const startingRef = useRef(false);
  soundOnRef.current = soundOn;

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
        const travel = Math.max(1, el.offsetHeight - window.innerHeight);
        const p = Math.min(1, Math.max(0, -rect.top / travel));
        el.style.setProperty("--p", String(p));
        const cam = reduced ? camera("still", 0, true) : camera(scene.cam, p, scene.still);
        el.style.setProperty("--copy-o", "1");
        el.style.setProperty("--l0", "1");
        el.style.setProperty("--l1", "1");
        el.style.setProperty("--l2", "1");
        el.style.setProperty("--l3", "1");
        el.style.setProperty("--lc", "1");
        el.style.setProperty("--cx", cam.x.toFixed(3));
        el.style.setProperty("--cy", cam.y.toFixed(3));
        el.style.setProperty("--cs", cam.s.toFixed(3));
        el.style.setProperty("--co", cam.o);
        el.classList.toggle(
          "is-near",
          rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08,
        );

        const vid = el.querySelector("video");
        if (vid) {
          if (el.classList.contains("is-near")) {
            if (!vid.ended) void vid.play().catch(() => {});
          } else {
            vid.pause();
            if (!vid.loop) vid.currentTime = 0;
          }
        }

        if (rect.top <= mid && rect.bottom > mid) {
          activeBed = scene.sound;
          activeChapter = scene.chapter;
        }
      });

      if (bedRef.current !== activeBed) {
        bedRef.current = activeBed;
        if (hybridSound.isStarted) hybridSound.setBed(activeBed);
      }
      rootRef.current?.style.setProperty("--ink", CHAPTERS[activeChapter].ink);
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
    if (startingRef.current) return;
    if (soundOnRef.current) {
      setSoundOn(false);
      soundOnRef.current = false;
      persistSound(false);
      hybridSound.setEnabled(false);
      return;
    }
    startingRef.current = true;
    void hybridSound
      .tryStart()
      .then((ok) => {
        if (!ok) {
          setSoundOn(false);
          soundOnRef.current = false;
          persistSound(false);
          hybridSound.setEnabled(false);
          return;
        }
        hybridSound.setEnabled(true);
        hybridSound.setBed(bedRef.current ?? "open");
        setSoundOn(true);
        soundOnRef.current = true;
        persistSound(true);
      })
      .catch(() => {
        setSoundOn(false);
        soundOnRef.current = false;
        persistSound(false);
        hybridSound.setEnabled(false);
      })
      .finally(() => {
        startingRef.current = false;
      });
  }

  function goChapter(id: ChapterId) {
    const el = document.querySelector<HTMLElement>(`[data-chapter-start="${id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const chapterStartId = CHAPTER_ORDER.reduce(
    (map, id) => {
      const scene = scenes.find((item) => item.chapter === id && !item.cover);
      if (scene) map[id] = scene.id;
      return map;
    },
    {} as Record<ChapterId, string>,
  );

  return (
    <main ref={rootRef} className={`hybrid-story is-ch-${runningChapter}`}>
      <Link to="/" className="story-home">
        Hybrid
      </Link>
      <nav className="story-rail" aria-label="Chapters">
        {CHAPTER_ORDER.map((id) => (
          <RailMark key={id} id={id} active={runningChapter === id} onJump={goChapter} />
        ))}
      </nav>
      <div className="story-chrome">
        <SoundToggle on={soundOn} onToggle={onSoundPress} />
      </div>

      {scenes.map((scene, i) => {
        const start = chapterStartId[scene.chapter] === scene.id;
        const chapter = CHAPTERS[scene.chapter];
        return (
          <section
            key={scene.id}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            data-chapter-start={start ? scene.chapter : undefined}
            className={[
              "scene",
              `is-${scene.grade}`,
              scene.still ? "is-still" : "",
              scene.cover ? "is-cover" : "",
              scene.last ? "is-last" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label={
              scene.cover
                ? "Sixteen months from a name to a world-tour court."
                : start
                  ? `${chapter.roman}. ${chapter.title}. ${scene.date ?? ""}`
                  : (scene.date ?? chapter.title)
            }
          >
            <div className="scene-sticky">
              <div className="scene-art">
                <div className="scene-art-live">
                  {scene.video ? (
                    <video
                      src={scene.video}
                      poster={scene.art}
                      muted
                      loop={scene.id !== "serve"}
                      playsInline
                      autoPlay
                      preload="metadata"
                    />
                  ) : (
                    <img src={scene.art} alt="" />
                  )}
                </div>
                <div className="scene-wash" aria-hidden="true" />
                <div className="scene-grain" aria-hidden="true" />
              </div>
              <div className="scene-copy">
                {start ? (
                  <p className="scene-act">
                    <span>{chapter.roman}</span>
                    {chapter.title}
                  </p>
                ) : null}
                {scene.date ? <h2 className="scene-date">{scene.date}</h2> : null}
                <div className="scene-body">
                  {scene.lines.map((line, li) => (
                    <p key={line} className={`scene-line is-${li}`}>
                      {line}
                    </p>
                  ))}
                  {scene.closer ? <p className="scene-closer">{scene.closer}</p> : null}
                </div>
                {scene.cover ? (
                  <p className="scroll-cue" aria-hidden="true">
                    scroll
                  </p>
                ) : null}
                {scene.last ? (
                  <>
                    <p className="scene-next">
                      <Link to="/vacations/lanzarote">Lanzarote 2027</Link>
                      <Link to="/community/club">The Club</Link>
                    </p>
                    <p className="scene-credit">
                      <span>Designed by</span>
                      <img src="/art/credit-jordan-blake.png" alt="" />
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
