import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
	title: "SlopGuard: Alerts & Notifications — Team",
	description:
		"View sent quarantine alerts and configure Slack/Discord/webhooks for Team plans.",
};

export default function AlertsPage() {
	return (
		<>
			<MarketingNav lang="en" enHref="/alerts" koHref="/ko/alerts" />

			<main className="wide" style={{ paddingTop: 32 }}>
				<div className="docs-hero" style={{ marginBottom: 32 }}>
					<div className="grid-bg" aria-hidden="true" />
					<div className="docs-hero-copy">
						<span className="eyebrow">TEAM</span>
						<h1 className="page-h1">Alerts &amp; Notifications</h1>
						<p className="page-sub">
							Real-time quarantine alerts to Slack, Discord, or your webhook.
							Configure in your repo’s <code>.github/SLOP_POLICY.yml</code>.
						</p>
						<div style={{ marginTop: 16, display: "flex", gap: 12 }}>
							<Link href="/pricing" className="btn btn-primary btn-sm">
								Get Team
							</Link>
							<Link href="/account" className="btn btn-ghost btn-sm">
								Account
							</Link>
						</div>
					</div>
					<figure className="plate docs-hero-plate" style={{ maxWidth: 520 }}>
						<div className="plate-art" style={{ padding: 0 }}>
							<img
								src="/images/slopguard-alerts-log.png"
								alt="SlopGuard Alerts Log"
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
						<h3>How to enable</h3>
					</div>
					<p className="muted" style={{ marginBottom: 12 }}>
						Add a <code>notify</code> section to{" "}
						<code>.github/SLOP_POLICY.yml</code> in any repo you want alerts
						for:
					</p>
					<pre className="docs-code" style={{ fontSize: 13 }}>
						{`notify:
  slack_webhook: "https://hooks.slack.com/services/..."
  discord_webhook: "https://discord.com/api/webhooks/..."
  webhook_url: "https://your-server.com/slop-alert"`}
					</pre>
					<p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
						Get webhook URLs from your Slack/Discord workspace settings. Works
						only on Team+ plans.
					</p>
				</div>

				<div className="card">
					<div className="card-head">
						<h3>Recent sent alerts (demo)</h3>
					</div>
					<table
						style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
					>
						<thead>
							<tr style={{ borderBottom: "1px solid var(--border)" }}>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>When</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>
									Repo / Item
								</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>
									Score
								</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>
									Destination
								</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>
									Status
								</th>
							</tr>
						</thead>
						<tbody>
							{[
								{
									when: "2026-06-04 14:22",
									item: "acme/web#128",
									score: 87,
									dest: "Slack #security",
									status: "delivered",
								},
								{
									when: "2026-06-03 09:11",
									item: "acme/api#44",
									score: 71,
									dest: "Discord",
									status: "delivered",
								},
								{
									when: "2026-06-02 18:05",
									item: "acme/docs#7",
									score: 94,
									dest: "webhook_url",
									status: "failed (retrying)",
								},
							].map((r, i) => (
								<tr
									key={i}
									style={{ borderBottom: "1px solid var(--border-muted)" }}
								>
									<td
										style={{
											padding: "10px 12px",
											fontFamily: "var(--mono)",
											color: "var(--muted)",
										}}
									>
										{r.when}
									</td>
									<td style={{ padding: "10px 12px" }}>{r.item}</td>
									<td style={{ padding: "10px 12px" }}>{r.score}/100</td>
									<td style={{ padding: "10px 12px" }}>{r.dest}</td>
									<td style={{ padding: "10px 12px" }}>
										<span
											style={{
												color: r.status.includes("failed")
													? "var(--danger)"
													: "var(--green)",
											}}
										>
											{r.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<p className="muted" style={{ marginTop: 12, fontSize: 12 }}>
						Live alerts are best-effort. Full history available in your
						Slack/Discord or via your webhook endpoint.
					</p>
				</div>
			</main>

			<SiteFooter lang="en" />
		</>
	);
}
