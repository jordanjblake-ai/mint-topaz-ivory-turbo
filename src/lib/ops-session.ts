const EMAIL_KEY = "hybrid-ops-email";
const PREVIEW_KEY = "hybrid-ops-preview";

export function setOpsSession(email: string, preview = false) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
    if (preview) window.sessionStorage.setItem(PREVIEW_KEY, "1");
    else window.sessionStorage.removeItem(PREVIEW_KEY);
  } catch {
    /* ignore */
  }
}

export function readOpsSession(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(EMAIL_KEY);
    return value?.trim() ? value.trim().toLowerCase() : null;
  } catch {
    return null;
  }
}

export function isOpsPreview(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(PREVIEW_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearOpsSession() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(EMAIL_KEY);
    window.sessionStorage.removeItem(PREVIEW_KEY);
  } catch {
    /* ignore */
  }
}
