"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	ConsoleHero,
	ConsoleSectionHead,
	ConsoleShell,
	ConsoleStatus,
} from "./ConsoleShell";
import type { SidebarItem } from "./ConsoleSidebar";
import { toneColor } from "./console-styles";

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
	kicker: string;
	workspace: string;
	connected: string;
	nav: SidebarItem[];
	loading: string;
	empty: string;
	installCta: string;
	installHref: string;
	heroEyebrow: string;
	heroTitle: string;
	heroBody: string;
	policyFileTitle: string;
	policyFileBody: string;
	docsHref: string;
	labels: {
		installed: string;
		applied: string;
		quarantined: string;
		cleared: string;
		docs: string;
		coverage: string;
		gap: string;
	};
};

export default function PolicyFullView({ copy }: { copy: PolicyFullViewCopy }) {
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
	const quarantined = live?.quarantined ?? 0;
	const cleared = live?.cleared ?? 0;
	const l = copy.labels;

	return (
		<ConsoleShell kicker={copy.kicker} workspace={copy.workspace} nav={copy.nav}>
			<ConsoleHero
				eyebrow={copy.heroEyebrow}
				title={copy.heroTitle}
				body={copy.heroBody}
				image="/console-governance.png"
				imageAlt="Policy coverage vault"
				plateLabel="policy coverage"
				connected={copy.connected}
				metrics={[
					{ label: l.installed, value: live ? total : "-" },
					{ label: l.applied, value: live ? `${pct}%` : "-", tone: "ok" },
					{ label: l.quarantined, value: live ? quarantined : "-", tone: "danger" },
					{ label: l.cleared, value: live ? cleared : "-", tone: "ok" },
				]}
			/>

			{isLoading && <ConsoleStatus>{copy.loading}</ConsoleStatus>}
			{error && <ConsoleStatus danger>{error}</ConsoleStatus>}
			{notInstalled && (
				<div className="plate console-empty">
					<p>{copy.empty}</p>
					<Link href={copy.installHref} className="btn btn-primary btn-sm">
						{copy.installCta}
					</Link>
				</div>
			)}

			{live && (
				<section className="console-section console-grid">
					<div className="plate console-panel">
						<ConsoleSectionHead
							title={copy.policyFileTitle}
							sub={copy.policyFileBody}
							href={copy.docsHref}
							cta={l.docs}
						/>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "auto minmax(0,1fr)",
								gap: 18,
								alignItems: "center",
								padding: "22px 0 6px",
								borderTop: "1px solid var(--border-muted)",
							}}
						>
							<b
								style={{
									fontFamily: "var(--mono)",
									fontSize: "clamp(56px, 8vw, 92px)",
									lineHeight: 1,
									letterSpacing: "-0.05em",
									color: toneColor.ok,
								}}
							>
								{pct}%
							</b>
							<span style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>
								{covered}/{total} {l.coverage}
							</span>
						</div>
						{covered < total && (
							<div className="console-empty-line" style={{ color: toneColor.warn }}>
								{total - covered} · {l.gap}
							</div>
						)}
					</div>
					<aside className="console-side-stack">
						{[
							{ label: l.installed, value: total, tone: "neutral" as const },
							{ label: l.quarantined, value: quarantined, tone: "danger" as const },
							{ label: l.cleared, value: cleared, tone: "ok" as const },
						].map((m) => (
							<div className="plate console-metric" key={m.label}>
								<span>{m.label}</span>
								<b style={{ color: toneColor[m.tone] }}>{m.value}</b>
							</div>
						))}
					</aside>
				</section>
			)}
		</ConsoleShell>
	);
}
