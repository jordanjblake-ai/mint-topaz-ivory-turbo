type PressOpts = {
  exclude?: string;
};

function skipped(target: EventTarget | null, exclude?: string) {
  return Boolean(exclude && target instanceof Element && target.closest(exclude));
}

function point(e: Event): { clientX: number; clientY: number } | null {
  if ("changedTouches" in e) {
    const t = (e as TouchEvent).changedTouches[0];
    if (t) return t;
  }
  if ("touches" in e) {
    const t = (e as TouchEvent).touches[0];
    if (t) return t;
  }
  if ("clientX" in e) {
    const p = e as PointerEvent | MouseEvent;
    return { clientX: p.clientX, clientY: p.clientY };
  }
  return null;
}

/**
 * iOS-safe press: no capture, no preventDefault on touch*,
 * and a direct `onclick` property so Safari marks the node tappable.
 * touchend fires the action; click is a fallback with a 400ms lock.
 */
export function bindPress(el: HTMLElement, onPress: () => void, opts: PressOpts = {}) {
  let sx = 0;
  let sy = 0;
  let armed = false;
  let last = 0;

  const fire = () => {
    const now = performance.now();
    if (now - last < 400) return;
    last = now;
    onPress();
  };

  const start = (e: Event) => {
    if (skipped(e.target, opts.exclude)) {
      armed = false;
      return;
    }
    const p = point(e);
    if (!p) return;
    sx = p.clientX;
    sy = p.clientY;
    armed = true;
  };

  const end = (e: Event) => {
    if (skipped(e.target, opts.exclude) || !armed) return;
    armed = false;
    const p = point(e);
    if (p && Math.hypot(p.clientX - sx, p.clientY - sy) > 18) return;
    fire();
  };

  const click = (e: Event) => {
    if (skipped(e.target, opts.exclude)) return;
    e.preventDefault();
    fire();
  };

  el.addEventListener("touchstart", start, { passive: true });
  el.addEventListener("touchend", end, { passive: true });
  el.addEventListener("click", click);
  el.onclick = click;

  return () => {
    el.removeEventListener("touchstart", start);
    el.removeEventListener("touchend", end);
    el.removeEventListener("click", click);
    el.onclick = null;
  };
}

const TRACE_TYPES = [
  "touchstart",
  "touchend",
  "touchcancel",
  "pointerdown",
  "pointerup",
  "click",
] as const;

function describeTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return "?";
  const id = target.id ? `#${target.id}` : "";
  const cls = target.classList[0] ? `.${target.classList[0]}` : "";
  return `${target.tagName.toLowerCase()}${id}${cls}`;
}

export function bindTouchTrace(el: HTMLElement, onLine: (line: string) => void) {
  const handler = (e: Event) => {
    const phase = e.eventPhase === 1 ? "cap" : e.eventPhase === 2 ? "tgt" : "bub";
    const cancel = e.cancelable ? "" : " !nocancel";
    onLine(`${e.type} ${describeTarget(e.target)} ${phase}${cancel}`);
  };
  for (const type of TRACE_TYPES) {
    el.addEventListener(type, handler, { capture: true, passive: true });
  }
  return () => {
    for (const type of TRACE_TYPES) {
      el.removeEventListener(type, handler, true);
    }
  };
}
