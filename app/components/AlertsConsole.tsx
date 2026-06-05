"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ConsoleSidebar, { type SidebarItem } from "./ConsoleSidebar";
import { shell, frame, card, muted, toneColor } from "./console-styles";

type Channel = {
	id: string;
	kind: "slack" | "discord" | "webhook";
	label: string;
	target: string;
	status: "active" | "paused" | "failed";
	lastSent: string | null;
	lastLatencyMs: number | null;
};
type RouteRule = {
	id: string;
	repo: string;
	pattern: string;
	channel: string;
	threshold: number;
};
type SentRow = {
	id: string;
	when: string;
	item: string;
	score: number;
	dest: string;
	channelKind: "slack" | "discord" | "webhook";
	status: "delivered" | "failed" | "queued" | "retrying";
	latency: string;
};

type StateResponse = {
	owner: string;
	channels: Channel[];
	rules: RouteRule[];
	sent: SentRow[];
};

export type AlertsConsoleCopy = {
	workspace: string;
	workspaceSub: string;
	user: string;
	entitlement: string;
	connected: string;
	nav: SidebarItem[];
	activeNav: string;
	loading: string;
	backToOrg: string;
	orgHref: string;
	campaignsHref: string;
	accountHref: string;
	heroEyebrow: string;
	heroTitle: string;
	heroBody: string;
	heroCta: string;
	heroCtaHref: string;
	channelsTitle: string;
	channelsSubtitle: string;
	channelsEmpty: string;
	rulesTitle: string;
	rulesSubtitle: string;
	rulesEmpty: string;
	rulesColumns: {
		repo: string;
		pattern: string;
		channel: string;
		threshold: string;
	};
	logTitle: string;
	logSubtitle: string;
	logEmpty: string;
	logColumns: {
		when: string;
		item: string;
		score: string;
		dest: string;
		status: string;
		latency: string;
	};
};

function statusColor(s: Channel["status"]): string {
	return s === "active" ? "#3fb950" : s === "paused" ? "#d29922" : "#f85149";
}
function rowColor(s: SentRow["status"]): string {
	return s === "delivered"
		? "#3fb950"
		: s === "queued"
			? "#d29922"
			: s === "retrying"
				? "#d29922"
				: "#f85149";
}

