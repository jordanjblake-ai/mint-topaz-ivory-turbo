const KEY = "hybrid-coach-email";

export function setCoachSession(email: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, email.trim().toLowerCase());
  } catch {
    /* ignore */
  }
}

export function readCoachSession(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(KEY);
    return value?.trim() ? value.trim().toLowerCase() : null;
  } catch {
    return null;
  }
}

export function clearCoachSession() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
