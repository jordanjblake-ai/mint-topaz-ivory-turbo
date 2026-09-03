/** Idle limit — 15 minutes with no activity. Aligned with HIPAA workstation lock guidance for health/emergency fields. */
export const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
/** Hard cap from first sign-in. */
export const ABSOLUTE_TIMEOUT_MS = 8 * 60 * 60 * 1000;
/** Warn this long before idle sign-out. */
export const IDLE_WARNING_MS = 2 * 60 * 1000;

const STARTED_KEY = "hybrid-session-started";
const ACTIVE_KEY = "hybrid-session-active";
const KILL_KEY = "hybrid-session-kill";
const UA_KEY = "hybrid-session-ua";

function read(key: string) {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.localStorage.getItem(key) || 0);
  } catch {
    return 0;
  }
}

function write(key: string, value: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    /* ignore */
  }
}

function remove(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function beginSessionClock() {
  const now = Date.now();
  if (!read(STARTED_KEY)) write(STARTED_KEY, now);
  write(ACTIVE_KEY, now);
  bindSessionAgent();
}

export function touchSession() {
  const now = Date.now();
  if (!read(STARTED_KEY)) write(STARTED_KEY, now);
  write(ACTIVE_KEY, now);
}

export function clearSessionClock() {
  remove(STARTED_KEY);
  remove(ACTIVE_KEY);
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(UA_KEY);
    window.sessionStorage.removeItem("hybrid-refresh-token");
  } catch {
    /* ignore */
  }
}

export function bindSessionAgent() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(UA_KEY, window.navigator.userAgent);
  } catch {
    /* ignore */
  }
}

export function sessionAgentHolds() {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.sessionStorage.getItem(UA_KEY);
    if (!stored) {
      bindSessionAgent();
      return true;
    }
    return stored === window.navigator.userAgent;
  } catch {
    return true;
  }
}

export function broadcastSessionEnd() {
  clearSessionClock();
  write(KILL_KEY, Date.now());
}

export function isSessionKillEvent(event: StorageEvent) {
  return event.key === KILL_KEY && Boolean(event.newValue);
}

export function sessionStatus(): {
  expired: boolean;
  reason: "idle" | "absolute" | "agent" | null;
  warn: boolean;
  remainingMs: number;
} {
  if (!sessionAgentHolds()) {
    return { expired: true, reason: "agent", warn: false, remainingMs: 0 };
  }
  const started = read(STARTED_KEY);
  const active = read(ACTIVE_KEY);
  if (!started && !active) {
    return { expired: false, reason: null, warn: false, remainingMs: IDLE_TIMEOUT_MS };
  }
  const now = Date.now();
  const idleLeft = IDLE_TIMEOUT_MS - (now - (active || started));
  const absLeft = ABSOLUTE_TIMEOUT_MS - (now - (started || active));
  if (absLeft <= 0) return { expired: true, reason: "absolute", warn: false, remainingMs: 0 };
  if (idleLeft <= 0) return { expired: true, reason: "idle", warn: false, remainingMs: 0 };
  return {
    expired: false,
    reason: null,
    warn: idleLeft <= IDLE_WARNING_MS,
    remainingMs: Math.min(idleLeft, absLeft),
  };
}

export function sessionStillValid() {
  return !sessionStatus().expired;
}
