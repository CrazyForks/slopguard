"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ConsoleSidebar, { type SidebarItem } from "./ConsoleSidebar";
import {
	shell,
	frame,
	card,
	muted,
	riskColor,
	riskBg,
	toneColor,
} from "./console-styles";

type Cluster = {
	id: string;
	fingerprint: string;
	repoCount: number;
	hits: number;
	authorCount: number;
	firstSeen: string;
	risk: "low" | "medium" | "high";
	repos: string[];
	authors: string[];
	commits: Array<{
		repo: string;
		sha: string;
		title: string;
		author: string;
		when: string;
	}>;
};

type ListResponse =
	| { installed: true; owner: string; repoCount: number; clusters: Cluster[] }
	| { installed: false; owner: string; reason: string };

export type CampaignsConsoleCopy = {
	workspace: string;
	workspaceSub: string;
	user: string;
	entitlement: string;
	connected: string;
	nav: SidebarItem[];
	activeNav?: string;
	loading: string;
	emptyTitle: string;
	emptyBody: string;
	emptyCta: string;
	emptyCtaHref: string;
	investigate: string;
	backToOrg: string;
	orgHref: string;
	accountHref: string;
	heroEyebrow: string;
	heroTitle: string;
	heroBody: string;
	heroCta: string;
	heroCtaHref: string;
	clustersTitle: string;
	clustersSubtitle: string;
	clustersEmpty: string;
	scoreBoostTitle: string;
	scoreBoostBody: string;
};

