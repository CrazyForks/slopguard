import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { planForOwner } from "../lib/billing/entitlement.js";
import {
	getEntitlementMap,
	invalidateEntitlements,
	normalizeGitHubOwner,
} from "../lib/billing/polar.js";

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

afterEach(() => {
	globalThis.fetch = originalFetch;
	process.env = { ...originalEnv };
	invalidateEntitlements();
});

test("normalizes GitHub owner values from checkout custom fields", () => {
	assert.equal(normalizeGitHubOwner(" @Blue-B "), "blue-b");
	assert.equal(
		normalizeGitHubOwner("https://github.com/Blue-B/slopguard"),
		"blue-b",
	);
	assert.equal(
		normalizeGitHubOwner("github.com/acme-inc?tab=repositories"),
		"acme-inc",
	);
	assert.equal(normalizeGitHubOwner("not_valid"), "");
});

test("maps active Polar subscriptions to highest owner plan", async () => {
	process.env.POLAR_API_TOKEN = "test-token";
	process.env.POLAR_PRODUCT_TEAM_IDS = "team-product-id";
	delete process.env.POLAR_ORG_ID;
	invalidateEntitlements();

	globalThis.fetch = (async () =>
		new Response(
			JSON.stringify({
				items: [
					{
						status: "active",
						product: { id: "pro-product-id", name: "SlopGuard Pro" },
						custom_field_data: { "github-login": "@Acme" },
					},
					{
						status: "trialing",
						product: { id: "team-product-id", name: "Renamed paid tier" },
						custom_field_data: {
							github_login: "https://github.com/Acme/slopguard",
						},
					},
					{
						status: "canceled",
						product: { name: "SlopGuard Team" },
						custom_field_data: { github: "ignored-org" },
					},
				],
				pagination: { max_page: 1 },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		)) as typeof fetch;

	const map = await getEntitlementMap();
	assert.equal(map.get("acme"), "team");
	assert.equal(map.has("ignored-org"), false);
	assert.equal(await planForOwner("Acme"), "team");
});
