import { createHash } from "node:crypto";
import type { Provenance, SlopInput } from "../types.js";

// Generator fingerprints we can detect from text/markers.
const MODEL_HINTS: Array<{ id: string; re: RegExp }> = [
	{ id: "chatgpt", re: /\b(chatgpt|gpt-4|gpt-3\.5|openai)\b/i },
	{ id: "claude", re: /\bclaude\b/i },
	{ id: "copilot", re: /\b(github )?copilot\b/i },
	{ id: "gemini", re: /\b(gemini|bard)\b/i },
	{ id: "grok", re: /\bgrok\b/i },
	{ id: "cursor", re: /\bcursor( ai)?\b/i },
	{ id: "devin", re: /\bdevin\b/i },
	// Co-authored-by trailers that AI tools inject
	{ id: "copilot", re: /co-authored-by:.*copilot/i },
	{ id: "cursor", re: /generated (with|by) cursor/i },
];

const LEAKED_PHRASES = [
	/as an ai language model/i,
	/i hope this helps/i,
	/here'?s? (an?|the) (updated|revised|improved) (version|implementation)/i,
	/feel free to (modify|customize|reach out)/i,
	/let me know if you (need|'d like)/i,
	/certainly!/i,
];

/**
 * Provenance is informational (never punitive). It records:
 *  - which generators (if any) the contribution hints at,
 *  - a stable fingerprint so identical/near-identical prompts can be deduped,
 *  - leaked chat-assistant phrases,
 *  - timestamps.
 */
export function extractProvenance(input: SlopInput): Provenance {
	const haystack = `${input.title}\n${input.body}\n${input.diff}`;

	const modelHints = Array.from(
		new Set(MODEL_HINTS.filter((h) => h.re.test(haystack)).map((h) => h.id)),
	);

	const leakedAssistantPhrases = LEAKED_PHRASES.filter((re) =>
		re.test(haystack),
	).map((re) => re.source);

	// Fingerprint over normalized body + diff (whitespace-collapsed, lowercased).
	const normalized = `${input.body}\n${input.diff}`
		.replace(/\s+/g, " ")
		.trim()
		.toLowerCase();
	const promptFingerprint = createHash("sha256")
		.update(normalized)
		.digest("hex")
		.slice(0, 16);

	return {
		modelHints,
		promptFingerprint,
		leakedAssistantPhrases,
		createdAt: input.createdAt,
		analyzedAt: new Date().toISOString(),
	};
}
