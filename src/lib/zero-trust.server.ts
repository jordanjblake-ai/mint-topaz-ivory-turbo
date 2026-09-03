import { personByEmail, type CampPerson } from "@/data/camp";

/**
 * Zero Trust for this origin: never trust the network, a client-supplied email,
 * or a desk PIN. Every privileged action re-checks origin, identity, and role.
 * Fail closed when sign-in is configured.
 */

export class TrustError extends Error {
  readonly status = 403;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "TrustError";
  }
}

export type TrustRole = CampPerson["role"];

const STAFF: TrustRole[] = ["coach", "head"];

export async function assertZeroTrustRequest() {
  const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
  assertSameSiteRequest();
}

export async function sessionRoster(): Promise<CampPerson | null> {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const session = await getSessionUser();
  if (!session?.email) return null;
  return personByEmail(session.email) ?? null;
}

export async function requireRosterActor(opts?: {
  claimedEmail?: string;
  roles?: TrustRole[];
}): Promise<CampPerson> {
  await assertZeroTrustRequest();
  const sessionPerson = await sessionRoster();
  const claimed = opts?.claimedEmail?.trim();

  if (sessionPerson) {
    if (claimed && sessionPerson.email.toLowerCase() !== claimed.toLowerCase()) {
      await auditEvent({
        action: "identity.mismatch",
        actor: sessionPerson,
        outcome: "deny",
        detail: "claimed email did not match session",
      });
      throw new TrustError("Sign in with the account that matches this action.");
    }
    assertRole(sessionPerson, opts?.roles);
    return sessionPerson;
  }

  const { authConfigured } = await import("@/lib/auth/verify.server");
  if (authConfigured) {
    await auditEvent({ action: "identity.missing", outcome: "deny" });
    throw new TrustError("Sign in to continue.");
  }

  if (!claimed) throw new TrustError("Sign in to continue.");
  const person = personByEmail(claimed);
  if (!person) throw new TrustError("That email is not on this camp.");
  assertRole(person, opts?.roles);
  return person;
}

export async function requireStaffActor() {
  await assertZeroTrustRequest();
  const sessionPerson = await sessionRoster();
  if (sessionPerson) {
    assertRole(sessionPerson, STAFF);
    return sessionPerson;
  }

  const { authConfigured } = await import("@/lib/auth/verify.server");
  if (authConfigured) {
    await auditEvent({ action: "staff.missing", outcome: "deny" });
    throw new TrustError("Staff sign-in required.");
  }
  return null;
}

function assertRole(person: CampPerson, roles?: TrustRole[]) {
  if (!roles?.length) return;
  if (!roles.includes(person.role)) {
    throw new TrustError("You do not have access to this.");
  }
}

export function isStaff(person: CampPerson | null | undefined) {
  return Boolean(person && STAFF.includes(person.role));
}

export async function auditEvent(event: {
  action: string;
  actor?: CampPerson | null;
  outcome: "allow" | "deny";
  detail?: string;
}) {
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const id = `zt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    await sql`
      insert into security_events (id, action, actor_id, role, outcome, detail)
      values (
        ${id},
        ${event.action.slice(0, 80)},
        ${event.actor?.id ?? null},
        ${event.actor?.role ?? null},
        ${event.outcome},
        ${event.detail ? event.detail.slice(0, 200) : null}
      )
    `;
  } catch {
    /* never block the visitor if the log is down */
  }
}
