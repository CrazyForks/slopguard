import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
	title: "SlopGuard: Org Dashboard — Team",
	description:
		"Org-wide slop activity, audit log, and cross-repo intelligence for Team plans.",
};

export default function OrgDashboard() {
	return (
		<>
			<MarketingNav lang="en" enHref="/org" koHref="/ko/org" />

			<main className="wide" style={{ paddingTop: 32 }}>
				<div className="docs-hero" style={{ marginBottom: 32 }}>
					<div className="grid-bg" aria-hidden="true" />
					<div className="docs-hero-copy">
						<span className="eyebrow">TEAM</span>
						<h1 className="page-h1">Org Dashboard</h1>
						<p className="page-sub">
							Cross-repo visibility, activity audit, and team-wide slop
							intelligence. Available only on Team and Enterprise plans.
						</p>
						<div style={{ marginTop: 16, display: "flex", gap: 12 }}>
							<Link href="/pricing" className="btn btn-primary btn-sm">
								Upgrade to Team
							</Link>
							<Link href="/account" className="btn btn-ghost btn-sm">
								Back to account
							</Link>
						</div>
					</div>
					<figure className="plate docs-hero-plate" style={{ maxWidth: 520 }}>
						<div className="plate-art" style={{ padding: 0 }}>
							<img
								src="/images/slopguard-team-dashboard.png"
								alt="SlopGuard Team Org Dashboard"
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

				<div className="card" style={{ marginBottom: 24 }}>
					<div className="card-head">
						<h3>Org-wide activity</h3>
						<span className="card-meta">Last 30 days • Acme Corp</span>
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
							gap: 12,
						}}
					>
						<div className="ministat">
							<div className="ministat-n">142</div>
							<div className="ministat-l">Quarantined</div>
						</div>
						<div className="ministat">
							<div className="ministat-n">89</div>
							<div className="ministat-l">Cleared</div>
						</div>
						<div className="ministat">
							<div className="ministat-n">17</div>
							<div className="ministat-l">Repos</div>
						</div>
						<div className="ministat">
							<div className="ministat-n">3</div>
							<div className="ministat-l">Campaigns detected</div>
						</div>
					</div>
				</div>

				<div className="card">
					<div className="card-head">
						<h3>Recent activity across org</h3>
					</div>
					<table
						style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
					>
						<thead>
							<tr style={{ borderBottom: "1px solid var(--border)" }}>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>Item</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>Repo</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>
									Score
								</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>
									Status
								</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>
									Cleared by
								</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>When</th>
							</tr>
						</thead>
						<tbody>
							{[
								{
									item: "feat: add new auth flow",
									repo: "acme/web",
									score: 78,
									status: "quarantined",
									by: "—",
									when: "2h ago",
								},
								{
									item: "fix: update deps",
									repo: "acme/api",
									score: 42,
									status: "cleared",
									by: "@jane",
									when: "yesterday",
								},
								{
									item: "docs: onboarding guide",
									repo: "acme/docs",
									score: 91,
									status: "quarantined",
									by: "—",
									when: "2d ago",
								},
							].map((row, i) => (
								<tr
									key={i}
									style={{ borderBottom: "1px solid var(--border-muted)" }}
								>
									<td
										style={{ padding: "10px 12px", fontFamily: "var(--mono)" }}
									>
										{row.item}
									</td>
									<td style={{ padding: "10px 12px" }}>{row.repo}</td>
									<td style={{ padding: "10px 12px" }}>
										<span style={{ color: "var(--green)" }}>{row.score}</span>
										/100
									</td>
									<td style={{ padding: "10px 12px" }}>
										<span
											style={{
												background:
													row.status === "quarantined"
														? "var(--danger-dim)"
														: "var(--green-dim)",
												padding: "2px 8px",
												borderRadius: 999,
												fontSize: 12,
											}}
										>
											{row.status}
										</span>
									</td>
									<td style={{ padding: "10px 12px" }}>{row.by}</td>
									<td style={{ padding: "10px 12px", color: "var(--muted)" }}>
										{row.when}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
						Real data from GitHub. Full history in your org’s GitHub activity.
					</p>
				</div>

				<div style={{ marginTop: 32, textAlign: "center" }}>
					<Link href="/pricing" className="btn btn-ghost">
						Compare plans
					</Link>
				</div>
			</main>

			<SiteFooter lang="en" />
		</>
	);
}
