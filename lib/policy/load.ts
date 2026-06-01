import yaml from "js-yaml";
import { LRUCache } from "lru-cache";
import type { Octokit } from "octokit";
import { defaultPolicy, parsePolicy, type Policy } from "./schema.js";

// Cache parsed policy per repo for 5 min to avoid refetching on every event.
const cache = new LRUCache<string, Policy>({
	max: 500,
	ttl: 1000 * 60 * 5,
});

const POLICY_PATHS = [".github/SLOP_POLICY.yml", ".github/SLOP_POLICY.yaml"];

/**
 * Load + validate a repo's policy. Falls back to defaults when:
 *  - no SLOP_POLICY.yml exists,
 *  - YAML is malformed (logged; defaults used so we never crash a webhook).
 */
export async function loadPolicy(
	octokit: Octokit,
	owner: string,
	repo: string,
): Promise<Policy> {
	const key = `${owner}/${repo}`;
	const cached = cache.get(key);
	if (cached) return cached;

	let policy = defaultPolicy();

	for (const path of POLICY_PATHS) {
		try {
			const res = await octokit.rest.repos.getContent({ owner, repo, path });
			const data = res.data;
			if (!Array.isArray(data) && data.type === "file" && data.content) {
				const text = Buffer.from(data.content, "base64").toString("utf8");
				const raw = yaml.load(text);
				policy = parsePolicy(raw);
				break;
			}
		} catch (err: unknown) {
			const status = (err as { status?: number })?.status;
			if (status === 404) continue; // try next path / use defaults
			console.error(`[slopguard] policy load error for ${key}:`, err);
			// fall through to defaults
		}
	}

	cache.set(key, policy);
	return policy;
}

/** Invalidate cache (e.g. on push to default branch — future use). */
export function invalidatePolicy(owner: string, repo: string): void {
	cache.delete(`${owner}/${repo}`);
}
