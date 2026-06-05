"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ConsoleSidebar, { type SidebarItem } from "./ConsoleSidebar";

type DashboardResponse =
	| {
			installed: true;
			owner: string;
			repoCount: number;
			quarantined: number;
			cleared: number;
			repos: Array<{ repo: string; quarantined: number; cleared: number }>;
	  }
	| { installed: false; owner: string; reason: string };

export type PolicyFullViewCopy = {
	workspace: string;
	workspaceSub: string;
	user: string;
	entitlement: string;
	connected: string;
	nav: SidebarItem[];
	loading: string;
	empty: string;
	installCta: string;
	installHref: string;
	backHref: string;
	backLabel: string;
	heroEyebrow: string;
	heroTitle: string;
	heroBody: string;
	policyFileTitle: string;
	policyFileBody: string;
	docsHref: string;
};

export default function PolicyFullView({
	copy,
}: {
	copy: PolicyFullViewCopy;
}) {
	const [data, setData] = useState<DashboardResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/team/dashboard", { cache: "no-store" });
				if (!res.ok) {
					setError(`HTTP ${res.status}`);
					return;
				}
				setData((await res.json()) as DashboardResponse);
			} catch (e) {
				setError(e instanceof Error ? e.message : "load failed");
			}
		})();
	}, []);

	const isLoading = data === null && error === null;
	const notInstalled = data !== null && "installed" in data && data.installed === false;
	const live = data && data.installed ? data : null;

	const total = live?.repoCount ?? 0;
	const covered = live?.repos.length ?? 0;
	const pct = total > 0 ? Math.round((covered / total) * 100) : 0;
	const missing = total - covered;
	const quarantined = live?.quarantined ?? 0;
	const cleared = live?.cleared ?? 0;

	return (
		<main
			style={{
				maxWidth: 1280,
				margin: "0 auto",
				padding: "24px 24px 64px",
			}}
		>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "240px 1fr",
					gap: 24,
				}}
			>
				<ConsoleSidebar
					workspace={copy.workspace}
					workspaceSub={copy.workspaceSub}
					user={copy.user}
					entitlement={copy.entitlement}
					connected={copy.connected}
					nav={copy.nav}
				/>

				<section>
					<header
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-end",
							padding: "8px 0 24px",
							borderBottom: "1px solid #1c2530",
							marginBottom: 8,
						}}
					>
						<div>
							<div
								style={{
									color: "#3fb950",
									fontSize: 10,
									letterSpacing: ".18em",
									textTransform: "uppercase",
									fontFamily: "var(--mono)",
									marginBottom: 8,
								}}
							>
								{copy.heroEyebrow}
							</div>
							<h1
								style={{
									margin: 0,
									fontSize: 24,
									letterSpacing: "-.03em",
									fontWeight: 800,
								}}
							>
								{copy.heroTitle}
							</h1>
							<p
								style={{
									color: "#8b949e",
									margin: "8px 0 0",
									maxWidth: 560,
									fontSize: 13,
									lineHeight: 1.5,
								}}
							>
								{copy.heroBody}
							</p>
						</div>
						<Link href={copy.backHref} className="btn btn-ghost btn-sm">
							← {copy.backLabel}
						</Link>
					</header>

					{isLoading && (
						<div
							style={{
								padding: "48px 0",
								textAlign: "center",
								color: "#8b949e",
								fontFamily: "var(--mono)",
								fontSize: 12,
							}}
						>
							{copy.loading}
						</div>
					)}

					{notInstalled && (
						<div
							style={{
								padding: "48px 0",
								textAlign: "center",
								color: "#8b949e",
							}}
						>
							<p style={{ fontSize: 13, marginBottom: 16 }}>{copy.empty}</p>
							<Link href={copy.installHref} className="btn btn-primary btn-sm">
								{copy.installCta}
							</Link>
						</div>
					)}

					{live && (
						<>
							{/* Coverage bar — full width, no card */}
							<div
								style={{
									padding: "32px 0 24px",
									borderBottom: "1px solid #1c2530",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "baseline",
										marginBottom: 14,
										fontFamily: "var(--mono)",
										fontSize: 12,
									}}
								>
									<span style={{ color: "#8b949e" }}>Enforcing policy on</span>
									<span
										style={{
											color: "#3fb950",
											fontWeight: 700,
											fontSize: 28,
											letterSpacing: "-.03em",
										}}
									>
										{pct}%
									</span>
								</div>
								<div
									style={{
										height: 8,
										background: "rgba(255,255,255,0.04)",
										borderRadius: 99,
										overflow: "hidden",
									}}
								>
									<div
										style={{
											width: `${pct}%`,
											height: "100%",
											background:
												"linear-gradient(90deg, #3fb950 0%, #2ea043 100%)",
										}}
									/>
								</div>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "repeat(4, 1fr)",
										gap: 16,
										marginTop: 28,
									}}
								>
									<div>
										<div
											style={{
												color: "#8b949e",
												fontSize: 10,
												letterSpacing: ".14em",
												textTransform: "uppercase",
												fontFamily: "var(--mono)",
											}}
										>
											Installed repos
										</div>
										<div
											style={{
												fontSize: 22,
												fontWeight: 800,
												fontFamily: "var(--mono)",
												marginTop: 6,
											}}
										>
											{total}
										</div>
									</div>
									<div>
										<div
											style={{
												color: "#8b949e",
												fontSize: 10,
												letterSpacing: ".14em",
												textTransform: "uppercase",
												fontFamily: "var(--mono)",
											}}
										>
											Protected
										</div>
										<div
											style={{
												fontSize: 22,
												fontWeight: 800,
												fontFamily: "var(--mono)",
												marginTop: 6,
												color: "#3fb950",
											}}
										>
											{covered}
										</div>
									</div>
									<div>
										<div
											style={{
												color: "#8b949e",
												fontSize: 10,
												letterSpacing: ".14em",
												textTransform: "uppercase",
												fontFamily: "var(--mono)",
											}}
										>
											Quarantined
										</div>
										<div
											style={{
												fontSize: 22,
												fontWeight: 800,
												fontFamily: "var(--mono)",
												marginTop: 6,
												color: "#f85149",
											}}
										>
											{quarantined}
										</div>
									</div>
									<div>
										<div
											style={{
												color: "#8b949e",
												fontSize: 10,
												letterSpacing: ".14em",
												textTransform: "uppercase",
												fontFamily: "var(--mono)",
											}}
										>
											Cleared
										</div>
										<div
											style={{
												fontSize: 22,
												fontWeight: 800,
												fontFamily: "var(--mono)",
												marginTop: 6,
												color: "#3fb950",
											}}
										>
											{cleared}
										</div>
									</div>
								</div>
							</div>

							{/* Policy file — link to docs */}
							<div
								style={{
									padding: "24px 0",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div>
									<h3
										style={{
											margin: 0,
											fontSize: 15,
											letterSpacing: "-.02em",
										}}
									>
										{copy.policyFileTitle}
									</h3>
									<p
										style={{
											color: "#8b949e",
											margin: "4px 0 0",
											fontSize: 12,
										}}
									>
										{copy.policyFileBody}
									</p>
								</div>
								<Link
									href={copy.docsHref}
									className="btn btn-ghost btn-sm"
								>
									Open docs →
								</Link>
							</div>

							{missing > 0 && (
								<div
									style={{
										padding: "16px 0",
										color: "#d29922",
										fontSize: 12,
										fontFamily: "var(--mono)",
									}}
								>
									{missing} installed repos have no quarantine activity yet —
									they&apos;ll be marked protected once SlopGuard labels their
									first item.
								</div>
							)}
						</>
					)}
				</section>
			</div>
		</main>
	);
}
