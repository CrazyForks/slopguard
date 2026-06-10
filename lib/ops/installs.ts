// Install tracking. GitHub sends `installation.created` / `installation.deleted`
// to every GitHub App webhook; we record them so the owner can see "who
// installed today" at a glance from /api/health (and the watchdog log) instead
// of digging through the App settings page.

import { Redis } from "@upstash/redis";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL?.trim() || "";
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || "";
const LIST_KEY = "ops:installs:events";
const COUNT_KEY = "ops:installs:current";
const MAX_EVENTS = 200;
const TIMEOUT_MS = 3000;

let client: Redis | null = null;
function redis(): Redis | null {
	if (!REDIS_URL || !REDIS_TOKEN) return null;
	if (!client)
		client = new Redis({
			url: REDIS_URL,
			token: REDIS_TOKEN,
			retry: { retries: 1, backoff: () => 150 },
		});
	return client;
}

function guard<T>(op: Promise<T>): Promise<T> {
	let timer: ReturnType<typeof setTimeout>;
	const t = new Promise<T>((_, rej) => {
		timer = setTimeout(() => rej(new Error("redis timeout")), TIMEOUT_MS);
	});
	return Promise.race([op, t]).finally(() => clearTimeout(timer)) as Promise<T>;
}

export type InstallEvent = {
	action: "installed" | "uninstalled";
	account: string;
	repos: number;
	at: string;
};

/** Record an install/uninstall (best-effort, never throws). */
export async function recordInstallEvent(
	action: InstallEvent["action"],
	account: string,
	repos: number,
): Promise<void> {
	const r = redis();
	if (!r) return;
	try {
		const e: InstallEvent = {
			action,
			account,
			repos,
			at: new Date().toISOString(),
		};
		const ops: Promise<unknown>[] = [
			r.lpush(LIST_KEY, JSON.stringify(e)),
			r.ltrim(LIST_KEY, 0, MAX_EVENTS - 1),
		];
		if (action === "installed") ops.push(r.incr(COUNT_KEY));
		else ops.push(r.decr(COUNT_KEY));
		await guard(Promise.all(ops));
	} catch {
		/* best-effort */
	}
}

/** Current install count + the most recent events, for /api/health. */
export async function installsSummary(limit = 8): Promise<{
	current: number;
	recent: InstallEvent[];
}> {
	const r = redis();
	if (!r) return { current: 0, recent: [] };
	try {
		const [count, raw] = await guard(
			Promise.all([r.get<number>(COUNT_KEY), r.lrange(LIST_KEY, 0, limit - 1)]),
		);
		const recent: InstallEvent[] = [];
		for (const item of raw ?? []) {
			try {
				recent.push(
					typeof item === "string" ? JSON.parse(item) : (item as InstallEvent),
				);
			} catch {
				/* skip malformed */
			}
		}
		return { current: Math.max(0, Number(count ?? 0)), recent };
	} catch {
		return { current: 0, recent: [] };
	}
}
