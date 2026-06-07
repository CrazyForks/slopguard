import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, decodeSession, effectiveOwner } from "@/lib/auth/session";
import { planForOwner } from "@/lib/billing/entitlement";
import { PLANS } from "@/lib/billing/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
	const store = await cookies();
	const session = decodeSession(store.get(SESSION_COOKIE)?.value);
	if (!session) {
		return NextResponse.json({ authenticated: false });
	}
	// Entitlement resolves to the tenant owner for SSO members; display login
	// strips the internal `sso:<owner>:` prefix so the profile reads cleanly.
	const planId = await planForOwner(effectiveOwner(session));
	const displayLogin = session.sso
		? session.login.replace(/^sso:[^:]+:/, "")
		: session.login;
	return NextResponse.json({
		authenticated: true,
		login: displayLogin,
		name: session.name,
		avatar: session.avatar,
		plan: planId,
		planName: PLANS[planId].name,
	});
}
