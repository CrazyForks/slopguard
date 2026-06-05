import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
	title: "SlopGuard: Org Dashboard — Team",
	description:
		"Org-wide slop activity, audit log, and cross-repo intelligence for Team plans.",
};

const navigation = ["Overview", "Queue", "Repos", "Campaigns", "Alerts", "Policy"];
const metrics = [
	{ label: "Open reviews", value: "18", detail: "6 require owner action" },
	{ label: "Protected repos", value: "17", detail: "3 added this week" },
	{ label: "Avg. slop score", value: "42", detail: "−11 from last week" },
	{ label: "Campaign clusters", value: "3", detail: "1 high confidence" },
];
const queue = [
	{
		item: "feat: harden GitHub OAuth callback",
		repo: "blue-b/slopguard",
		score: 78,
		status: "Quarantined",
		owner: "Security review",
		age: "12m",
	},
	{
		item: "docs: setup page copy refresh",
		repo: "blue-b/docs",
		score: 31,
		status: "Cleared",
		owner: "@blue-b",
		age: "1h",
	},
	{
		item: "chore: dependency wave",
		repo: "blue-b/api",
		score: 64,
		status: "Watching",
		owner: "Policy bot",
		age: "4h",
	},
];
const campaigns = [
	{ name: "Auth surface changes", repos: "7 repos", risk: "High" },
	{ name: "Docs-only churn", repos: "3 repos", risk: "Low" },
	{ name: "Lockfile refresh", repos: "5 repos", risk: "Medium" },
];

const shell: React.CSSProperties = {
	maxWidth: 1200,
	margin: "28px auto 56px",
	padding: "0 20px",
};
const frame: React.CSSProperties = {
	border: "1px solid var(--border)",
	borderRadius: 20,
	overflow: "hidden",
	background: "#0b1016",
	boxShadow: "0 20px 70px rgba(0,0,0,.28)",
};
const card: React.CSSProperties = {
	border: "1px solid #26313d",
	borderRadius: 14,
	background: "#0f1620",
};
const muted: React.CSSProperties = { color: "#8b949e" };