export default function CampaignsConsole({
	copy,
}: {
	copy: CampaignsConsoleCopy;
}) {
	const [data, setData] = useState<ListResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function load() {
		try {
			const res = await fetch("/api/campaigns", { cache: "no-store" });
			if (!res.ok) {
				setError(`HTTP ${res.status}`);
				return;
			}
			const json = (await res.json()) as ListResponse;
			setData(json);
			setError(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load campaigns");
		}
	}

	useEffect(() => {
		load();
		const t = setInterval(load, 30_000);
		return () => clearInterval(t);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isLoading = data === null && error === null;
	const notInstalled =
		data !== null && "installed" in data && data.installed === false;
	const live = data && data.installed ? data : null;

	const metrics = [
		{
			label: "Active clusters",
			value: live ? String(live.clusters.length) : "—",
			detail: live
				? `${live.clusters.filter((c) => c.risk === "high").length} high-risk`
				: "loading",
			tone:
				live && live.clusters.some((c) => c.risk === "high")
					? ("danger" as const)
					: ("neutral" as const),
		},
		{
			label: "Total hits",
			value: live ? String(live.clusters.reduce((s, c) => s + c.hits, 0)) : "—",
			detail: live ? `${live.repoCount} installed repos` : "loading",
			tone: "ok" as const,
		},
		{
			label: "Authors involved",
			value: live
				? String(new Set(live.clusters.flatMap((c) => c.authors)).size)
				: "—",
			detail: live ? "unique handles" : "loading",
			tone: "neutral" as const,
		},
		{
			label: "Repos monitored",
			value: live ? String(live.repoCount) : "—",
			detail: live ? "in this account" : "loading",
			tone: "ok" as const,
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
									src="/radar-circuit.png"
									alt="Cross-repo campaign radar"
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
										Cross-repo fingerprint detector
									</div>
									<div style={{ marginTop: 4 }}>
										{live
											? `${live.clusters.length} clusters · ${live.repoCount} repos`
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
								Loading live campaign state…
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

						{notInstalled && (
							<div
								style={{
									...card,
									padding: "32px 24px",
									textAlign: "center",
									marginBottom: 24,
								}}
							>
								<h2
									style={{
										margin: "0 0 8px",
										fontSize: 18,
										letterSpacing: "-.02em",
										color: "#f0f6fc",
									}}
								>
									{copy.emptyTitle}
								</h2>
								<p
									style={{
										...muted,
										margin: "0 auto",
										maxWidth: 480,
										lineHeight: 1.55,
										fontSize: 13,
									}}
								>
									{copy.emptyBody}
								</p>
								<p
									style={{
										...muted,
										margin: "12px auto 0",
										maxWidth: 480,
										fontFamily: "var(--mono)",
										fontSize: 11,
									}}
								>
									reason: {data && "reason" in data ? data.reason : ""}
								</p>
								<div style={{ marginTop: 18 }}>
									<Link
										href={copy.emptyCtaHref}
										className="btn btn-primary btn-sm"
									>
										{copy.emptyCta}
									</Link>
								</div>
							</div>
						)}

						{!isLoading && !notInstalled && (
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

								{/* Clusters — id=clusters anchor */}
								<section
									id="clusters"
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
												{copy.clustersTitle}
											</h2>
											<div style={{ ...muted, fontSize: 12, marginTop: 4 }}>
												{copy.clustersSubtitle}
											</div>
										</div>
									</header>
									{live!.clusters.length === 0 ? (
										<div
											style={{
												...card,
												padding: "32px 24px",
												textAlign: "center",
												color: "#8b949e",
												fontSize: 12,
												fontFamily: "var(--mono)",
											}}
										>
											{copy.clustersEmpty}
										</div>
									) : (
										<div style={{ display: "grid", gap: 14 }}>
											{live!.clusters.map((cluster) => {
												const c0 = riskColor[cluster.risk];
												return (
													<div
														key={cluster.id}
														style={{ ...card, padding: "16px 18px" }}
													>
														<div
															style={{
																display: "flex",
																justifyContent: "space-between",
																alignItems: "flex-start",
																gap: 16,
																marginBottom: 14,
															}}
														>
															<div style={{ minWidth: 0, flex: 1 }}>
																<div
																	style={{
																		display: "flex",
																		alignItems: "center",
																		gap: 8,
																		marginBottom: 6,
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
																			background: riskBg[cluster.risk],
																			color: c0,
																		}}
																	>
																		{cluster.risk} risk
																	</span>
																	<span
																		style={{
																			fontSize: 11,
																			color: "#8b949e",
																			fontFamily: "var(--mono)",
																		}}
																	>
																		{cluster.repoCount} repos · {cluster.hits}{" "}
																		hits · first seen {cluster.firstSeen}
																	</span>
																</div>
																<div
																	style={{
																		fontFamily: "var(--mono)",
																		fontSize: 14,
																		color: "#f0f6fc",
																		overflow: "hidden",
																		textOverflow: "ellipsis",
																		whiteSpace: "nowrap",
																	}}
																>
																	{cluster.fingerprint}
																</div>
															</div>
															<Link
																href={`/api/campaigns/${encodeURIComponent(cluster.id)}`}
																target="_blank"
																rel="noreferrer"
																className="btn btn-ghost btn-sm"
															>
																{copy.investigate} →
															</Link>
														</div>
														<div
															style={{
																display: "grid",
																gridTemplateColumns:
																	"repeat(auto-fit, minmax(220px, 1fr))",
																gap: 10,
															}}
														>
															{cluster.repos.map((repo) => {
																const matchingCommits = cluster.commits.filter(
																	(c) => c.repo === repo,
																);
																const commits =
																	matchingCommits.length > 0
																		? matchingCommits.length
																		: Math.max(
																				1,
																				Math.floor(
																					cluster.hits /
																						Math.max(1, cluster.repoCount),
																				),
																			);
																const authors = Array.from(
																	new Set(matchingCommits.map((c) => c.author)),
																);
																return (
																	<div
																		key={repo}
																		style={{
																			border: "1px solid #1c2530",
																			borderRadius: 10,
																			padding: "10px 12px",
																			background: "#0a1018",
																		}}
																	>
																		<div
																			style={{
																				fontFamily: "var(--mono)",
																				fontSize: 12,
																				color: "#c9d1d9",
																			}}
																		>
																			{repo}
																		</div>
																		<div
																			style={{
																				display: "flex",
																				justifyContent: "space-between",
																				marginTop: 4,
																				fontFamily: "var(--mono)",
																				fontSize: 11,
																				color: "#8b949e",
																			}}
																		>
																			<span>
																				{commits} commits
																				{authors.length > 0
																					? ` · ${authors.join(", ")}`
																					: ""}
																			</span>
																		</div>
																	</div>
																);
															})}
														</div>
													</div>
												);
											})}
										</div>
									)}
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
							<Link href={copy.orgHref} className="btn btn-ghost btn-sm">
								{copy.backToOrg}
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
