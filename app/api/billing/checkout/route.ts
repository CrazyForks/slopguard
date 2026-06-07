import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth/session";
import { planForOwner } from "@/lib/billing/entitlement";
import { PLANS, type PlanId } from "@/lib/billing/plans";
import { PORTAL_URL } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Checkout via Polar (Merchant of Record). Set POLAR_LINK_PRO / POLAR_LINK_TEAM
// (monthly) and optionally POLAR_LINK_PRO_ANNUAL / POLAR_LINK_TEAM_ANNUAL
// (yearly) to the hosted Checkout Link URLs from your Polar dashboard
// (https://polar.sh → Products → Checkout Links). No SDK or secret key needed
// at runtime. If unset, we return guidance instead of failing — the free tier
// works without any billing setup.
function linkFor(
	plan: PlanId,
	yearly: boolean,
): {
	link?: string;
	envKey?: string;
} {
	const p = PLANS[plan];
	// Never silently fall back monthly<->yearly: charging the wrong cycle is
	// worse than a clear "not configured" error.
	const envKey = yearly ? p?.polarEnvKeyYearly : p?.polarEnvKey;
	return { link: envKey ? process.env[envKey] : undefined, envKey };
}

export async function GET(req: Request) {
	const url = new URL(req.url);
	const plan = (url.searchParams.get("plan") ?? "pro") as PlanId;
	const yearly = url.searchParams.get("cycle") === "yearly";

	if (!PLANS[plan] || plan === "free") {
		return NextResponse.json({ error: "invalid plan" }, { status: 400 });
	}

	// Duplicate-purchase guard (defense in depth; the pricing UI already hides
	// these CTAs for signed-in paying users). A customer who already holds a paid
	// plan must change tiers in the customer portal — a fresh checkout would
	// create a SECOND subscription and double-charge. Free/anonymous users may
	// proceed normally.
	const store = await cookies();
	const session = decodeSession(store.get(SESSION_COOKIE)?.value);
	if (session) {
		const current = await planForOwner(session.login);
		if (current && current !== "free") {
			return NextResponse.redirect(PORTAL_URL, { status: 302 });
		}
	}
	// Enterprise has no self-serve checkout.
	if (PLANS[plan].contactSales) {
		return NextResponse.json(
			{ error: "contact sales", plan: PLANS[plan] },
			{ status: 400 },
		);
	}

	const { link } = linkFor(plan, yearly);
	if (!link) {
		return NextResponse.json(
			{
				error: "billing not configured",
				hint: `Set POLAR_LINK_${plan.toUpperCase()}${yearly ? "_ANNUAL" : ""} to a Polar Checkout Link URL to enable checkout. The free tier works without any billing setup.`,
				plan: PLANS[plan],
			},
			{ status: 501 },
		);
	}

	// Redirect to the hosted Polar checkout. Remember the language so the
	// post-payment success page (Polar redirects back) renders in it.
	const res = NextResponse.redirect(link, { status: 302 });
	if (url.searchParams.get("lang") === "ko") {
		res.cookies.set("sg_lang", "ko", {
			sameSite: "lax",
			path: "/",
			maxAge: 3600,
		});
	}
	return res;
}
