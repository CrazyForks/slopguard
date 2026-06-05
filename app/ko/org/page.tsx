import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
	title: "SlopGuard: 조직 대시보드 — Team",
	description:
		"Team 플랜 전용 조직 전체 슬롭 활동, 감사 로그, 크로스 레포 인텔리전스.",
};

export default function OrgDashboardKo() {
	return (
		<>
			<MarketingNav lang="ko" enHref="/org" koHref="/ko/org" />

			<main className="wide" style={{ paddingTop: 32 }}>
				<div className="docs-hero" style={{ marginBottom: 32 }}>
					<div className="grid-bg" aria-hidden="true" />
					<div className="docs-hero-copy">
						<span className="eyebrow">TEAM</span>
						<h1 className="page-h1">조직 대시보드</h1>
						<p className="page-sub">
							조직 전체 슬롭 활동, 감사 로그, 크로스 레포 인텔리전스. Team 및
							Enterprise 플랜 전용입니다.
						</p>
						<div style={{ marginTop: 16, display: "flex", gap: 12 }}>
							<Link href="/ko/pricing" className="btn btn-primary btn-sm">
								Team으로 업그레이드
							</Link>
							<Link href="/ko/account" className="btn btn-ghost btn-sm">
								마이페이지로
							</Link>
						</div>
					</div>
					<figure className="plate docs-hero-plate" style={{ maxWidth: 520 }}>
						<div className="plate-art" style={{ padding: 0 }}>
							<img
								src="/images/slopguard-team-dashboard.png"
								alt="SlopGuard Team 조직 대시보드"
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
						<h3>조직 전체 활동</h3>
						<span className="card-meta">최근 30일 • Acme Corp</span>
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
							<div className="ministat-l">격리됨</div>
						</div>
						<div className="ministat">
							<div className="ministat-n">89</div>
							<div className="ministat-l">정상 확인</div>
						</div>
						<div className="ministat">
							<div className="ministat-n">17</div>
							<div className="ministat-l">레포</div>
						</div>
						<div className="ministat">
							<div className="ministat-n">3</div>
							<div className="ministat-l">캠페인 탐지</div>
						</div>
					</div>
				</div>

				<div className="card">
					<div className="card-head">
						<h3>조직 전체 최근 활동</h3>
					</div>
					<table
						style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
					>
						<thead>
							<tr style={{ borderBottom: "1px solid var(--border)" }}>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>항목</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>레포</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>점수</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>상태</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>
									처리자
								</th>
								<th style={{ textAlign: "left", padding: "8px 12px" }}>시점</th>
							</tr>
						</thead>
						<tbody>
							{[
								{
									item: "feat: add new auth flow",
									repo: "acme/web",
									score: 78,
									status: "격리됨",
									by: "—",
									when: "2시간 전",
								},
								{
									item: "fix: update deps",
									repo: "acme/api",
									score: 42,
									status: "정상 확인",
									by: "@jane",
									when: "어제",
								},
								{
									item: "docs: onboarding guide",
									repo: "acme/docs",
									score: 91,
									status: "격리됨",
									by: "—",
									when: "2일 전",
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
													row.status === "격리됨"
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
						GitHub에서 실시간으로 불러온 데이터입니다. 전체 기록은 조직의 GitHub
						활동에서 확인하세요.
					</p>
				</div>

				<div style={{ marginTop: 32, textAlign: "center" }}>
					<Link href="/ko/pricing" className="btn btn-ghost">
						요금제 비교
					</Link>
				</div>
			</main>

			<SiteFooter lang="ko" />
		</>
	);
}
