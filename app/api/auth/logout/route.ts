import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { getAppBaseUrl } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
	const res = NextResponse.redirect(getAppBaseUrl());
	res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
	return res;
}
