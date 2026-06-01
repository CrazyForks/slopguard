import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth/session";
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
	const planId = await planForOwner(session.login);
	return NextResponse.json({
		authenticated: true,
		login: session.login,
		name: session.name,
		avatar: session.avatar,
		plan: planId,
		planName: PLANS[planId].name,
	});
}
