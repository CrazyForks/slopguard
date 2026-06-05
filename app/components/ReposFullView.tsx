"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ConsoleSidebar, { type SidebarItem } from "./ConsoleSidebar";

type DashboardResponse =
	| {
			installed: true;
			owner: string;
			repoCount: number;
			repos: Array<{ repo: string; quarantined: number; cleared: number }>;
	  }
	| { installed: false; owner: string; reason: string };

export type ReposFullViewCopy = {
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
	columns: { repo: string; quarantined: string; cleared: string };
};

export default function ReposFullView({ copy }: { copy: ReposFullViewCopy }) {
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

					{live && live.repos.length === 0 && (
						<div
							style={{
								padding: "48px 0",
								textAlign: "center",
								color: "#8b949e",
								fontFamily: "var(--mono)",
								fontSize: 12,
							}}
						>
							{copy.empty}
						</div>
					)}

					{live && live.repos.length > 0 && (
						<table
							style={{
								width: "100%",
								borderCollapse: "collapse",
								fontSize: 13,
							}}
						>
							<thead>
								<tr style={{ color: "#7d8590" }}>
									{(["repo", "quarantined", "cleared"] as const).map((k) => (
										<th
											key={k}
											style={{
												textAlign:
													k === "repo" ? "left" : "right",
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
									))}
								</tr>
							</thead>
							<tbody>
								{live.repos.map((row) => (
									<tr key={row.repo} style={{ borderBottom: "1px solid #161e29" }}>
										<td
											style={{
												padding: "14px 4px",
												fontFamily: "var(--mono)",
												color: "#c9d1d9",
											}}
										>
											{row.repo}
										</td>
										<td
											style={{
												padding: "14px 4px",
												textAlign: "right",
												fontFamily: "var(--mono)",
												color: row.quarantined > 0 ? "#f85149" : "#8b949e",
											}}
										>
											{row.quarantined}
										</td>
										<td
											style={{
												padding: "14px 4px",
												textAlign: "right",
												fontFamily: "var(--mono)",
												color: row.cleared > 0 ? "#3fb950" : "#8b949e",
											}}
										>
											{row.cleared}
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
