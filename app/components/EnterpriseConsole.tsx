"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
	ConsoleHero,
	ConsoleSectionHead,
	ConsoleShell,
	ConsoleStatus,
} from "./ConsoleShell";
import type { SidebarItem } from "./ConsoleSidebar";

type SsoState = { provider: string; status: "active" | "pending" | "unconfigured"; lastSync: string };
type AuditEntry = {
	id: string;
	owner: string;
	when: string;
	actor: string;
	action: string;
	target: string;
	source: "SSO" | "API" | "Admin";
};
type Integration = { name: string; status: "connected" | "pending" | "available"; scope: string };

type StateResponse = {
	owner: string;
	sso: SsoState;
	audit: AuditEntry[];
	integrations: Integration[];
};

function formatLastSync(iso: string): string {
	const ms = Date.now() - new Date(iso).getTime();
	const m = Math.floor(ms / 60000);
	if (m < 1) return "now";
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	return new Date(iso).toISOString().slice(0, 10);
}

export type EnterpriseConsoleCopy = {
	kicker: string;
	workspace: string;
	connected: string;
	nav: SidebarItem[];
	loading: string;
	heroEyebrow: string;
	heroTitle: string;
	heroBody: string;
	heroCta: string;
	heroCtaHref: string;
	metricLabels: { audit: string; integrations: string; ssoProvider: string; ssoStatus: string };
	ssoTitle: string;
	ssoSubtitle: string;
	ssoLabels: { provider: string; status: string; lastSync: string };
	supportTitle: string;
	supportSubtitle: string;
	supportSla: string;
	supportHours: string;
	supportAccountMgr: string;
	auditTitle: string;
	auditSubtitle: string;
	auditViewAll: string;
	auditViewAllHref: string;
	integrationsTitle: string;
	integrationsSubtitle: string;
	integrationsViewAll: string;
	integrationsViewAllHref: string;
};

export default function EnterpriseConsole({ copy }: { copy: EnterpriseConsoleCopy }) {
	const [data, setData] = useState<StateResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/enterprise/state", { cache: "no-store" });
				if (!res.ok) {
					setError(`HTTP ${res.status}`);
					return;
				}
				setData((await res.json()) as StateResponse);
			} catch (e) {
				setError(e instanceof Error ? e.message : "load failed");
			}
		})();
	}, []);

	const isLoading = data === null && error === null;
	const ml = copy.metricLabels;

	const metrics = useMemo(() => {
		if (!data) {
			return [
				{ label: ml.audit, value: "-" as string | number, tone: "neutral" as const },
				{ label: ml.integrations, value: "-" as string | number, tone: "neutral" as const },
				{ label: ml.ssoProvider, value: "-" as string | number, tone: "neutral" as const },
				{ label: ml.ssoStatus, value: "-" as string | number, tone: "neutral" as const },
			];
		}
		return [
			{ label: ml.audit, value: data.audit.length, tone: "ok" as const },
			{ label: ml.integrations, value: data.integrations.length, tone: "ok" as const },
			{ label: ml.ssoProvider, value: data.sso.provider, tone: "ok" as const },
			{
				label: ml.ssoStatus,
				value: data.sso.status,
				tone: data.sso.status === "active" ? ("ok" as const) : ("warn" as const),
			},
		];
	}, [data, ml]);

	return (
		<ConsoleShell kicker={copy.kicker} workspace={copy.workspace} nav={copy.nav}>
			<ConsoleHero
				eyebrow={copy.heroEyebrow}
				title={copy.heroTitle}
				body={copy.heroBody}
				image="/console-governance.png"
				imageAlt="Enterprise governance"
				plateLabel="compliance / audit / sso"
				connected={copy.connected}
				actions={
					<Link href={copy.heroCtaHref} className="btn btn-primary btn-lg">
						{copy.heroCta}
					</Link>
				}
				metrics={metrics}
			/>

			{isLoading && <ConsoleStatus>{copy.loading}</ConsoleStatus>}
			{error && !isLoading && <ConsoleStatus danger>{error}</ConsoleStatus>}

			{!isLoading && !error && (
				<>
					<section className="console-section console-grid">
						<div className="plate console-panel">
							<ConsoleSectionHead title={copy.ssoTitle} sub={copy.ssoSubtitle} />
							<div style={{ display: "grid", gap: 10, borderTop: "1px solid var(--border-muted)", paddingTop: 14 }}>
								{[
									{ k: copy.ssoLabels.provider, v: data?.sso.provider ?? "-", c: "var(--fg)" },
									{ k: copy.ssoLabels.status, v: data?.sso.status ?? "-", c: "var(--green)" },
									{ k: copy.ssoLabels.lastSync, v: data ? formatLastSync(data.sso.lastSync) : "-", c: "var(--fg)" },
								].map((row) => (
									<div key={row.k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "var(--mono)" }}>
										<span style={{ color: "var(--muted)" }}>{row.k}</span>
										<span style={{ color: row.c, fontWeight: 600 }}>{row.v}</span>
									</div>
								))}
							</div>
						</div>

						<div className="plate console-panel">
							<ConsoleSectionHead title={copy.supportTitle} sub={copy.supportSubtitle} />
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderTop: "1px solid var(--border-muted)", paddingTop: 14 }}>
								{[
									{ label: copy.supportSla, value: "1h P1" },
									{ label: copy.supportHours, value: "24 / 7" },
									{ label: copy.supportAccountMgr, value: "assigned" },
								].map((row, i) => (
									<div key={row.label} style={{ padding: "0 12px", borderRight: i < 2 ? "1px solid var(--border-muted)" : "none" }}>
										<div style={{ color: "var(--muted)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", fontFamily: "var(--mono)" }}>{row.label}</div>
										<div style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--mono)", color: "var(--fg)", marginTop: 4 }}>{row.value}</div>
									</div>
								))}
							</div>
						</div>
					</section>

					<section className="console-section" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
						<Link href={copy.auditViewAllHref} className="plate console-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", color: "var(--fg)" }}>
							<div>
								<div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{copy.auditTitle}</div>
								<div style={{ fontSize: 12, color: "var(--muted)" }}>{copy.auditSubtitle}</div>
							</div>
							<span style={{ color: "var(--green)", fontFamily: "var(--mono)", fontSize: 12 }}>{copy.auditViewAll} →</span>
						</Link>
						<Link href={copy.integrationsViewAllHref} className="plate console-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", color: "var(--fg)" }}>
							<div>
								<div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{copy.integrationsTitle}</div>
								<div style={{ fontSize: 12, color: "var(--muted)" }}>{copy.integrationsSubtitle}</div>
							</div>
							<span style={{ color: "var(--green)", fontFamily: "var(--mono)", fontSize: 12 }}>{copy.integrationsViewAll} →</span>
						</Link>
					</section>
				</>
			)}
		</ConsoleShell>
	);
}
