import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
	title: "SlopGuard: 크로스 레포 캠페인 — Pro & Team",
	description: "여러 레포에 걸친 봇/AI 슬롭 캠페인을 탐지하고 조사하세요.",
};

export default function CampaignsPageKo() {
	return (
		<>
			<MarketingNav lang="ko" enHref="/campaigns" koHref="/ko/campaigns" />

			<main className="wide" style={{ paddingTop: 32 }}>
				<div className="docs-hero" style={{ marginBottom: 32 }}>
					<div className="grid-bg" aria-hidden="true" />
					<div className="docs-hero-copy">
						<span className="eyebrow">PRO / TEAM</span>
						<h1 className="page-h1">크로스 레포 캠페인</h1>
						<p className="page-sub">
							동일한 AI 프롬프트나 보일러플레이트가 여러 레포에 나타나는 현상을
							탐지합니다. Pro 및 Team 플랜에서 사용 가능.
						</p>
						<div style={{ marginTop: 16, display: "flex", gap: 12 }}>
							<Link href="/ko/pricing" className="btn btn-primary btn-sm">
								업그레이드
							</Link>
							<Link href="/ko/account" className="btn btn-ghost btn-sm">
								마이페이지
							</Link>
						</div>
					</div>
					<figure className="plate docs-hero-plate" style={{ maxWidth: 520 }}>
						<div className="plate-art" style={{ padding: 0 }}>
							<img
								src="/images/slopguard-campaigns.png"
								alt="SlopGuard 캠페인 탐지"
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
						<h3>탐지된 캠페인 (데모)</h3>
					</div>
					<div style={{ display: "grid", gap: 16 }}>
						{[
							{
								fingerprint: "feat: implement new feature with tests",
								repos: 7,
								hits: 23,
								authors: 4,
								first: "3일 전",
							},
							{
								fingerprint: "fix: resolve edge case in parser",
								repos: 4,
								hits: 11,
								authors: 2,
								first: "1주 전",
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
									프롬프트 지문
								</div>
								<div style={{ fontSize: 15, marginBottom: 12 }}>
									{c.fingerprint}
								</div>
								<div style={{ display: "flex", gap: 24, fontSize: 13 }}>
									<div>
										<strong>{c.repos}</strong> 레포
									</div>
									<div>
										<strong>{c.hits}</strong> 총 히트
									</div>
									<div>
										<strong>{c.authors}</strong> 작성자
									</div>
									<div style={{ color: "var(--muted)" }}>최초 {c.first}</div>
								</div>
								<div
									style={{ marginTop: 8, fontSize: 12, color: "var(--green)" }}
								>
									영향 레포에 점수 +25 부스트 적용
								</div>
							</div>
						))}
					</div>
					<p className="muted" style={{ marginTop: 16, fontSize: 12 }}>
						Pro/Team에서 자동 실행됩니다. 상세는 PR 코멘트와 조직 활동에서
						확인하세요.
					</p>
				</div>
			</main>

			<SiteFooter lang="ko" />
		</>
	);
}
