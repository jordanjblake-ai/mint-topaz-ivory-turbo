import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import {
  CHAPTERS,
  scenes,
  type Cam,
  type ChapterId,
  type SceneFx,
  type SoundBed,
} from "@/data/scenes";
import { hybridSound } from "@/lib/sound";
import { bindPress } from "@/lib/ios-press";
import "./story.css";

const BOOK_ART = { w: 1152, h: 1728 };

const HYBRID_DRAW =
  "M -100 -16 C -86 -42 -72 6 -56 -14 C -40 -40 -24 8 -8 -12 C 10 -38 28 6 48 -14 C 66 -36 86 6 108 -14 C 128 -38 154 8 180 -12";
const VACATION_DRAW =
  "M -100 54 C -86 40 -74 66 -62 52 C -50 40 -40 66 -28 52 C -16 40 -6 64 8 52 C 20 40 30 64 42 52 C 54 42 64 62 76 52 C 88 42 100 62 110 52";

function InkOnBook() {
  const [fit, setFit] = useState("xMidYMid slice");

  useEffect(() => {
    const mq = window.matchMedia("(min-aspect-ratio: 11/10)");
    const apply = () => setFit(mq.matches ? "xMidYMid meet" : "xMidYMid slice");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <svg
      className="scene-fx is-ink"
      viewBox={`0 0 ${BOOK_ART.w} ${BOOK_ART.h}`}
      preserveAspectRatio={fit}
      aria-hidden="true"
    >
      <g className="ink-plane" transform="translate(584 1176) rotate(17.1) scale(1 0.72)">
        <defs>
          <mask id="ink-mask-hybrid" maskUnits="userSpaceOnUse">
            <rect x="-220" y="-120" width="460" height="200" fill="black" />
            <path
              className="ink-draw ink-draw-hybrid"
              d={HYBRID_DRAW}
              fill="none"
              stroke="white"
              strokeWidth="88"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="100"
            />
          </mask>
          <mask id="ink-mask-vacations" maskUnits="userSpaceOnUse">
            <rect x="-220" y="8" width="360" height="90" fill="black" />
            <path
              className="ink-draw ink-draw-vacations"
              d={VACATION_DRAW}
              fill="none"
              stroke="white"
              strokeWidth="48"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="100"
            />
          </mask>
        </defs>
        <text className="ink-draft" x="0" y="8" textAnchor="middle">
          Hybryd
        </text>
        <g className="ink-rub">
          <path d="M -168 -18 Q -36 -26 88 -8 T 172 8" />
          <path d="M -158 10 Q -18 20 70 6 T 164 16" />
          <path d="M -148 -6 Q 10 2 158 10" />
        </g>
        <image
          className="ink-logo"
          href="/logos/ink-hybrid.png"
          x="-104"
          y="-58"
          width="292"
          height="90"
          preserveAspectRatio="xMidYMid meet"
          mask="url(#ink-mask-hybrid)"
        />
        <image
          className="ink-logo"
          href="/logos/ink-vacations.png"
          x="-106"
          y="32"
          width="212"
          height="44"
          preserveAspectRatio="xMidYMid meet"
          mask="url(#ink-mask-vacations)"
        />
        <ellipse
          className="ink-nib ink-nib-hybrid"
          rx="4.2"
          ry="1.6"
          style={{ offsetPath: `path("${HYBRID_DRAW}")` } as CSSProperties}
        />
        <ellipse
          className="ink-nib ink-nib-vacations"
          rx="3.4"
          ry="1.3"
          style={{ offsetPath: `path("${VACATION_DRAW}")` } as CSSProperties}
        />
      </g>
    </svg>
  );
}

const STAR4 = "16,0 19.4,11.2 32,16 19.4,20.8 16,32 12.6,20.8 0,16 12.6,11.2";
const STAR4_A = "16,3 21.2,10.2 28.5,16 21.2,21.8 16,29 10.4,21.8 -5.5,16 10.4,10.2";
const STAR4_B = "16,-1.5 18.4,12.4 33.5,16 18.4,19.6 16,33.5 13.6,19.6 3.5,16 13.6,12.4";
const STAR5 =
  "16,1 19.5,11.2 30.3,11.4 21.7,17.9 24.8,28.1 16,22 7.2,28.1 10.3,17.9 1.7,11.4 12.5,11.2";
const STAR5_A =
  "16,3 20.6,10.4 27.8,12.2 21.2,18.4 23.4,27 16,21.2 5.4,29.2 9.2,17.4 -3.2,10.6 12,11.8";
const STAR5_B =
  "16,-1 18.6,12.2 32.4,10.6 22.4,17.2 26.6,30 16,23.2 8.6,26.6 11.2,18.6 4.2,12.4 13.2,10.4";

function seeded(id: string) {
  let s = 17;
  for (const ch of id) s = (s * 31 + ch.charCodeAt(0)) % 2147483647;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function starField(id: string, count: number, glow: number) {
  const rand = seeded(`${id}:${count}:${glow}`);
  return Array.from({ length: count }, () => {
    const x = (rand() * 100).toFixed(2);
    const y = (rand() * 46).toFixed(2);
    const a = (0.28 + rand() * 0.72).toFixed(2);
    return `${x}vw ${y}vh 0 ${glow}px rgb(255 255 255 / ${a})`;
  }).join(",");
}

function StarPoly({ rest, warpA, warpB }: { rest: string; warpA: string; warpB: string }) {
  return (
    <polygon points={rest} fill="#fff">
      <animate
        attributeName="points"
        dur="0.76s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0; 0.38; 0.72; 1"
        keySplines="0.37 0 0.63 1; 0.45 0.05 0.55 0.95; 0.37 0 0.63 1"
        values={`${rest}; ${warpA}; ${warpB}; ${rest}`}
      />
    </polygon>
  );
}

function shootersFor(id: string) {
  const rand = seeded(`shoot:${id}`);
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  return ["a", "b", "c", "d"].map((slot) => {
    const ang = 12 + rand() * 8;
    const distX = 40 + rand() * 26;
    const distY = distX * Math.tan((ang * Math.PI) / 180);
    const dx = -((distX / 100) * vw);
    const dy = (distY / 100) * vw;
    const bend = 0.28 + rand() * 0.5;
    const swell = (rand() - 0.4) * dy * 1.2;
    const c1x = dx * 0.28;
    const c1y = dy * 0.08 + swell * 0.25;
    const c2x = dx * 0.7;
    const c2y = dy * bend + swell;
    const five = slot === "b" || slot === "d";
    const size = slot === "a" ? 13 : slot === "b" ? 9 : slot === "c" ? 16 : 8;
    const sd = 16 + rand() * 16;
    const sdel = 0.8 + rand() * 13;
    const d = `M 0 0 C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${dx.toFixed(1)} ${dy.toFixed(1)}`;
    return {
      slot,
      five,
      d,
      size,
      sd,
      sdel,
      style: {
        "--sy": `${3 + rand() * 8}%`,
        "--sx": `${2 + rand() * 14}%`,
        "--sdel": `${sdel.toFixed(2)}s`,
        "--sd": `${sd.toFixed(2)}s`,
        "--sh": `${size}px`,
      } as CSSProperties,
    };
  });
}

function rainDropsFor(id: string) {
  const gold = id === "ch-gold";
  const week = id === "ch-week";
  const rand = seeded(`rain:${id}`);
  const n = gold ? 56 : week ? 128 : 38;
  return Array.from({ length: n }, (_, i) => {
    const left = rand() * 100;
    const delay = rand() * (week ? 2.6 : 3.4);
    const dur = (gold ? 1.15 : week ? 1.25 : 1.55) + rand() * (gold ? 0.9 : week ? 0.85 : 1.2);
    const len = gold ? 7 + rand() * 9 : week ? 10 + rand() * 14 : 8 + rand() * 11;
    const travel = 42 + rand() * 38;
    const drift = (week ? 2 : 4) + rand() * (week ? 18 : 10);
    const tilt = (week ? 5 + rand() * 9 : 8) + (rand() - 0.5) * 2;
    return {
      i,
      style: {
        left: `${left.toFixed(2)}%`,
        animationDelay: `${delay.toFixed(2)}s`,
        animationDuration: `${dur.toFixed(2)}s`,
        height: `${len.toFixed(1)}px`,
        "--travel": `${travel.toFixed(1)}vh`,
        "--drift": `${drift.toFixed(1)}px`,
        "--tilt": `${tilt.toFixed(1)}deg`,
      } as CSSProperties,
    };
  });
}

function hasFx(fx: SceneFx[] | undefined, kind: SceneFx) {
  return Boolean(fx?.includes(kind));
}

function SceneFxLayers({
  fx,
  bound,
  sceneId = "",
  sun,
}: {
  fx?: SceneFx[];
  bound: "art" | "scene";
  sceneId?: string;
  sun?: { x: string; y: string };
}) {
  if (!fx?.length) return null;
  if (bound === "art") {
    return (
      <>
        {hasFx(fx, "sun") ? (
          <div
            className="scene-fx is-sun"
            style={
              sun
                ? ({ "--sun-x": sun.x, "--sun-y": sun.y } as CSSProperties)
                : undefined
            }
            aria-hidden="true"
          />
        ) : null}
        {hasFx(fx, "waves") ? (
          <div className="scene-fx is-waves" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : null}
        {hasFx(fx, "clouds") ? (
          <div className="scene-fx is-clouds" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : null}
        {hasFx(fx, "grass") ? (
          <div className="scene-fx is-grass" aria-hidden="true">
            {Array.from({ length: 30 }, (_, i) => (
              <span
                key={i}
                className="grass-blade"
                style={
                  {
                    left: `${2 + ((i * 17) % 92) * 0.42}%`,
                    height: `${32 + ((i * 13) % 36)}%`,
                    width: `${4 + (i % 3)}px`,
                    animationDelay: `${((i * 17) % 120) / 100}s`,
                    animationDuration: `${2.1 + ((i * 7) % 12) / 10}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ) : null}
        {hasFx(fx, "sunrise") ? (
          <div className="scene-fx is-sunrise" aria-hidden="true">
            <span className="sunrise-sky" />
            <span className="sunrise-sun" />
          </div>
        ) : null}
        {hasFx(fx, "lamp") ? (
          <div className="scene-fx is-lamp" aria-hidden="true">
            <span className="lamp-glow" />
            <span className="lamp-wash" />
          </div>
        ) : null}
        {hasFx(fx, "ink") ? <InkOnBook /> : null}
        {hasFx(fx, "rain") ? (
          <div
            className={`scene-fx is-rain ${sceneId === "ch-gold" ? "is-rain-fine" : "is-rain-soft"}`}
            aria-hidden="true"
          >
            {rainDropsFor(sceneId).map((drop) => (
              <i key={drop.i} className="rain-drop" style={drop.style} />
            ))}
          </div>
        ) : null}
      </>
    );
  }
  return (
    <>
      {hasFx(fx, "stars") ? (
        <div className="scene-fx is-stars" data-sky={sceneId} aria-hidden="true">
          <span className="star-layer is-a" style={{ boxShadow: starField(`${sceneId}-a`, 48, 0) }} />
          <span className="star-layer is-b" style={{ boxShadow: starField(`${sceneId}-b`, 28, 0.4) }} />
          <span className="star-layer is-c" style={{ boxShadow: starField(`${sceneId}-c`, 14, 0.8) }} />
          {shootersFor(sceneId).map((shot) => {
            const rest = shot.five ? STAR5 : STAR4;
            const warpA = shot.five ? STAR5_A : STAR4_A;
            const warpB = shot.five ? STAR5_B : STAR4_B;
            const scale = shot.size / 32;
            const gid = `st-${sceneId}-${shot.slot}`;
            const tail = shot.size * 4.6;
            return (
              <span key={shot.slot} className={`shoot-pack is-${shot.slot}`} style={shot.style}>
                <svg className="shoot-svg" aria-hidden="true" overflow="visible">
                  <defs>
                    <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                      <stop offset="0.45" stopColor="#fff" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g className="shoot-mover">
                    <animateMotion
                      dur={`${shot.sd.toFixed(2)}s`}
                      begin={`${shot.sdel.toFixed(2)}s`}
                      repeatCount="indefinite"
                      rotate="auto-reverse"
                      path={shot.d}
                      keyTimes="0;0.70;0.88;1"
                      keyPoints="0;0;1;1"
                      calcMode="spline"
                      keySplines="0 0 1 1; 0.37 0 0.63 1; 0 0 1 1"
                    />
                    <path
                      className="shoot-tail"
                      d={`M ${shot.size * 0.2} 0 L ${tail} 0`}
                      fill="none"
                      stroke={`url(#${gid})`}
                      strokeWidth={Math.max(1.2, shot.size * 0.14)}
                      strokeLinecap="round"
                    />
                    <g className="shoot-spin">
                      <g
                        transform={`translate(${(-shot.size / 2).toFixed(2)}, ${(-shot.size / 2).toFixed(2)}) scale(${scale.toFixed(3)})`}
                      >
                        <StarPoly rest={rest} warpA={warpA} warpB={warpB} />
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
            );
          })}
        </div>
      ) : null}
      {hasFx(fx, "mist") ? <div className="scene-fx is-mist" aria-hidden="true" /> : null}
      {hasFx(fx, "dust") ? <div className="scene-fx is-dust" aria-hidden="true" /> : null}
    </>
  );
}

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
                <div className="scene-art-live">
                  {scene.video ? (
                    <video
                      src={scene.video}
                      poster={scene.art}
                      muted
                      loop={scene.id !== "dawn"}
                      playsInline
                      autoPlay
                      preload="metadata"
                    />
                  ) : (
                    <img src={scene.art} alt="" />
                  )}
                  <SceneFxLayers fx={scene.fx} bound="art" sceneId={scene.id} sun={scene.sun} />
                  {scene.id === "dawn" ? (
                    <p className="scene-credit">
                      <span>Designed by</span>
                      <img src="/art/credit-jordan-blake.png" alt="Jordan Blake" />
                    </p>
                  ) : null}
                </div>
              </div>
              <SceneFxLayers fx={scene.fx} bound="scene" sceneId={scene.id} />
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
