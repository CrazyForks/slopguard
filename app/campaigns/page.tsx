import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
	title: "SlopGuard: Cross-Repo Campaigns — Pro & Team",
	description:
		"Detect and investigate bot/AI slop campaigns across your repositories.",
};

export default function CampaignsPage() {
	return (
		<>
			<MarketingNav lang="en" enHref="/campaigns" koHref="/ko/campaigns" />

			<main className="wide" style={{ paddingTop: 32 }}>
				<div className="docs-hero" style={{ marginBottom: 32 }}>
					<div className="grid-bg" aria-hidden="true" />
					<div className="docs-hero-copy">
						<span className="eyebrow">PRO / TEAM</span>
						<h1 className="page-h1">Cross-Repo Campaigns</h1>
						<p className="page-sub">
							Detect when the same AI prompt or boilerplate appears across
							multiple repositories. Available on Pro and Team.
						</p>
						<div style={{ marginTop: 16, display: "flex", gap: 12 }}>
							<Link href="/pricing" className="btn btn-primary btn-sm">
								Upgrade
							</Link>
							<Link href="/account" className="btn btn-ghost btn-sm">
								Account
							</Link>
						</div>
					</div>
					<figure className="plate docs-hero-plate" style={{ maxWidth: 520 }}>
						<div className="plate-art" style={{ padding: 0 }}>
							<img
								src="/images/slopguard-campaigns.png"
								alt="SlopGuard Campaign Detection"
								style={{
									width: "100%",
									height: "auto",
									borderRadius: 8,
									display: "block",
								}}
							/>
						</div>
					</figure>
				</div>

				<div className="card">
					<div className="card-head">
						<h3>Detected campaigns (demo)</h3>
					</div>
					<div style={{ display: "grid", gap: 16 }}>
						{[
							{
								fingerprint: "feat: implement new feature with tests",
								repos: 7,
								hits: 23,
								authors: 4,
								first: "3 days ago",
							},
							{
								fingerprint: "fix: resolve edge case in parser",
								repos: 4,
								hits: 11,
								authors: 2,
								first: "1 week ago",
							},
						].map((c, i) => (
							<div
								key={i}
								className="card"
								style={{ padding: 16, background: "var(--surface-2)" }}
							>
								<div
									style={{
										fontFamily: "var(--mono)",
										fontSize: 13,
										marginBottom: 8,
										color: "var(--muted)",
									}}
								>
									Prompt fingerprint
								</div>
								<div style={{ fontSize: 15, marginBottom: 12 }}>
									{c.fingerprint}
								</div>
								<div style={{ display: "flex", gap: 24, fontSize: 13 }}>
									<div>
										<strong>{c.repos}</strong> repos
									</div>
									<div>
										<strong>{c.hits}</strong> total hits
									</div>
									<div>
										<strong>{c.authors}</strong> authors
									</div>
									<div style={{ color: "var(--muted)" }}>
										First seen {c.first}
									</div>
								</div>
								<div
									style={{ marginTop: 8, fontSize: 12, color: "var(--green)" }}
								>
									Score boost +25 applied in affected repos
								</div>
							</div>
						))}
					</div>
					<p className="muted" style={{ marginTop: 16, fontSize: 12 }}>
						Campaign detection runs automatically on Pro/Team. View details in
						PR comments and org activity.
					</p>
				</div>
			</main>

			<SiteFooter lang="en" />
		</>
	);
}
