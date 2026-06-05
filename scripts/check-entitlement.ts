#!/usr/bin/env node --import tsx
/**
 * Quick helper to inspect what plan (and paid features) an owner would get.
 * Respects the env overrides (PRO_OWNERS / TEAM_OWNERS / ENTERPRISE_OWNERS) first,
 * then falls back to Polar if configured.
 *
 * Usage (local):
 *   TEAM_OWNERS=Blue-B node --import tsx scripts/check-entitlement.ts Blue-B
 *   PRO_OWNERS=you node --import tsx scripts/check-entitlement.ts you
 */

import {
	planForOwner,
	planObjectForOwner,
	hasPrivateRepos,
	hasManagedLlm,
	hasCampaignDetection,
	hasAlerts,
	hasOrgDashboard,
} from "../lib/billing/entitlement.js";

const owner = process.argv[2] || process.env.CHECK_OWNER || "Blue-B";

(async () => {
	const planId = await planForOwner(owner);
	const plan = await planObjectForOwner(owner);

	console.log(`Owner: ${owner}`);
	console.log(`Plan: ${planId} (${plan.name})`);
	console.log("");
	console.log("Paid feature flags (what the code will actually enforce):");
	console.log(`  privateRepos:       ${await hasPrivateRepos(owner)}`);
	console.log(`  managedLlm (no throttle): ${await hasManagedLlm(owner)}`);
	console.log(`  campaignDetection:  ${await hasCampaignDetection(owner)}`);
	console.log(`  alerts:             ${await hasAlerts(owner)}`);
	console.log(`  orgDashboard:       ${await hasOrgDashboard(owner)}`);
	console.log("");
	console.log("How to force Team for testing (no payment):");
	console.log("  TEAM_OWNERS=Blue-B npm run dev");
	console.log("  or set in Cloudtype env + redeploy.");
})();
