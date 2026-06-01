import { LRUCache } from "lru-cache";
import { getApp, type InstallationClient } from "./app.js";

// Short cache so dashboard refreshes don't burn the repo's REST rate limit.
const statsCache = new LRUCache<string, RepoSlopStats>({
	max: 500,
	ttl: 1000 * 30,
});

export interface SlopHistoryItem {
	number: number;
	title: string;
	url: string;
	kind: "pull_request" | "issue";
	state: string;
	author: string;
	labels: string[];
	createdAt: string;
	updatedAt: string;
}

export interface RepoSlopStats {
	repo: string;
	quarantined: number;
	cleared: number;
	open: number;
	closed: number;
	items: SlopHistoryItem[];
}

/** Resolve an installation-scoped client for a specific repo (GitHub-as-storage). */
export async function getRepoInstallationClient(
	owner: string,
	repo: string,
): Promise<InstallationClient> {
	const app = getApp();
	const { data } = await app.octokit.request(
		"GET /repos/{owner}/{repo}/installation",
		{ owner, repo },
	);
	return (await app.getInstallationOctokit(data.id)) as InstallationClient;
}

/**
 * Read slop history straight from GitHub (no DB): issues/PRs carrying the
 * quarantine or cleared labels. MVP storage = the repo itself.
 */
export async function getRepoSlopStats(
	owner: string,
	repo: string,
	quarantineLabel = process.env.DEFAULT_QUARANTINE_LABEL ?? "slop-quarantine",
	clearedLabel = "slop-cleared",
): Promise<RepoSlopStats> {
	const cacheKey = `${owner}/${repo}`;
	const cached = statsCache.get(cacheKey);
	if (cached) return cached;

	const octokit = await getRepoInstallationClient(owner, repo);

	const collected = new Map<number, SlopHistoryItem>();
	for (const label of [quarantineLabel, clearedLabel]) {
		const res = await octokit.rest.issues.listForRepo({
			owner,
			repo,
			labels: label,
			state: "all",
			per_page: 100,
			sort: "updated",
			direction: "desc",
		});
		for (const it of res.data) {
			collected.set(it.number, {
				number: it.number,
				title: it.title,
				url: it.html_url,
				kind: it.pull_request ? "pull_request" : "issue",
				state: it.state,
				author: it.user?.login ?? "unknown",
				labels: it.labels.map((l) =>
					typeof l === "string" ? l : (l.name ?? ""),
				),
				createdAt: it.created_at,
				updatedAt: it.updated_at,
			});
		}
	}

	const items = Array.from(collected.values()).sort(
		(a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt),
	);

	const stats: RepoSlopStats = {
		repo: `${owner}/${repo}`,
		quarantined: items.filter((i) => i.labels.includes(quarantineLabel)).length,
		cleared: items.filter((i) => i.labels.includes(clearedLabel)).length,
		open: items.filter((i) => i.state === "open").length,
		closed: items.filter((i) => i.state === "closed").length,
		items,
	};
	statsCache.set(cacheKey, stats);
	return stats;
}
