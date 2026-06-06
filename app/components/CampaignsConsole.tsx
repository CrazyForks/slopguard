"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SidebarItem } from "./ConsoleSidebar";
import { riskBg, riskColor, toneColor } from "./console-styles";

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
				if (res.status === 401 || res.status === 403) {
					setData(null);
					setError(null);
					return;
				}
				setError(`HTTP ${res.status}`);
				return;
			}
			setData((await res.json()) as ListResponse);
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
	const detailBase = copy.heroCtaHref.startsWith("/ko/")
		? "/ko/campaigns"
		: "/campaigns";
	const highCount = live?.clusters.filter((c) => c.risk === "high").length ?? 0;
	const totalHits = live?.clusters.reduce((s, c) => s + c.hits, 0) ?? 0;
	const authorCount = live
		? new Set(live.clusters.flatMap((c) => c.authors)).size
		: 0;
	const lead = live?.clusters[0] ?? null;

	const metrics = [
		{
			label: "Active clusters",
			value: live ? String(live.clusters.length) : "-",
			tone: highCount > 0 ? "danger" : "neutral",
		},
		{ label: "Total hits", value: live ? String(totalHits) : "-", tone: "ok" },
		{
			label: "Authors",
			value: live ? String(authorCount) : "-",
			tone: "neutral",
		},
		{ label: "Repos", value: live ? String(live.repoCount) : "-", tone: "ok" },
	] as const;

	return (
		<main className="campaign-experience">
			<div className="grid-bg" aria-hidden="true" />
			<div className="wide campaign-wide">
				<nav className="campaign-topnav" aria-label="Campaign console sections">
					<Link href={copy.orgHref}>{copy.backToOrg}</Link>
					<div className="campaign-nav-center">
						{copy.nav.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className={item.label === copy.activeNav ? "active" : ""}
							>
								{item.label}
								{item.external ? <span>↗</span> : null}
							</Link>
						))}
					</div>
					<Link href={copy.accountHref}>{copy.user}</Link>
				</nav>

				<header className="campaign-hero-redesign">
					<div className="campaign-hero-copy">
						<div className="eyebrow mono">{copy.heroEyebrow}</div>
						<h1>{copy.heroTitle}</h1>
						<p>{copy.heroBody}</p>
						<ul className="hero-spec campaign-spec">
							{metrics.map((m) => (
								<li key={m.label}>
									<span>{m.label}</span>
									<b style={{ color: toneColor[m.tone] }}>{m.value}</b>
								</li>
							))}
						</ul>
					</div>
					<figure className="plate campaign-hero-plate">
						<figcaption className="plate-bar">
							<span>campaign radar</span>
							<span className="plate-coord">{copy.connected}</span>
						</figcaption>
						<div className="plate-art">
							<Image
								src="/org-wave-command.png"
								alt="Campaign spread radar"
								width={1568}
								height={882}
								priority
							/>
							<span className="plate-scan" aria-hidden="true" />
						</div>
					</figure>
				</header>

				{isLoading && <StatusLine>{copy.loading}</StatusLine>}
				{error && !isLoading && (
					<StatusLine danger>Failed to load: {error}</StatusLine>
				)}
				{notInstalled && (
					<section className="plate campaign-empty">
						<h2>{copy.emptyTitle}</h2>
						<p>{copy.emptyBody}</p>
						<Link href={copy.emptyCtaHref} className="btn btn-primary btn-sm">
							{copy.emptyCta}
						</Link>
					</section>
				)}

				{live && (
					<section className="campaign-workspace section">
						<div className="campaign-lead">
							<SectionTitle
								title={copy.clustersTitle}
								sub={copy.clustersSubtitle}
							/>
							{lead ? (
								<article className="campaign-priority plate">
									<div className="campaign-priority-head">
										<span
											style={{
												color: riskColor[lead.risk],
												background: riskBg[lead.risk],
											}}
										>
											{lead.risk}
										</span>
										<em>first seen {lead.firstSeen}</em>
									</div>
									<h2>{lead.fingerprint}</h2>
									<p>
										{lead.hits} repeated hits across {lead.repoCount} repos with{" "}
										{lead.authorCount} authors involved.
									</p>
									<Link
										href={`${detailBase}/${lead.id}`}
										className="btn btn-primary btn-sm"
										prefetch={false}
									>
										{copy.investigate}
									</Link>
								</article>
							) : (
								<EmptyLine>{copy.clustersEmpty}</EmptyLine>
							)}
						</div>

						<div className="campaign-stream">
							<div className="campaign-stream-head mono">
								<span>fingerprint</span>
								<span>scope</span>
								<span>risk</span>
								<span />
							</div>
							{live.clusters.length === 0 ? (
								<EmptyLine>{copy.clustersEmpty}</EmptyLine>
							) : (
								live.clusters.map((cluster) => (
									<div className="campaign-row" key={cluster.id}>
										<div>
											<b>{cluster.fingerprint}</b>
											<small>{cluster.firstSeen}</small>
										</div>
										<span>
											{cluster.hits} hits / {cluster.repoCount} repos
										</span>
										<em
											style={{
												color: riskColor[cluster.risk],
												background: riskBg[cluster.risk],
											}}
										>
											{cluster.risk}
										</em>
										<Link href={`${detailBase}/${cluster.id}`} prefetch={false}>
											{copy.investigate}
											<span>→</span>
										</Link>
									</div>
								))
							)}
						</div>
					</section>
				)}
			</div>
		</main>
	);
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
	return (
		<header className="campaign-section-title">
			<h2>{title}</h2>
			<p>{sub}</p>
		</header>
	);
}

function StatusLine({
	children,
	danger = false,
}: {
	children: React.ReactNode;
	danger?: boolean;
}) {
	return (
		<div
			className={
				danger ? "campaign-status danger mono" : "campaign-status mono"
			}
		>
			{children}
		</div>
	);
}

function EmptyLine({ children }: { children: React.ReactNode }) {
	return <div className="campaign-empty-line mono">{children}</div>;
}
