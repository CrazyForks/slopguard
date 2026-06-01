import { cookies } from "next/headers";
import Link from "next/link";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth/session";
import { planForOwner } from "@/lib/billing/entitlement";
import { PLANS } from "@/lib/billing/plans";
import type { Lang } from "@/lib/i18n";

const INSTALL_URL =
	"https://github.com/apps/slopguard-blue-b-2026/installations/new";
const PORTAL_URL = "https://polar.sh/slopguard/portal";

const T = {
	en: {
		brand: "SlopGuard",
		home: "Home",
		signedOutTitle: "Sign in to SlopGuard",
		signedOutSub:
			"Use your GitHub account to see your plan, manage billing, and install the app.",
		signin: "Sign in with GitHub",
		myAccount: "My account",
		account: "GitHub account",
		email: "Email",
		plan: "Plan",
		planFreeNote:
			"You are on the Free plan. Upgrade to Pro for private repos and a dedicated LLM quota.",
		planPaidNote:
			"Your paid plan is active. It is matched to the GitHub account you entered at checkout.",
		upgrade: "See plans",
		manageBilling: "Manage billing",
		installApp: "Install / manage on GitHub",
		logout: "Sign out",
		errorNote: "Sign-in did not complete. Please try again.",
		notProvided: "not provided",
	},
	ko: {
		brand: "SlopGuard",
		home: "홈",
		signedOutTitle: "SlopGuard 로그인",
		signedOutSub:
			"GitHub 계정으로 로그인하면 내 플랜 확인, 결제 관리, 앱 설치를 할 수 있습니다.",
		signin: "GitHub으로 로그인",
		myAccount: "마이페이지",
		account: "GitHub 계정",
		email: "이메일",
		plan: "플랜",
		planFreeNote:
			"현재 Free 플랜입니다. 비공개 레포와 전용 LLM 쿼터가 필요하면 Pro로 업그레이드하세요.",
		planPaidNote:
			"유료 플랜이 활성화되어 있습니다. 결제 시 입력한 GitHub 계정과 연결됩니다.",
		upgrade: "플랜 보기",
		manageBilling: "결제 관리",
		installApp: "GitHub에서 설치 / 관리",
		logout: "로그아웃",
		errorNote: "로그인이 완료되지 않았습니다. 다시 시도해 주세요.",
		notProvided: "미제공",
	},
} as const;

function PlanBadge({ plan }: { plan: "free" | "pro" | "team" }) {
	const cls = plan === "free" ? "cleared" : "quarantine";
	const color =
		plan === "free" ? "var(--green)" : plan === "team" ? "#a371f7" : "var(--green)";
	return (
		<span
			className="label"
			style={{
				color,
				background: "rgba(63,185,80,0.12)",
				borderColor: "rgba(63,185,80,0.4)",
				fontSize: 13,
				textTransform: "uppercase",
			}}
			data-cls={cls}
		>
			{PLANS[plan].name}
		</span>
	);
}

export default async function Account({
	lang,
	error,
}: {
	lang: Lang;
	error?: string;
}) {
	const t = T[lang];
	const home = lang === "ko" ? "/ko" : "/";
	const store = await cookies();
	const session = decodeSession(store.get(SESSION_COOKIE)?.value);
	const plan = session ? await planForOwner(session.login) : null;

	return (
		<>
			<nav className="nav">
				<Link className="brand" href={home}>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/shield.svg" alt="SlopGuard" />
					{t.brand}
				</Link>
				<span className="nav-links">
					<Link href={home}>{t.home}</Link>
				</span>
			</nav>

			<main className="wide" style={{ maxWidth: 620, paddingTop: 56 }}>
				{!session ? (
					<>
						<span className="eyebrow">
							<span className="dot" /> account
						</span>
						<h1
							style={{ fontSize: 32, letterSpacing: "-0.02em", margin: "14px 0 8px" }}
						>
							{t.signedOutTitle}
						</h1>
						<p className="muted" style={{ marginTop: 0 }}>
							{t.signedOutSub}
						</p>
						{error && (
							<p style={{ color: "var(--danger)", fontSize: 14 }}>{t.errorNote}</p>
						)}
						<a className="btn btn-primary btn-lg" href="/api/auth/login">
							{t.signin}
						</a>
					</>
				) : (
					<>
						<h1
							style={{ fontSize: 28, letterSpacing: "-0.02em", margin: "0 0 20px" }}
						>
							{t.myAccount}
						</h1>
						<div className="card" style={{ marginBottom: 16 }}>
							<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={session.avatar}
									alt=""
									width={56}
									height={56}
									style={{ borderRadius: "50%", border: "1px solid var(--border)" }}
								/>
								<div>
									<div style={{ fontWeight: 700, fontSize: 17 }}>
										{session.name || session.login}
									</div>
									<a
										href={session.profileUrl}
										className="mono"
										style={{ fontSize: 13 }}
									>
										@{session.login}
									</a>
								</div>
								<span style={{ marginLeft: "auto" }}>
									{plan && <PlanBadge plan={plan} />}
								</span>
							</div>
						</div>

						<div className="card" style={{ marginBottom: 16 }}>
							<dl style={{ margin: 0, display: "grid", gap: 12 }}>
								<div>
									<dt className="muted" style={{ fontSize: 12 }}>
										{t.account}
									</dt>
									<dd className="mono" style={{ margin: "2px 0 0", fontSize: 14 }}>
										{session.login}
									</dd>
								</div>
								<div>
									<dt className="muted" style={{ fontSize: 12 }}>
										{t.email}
									</dt>
									<dd className="mono" style={{ margin: "2px 0 0", fontSize: 14 }}>
										{session.email || t.notProvided}
									</dd>
								</div>
								<div>
									<dt className="muted" style={{ fontSize: 12 }}>
										{t.plan}
									</dt>
									<dd style={{ margin: "4px 0 0" }}>
										{plan && <PlanBadge plan={plan} />}
									</dd>
								</div>
							</dl>
							<p className="muted" style={{ fontSize: 13, marginBottom: 0 }}>
								{plan === "free" ? t.planFreeNote : t.planPaidNote}
							</p>
						</div>

						<div className="btn-row">
							<a className="btn btn-primary" href={INSTALL_URL}>
								{t.installApp}
							</a>
							{plan === "free" ? (
								<Link className="btn btn-ghost" href={`${home}#pricing`}>
									{t.upgrade}
								</Link>
							) : (
								<a className="btn btn-ghost" href={PORTAL_URL}>
									{t.manageBilling}
								</a>
							)}
							<a className="btn btn-ghost" href="/api/auth/logout">
								{t.logout}
							</a>
						</div>
					</>
				)}
			</main>

			<footer className="site">
				<p>
					SlopGuard | MIT |{" "}
					<a href="https://github.com/Blue-B/slopguard">
						github.com/Blue-B/slopguard
					</a>
				</p>
			</footer>
		</>
	);
}
