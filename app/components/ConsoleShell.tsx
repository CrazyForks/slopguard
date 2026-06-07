"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { SidebarItem } from "./ConsoleSidebar";
import { toneColor } from "./console-styles";

/**
 * One shared chrome for every paid console (Org / Campaigns / Alerts /
 * Enterprise). Glass top nav + grid background + page-width frame. This is the
 * single source of truth for paid-surface navigation so every plan-gated page
 * reads as the same product.
 */
export function ConsoleShell({
	kicker,
	workspace,
	nav,
	children,
}: {
	kicker: string;
	workspace: string;
	nav: SidebarItem[];
	children: React.ReactNode;
}) {
	const pathname = usePathname() ?? "";
	const activeBase = nav.reduce<string | null>((best, item) => {
		const base = item.href.split("#")[0];
		if (!base || base === "/") return best;
		const match = pathname === base || pathname.startsWith(`${base}/`);
		if (!match) return best;
		return !best || base.length > best.length ? base : best;
	}, null);

	return (
		<main className="console-experience">
			<div className="grid-bg" aria-hidden="true" />
			<div className="wide console-wide">
				<nav className="console-nav" aria-label="Console sections">
					<div className="console-nav-brand">
						<span className="console-nav-kicker mono">{kicker}</span>
						<strong>{workspace}</strong>
					</div>
					<div className="console-nav-links">
						{nav.map((item) => {
							const base = item.href.split("#")[0];
							const active = activeBase === base;
							return (
								<Link
									key={item.label}
									href={item.href}
									className={active ? "active" : ""}
								>
									{item.label}
									{item.external ? <span aria-hidden="true">↗</span> : null}
								</Link>
							);
						})}
					</div>
				</nav>
				{children}
			</div>
		</main>
	);
}

export type ConsoleMetric = {
	label: string;
	value: string | number;
	tone?: keyof typeof toneColor;
};

/**
 * Shared hero: editorial copy + metric spec on the left, a generated console
 * plate on the right. Used by every paid page so the entry rhythm is identical.
 */
export function ConsoleHero({
	eyebrow,
	title,
	body,
	metrics,
	image,
	imageAlt,
	plateLabel,
	connected,
	actions,
}: {
	eyebrow: string;
	title: string;
	body: string;
	metrics?: ConsoleMetric[];
	image: string;
	imageAlt: string;
	plateLabel: string;
	connected: string;
	actions?: React.ReactNode;
}) {
	return (
		<header className="console-hero">
			<div className="console-hero-copy">
				<div className="eyebrow mono">{eyebrow}</div>
				<h1>{title}</h1>
				<p>{body}</p>
				{actions ? <div className="console-hero-actions">{actions}</div> : null}
				{metrics && metrics.length > 0 ? (
					<ul className="hero-spec console-spec">
						{metrics.map((m) => (
							<li key={m.label}>
								<span>{m.label}</span>
								<b style={m.tone ? { color: toneColor[m.tone] } : undefined}>
									{m.value}
								</b>
							</li>
						))}
					</ul>
				) : null}
			</div>
			<figure className="plate console-hero-plate">
				<figcaption className="plate-bar">
					<span>{plateLabel}</span>
					<span className="plate-coord">{connected}</span>
				</figcaption>
				<div className="plate-art">
					<Image src={image} alt={imageAlt} width={1568} height={882} priority />
					<span className="plate-scan" aria-hidden="true" />
				</div>
			</figure>
		</header>
	);
}

export function ConsoleSectionHead({
	title,
	sub,
	href,
	cta,
}: {
	title: string;
	sub?: string;
	href?: string;
	cta?: string;
}) {
	return (
		<header className="console-section-head">
			<div>
				<h2>{title}</h2>
				{sub ? <p>{sub}</p> : null}
			</div>
			{href && cta ? (
				<Link href={href} prefetch={false}>
					{cta} <span aria-hidden="true">→</span>
				</Link>
			) : null}
		</header>
	);
}

export function ConsoleStatus({
	children,
	danger = false,
}: {
	children: React.ReactNode;
	danger?: boolean;
}) {
	return (
		<div className={danger ? "console-status danger mono" : "console-status mono"}>
			{children}
		</div>
	);
}
