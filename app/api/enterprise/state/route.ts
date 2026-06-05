import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth/session";
import { hasSso } from "@/lib/billing/entitlement";
import { getState } from "@/lib/billing/console-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/enterprise/state
 *
 * Read-only view of the signed-in owner's Enterprise console: audit log,
 * integrations, and SSO config status. The export endpoint
 * (GET /api/audit/export) records an "exported" entry into the same audit
 * log so a refresh of this view will reflect that action.
 */
export async function GET() {
	const store = await cookies();
	const session = decodeSession(store.get(SESSION_COOKIE)?.value);
	if (!session) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

	const ok = await hasSso(session.login);
	if (!ok) {
		return NextResponse.json(
			{ error: "forbidden", reason: "Enterprise plan required" },
			{ status: 403 },
		);
	}

	const state = getState(session.login);

	return NextResponse.json({
		owner: state.owner,
		sso: {
			provider: "Okta SAML 2.0",
			status: "active",
			lastSync: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
		},
		audit: state.audit.slice(0, 20),
		integrations: state.integrations,
	});
}
