"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
	const t = new Date(iso).getTime();
	if (!t || t <= 0 || Number.isNaN(t)) return "—";
	const ms = Date.now() - t;
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
	auditEmpty: string;
	integrationsEmpty: string;
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
				workspace={copy.workspace}
				eyebrow={copy.heroEyebrow}
				title={copy.heroTitle}
				body={copy.heroBody}
				image="/console-governance.png"
				imageAlt="Enterprise governance"
				plateLabel="compliance / audit / sso"
				connected={copy.connected}
				metrics={metrics}
			/>

			{isLoading && <ConsoleStatus>{copy.loading}</ConsoleStatus>}
			{error && !isLoading && <ConsoleStatus danger>{error}</ConsoleStatus>}

			{!isLoading && !error && (
				<section className="console-section">
					<div className="plate console-overview">
						<div className="console-overview-main">
							<ConsoleSectionHead title={copy.ssoTitle} sub={copy.ssoSubtitle} />
							<div className="console-kv">
								{[
									{ k: copy.ssoLabels.provider, v: data?.sso.provider ?? "-", c: "var(--fg)" },
									{ k: copy.ssoLabels.status, v: data?.sso.status ?? "-", c: "var(--green)" },
									{ k: copy.ssoLabels.lastSync, v: data ? formatLastSync(data.sso.lastSync) : "-", c: "var(--fg)" },
								].map((row) => (
									<div key={row.k} className="console-kv-row">
										<span>{row.k}</span>
										<b style={{ color: row.c }}>{row.v}</b>
									</div>
								))}
							</div>
						</div>
						<aside className="console-overview-rail">
							<div className="console-rail-block">
								<header className="console-block-head">
									<h3>{copy.auditTitle}</h3>
									<Link href={copy.auditViewAllHref} className="console-block-link">
										{copy.auditViewAll} <span aria-hidden="true">→</span>
									</Link>
								</header>
								{!data || data.audit.length === 0 ? (
									<div className="console-empty-line">{copy.auditEmpty}</div>
								) : (
									data.audit.slice(0, 4).map((a) => (
										<div key={a.id} className="console-rail-row">
											<span>{a.action}</span>
											<em style={{ color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 11 }}>
												{a.when.slice(0, 10)}
											</em>
										</div>
									))
								)}
							</div>

							<div className="console-rail-block">
								<header className="console-block-head">
									<h3>{copy.integrationsTitle}</h3>
									<Link href={copy.integrationsViewAllHref} className="console-block-link">
										{copy.integrationsViewAll} <span aria-hidden="true">→</span>
									</Link>
								</header>
								{!data || data.integrations.length === 0 ? (
									<div className="console-empty-line">{copy.integrationsEmpty}</div>
								) : (
									data.integrations.map((it) => (
										<div key={it.name} className="console-rail-row">
											<span>{it.name}</span>
											<b style={{ color: it.status === "connected" ? "var(--green)" : "var(--muted)" }}>
												{it.status}
											</b>
										</div>
									))
								)}
							</div>
						</aside>
					</div>
				</section>
			)}
		</ConsoleShell>
	);
}
