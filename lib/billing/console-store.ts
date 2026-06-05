import { LRUCache } from "lru-cache";

// Per-user state for paid feature consoles (channels, routing rules, audit
// log). In-memory only — the live production app uses GitHub as the source of
// truth for slop data, and these console-level settings are an MVP until we
// wire them to a real DB. Bounded; restarts clear entries (documented
// behavior for the free/team demo).

export type ChannelKind = "slack" | "discord" | "webhook";
export interface Channel {
	id: string;
	kind: ChannelKind;
	label: string;
	target: string;
	status: "active" | "paused" | "failed";
	lastSent?: string;
	lastLatencyMs?: number;
}

export interface RoutingRule {
	id: string;
	repo: string;
	pattern: string;
	channelId: string;
	threshold: number;
}

export interface SentAlert {
	id: string;
	owner: string;
	when: string;
	item: string;
	score: number;
	dest: string;
	channelId: string;
	channelKind: ChannelKind;
	status: "delivered" | "failed" | "queued" | "retrying";
	latency: string;
	latencyMs: number;
}

export interface AuditEntry {
	id: string;
	owner: string;
	when: string;
	actor: string;
	action: string;
	target: string;
	source: "SSO" | "API" | "Admin";
}

export interface Integration {
	name: string;
	status: "connected" | "pending" | "available";
	scope: string;
}

export interface OwnerConsoleState {
	owner: string;
	channels: Channel[];
	rules: RoutingRule[];
	sentAlerts: SentAlert[];
	audit: AuditEntry[];
	integrations: Integration[];
}

const store = new LRUCache<string, OwnerConsoleState>({
	max: 5000,
	ttl: 1000 * 60 * 60 * 24 * 7,
});

function emptyState(owner: string): OwnerConsoleState {
	// Real production data only. The owner must explicitly add channels,
	// rules, integrations, and the audit log records the actions they take.
	// The previous seed data made the consoles look "populated" without
	// representing anything the user actually did, which the product team
	// flagged as marketing-dummy behavior in 2026-06.
	return {
		owner: owner.toLowerCase(),
		channels: [],
		rules: [],
		sentAlerts: [],
		audit: [],
		integrations: [],
	};
}

export function getState(owner: string): OwnerConsoleState {
	const key = owner.toLowerCase();
	let s = store.get(key);
	if (!s) {
		s = emptyState(owner);
		store.set(key, s);
	}
	return s;
}

export function mutateState(
	owner: string,
	fn: (s: OwnerConsoleState) => void,
): OwnerConsoleState {
	const s = getState(owner);
	fn(s);
	store.set(s.owner, s);
	return s;
}

