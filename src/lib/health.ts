/** Health-check probes. Server-only. Do not import from UI. */

export type ProbeKind = "live" | "ready" | "health";

type CheckState = "ok" | "error";

export type ProbeBody = {
  status: CheckState;
  check: ProbeKind;
  service: "hybrid-vacations";
  time: string;
  uptime_s: number;
  checks: {
    process: CheckState;
    database?: {
      status: CheckState;
      source?: "neon" | "pglite";
      latency_ms: number;
    };
  };
};

const DB_TIMEOUT_MS = 1500;
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
  pragma: "no-cache",
  "x-robots-tag": "noindex, nofollow",
  "x-content-type-options": "nosniff",
} as const;

function uptimeS() {
  return typeof process !== "undefined" && typeof process.uptime === "function"
    ? Math.round(process.uptime())
    : 0;
}

function jsonResponse(body: ProbeBody, status: number) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function headResponse(status: number) {
  return new Response(null, {
    status,
    headers: {
      "cache-control": JSON_HEADERS["cache-control"],
      pragma: JSON_HEADERS.pragma,
      "x-robots-tag": JSON_HEADERS["x-robots-tag"],
      "x-content-type-options": JSON_HEADERS["x-content-type-options"],
    },
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(label)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

export function liveBody(): ProbeBody {
  return {
    status: "ok",
    check: "live",
    service: "hybrid-vacations",
    time: new Date().toISOString(),
    uptime_s: uptimeS(),
    checks: { process: "ok" },
  };
}

export async function readyBody(): Promise<ProbeBody> {
  const started = Date.now();
  try {
    const { getSql, dbSource } = await import("@/lib/db");
    const sql = await withTimeout(getSql(), DB_TIMEOUT_MS, "database timeout");
    await withTimeout(sql`select 1 as ok`, DB_TIMEOUT_MS, "database timeout");
    return {
      status: "ok",
      check: "ready",
      service: "hybrid-vacations",
      time: new Date().toISOString(),
      uptime_s: uptimeS(),
      checks: {
        process: "ok",
        database: {
          status: "ok",
          source: dbSource,
          latency_ms: Date.now() - started,
        },
      },
    };
  } catch {
    return {
      status: "error",
      check: "ready",
      service: "hybrid-vacations",
      time: new Date().toISOString(),
      uptime_s: uptimeS(),
      checks: {
        process: "ok",
        database: { status: "error", latency_ms: Date.now() - started },
      },
    };
  }
}

export async function healthBody(): Promise<ProbeBody> {
  const ready = await readyBody();
  return { ...ready, check: "health" };
}

async function bodyFor(kind: ProbeKind): Promise<ProbeBody> {
  if (kind === "live") return liveBody();
  if (kind === "ready") return readyBody();
  return healthBody();
}

export function healthHandlers(kind: ProbeKind) {
  const run = async (method: string) => {
    const body = await bodyFor(kind);
    const status = body.status === "ok" ? 200 : 503;
    if (method === "HEAD") return headResponse(status);
    return jsonResponse(body, status);
  };

  return {
    GET: ({ request }: { request: Request }) => run(request.method),
    HEAD: ({ request }: { request: Request }) => run(request.method),
  };
}
