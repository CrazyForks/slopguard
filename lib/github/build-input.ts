import type { SlopInput } from "../agent/types.js";
import type { InstallationClient } from "./app.js";

interface RepoLike {
	name: string;
	owner: { login: string };
}

interface PRLike {
	number: number;
	title: string;
	body: string | null;
	user: { login: string } | null;
	additions?: number;
	deletions?: number;
	changed_files?: number;
	created_at: string;
}

interface IssueLike {
	number: number;
	title: string;
	body: string | null;
	user: { login: string } | null;
	created_at: string;
}

/** Build a normalized SlopInput from a pull_request webhook payload. */
export async function buildPullRequestInput(
	octokit: InstallationClient,
	repository: RepoLike,
	pr: PRLike,
): Promise<SlopInput> {
	const owner = repository.owner.login;
	const repo = repository.name;

	// Unified diff (text). Cast: typed client returns PR object type for this route.
	let diff = "";
	try {
		const resp = await octokit.request(
			"GET /repos/{owner}/{repo}/pulls/{pull_number}",
			{
				owner,
				repo,
				pull_number: pr.number,
				mediaType: { format: "diff" },
			},
		);
		diff = resp.data as unknown as string;
	} catch (err) {
		console.error("[slopguard] diff fetch failed:", err);
	}

	// Changed file paths (first 100).
	let changedFiles: string[] = [];
	try {
		const files = await octokit.rest.pulls.listFiles({
			owner,
			repo,
			pull_number: pr.number,
			per_page: 100,
		});
		changedFiles = files.data.map((f) => f.filename);
	} catch (err) {
		console.error("[slopguard] listFiles failed:", err);
	}

	return {
		kind: "pull_request",
		repo: `${owner}/${repo}`,
		number: pr.number,
		title: pr.title ?? "",
		body: pr.body ?? "",
		diff,
		author: pr.user?.login ?? "unknown",
		changedFiles,
		additions: pr.additions ?? 0,
		deletions: pr.deletions ?? 0,
		createdAt: pr.created_at,
	};
}

/** Build a normalized SlopInput from an issues webhook payload. */
export function buildIssueInput(
	repository: RepoLike,
	issue: IssueLike,
): SlopInput {
	const owner = repository.owner.login;
	const repo = repository.name;
	return {
		kind: "issue",
		repo: `${owner}/${repo}`,
		number: issue.number,
		title: issue.title ?? "",
		body: issue.body ?? "",
		diff: "",
		author: issue.user?.login ?? "unknown",
		changedFiles: [],
		additions: 0,
		deletions: 0,
		createdAt: issue.created_at,
	};
}
