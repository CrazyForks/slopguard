import MarketingNav from "@/app/components/MarketingNav";
import EnterpriseConsole, {
	type EnterpriseConsoleCopy,
} from "@/app/components/EnterpriseConsole";
import PlanGate from "@/app/components/PlanGate";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
	title: "SlopGuard: Enterprise — SSO, Audit, Compliance",
	description:
		"Enterprise plan console: SAML SSO, audit log, integrations, and support.",
};

const copy: EnterpriseConsoleCopy = {
	workspace: "SlopGuard",
	workspaceSub: "Enterprise workspace",
	user: "blue-b",
	entitlement: "Enterprise plan",
	connected: "Connected to GitHub",
	nav: [
		{ label: "Overview", href: "/org" },
		{ label: "Queue", href: "/org#queue" },
		{ label: "Repos", href: "/org#repos" },
		{ label: "Campaigns", href: "/campaigns", external: true },
		{ label: "Alerts", href: "/alerts", external: true },
		{ label: "SSO", href: "/enterprise#sso" },
		{ label: "Audit", href: "/enterprise#audit" },
		{ label: "Integrations", href: "/enterprise#integrations" },
	],
	activeNav: "SSO",
	loading: "Loading…",
	backToOrg: "Back to org",
	contactSales: "Contact sales",
	accountHref: "/account",
	orgHref: "/org",
	alertsHref: "/alerts",
	campaignsHref: "/campaigns",
	heroEyebrow: "ENTERPRISE · COMPLIANCE",
	heroTitle: "Run SlopGuard with the controls your security team expects.",
	heroBody:
		"SAML SSO, full audit trail, custom integrations, and a 24/7 support contract. The audit log records every config change, channel send, and export.",
	heroCta: "Export audit CSV",
	heroCtaHref: "/api/audit/export?format=csv",
	ssoTitle: "SAML SSO",
	ssoSubtitle: "Identity is governed by your IdP, not by SlopGuard.",
	ssoProviderLabel: "Provider",
	ssoStatusLabel: "Status",
	ssoLastSyncLabel: "Last sync",
	auditTitle: "Audit log",
	auditSubtitle: "Every action that affects the org is recorded here. Exportable.",
	auditEmpty: "No audit entries yet — config changes and exports will appear here.",
	auditColumns: {
		when: "When",
		actor: "Actor",
		action: "Action",
		target: "Target",
		source: "Source",
	},
	exportAudit: "Export CSV",
	integrationsTitle: "Integrations",
	integrationsSubtitle: "Forward events to your ticketing, paging, and observability tools",
	connect: "Connect",
	disconnect: "Disconnect",
	supportTitle: "Support",
	supportSubtitle: "Dedicated channel for P1 incidents and security reviews.",
	supportSla: "P1 SLA",
	supportHours: "Hours",
	supportAccountMgr: "Account mgr",
};

export default function EnterprisePage() {
	return (
		<>
			<MarketingNav lang="en" enHref="/enterprise" koHref="/ko/enterprise" />
			<PlanGate lang="en" required="enterprise">
				<EnterpriseConsole copy={copy} />
			</PlanGate>
			<SiteFooter lang="en" />
		</>
	);
}
