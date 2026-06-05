import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
	title: "SlopGuard: 알림 & 웹훅 — Team",
	description: "Team 플랜의 격리 알림 내역과 Slack/Discord/webhook 설정 안내.",
};

export default function AlertsPageKo() {
	return (
		<>
			<MarketingNav lang="ko" enHref="/alerts" koHref="/ko/alerts" />

			<main className="wide" style={{ paddingTop: 32 }}>
				<div className="docs-hero" style={{ marginBottom: 32 }}>
					<div className="grid-bg" aria-hidden="true" />
					<div className="docs-hero-copy">
						<span className="eyebrow">TEAM</span>
						<h1 className="page-h1">알림 &amp; 웹훅</h1>
						<p className="page-sub">
							격리 발생 시 Slack, Discord, 또는 웹훅으로 실시간 알림. 레포의{" "}
							<code>.github/SLOP_POLICY.yml</code>에서 설정하세요.
						</p>
						<div style={{ marginTop: 16, display: "flex", gap: 12 }}>
							<Link href="/ko/pricing" className="btn btn-primary btn-sm">
								Team 시작하기
							</Link>
							<Link href="/ko/account" className="btn btn-ghost btn-sm">
								마이페이지
							</Link>
						</div>
					</div>
					<figure className="plate docs-hero-plate" style={{ maxWidth: 520 }}>
						<div className="plate-art" style={{ padding: 0 }}>
							<img
								src="/images/slopguard-alerts-log.png"
								alt="SlopGuard 알림 로그"
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
						<h3>설정 방법</h3>
					</div>
					<p className="muted" style={{ marginBottom: 12 }}>
						알림을 받고 싶은 레포의 <code>.github/SLOP_POLICY.yml</code>에{" "}
						<code>notify</code> 섹션을 추가하세요:
					</p>
					<pre className="docs-code" style={{ fontSize: 13 }}>
						{`notify:
  slack_webhook: "https://hooks.slack.com/services/..."
  discord_webhook: "https://discord.com/api/webhooks/..."
  webhook_url: "https://your-server.com/slop-alert"`}
					</pre>
					<p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
						웹훅 URL은 Slack/Discord 워크스페이스 설정에서 직접 발급받으세요.
						Team 이상 플랜에서만 동작합니다.
					</p>
				</div>

				<div className="card">
					<div className="card-head">
						<h3>최근 발송된 알림 (데모)</h3>
					</div>
					<table
						style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
					>
						<thead>
							<tr style={{ borderBottom: "1px solid var(--border)" }}>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>시점</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>
									레포 / 항목
								</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>점수</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>대상</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>상태</th>
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
						실제 알림은 best-effort로 전송됩니다. 전체 내역은 Slack/Discord 또는
						웹훅에서 확인하세요.
					</p>
				</div>
			</main>

			<SiteFooter lang="ko" />
		</>
	);
}
