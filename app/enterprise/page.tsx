import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
	title: "SlopGuard: Enterprise — SSO, Audit, Self-host",
	description:
		"Enterprise features: SAML SSO, audit exports, self-host support, and custom integrations.",
};

export default function EnterprisePage() {
	return (
		<>
			<MarketingNav lang="en" enHref="/enterprise" koHref="/ko/enterprise" />

			<main className="wide" style={{ paddingTop: 32 }}>
				<div className="docs-hero" style={{ marginBottom: 32 }}>
					<div className="grid-bg" aria-hidden="true" />
					<div className="docs-hero-copy">
						<span className="eyebrow">ENTERPRISE</span>
						<h1 className="page-h1">Enterprise Portal</h1>
						<p className="page-sub">
							SAML SSO, audit log export, self-host support contracts, and
							custom integrations. Contact sales to get started.
						</p>
						<div style={{ marginTop: 16, display: "flex", gap: 12 }}>
							<a
								href="https://github.com/Blue-B/slopguard/issues/new?labels=enterprise&title=Enterprise%20inquiry"
								className="btn btn-primary btn-sm"
							>
								Contact sales
							</a>
							<Link href="/pricing" className="btn btn-ghost btn-sm">
								View pricing
							</Link>
						</div>
					</div>
					<figure className="plate docs-hero-plate" style={{ maxWidth: 520 }}>
						<div className="plate-art" style={{ padding: 0 }}>
							<img
								src="/images/slopguard-enterprise.png"
								alt="SlopGuard Enterprise Portal"
								style={{
									width: "100%",
									height: "auto",
									borderRadius: 8,
									display: "block",
								}}
							/>
						</div>
					</figure>
				</div>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
						gap: 16,
					}}
				>
					<div className="card">
						<h3 style={{ marginBottom: 8 }}>SAML / SSO</h3>
						<p className="muted">
							Enterprise-grade single sign-on with your identity provider. Full
							audit of sign-ins included.
						</p>
						<div style={{ marginTop: 12, fontSize: 12, color: "var(--green)" }}>
							Available after sales onboarding
						</div>
					</div>
					<div className="card">
						<h3 style={{ marginBottom: 8 }}>Audit Log Export</h3>
						<p className="muted">
							Export full activity logs (who cleared what, when) in JSON/CSV.
							Retention policies configurable.
						</p>
					</div>
					<div className="card">
						<h3 style={{ marginBottom: 8 }}>Self-host Support</h3>
						<p className="muted">
							Dedicated contract for on-premise deployment, custom builds, SLA
							response times, and ongoing maintenance.
						</p>
					</div>
					<div className="card">
						<h3 style={{ marginBottom: 8 }}>Custom Integrations</h3>
						<p className="muted">
							Webhook, ticketing system, or internal tool integrations tailored
							to your workflow.
						</p>
					</div>
				</div>

				<div style={{ marginTop: 32, textAlign: "center" }}>
					<a
						href="https://github.com/Blue-B/slopguard/issues/new?labels=enterprise&title=Enterprise%20inquiry"
						className="btn btn-primary"
					>
						Start Enterprise inquiry
					</a>
				</div>
			</main>

			<SiteFooter lang="en" />
		</>
	);
}
