const windows = new Map<string, number[]>();

export function allowAttempt(key: string, max = 8, windowMs = 60_000) {
  const now = Date.now();
  const recent = (windows.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= max) {
    windows.set(key, recent);
    return false;
  }
  recent.push(now);
  windows.set(key, recent);
  return true;
}

export function clip(value: string, max: number) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}

export function isEmail(value: string) {
  const email = value.trim();
  return email.length > 3 && email.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function safeJsonParse<T>(raw: string, maxBytes = 400_000): T | null {
  if (raw.length > maxBytes) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as T;
  } catch {
    return null;
  }
}

export function sameText(a: string, b: string) {
  const left = a.trim();
  const right = b.trim();
  const len = Math.max(left.length, right.length);
  let diff = left.length === right.length ? 0 : 1;
  for (let i = 0; i < len; i += 1) {
    diff |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0);
  }
  return diff === 0;
}
