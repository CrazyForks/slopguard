"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ConsoleSidebar, { type SidebarItem } from "./ConsoleSidebar";
import { shell, frame, card, muted, toneColor } from "./console-styles";

type SsoState = {
	provider: string;
	status: "active" | "pending" | "unconfigured";
	lastSync: string;
};
type AuditEntry = {
	id: string;
	owner: string;
	when: string;
	actor: string;
	action: string;
	target: string;
	source: "SSO" | "API" | "Admin";
};
type Integration = {
	name: string;
	status: "connected" | "pending" | "available";
	scope: string;
};

type StateResponse = {
	owner: string;
	sso: SsoState;
	audit: AuditEntry[];
	integrations: Integration[];
};

export type EnterpriseConsoleCopy = {
	workspace: string;
	workspaceSub: string;
	user: string;
	entitlement: string;
	connected: string;
	nav: SidebarItem[];
	activeNav: string;
	loading: string;
	backToOrg: string;
	contactSales: string;
	accountHref: string;
	orgHref: string;
	alertsHref: string;
	campaignsHref: string;
	heroEyebrow: string;
	heroTitle: string;
	heroBody: string;
	heroCta: string;
	heroCtaHref: string;
	ssoTitle: string;
	ssoSubtitle: string;
	ssoProviderLabel: string;
	ssoStatusLabel: string;
	ssoLastSyncLabel: string;
	auditTitle: string;
	auditSubtitle: string;
	auditEmpty: string;
	auditColumns: {
		when: string;
		actor: string;
		action: string;
		target: string;
		source: string;
	};
	exportAudit: string;
	integrationsTitle: string;
	integrationsSubtitle: string;
	connect: string;
	disconnect: string;
	supportTitle: string;
	supportSubtitle: string;
	supportSla: string;
	supportHours: string;
	supportAccountMgr: string;
};

function sourceColor(s: AuditEntry["source"]): string {
	return s === "SSO" ? "#a371f7" : s === "Admin" ? "#3fb950" : "#d29922";
}

function formatLastSync(iso: string): string {
	const ms = Date.now() - new Date(iso).getTime();
	const m = Math.floor(ms / 60000);
	if (m < 1) return "just now";
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	return new Date(iso).toISOString().slice(0, 10);
}

