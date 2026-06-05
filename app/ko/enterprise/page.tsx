import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
	title: "SlopGuard: Enterprise — SSO, 감사, 셀프호스트",
	description:
		"Enterprise 기능: SAML SSO, 감사 로그 내보내기, 셀프호스트 지원 계약, 맞춤 연동.",
};

export default function EnterprisePageKo() {
	return (
		<>
			<MarketingNav lang="ko" enHref="/enterprise" koHref="/ko/enterprise" />

			<main className="wide" style={{ paddingTop: 32 }}>
				<div className="docs-hero" style={{ marginBottom: 32 }}>
					<div className="grid-bg" aria-hidden="true" />
					<div className="docs-hero-copy">
						<span className="eyebrow">ENTERPRISE</span>
						<h1 className="page-h1">Enterprise 포털</h1>
						<p className="page-sub">
							SAML SSO, 감사 로그 내보내기, 셀프호스트 지원 계약, 맞춤 연동.
							sales에 문의하여 시작하세요.
						</p>
						<div style={{ marginTop: 16, display: "flex", gap: 12 }}>
							<a
								href="https://github.com/Blue-B/slopguard/issues/new?labels=enterprise&title=Enterprise%20inquiry"
								className="btn btn-primary btn-sm"
							>
								문의하기
							</a>
							<Link href="/ko/pricing" className="btn btn-ghost btn-sm">
								요금제 보기
							</Link>
						</div>
					</div>
					<figure className="plate docs-hero-plate" style={{ maxWidth: 520 }}>
						<div className="plate-art" style={{ padding: 0 }}>
							<img
								src="/images/slopguard-enterprise.png"
								alt="SlopGuard Enterprise 포털"
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

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
						gap: 16,
					}}
				>
					<div className="card">
						<h3 style={{ marginBottom: 8 }}>SAML / SSO</h3>
						<p className="muted">
							기업용 싱글 사인온. ID 제공자와 연동하며 로그인 감사 로그 포함.
						</p>
						<div style={{ marginTop: 12, fontSize: 12, color: "var(--green)" }}>
							sales 온보딩 후 제공
						</div>
					</div>
					<div className="card">
						<h3 style={{ marginBottom: 8 }}>감사 로그 내보내기</h3>
						<p className="muted">
							전체 활동 로그(JSON/CSV) 내보내기. 보관 정책 설정 가능.
						</p>
					</div>
					<div className="card">
						<h3 style={{ marginBottom: 8 }}>셀프호스트 지원</h3>
						<p className="muted">
							온프레미스 배포, 커스텀 빌드, SLA 응답, 유지보수 전용 계약.
						</p>
					</div>
					<div className="card">
						<h3 style={{ marginBottom: 8 }}>맞춤 연동</h3>
						<p className="muted">
							웹훅, 티켓 시스템, 내부 툴 등 워크플로에 맞춘 커스텀 연동.
						</p>
					</div>
				</div>

				<div style={{ marginTop: 32, textAlign: "center" }}>
					<a
						href="https://github.com/Blue-B/slopguard/issues/new?labels=enterprise&title=Enterprise%20inquiry"
						className="btn btn-primary"
					>
						Enterprise 문의 시작
					</a>
				</div>
			</main>

			<SiteFooter lang="ko" />
		</>
	);
}
