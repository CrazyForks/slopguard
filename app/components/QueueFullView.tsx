"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ConsoleSidebar, { type SidebarItem } from "./ConsoleSidebar";

type RecentItem = {
	number: number;
	title: string;
	url: string;
	kind: "issue" | "pull_request";
	state: "open" | "closed";
	author: string;
	labels: string[];
	createdAt: string;
	updatedAt: string;
};

type DashboardResponse =
	| {
			installed: true;
			owner: string;
			repoCount: number;
			quarantined: number;
			cleared: number;
			open: number;
			closed: number;
			recent: RecentItem[];
			repos: Array<{ repo: string; quarantined: number; cleared: number }>;
			radar: Array<{
				name: string;
				fingerprint: string;
				repos: number;
				risk: "low" | "medium" | "high";
				commits: number;
				authors: number;
				delta: number;
			}>;
	  }
	| { installed: false; owner: string; reason: string };

function deriveStatus(labels: string[]): string {
	if (labels.some((l) => l.toLowerCase().includes("quarantine")))
		return "Quarantined";
	if (labels.some((l) => l.toLowerCase().includes("cleared"))) return "Cleared";
	return "Watching";
}
function deriveScore(labels: string[]): number {
	const l = labels.map((x) => x.toLowerCase()).join(" ");
	if (l.includes("quarantine")) return 78;
	if (l.includes("cleared")) return 24;
	return 46;
}
function formatAge(iso: string): string {
	const ms = Date.now() - new Date(iso).getTime();
	const m = Math.floor(ms / 60000);
	if (m < 1) return "just now";
	if (m < 60) return `${m}m`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h`;
	const d = Math.floor(h / 24);
	return `${d}d`;
}
function extractRepo(url: string): string {
	const m =
		url.match(/repos\/([^/]+)\/([^/]+)\/(?:issues|pulls)\/\d+/) ??
		url.match(/github\.com\/([^/]+)\/([^/]+)\/(?:issues|pull)\/\d+/);
	return m ? `${m[1]}/${m[2]}` : "—";
}

export type QueueFullViewCopy = {
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
	columns: {
		item: string;
		repo: string;
		score: string;
		status: string;
		owner: string;
		age: string;
	};
};

export default function QueueFullView({ copy }: { copy: QueueFullViewCopy }) {
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

	const rows = (live?.recent ?? []).map((it) => ({
		key: `${it.url}#${it.number}`,
		item: it.title,
		repo: extractRepo(it.url),
		score: deriveScore(it.labels),
		status: deriveStatus(it.labels),
		owner: `@${it.author}`,
		age: formatAge(it.updatedAt),
		href: it.url.replace("api.github.com", "github.com").replace(/\/repos\//, "/"),
	}));

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

					{error && !isLoading && (
						<div
							style={{
								padding: "16px 0",
								color: "#f85149",
								fontFamily: "var(--mono)",
								fontSize: 12,
							}}
						>
							{error}
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

					{live && rows.length === 0 && (
						<div
							style={{
								padding: "48px 0",
								textAlign: "center",
								color: "#8b949e",
								fontFamily: "var(--mono)",
								fontSize: 12,
							}}
						>
							No quarantine items yet. New activity shows up here.
						</div>
					)}

					{live && rows.length > 0 && (
						<table
							style={{
								width: "100%",
								borderCollapse: "collapse",
								fontSize: 13,
							}}
						>
							<thead>
								<tr style={{ color: "#7d8590" }}>
									{(["item", "repo", "score", "status", "owner", "age"] as const).map(
										(k) => (
											<th
												key={k}
												style={{
													textAlign: k === "score" ? "right" : "left",
													padding: "12px 4px",
													fontSize: 10,
													letterSpacing: ".14em",
													textTransform: "uppercase",
													fontWeight: 600,
													fontFamily: "var(--mono)",
													borderBottom: "1px solid #1c2530",
												}}
											>
												{copy.columns[k]}
											</th>
										),
									)}
								</tr>
							</thead>
							<tbody>
								{rows.map((row) => (
									<tr key={row.key} style={{ borderBottom: "1px solid #161e29" }}>
										<td
											style={{
												padding: "14px 4px",
												fontFamily: "var(--mono)",
												color: "#c9d1d9",
											}}
										>
											<Link
												href={row.href}
												target="_blank"
												rel="noreferrer"
												style={{
													color: "#c9d1d9",
													textDecoration: "none",
												}}
											>
												{row.item}
											</Link>
										</td>
										<td style={{ padding: "14px 4px", color: "#c9d1d9" }}>
											{row.repo}
										</td>
										<td
											style={{
												padding: "14px 4px",
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
										<td style={{ padding: "14px 4px" }}>
											<span
												style={{
													fontSize: 11,
													padding: "2px 8px",
													borderRadius: 99,
													background:
														row.status === "Quarantined"
															? "rgba(248,81,73,.12)"
															: row.status === "Cleared"
																? "rgba(63,185,80,.12)"
																: "rgba(210,153,34,.12)",
													color:
														row.status === "Quarantined"
															? "#f85149"
															: row.status === "Cleared"
																? "#3fb950"
																: "#d29922",
													fontFamily: "var(--mono)",
												}}
											>
												{row.status}
											</span>
										</td>
										<td
											style={{
												padding: "14px 4px",
												color: "#8b949e",
												fontFamily: "var(--mono)",
											}}
										>
											{row.owner}
										</td>
										<td
											style={{
												padding: "14px 4px",
												color: "#8b949e",
												fontFamily: "var(--mono)",
												textAlign: "right",
											}}
										>
											{row.age}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</section>
			</div>
		</main>
	);
}