export default function AlertsConsole({ copy }: { copy: AlertsConsoleCopy }) {
	const [data, setData] = useState<StateResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [updatedAt, setUpdatedAt] = useState<string>("");

	async function load() {
		try {
			const res = await fetch("/api/alerts/state", { cache: "no-store" });
			if (!res.ok) {
				setError(`HTTP ${res.status}`);
				return;
			}
			const json = (await res.json()) as StateResponse;
			setData(json);
			setError(null);
			setUpdatedAt(new Date().toISOString());
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load alerts state");
		}
	}

	useEffect(() => {
		load();
		const t = setInterval(load, 15_000);
		return () => clearInterval(t);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isLoading = data === null && error === null;

	const metrics = useMemo(() => {
		const channels = data?.channels ?? [];
		const sent = data?.sent ?? [];
		const rules = data?.rules ?? [];
		const active = channels.filter((c) => c.status === "active").length;
		const failed = channels.filter((c) => c.status === "failed").length;
		const delivered = sent.filter((s) => s.status === "delivered").length;
		const avgLatency =
			sent.length > 0
				? Math.round(
						sent
							.map((s) => parseFloat(s.latency) || 0)
							.reduce((a, b) => a + b, 0) * 1000,
					) /
					sent.length /
					1000
				: 0;
		return [
			{
				label: "Channels",
				value: String(channels.length),
				detail: `${active} active · ${failed} failed`,
				tone: failed > 0 ? ("warn" as const) : ("ok" as const),
			},
			{
				label: "Routing rules",
				value: String(rules.length),
				detail: `${rules.filter((r) => r.threshold >= 80).length} high-priority`,
				tone: "neutral" as const,
			},
			{
				label: "Delivered (24h)",
				value: String(delivered),
				detail: `${sent.length} total sent`,
				tone: delivered > 0 ? ("ok" as const) : ("neutral" as const),
			},
			{
				label: "Avg. latency",
				value: avgLatency > 0 ? `${avgLatency.toFixed(1)}s` : "—",
				detail: `${sent.length} sample${sent.length === 1 ? "" : "s"}`,
				tone: avgLatency >= 2 ? ("warn" as const) : ("ok" as const),
			},
		];
	}, [data]);

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
										"radial-gradient(120% 80% at 0% 0%, rgba(63,185,80,.08), transparent 60%), linear-gradient(180deg, #0f1620 0%, #0b1016 100%)",
									border: "1px solid #1c2530",
									borderRadius: 16,
									padding: "20px 22px",
								}}
							>
								<div
									style={{
										color: "#3fb950",
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
									src="/funnel-circuit.png"
									alt="Alerts routing diagram"
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
										Routing fan-out
									</div>
									<div style={{ marginTop: 4 }}>
										{data
											? `${data.channels.length} channels · ${data.rules.length} rules`
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
								Loading live alert state…
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

						{!isLoading && (
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
													i < metrics.length - 1 ? "1px solid #1c2530" : "none",
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
													fontSize: 28,
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

								{/* Channels — id=channels anchor */}
								<section
									id="channels"
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
												{copy.channelsTitle}
											</h2>
											<div style={{ ...muted, fontSize: 12, marginTop: 4 }}>
												{copy.channelsSubtitle}
											</div>
										</div>
										<div
											style={{
												...muted,
												fontSize: 11,
												fontFamily: "var(--mono)",
											}}
										>
											{updatedAt
												? `Updated ${new Date(updatedAt).toLocaleTimeString()}`
												: ""}
										</div>
									</header>
									<div style={{ ...card, overflow: "hidden" }}>
										{data!.channels.length === 0 ? (
											<div
												style={{
													padding: "32px 24px",
													textAlign: "center",
													color: "#8b949e",
													fontSize: 12,
													fontFamily: "var(--mono)",
												}}
											>
												{copy.channelsEmpty}
											</div>
										) : (
											data!.channels.map((channel, i) => (
												<div
													key={channel.id}
													style={{
														display: "grid",
														gridTemplateColumns: "1fr 1fr auto",
														gap: 12,
														padding: "12px 16px",
														borderTop: i === 0 ? "none" : "1px solid #161e29",
														alignItems: "center",
													}}
												>
													<div>
														<div
															style={{
																display: "flex",
																alignItems: "center",
																gap: 8,
															}}
														>
															<span
																style={{
																	display: "inline-block",
																	padding: "1px 8px",
																	borderRadius: 99,
																	fontSize: 10,
																	fontFamily: "var(--mono)",
																	textTransform: "uppercase",
																	letterSpacing: ".08em",
																	background: "rgba(63,185,80,0.10)",
																	color: "#3fb950",
																}}
															>
																{channel.kind}
															</span>
															<span style={{ fontWeight: 600 }}>
																{channel.label}
															</span>
														</div>
														<div
															style={{
																...muted,
																fontSize: 11,
																marginTop: 4,
																fontFamily: "var(--mono)",
															}}
														>
															{channel.target}
														</div>
													</div>
													<div
														style={{
															fontSize: 11,
															color: "#8b949e",
															fontFamily: "var(--mono)",
														}}
													>
														{channel.lastSent
															? `last sent ${channel.lastSent}${
																	channel.lastLatencyMs
																		? ` · ${channel.lastLatencyMs}ms`
																		: ""
																}`
															: "no sends yet"}
													</div>
													<span
														style={{
															fontSize: 11,
															padding: "2px 8px",
															borderRadius: 99,
															fontFamily: "var(--mono)",
															background:
																channel.status === "active"
																	? "rgba(63,185,80,.12)"
																	: channel.status === "paused"
																		? "rgba(210,153,34,.12)"
																		: "rgba(248,81,73,.12)",
															color: statusColor(channel.status),
														}}
													>
														{channel.status}
													</span>
												</div>
											))
										)}
									</div>
								</section>

								{/* Rules — id=rules anchor */}
								<section
									id="rules"
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
												{copy.rulesTitle}
											</h2>
											<div style={{ ...muted, fontSize: 12, marginTop: 4 }}>
												{copy.rulesSubtitle}
											</div>
										</div>
									</header>
									<div style={{ ...card, overflow: "hidden" }}>
										{data!.rules.length === 0 ? (
											<div
												style={{
													padding: "32px 24px",
													textAlign: "center",
													color: "#8b949e",
													fontSize: 12,
													fontFamily: "var(--mono)",
												}}
											>
												{copy.rulesEmpty}
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
														{(
															[
																"repo",
																"pattern",
																"channel",
																"threshold",
															] as const
														).map((k) => (
															<th
																key={k}
																style={{
																	textAlign:
																		k === "threshold" ? "right" : "left",
																	padding: "10px 14px",
																	fontSize: 10,
																	letterSpacing: ".14em",
																	textTransform: "uppercase",
																	fontWeight: 600,
																	fontFamily: "var(--mono)",
																}}
															>
																{copy.rulesColumns[k]}
															</th>
														))}
													</tr>
												</thead>
												<tbody>
													{data!.rules.map((row) => (
														<tr
															key={row.id}
															style={{
																borderBottom: "1px solid #161e29",
															}}
														>
															<td
																style={{
																	padding: "11px 14px",
																	fontFamily: "var(--mono)",
																	color: "#c9d1d9",
																}}
															>
																{row.repo}
															</td>
															<td
																style={{
																	padding: "11px 14px",
																	fontFamily: "var(--mono)",
																	color: "#c9d1d9",
																}}
															>
																{row.pattern}
															</td>
															<td
																style={{
																	padding: "11px 14px",
																	color: "#c9d1d9",
																}}
															>
																{row.channel}
															</td>
															<td
																style={{
																	padding: "11px 14px",
																	textAlign: "right",
																	fontFamily: "var(--mono)",
																	color:
																		row.threshold >= 80
																			? "#f85149"
																			: row.threshold >= 60
																				? "#d29922"
																				: "#3fb950",
																}}
															>
																≥ {row.threshold}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										)}
									</div>
								</section>

								{/* Sent log — id=log anchor */}
								<section id="log" style={{ scrollMarginTop: 80 }}>
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
												{copy.logTitle}
											</h2>
											<div style={{ ...muted, fontSize: 12, marginTop: 4 }}>
												{copy.logSubtitle}
											</div>
										</div>
									</header>
									<div style={{ ...card, overflow: "hidden" }}>
										{data!.sent.length === 0 ? (
											<div
												style={{
													padding: "32px 24px",
													textAlign: "center",
													color: "#8b949e",
													fontSize: 12,
													fontFamily: "var(--mono)",
												}}
											>
												{copy.logEmpty}
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
														{(
															[
																"when",
																"item",
																"score",
																"dest",
																"status",
																"latency",
															] as const
														).map((k) => (
															<th
																key={k}
																style={{
																	textAlign:
																		k === "score" || k === "latency"
																			? "right"
																			: "left",
																	padding: "10px 14px",
																	fontSize: 10,
																	letterSpacing: ".14em",
																	textTransform: "uppercase",
																	fontWeight: 600,
																	fontFamily: "var(--mono)",
																}}
															>
																{copy.logColumns[k]}
															</th>
														))}
													</tr>
												</thead>
												<tbody>
													{data!.sent.map((row) => (
														<tr
															key={row.id}
															style={{
																borderBottom: "1px solid #161e29",
															}}
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
																	fontFamily: "var(--mono)",
																	color: "#c9d1d9",
																}}
															>
																{row.item}
															</td>
															<td
																style={{
																	padding: "11px 14px",
																	textAlign: "right",
																	fontFamily: "var(--mono)",
																	color:
																		row.score >= 80
																			? "#f85149"
																			: row.score >= 60
																				? "#d29922"
																				: "#3fb950",
																}}
															>
																{row.score}
															</td>
															<td
																style={{
																	padding: "11px 14px",
																	color: "#c9d1d9",
																}}
															>
																{row.dest}
															</td>
															<td
																style={{
																	padding: "11px 14px",
																	color: rowColor(row.status),
																	fontFamily: "var(--mono)",
																}}
															>
																{row.status}
															</td>
															<td
																style={{
																	padding: "11px 14px",
																	textAlign: "right",
																	color: "#8b949e",
																	fontFamily: "var(--mono)",
																}}
															>
																{row.latency}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										)}
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
								Account settings
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
