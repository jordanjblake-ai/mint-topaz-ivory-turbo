export type ConsentChoice = {
  analytics: boolean;
  marketing: boolean;
  at: string;
};

const KEY = "hybrid-consent-v1";
const listeners = new Set<() => void>();
let memory: ConsentChoice | null | undefined;

function storageGet() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function storageSet(value: string) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* private / iframe */
  }
}

function storageClear() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* private / iframe */
  }
}

function read(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = storageGet();
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentChoice;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((fn) => fn());
}

export function getConsent() {
  if (memory === undefined) memory = read();
  return memory ?? null;
}

export function setConsent(next: Omit<ConsentChoice, "at">) {
  memory = { ...next, at: new Date().toISOString() };
  if (typeof window !== "undefined") storageSet(JSON.stringify(memory));
  emit();
}

export function subscribeConsent(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function resetConsent() {
  memory = null;
  if (typeof window !== "undefined") storageClear();
  emit();
}

export const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? "";
export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID ?? "";
export const GOOGLE_SITE_VERIFICATION = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ?? "";
