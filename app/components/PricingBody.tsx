import { cookies } from "next/headers";
import { PORTAL_URL, REPO_URL } from "@/lib/config";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth/session";
import { planForOwner } from "@/lib/billing/entitlement";
import {
	getEntitlementMap,
	isPolarConfigured,
	normalizeGitHubOwner,
} from "@/lib/billing/polar";
import type { Lang } from "@/lib/i18n";
import MarketingNav from "./MarketingNav";
import RevealOnScroll from "./RevealOnScroll";
import PricingPlans from "./PricingPlans";
import SiteFooter from "./SiteFooter";

/** Dedicated pricing page body, shared by the EN and KO routes. */
export default async function PricingBody({ lang }: { lang: Lang }) {
	const ko = lang === "ko";
	// Personalize the plan grid for a signed-in user: their active tier renders as
	// "current" (not buyable) and other paid tiers route to the portal, so they
	// can never start a duplicate subscription from this page.
	const store = await cookies();
	const session = decodeSession(store.get(SESSION_COOKIE)?.value);
	const currentPlan = session ? await planForOwner(session.login) : undefined;
	// Whether the user has a real Polar subscription to change (vs an env/comp
	// grant). Only then do we show upgrade/downgrade controls; otherwise other
	// tiers stay normal checkouts. getEntitlementMap is cached, so this is cheap.
	let hasManagedSub = false;
	if (session && currentPlan && currentPlan !== "free" && isPolarConfigured()) {
		try {
			const map = await getEntitlementMap();
			hasManagedSub = map.has(normalizeGitHubOwner(session.login));
		} catch {
			hasManagedSub = false;
		}
	}
	const t = ko
		? {
				eyebrow: "가격",
				h1: "운영까지 맡기면,\n팀이 더 편해집니다",
				sub: "비공개 레포, 조직 기능, 서버와 LLM 운영까지 유료 플랜이 맡습니다. 소스가 공개돼 있어 직접 올려 써도 됩니다(본인 용도, Commons Clause).",
				addsTitle: "유료 플랜이 대신해주는 것",
				adds: [
					"매니지드 LLM, 서버와 API 비용 제로",
					"비공개 레포와 레포 교차 탐지",
					"조직 현황과 Slack 알림",
				],
				polar: "결제는 Polar(Merchant of Record)로 안전하게 처리됩니다.",
				whyTitle: "셀프호스팅 되는데 왜 결제하나요?",
				selfTitle: "직접 셀프호스팅 (무료)",
				selfItems: [
					"소스 공개, 자기 용도로 영원히 무료",
					"서버 운영, LLM API 비용, 유지보수를 직접 부담",
					"자기 레포만 봅니다. 네트워크 효과 없음",
				],
				hostedTitle: "호스팅 결제",
				hostedItems: [
					"서버, LLM 비용, 운영 전부 제로 (관리형)",
					"네트워크 슬롭 인텔리전스: 전체 고객 레포를 가로지른 슬롭 신호와 집단 피드백. 셀프호스팅은 자기 레포만 봐서 원천적으로 불가능합니다",
					"비공개 레포, 레포 교차 패턴 탐지, 장기 추세 조직 대시보드, Slack/Discord/웹훅 알림, SSO",
				],
				whyPunch: "소스는 무료입니다. 호스팅과 네트워크 인텔리전스, 편의가 제품이에요. Sentry, PostHog, Plausible과 같은 모델입니다.",
				qPre: "궁금한 점이 있으면 ",
				qLink: "GitHub 이슈",
				qPost: "로 남겨주세요.",
			}
		: {
				eyebrow: "pricing",
				h1: "Stronger when\nwe run it for you.",
				sub: "Paid plans cover private repos, org features, and the server and LLM bill. The source is available (Commons Clause), so self-hosting for your own use is always an option too.",
				addsTitle: "What a paid plan handles for you",
				adds: [
					"Managed LLM (no server or API bill)",
					"Private repos and cross-repo detection",
					"Org overview and Slack alerts",
				],
				polar: "Checkout is handled securely by Polar (Merchant of Record).",
				whyTitle: "Self-hostable. So why pay?",
				selfTitle: "Self-host (free)",
				selfItems: [
					"Source-available, free forever for your own use",
					"You run the server, pay the LLM API bill, and maintain it",
					"Only sees your own repos. No network effect",
				],
				hostedTitle: "Hosted (paid)",
				hostedItems: [
					"Zero server, LLM bill, or maintenance (managed)",
					"Network slop intelligence: slop signals and collective feedback across every customer's repos. A self-hosted instance only sees its own, so it structurally cannot have this",
					"Private repos, cross-repo pattern detection, org dashboard with long-term trends, Slack/Discord/webhook alerts, SSO",
				],
				whyPunch: "The source is free. The hosting, the network intelligence, and the convenience are the product. Same model as Sentry, PostHog, and Plausible.",
				qPre: "Questions? Open an issue on ",
				qLink: "GitHub",
				qPost: ".",
			};
	return (
		<>
			<MarketingNav
				lang={lang}
				enHref="/pricing"
				koHref="/ko/pricing"
				active="pricing"
			/>
			<RevealOnScroll />
			<header className="wide pricing-hero">
				<div className="grid-bg" aria-hidden="true" />
				<div className="pricing-hero-copy">
					<span className="eyebrow">{t.eyebrow}</span>
					<h1 className="page-h1" style={{ whiteSpace: "pre-line" }}>
						{t.h1}
					</h1>
					<p className="page-sub">{t.sub}</p>
					<div className="pricing-adds">
						<span className="pricing-adds-t">{t.addsTitle}</span>
						<ul>
							{t.adds.map((a) => (
								<li key={a}>{a}</li>
							))}
						</ul>
						<p className="pricing-polar">{t.polar}</p>
					</div>
				</div>
				<figure className="plate pricing-plate">
					<figcaption className="plate-bar">
						<span>{ko ? "공정한 가치 교환" : "fair value exchange"}</span>
						<span className="plate-coord">fig.03</span>
					</figcaption>
					<div className="plate-art">
						<span className="plate-tag">FREE / PRO / TEAM / ENTERPRISE</span>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src="/scale-circuit.png" alt="" />
						<span className="plate-scan" aria-hidden="true" />
					</div>
				</figure>
			</header>

			<section className="wide" style={{ marginTop: 56 }}>
				<PricingPlans
					lang={lang}
					currentPlan={currentPlan}
					hasManagedSub={hasManagedSub}
					portalUrl={PORTAL_URL}
				/>
			</section>

			<section className="wide why-pay">
				<h2>{t.whyTitle}</h2>
				<div className="why-grid">
					<div className="why-col why-self">
						<h3>{t.selfTitle}</h3>
						<ul>
							{t.selfItems.map((s) => (
								<li key={s}>{s}</li>
							))}
						</ul>
					</div>
					<div className="why-col why-hosted">
						<h3>{t.hostedTitle}</h3>
						<ul>
							{t.hostedItems.map((s) => (
								<li key={s}>{s}</li>
							))}
						</ul>
					</div>
				</div>
				<p className="why-punch">{t.whyPunch}</p>
				<p className="why-q">
					{t.qPre}
					<a href={`${REPO_URL}/issues`}>{t.qLink}</a>
					{t.qPost}
				</p>
			</section>

			<SiteFooter lang={lang} />
		</>
	);
}
