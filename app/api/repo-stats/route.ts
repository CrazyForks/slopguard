import { NextResponse } from "next/server";
import { getRepoSlopStats } from "@/lib/github/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Read-only slop stats for a repo where SlopGuard is installed. Powers the
// inline "look up a public repo" widget on the account page. Only returns data
// for repos the app is installed on (getRepoSlopStats throws otherwise), and
// it is the same public label data already shown on /dashboard/[owner]/[repo].
export async function GET(req: Request) {
	const url = new URL(req.url);
	const owner = (url.searchParams.get("owner") ?? "").trim();
	const repo = (url.searchParams.get("repo") ?? "").trim();
	if (!owner || !repo || /[^\w.-]/.test(owner) || /[^\w.-]/.test(repo)) {
		return NextResponse.json({ error: "invalid owner/repo" }, { status: 400 });
	}
	try {
		const s = await getRepoSlopStats(owner, repo);
		return NextResponse.json({
			repo: s.repo,
			quarantined: s.quarantined,
			cleared: s.cleared,
			open: s.open,
			closed: s.closed,
			items: s.items.slice(0, 12),
		});
	} catch (e) {
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : "lookup failed" },
			{ status: 502 },
		);
	}
}