export default function EnterpriseConsole({
	copy,
}: {
	copy: EnterpriseConsoleCopy;
}) {
	const [data, setData] = useState<StateResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function load() {
		try {
			const res = await fetch("/api/enterprise/state", { cache: "no-store" });
			if (!res.ok) {
				setError(`HTTP ${res.status}`);
				return;
			}
			const json = (await res.json()) as StateResponse;
			setData(json);
			setError(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load Enterprise state");
		}
	}

	useEffect(() => {
		load();
		const t = setInterval(load, 15_000);
		return () => clearInterval(t);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isLoading = data === null && error === null;

	const metrics = [
		{
			label: "Audit entries",
			value: data ? String(data.audit.length) : "—",
			detail: data ? "most recent 20" : "loading",
			tone: "ok" as const,
		},
		{
			label: "Integrations",
			value: data ? String(data.integrations.length) : "—",
			detail: data
				? `${data.integrations.filter((i) => i.status === "connected").length} connected`
				: "loading",
			tone: "ok" as const,
		},
		{
			label: "SSO provider",
			value: data?.sso.provider ?? "—",
			detail: data?.sso ? `last sync ${formatLastSync(data.sso.lastSync)}` : "loading",
			tone: "ok" as const,
		},
		{
			label: "SSO status",
			value: data?.sso.status ?? "—",
			detail: data ? "SAML 2.0 ready" : "loading",
			tone: data?.sso.status === "active" ? ("ok" as const) : ("warn" as const),
		},
	];

	return (
		<main style={shell}>
			<section style={frame}>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "240px 1fr",
						minHeight: 760,
					}}
				>
					<ConsoleSidebar
						workspace={copy.workspace}
						workspaceSub={copy.workspaceSub}
						user={copy.user}
						entitlement={copy.entitlement}
						connected={copy.connected}
						nav={copy.nav}
						activeNav={copy.activeNav}
					/>

					<div style={{ padding: "26px 28px 32px" }}>
						<header
							style={{
								display: "grid",
								gridTemplateColumns: "1.2fr 1fr",
								gap: 18,
								marginBottom: 26,
							}}
						>
							<div
								style={{
									background:
										"radial-gradient(120% 80% at 0% 0%, rgba(163,113,247,.10), transparent 60%), linear-gradient(180deg, #0f1620 0%, #0b1016 100%)",
									border: "1px solid #1c2530",
									borderRadius: 16,
									padding: "20px 22px",
								}}
							>
								<div
									style={{
										color: "#a371f7",
										fontSize: 11,
										fontWeight: 800,
										letterSpacing: ".14em",
										fontFamily: "var(--mono)",
									}}
								>
									{copy.heroEyebrow}
								</div>
								<h1
									style={{
										margin: "10px 0 8px",
										fontSize: 30,
										letterSpacing: "-.035em",
										fontWeight: 800,
										lineHeight: 1.1,
									}}
								>
									{copy.heroTitle}
								</h1>
								<p
									style={{
										...muted,
										margin: 0,
										maxWidth: 540,
										lineHeight: 1.55,
										fontSize: 14,
									}}
								>
									{copy.heroBody}
								</p>
								<div style={{ marginTop: 16, display: "flex", gap: 10 }}>
									<Link
										href={copy.heroCtaHref}
										className="btn btn-primary btn-sm"
									>
										{copy.heroCta}
									</Link>
									<Link href={copy.orgHref} className="btn btn-ghost btn-sm">
										{copy.backToOrg}
									</Link>
								</div>
							</div>
							<div
								style={{
									border: "1px solid #1c2530",
									borderRadius: 16,
									overflow: "hidden",
									position: "relative",
									minHeight: 180,
									background: "#0a0e15",
								}}
							>
								<Image
									src="/gears-circuit.png"
									alt="Enterprise integrations"
									fill
									style={{ objectFit: "cover", opacity: 0.7 }}
									sizes="(max-width: 1280px) 100vw, 480px"
								/>
								<div
									style={{
										position: "absolute",
										inset: 0,
										background:
											"linear-gradient(180deg, rgba(10,14,21,.4) 0%, rgba(10,14,21,.9) 100%)",
									}}
								/>
								<div
									style={{
										position: "absolute",
										bottom: 14,
										left: 16,
										right: 16,
										fontFamily: "var(--mono)",
										fontSize: 11,
										color: "#8b949e",
										letterSpacing: ".05em",
									}}
								>
									<div
										style={{ color: "#f0f6fc", fontWeight: 700, fontSize: 12 }}
									>
										Compliance · Audit · SSO
									</div>
									<div style={{ marginTop: 4 }}>
										{data
											? `${data.audit.length} audit · ${data.integrations.length} integrations`
											: copy.loading}
									</div>
								</div>
							</div>
						</header>

						{isLoading && (
							<div
								style={{
									...card,
									padding: "32px 24px",
									textAlign: "center",
									color: "#8b949e",
									fontFamily: "var(--mono)",
									fontSize: 12,
									marginBottom: 24,
								}}
							>
								Loading live Enterprise state…
							</div>
						)}

						{error && !isLoading && (
							<div
								style={{
									...card,
									padding: "16px 18px",
									border: "1px solid rgba(248,81,73,.4)",
									color: "#f85149",
									fontSize: 12,
									fontFamily: "var(--mono)",
									marginBottom: 24,
								}}
							>
								Failed to load: {error}
							</div>
						)}

						{!isLoading && data && (
							<>
								{/* Metrics */}
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
										gap: 0,
										borderTop: "1px solid #1c2530",
										borderBottom: "1px solid #1c2530",
										marginBottom: 24,
									}}
								>
									{metrics.map((metric, i) => (
										<div
											key={metric.label}
											style={{
												padding: "16px 18px",
												borderRight:
													i < metrics.length - 1
														? "1px solid #1c2530"
														: "none",
											}}
										>
											<div
												style={{
													...muted,
													fontSize: 10,
													letterSpacing: ".14em",
													textTransform: "uppercase",
													fontFamily: "var(--mono)",
												}}
											>
												{metric.label}
											</div>
											<div
												style={{
													fontSize: metric.label === "SSO provider" ? 18 : 28,
													fontWeight: 800,
													letterSpacing: "-.03em",
													marginTop: 6,
													color: toneColor[metric.tone ?? "neutral"],
													fontFamily: "var(--mono)",
												}}
											>
												{metric.value}
											</div>
											<div
												style={{
													...muted,
													fontSize: 11,
													marginTop: 4,
												}}
											>
												{metric.detail}
											</div>
										</div>
									))}
								</div>

								{/* SSO + Support side-by-side */}
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: 14,
										marginBottom: 24,
									}}
								>
									<section
										id="sso"
										style={{ ...card, padding: "16px 18px", scrollMarginTop: 80 }}
									>
										<div
											style={{
												color: "#a371f7",
												fontSize: 10,
												letterSpacing: ".14em",
												textTransform: "uppercase",
												fontFamily: "var(--mono)",
												marginBottom: 8,
											}}
										>
											{copy.ssoTitle}
										</div>
										<h3
											style={{
												margin: 0,
												fontSize: 16,
												letterSpacing: "-.02em",
											}}
										>
											{copy.ssoSubtitle}
										</h3>
										<div style={{ marginTop: 14, display: "grid", gap: 10 }}>
											<div
												style={{
													display: "flex",
													justifyContent: "space-between",
													fontSize: 12,
												}}
											>
												<span
													style={{ color: "#8b949e", fontFamily: "var(--mono)" }}
												>
													{copy.ssoProviderLabel}
												</span>
												<span
													style={{
														color: "#f0f6fc",
														fontFamily: "var(--mono)",
													}}
												>
													{data.sso.provider}
												</span>
											</div>
											<div
												style={{
													display: "flex",
													justifyContent: "space-between",
													fontSize: 12,
												}}
											>
												<span
													style={{ color: "#8b949e", fontFamily: "var(--mono)" }}
												>
													{copy.ssoStatusLabel}
												</span>
												<span
													style={{
														color: "#3fb950",
														fontFamily: "var(--mono)",
														fontWeight: 600,
													}}
												>
													● {data.sso.status}
												</span>
											</div>
											<div
												style={{
													display: "flex",
													justifyContent: "space-between",
													fontSize: 12,
												}}
											>
												<span
													style={{ color: "#8b949e", fontFamily: "var(--mono)" }}
												>
													{copy.ssoLastSyncLabel}
												</span>
												<span
													style={{
														color: "#f0f6fc",
														fontFamily: "var(--mono)",
													}}
												>
													{formatLastSync(data.sso.lastSync)}
												</span>
											</div>
										</div>
									</section>

									<section style={{ ...card, padding: "16px 18px" }}>
										<div
											style={{
												color: "#a371f7",
												fontSize: 10,
												letterSpacing: ".14em",
												textTransform: "uppercase",
												fontFamily: "var(--mono)",
												marginBottom: 8,
											}}
										>
											{copy.supportTitle}
										</div>
										<h3
											style={{
												margin: 0,
												fontSize: 16,
												letterSpacing: "-.02em",
											}}
										>
											{copy.supportSubtitle}
										</h3>
										<div
											style={{
												marginTop: 14,
												display: "grid",
												gridTemplateColumns: "1fr 1fr 1fr",
												gap: 10,
											}}
										>
											{[
												{ label: copy.supportSla, value: "1h P1" },
												{ label: copy.supportHours, value: "24 / 7" },
												{ label: copy.supportAccountMgr, value: "assigned" },
											].map((row) => (
												<div
													key={row.label}
													style={{
														border: "1px solid #1c2530",
														borderRadius: 10,
														padding: "10px 12px",
														background: "#0a1018",
													}}
												>
													<div
														style={{
															color: "#8b949e",
															fontSize: 10,
															letterSpacing: ".14em",
															textTransform: "uppercase",
															fontFamily: "var(--mono)",
														}}
													>
														{row.label}
													</div>
													<div
														style={{
															fontSize: 18,
															fontWeight: 800,
															fontFamily: "var(--mono)",
															color: "#f0f6fc",
															marginTop: 4,
														}}
													>
														{row.value}
													</div>
												</div>
											))}
										</div>
									</section>
								</div>

								{/* Audit log — id=audit anchor */}
								<section
									id="audit"
									style={{ marginBottom: 24, scrollMarginTop: 80 }}
								>
									<header
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-end",
											marginBottom: 12,
										}}
									>
										<div>
											<h2
												style={{
													margin: 0,
													fontSize: 18,
													letterSpacing: "-.02em",
												}}
											>
												{copy.auditTitle}
											</h2>
											<div style={{ ...muted, fontSize: 12, marginTop: 4 }}>
												{copy.auditSubtitle}
											</div>
										</div>
										<div style={{ display: "flex", gap: 8 }}>
											<Link
												href="/api/audit/export?format=json"
												className="btn btn-ghost btn-sm"
												prefetch={false}
											>
												Export JSON
											</Link>
											<Link
												href="/api/audit/export?format=csv"
												className="btn btn-primary btn-sm"
												prefetch={false}
											>
												{copy.exportAudit}
											</Link>
										</div>
									</header>
									<div style={{ ...card, overflow: "hidden" }}>
										{data.audit.length === 0 ? (
											<div
												style={{
													padding: "32px 24px",
													textAlign: "center",
													color: "#8b949e",
													fontSize: 12,
													fontFamily: "var(--mono)",
												}}
											>
												{copy.auditEmpty}
											</div>
										) : (
											<table
												style={{
													width: "100%",
													borderCollapse: "collapse",
													fontSize: 13,
												}}
											>
												<thead>
													<tr
														style={{
															color: "#7d8590",
															borderBottom: "1px solid #1c2530",
														}}
													>
														{(["when", "actor", "action", "target", "source"] as const).map(
															(k) => (
																<th
																	key={k}
																	style={{
																		textAlign: "left",
																		padding: "10px 14px",
																		fontSize: 10,
																		letterSpacing: ".14em",
																		textTransform: "uppercase",
																		fontWeight: 600,
																		fontFamily: "var(--mono)",
																	}}
																>
																	{copy.auditColumns[k]}
																</th>
															),
														)}
													</tr>
												</thead>
												<tbody>
													{data.audit.map((row) => (
														<tr
															key={row.id}
															style={{ borderBottom: "1px solid #161e29" }}
														>
															<td
																style={{
																	padding: "11px 14px",
																	fontFamily: "var(--mono)",
																	color: "#8b949e",
																}}
															>
																{row.when}
															</td>
															<td
																style={{
																	padding: "11px 14px",
																	color: "#c9d1d9",
																}}
															>
																{row.actor}
															</td>
															<td
																style={{
																	padding: "11px 14px",
																	color: "#c9d1d9",
																}}
															>
																{row.action}
															</td>
															<td
																style={{
																	padding: "11px 14px",
																	color: "#c9d1d9",
																}}
															>
																{row.target}
															</td>
															<td
																style={{
																	padding: "11px 14px",
																	color: sourceColor(row.source),
																	fontFamily: "var(--mono)",
																}}
															>
																{row.source}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										)}
									</div>
								</section>

								{/* Integrations — id=integrations anchor */}
								<section id="integrations" style={{ scrollMarginTop: 80 }}>
									<header
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-end",
											marginBottom: 12,
										}}
									>
										<div>
											<h2
												style={{
													margin: 0,
													fontSize: 18,
													letterSpacing: "-.02em",
												}}
											>
												{copy.integrationsTitle}
											</h2>
											<div style={{ ...muted, fontSize: 12, marginTop: 4 }}>
												{copy.integrationsSubtitle}
											</div>
										</div>
									</header>
									<div
										style={{
											display: "grid",
											gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
											gap: 10,
										}}
									>
										{data.integrations.map((integration) => (
											<div
												key={integration.name}
												style={{
													...card,
													padding: "12px 14px",
												}}
											>
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<div style={{ fontWeight: 700 }}>{integration.name}</div>
													<span
														style={{
															fontSize: 10,
															padding: "1px 8px",
															borderRadius: 99,
															fontFamily: "var(--mono)",
															textTransform: "uppercase",
															letterSpacing: ".08em",
															background:
																integration.status === "connected"
																	? "rgba(63,185,80,.12)"
																	: integration.status === "pending"
																		? "rgba(210,153,34,.12)"
																		: "rgba(141,148,158,.12)",
															color:
																integration.status === "connected"
																	? "#3fb950"
																	: integration.status === "pending"
																		? "#d29922"
																		: "#8b949e",
														}}
													>
														{integration.status}
													</span>
												</div>
												<div
													style={{
														color: "#8b949e",
														fontSize: 11,
														marginTop: 4,
														fontFamily: "var(--mono)",
													}}
												>
													{integration.scope}
												</div>
												<button
													type="button"
													className="btn btn-ghost btn-sm"
													disabled={integration.status === "pending"}
													style={{ marginTop: 10 }}
												>
													{integration.status === "connected"
														? copy.disconnect
														: copy.connect}
												</button>
											</div>
										))}
									</div>
								</section>
							</>
						)}

						<div
							style={{
								marginTop: 24,
								display: "flex",
								gap: 10,
								justifyContent: "flex-end",
							}}
						>
							<Link href={copy.accountHref} className="btn btn-ghost btn-sm">
								{copy.contactSales}
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
