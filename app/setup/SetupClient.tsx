"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MarketingNav from "@/app/components/MarketingNav";
import SiteFooter from "@/app/components/SiteFooter";
import type { Lang } from "@/lib/i18n";

const inputStyle: React.CSSProperties = {
	display: "block",
	marginTop: 8,
	padding: "11px 13px",
	width: "100%",
	background: "#0b0f14",
	color: "var(--fg)",
	border: "1px solid var(--border)",
	borderRadius: 8,
	fontFamily: "var(--mono)",
	fontSize: 14,
};

const C = {
	en: {
		eyebrow: "self-host / advanced",
		h1: "Run your own SlopGuard",
		lead: "This page builds a brand-new GitHub App from a manifest so you can self-host SlopGuard on your own server. Most people do not need this.",
		hostedTitle: "Just want to use SlopGuard?",
		hostedBody:
			"Install the hosted app on your repo. No server, no setup. That is what you want unless you specifically need to self-host.",
		hostedCta: "Install on your repo",
		selfTitle: "Self-host setup",
		selfLeadA: "One click creates the App with the exact permissions and webhook URL for",
		selfLeadB: "GitHub then returns credentials to paste into your env.",
		thisDeploy: "this deployment",
		appNameLabel: "GitHub App name (must be globally unique)",
		orgLabel: "Install under an organization? (optional)",
		createBtn: "Create your own App on GitHub",
		manifest: "Manifest preview",
		back: "Back to home",
	},
	ko: {
		eyebrow: "셀프호스팅 / 고급",
		h1: "직접 SlopGuard 운영하기",
		lead: "이 페이지는 매니페스트로 새 GitHub App을 만들어, SlopGuard를 직접 서버에 올려 운영할 수 있게 합니다. 대부분은 필요하지 않습니다.",
		hostedTitle: "그냥 쓰고 싶으신가요?",
		hostedBody:
			"호스팅된 앱을 레포에 설치하면 됩니다. 서버도, 설정도 없습니다. 직접 호스팅이 꼭 필요한 게 아니라면 이쪽이 맞습니다.",
		hostedCta: "내 레포에 설치하기",
		selfTitle: "셀프호스팅 설정",
		selfLeadA: "클릭 한 번이면 정확한 권한과 웹훅 URL이 설정된 App을 만듭니다. 대상:",
		selfLeadB: "GitHub가 환경변수에 넣을 자격 증명을 돌려줍니다.",
		thisDeploy: "이 배포",
		appNameLabel: "GitHub App 이름 (전역에서 유일해야 함)",
		orgLabel: "조직에 설치하나요? (선택)",
		createBtn: "GitHub에서 내 App 만들기",
		manifest: "매니페스트 미리보기",
		back: "홈으로",
	},
} as const;

export default function SetupClient({ lang = "en" }: { lang?: Lang }) {
	const c = C[lang];
	const ko = lang === "ko";
	const installHref = ko ? "/ko/install" : "/install";
	const homeHref = ko ? "/ko" : "/";

	const [origin, setOrigin] = useState("");
	const [org, setOrg] = useState("");
	const [appName, setAppName] = useState("SlopGuard Guard");

	useEffect(() => setOrigin(window.location.origin), []);

	const manifest = {
		name: appName,
		description:
			"Detects AI slop PRs/issues, tags provenance, quarantines with a label, maintainer has the final say.",
		url: "https://github.com/Blue-B/slopguard",
		hook_attributes: { url: `${origin}/api/webhook`, active: true },
		redirect_url: `${origin}/api/manifest/callback`,
		setup_url: `${origin}/setup`,
		public: true,
		default_permissions: {
			metadata: "read",
			contents: "read",
			issues: "write",
			pull_requests: "write",
		},
		default_events: ["pull_request", "issues", "issue_comment"],
	};

	const action = org
		? `https://github.com/organizations/${org}/settings/apps/new`
		: "https://github.com/settings/apps/new";

	return (
		<>
			<MarketingNav lang={lang} enHref="/setup" koHref="/ko/setup" />

			<main className="install-main">
				<header className="docs-hero">
					<div className="grid-bg" aria-hidden="true" />
					<div className="docs-hero-copy">
						<span className="eyebrow">{c.eyebrow}</span>
						<h1 className="page-h1">{c.h1}</h1>
						<p className="page-sub">{c.lead}</p>
					</div>
					<figure className="plate docs-hero-plate">
						<figcaption className="plate-bar">
							<span>{ko ? "직접 운영" : "self-host"}</span>
							<span className="plate-coord">manifest</span>
						</figcaption>
						<div className="plate-art">
							<span className="plate-tag">GitHub App</span>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src="/gears-circuit.png" alt="" />
							<span className="plate-scan" aria-hidden="true" />
						</div>
					</figure>
				</header>

				<div className="why-pay" style={{ marginTop: 8 }}>
					<h3>{c.hostedTitle}</h3>
					<p>{c.hostedBody}</p>
					<Link
						className="btn btn-primary btn-sm"
						href={installHref}
						style={{ marginTop: 14 }}
					>
						{c.hostedCta}
					</Link>
				</div>

				<section className="install-perms">
					<h2 className="install-h2">{c.selfTitle}</h2>
					<p className="muted" style={{ fontSize: 14, marginTop: 0 }}>
						{c.selfLeadA} <code>{origin || c.thisDeploy}</code>. {c.selfLeadB}
					</p>

					<div className="setup-form">
						<label className="setup-label">{c.appNameLabel}</label>
						<input
							value={appName}
							onChange={(e) => setAppName(e.target.value)}
							placeholder="SlopGuard Guard"
							style={inputStyle}
						/>
						<label className="setup-label" style={{ marginTop: 16 }}>
							{c.orgLabel}
						</label>
						<input
							value={org}
							onChange={(e) => setOrg(e.target.value)}
							placeholder="my-org"
							style={inputStyle}
						/>
					</div>

					<form action={action} method="post" style={{ marginTop: 18 }}>
						<input
							type="hidden"
							name="manifest"
							value={JSON.stringify(manifest)}
						/>
						<button
							type="submit"
							className="btn btn-primary btn-lg"
							disabled={!origin}
						>
							{c.createBtn}
						</button>
					</form>

					<figure className="plate docs-code-plate" style={{ marginTop: 22 }}>
						<figcaption className="plate-bar">
							<span>{c.manifest}</span>
							<span className="plate-coord">app-manifest.json</span>
						</figcaption>
						<pre className="docs-code">
							<code>{JSON.stringify(manifest, null, 2)}</code>
						</pre>
					</figure>

					<p style={{ marginTop: 22 }}>
						<Link className="muted" href={homeHref} style={{ fontSize: 14 }}>
							&larr; {c.back}
						</Link>
					</p>
				</section>
			</main>

			<SiteFooter lang={lang} />
		</>
	);
}