export default function OrgDashboard() {
	return (
		<>
			<MarketingNav lang="en" enHref="/org" koHref="/ko/org" />

			<main style={shell}>
				<section style={frame}>
					<div style={{ display: "grid", gridTemplateColumns: "228px 1fr" }}>
						<aside
							style={{
								borderRight: "1px solid #26313d",
								background: "#111923",
								padding: 18,
								minHeight: 720,
							}}
						>
							<div style={{ marginBottom: 22 }}>
								<div style={{ fontWeight: 800, letterSpacing: "-.02em" }}>SlopGuard</div>
								<div style={{ ...muted, fontSize: 12, marginTop: 3 }}>Team workspace</div>
							</div>

							<nav style={{ display: "grid", gap: 4 }}>
								{navigation.map((item) => {
									const active = item === "Overview";
									return (
										<div
											key={item}
											style={{
												borderRadius: 10,
												padding: "9px 10px",
												fontSize: 13,
												color: active ? "#f0f6fc" : "#8b949e",
												background: active ? "#17212d" : "transparent",
												border: active ? "1px solid #2b3846" : "1px solid transparent",
											}}
										>
											{item}
										</div>
									);
								})}
							</nav>

							<div style={{ ...card, marginTop: 28, padding: 12, fontSize: 12 }}>
								<div style={{ color: "#f0f6fc", fontWeight: 700 }}>Blue-B</div>
								<div style={{ ...muted, marginTop: 4 }}>Team entitlement active</div>
								<div style={{ marginTop: 10, color: "#3fb950" }}>● Connected to GitHub</div>
							</div>
						</aside>

						<div style={{ padding: 24 }}>
							<header
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									gap: 18,
									marginBottom: 22,
								}}
							>
								<div>
									<div style={{ color: "#3fb950", fontSize: 12, fontWeight: 800, letterSpacing: ".08em" }}>
										ORG CONTROL ROOM
									</div>
									<h1 style={{ margin: "8px 0 7px", fontSize: 32, letterSpacing: "-.04em" }}>
										Review activity across every protected repo.
									</h1>
									<p style={{ ...muted, margin: 0, maxWidth: 680, lineHeight: 1.55 }}>
										A real Team console surface for quarantine queues, campaign clusters, and policy coverage.
										The generated preview art is no longer the product — this rendered panel is.
									</p>
								</div>
								<div style={{ display: "flex", gap: 10 }}>
									<Link href="/account" className="btn btn-ghost btn-sm">
										Account
									</Link>
									<Link href="/alerts" className="btn btn-primary btn-sm">
										Configure alerts
									</Link>
								</div>
							</header>

							<div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
								{metrics.map((metric) => (
									<div key={metric.label} style={{ ...card, padding: 15 }}>
										<div style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-.03em" }}>{metric.value}</div>
										<div style={{ color: "#f0f6fc", fontSize: 13, marginTop: 4 }}>{metric.label}</div>
										<div style={{ ...muted, fontSize: 12, marginTop: 6 }}>{metric.detail}</div>
									</div>
								))}
							</div>

							<div style={{ display: "grid", gridTemplateColumns: "1.55fr .85fr", gap: 16, marginTop: 16 }}>
								<section style={{ ...card, padding: 16 }}>
									<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
										<div>
											<h2 style={{ margin: 0, fontSize: 18 }}>Quarantine queue</h2>
											<div style={{ ...muted, fontSize: 12, marginTop: 4 }}>Prioritized by score and policy impact</div>
										</div>
										<span style={{ ...muted, fontSize: 12 }}>Updated just now</span>
									</div>
									<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
										<thead>
											<tr style={{ color: "#8b949e", borderBottom: "1px solid #26313d" }}>
												<th style={{ textAlign: "left", padding: "9px 8px" }}>Item</th>
												<th style={{ textAlign: "left", padding: "9px 8px" }}>Repo</th>
												<th style={{ textAlign: "left", padding: "9px 8px" }}>Score</th>
												<th style={{ textAlign: "left", padding: "9px 8px" }}>Status</th>
												<th style={{ textAlign: "left", padding: "9px 8px" }}>Owner</th>
												<th style={{ textAlign: "left", padding: "9px 8px" }}>Age</th>
											</tr>
										</thead>
										<tbody>
											{queue.map((row) => (
												<tr key={row.item} style={{ borderBottom: "1px solid #18222e" }}>
													<td style={{ padding: "10px 8px", fontFamily: "var(--mono)" }}>{row.item}</td>
													<td style={{ padding: "10px 8px", color: "#c9d1d9" }}>{row.repo}</td>
													<td style={{ padding: "10px 8px", color: row.score > 60 ? "#f85149" : "#3fb950" }}>{row.score}</td>
													<td style={{ padding: "10px 8px" }}>{row.status}</td>
													<td style={{ padding: "10px 8px", color: "#8b949e" }}>{row.owner}</td>
													<td style={{ padding: "10px 8px", color: "#8b949e" }}>{row.age}</td>
												</tr>
											))}
										</tbody>
									</table>
								</section>

								<aside style={{ display: "grid", gap: 16 }}>
									<section style={{ ...card, padding: 16 }}>
										<h2 style={{ margin: 0, fontSize: 18 }}>Campaign radar</h2>
										<div style={{ ...muted, fontSize: 12, marginTop: 4, marginBottom: 12 }}>
											Grouped by repeated AI-like patterns
										</div>
										{campaigns.map((item) => (
											<div key={item.name} style={{ borderTop: "1px solid #26313d", padding: "12px 0" }}>
												<div style={{ fontWeight: 700 }}>{item.name}</div>
												<div style={{ ...muted, fontSize: 12, marginTop: 4 }}>{item.repos} · {item.risk} risk</div>
											</div>
										))}
									</section>

									<section style={{ ...card, padding: 16 }}>
										<h2 style={{ margin: 0, fontSize: 18 }}>Policy coverage</h2>
										<div style={{ ...muted, fontSize: 12, marginTop: 8 }}>
											14 repos enforce quarantine, 3 repos observe only. Alerts route to the Team webhook policy.
										</div>
										<div style={{ marginTop: 14, height: 8, borderRadius: 999, background: "#17212d", overflow: "hidden" }}>
											<div style={{ width: "82%", height: "100%", background: "#3fb950" }} />
										</div>
									</section>
								</aside>
							</div>
						</div>
					</div>
				</section>
			</main>

			<SiteFooter lang="en" />
		</>
	);
}
