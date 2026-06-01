import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeSlop } from "../lib/agent/graph.js";
import { runHeuristics } from "../lib/agent/nodes/staticHeuristics.js";
import { extractProvenance } from "../lib/agent/nodes/provenance.js";
import { computeScore } from "../lib/agent/nodes/score.js";
import { DEFAULT_AGENT_POLICY, type SlopInput } from "../lib/agent/types.js";

function pr(overrides: Partial<SlopInput> = {}): SlopInput {
	return {
		kind: "pull_request",
		repo: "acme/widgets",
		number: 1,
		title: "Fix off-by-one in pagination",
		body: "Adjusts offset from page*size to (page-1)*size with a regression test.",
		diff: "--- a/x.ts\n+++ b/x.ts\n@@\n-  const o = page * size;\n+  const o = (page - 1) * size;",
		author: "human-dev",
		changedFiles: ["x.ts"],
		additions: 4,
		deletions: 2,
		createdAt: new Date().toISOString(),
		...overrides,
	};
}

test("clean human fix scores low and is not quarantined", async () => {
	const r = await analyzeSlop(pr());
	assert.equal(r.verdict, "clean");
	assert.equal(r.shouldQuarantine, false);
	assert.ok(r.score < DEFAULT_AGENT_POLICY.quarantineThreshold);
});

test("AI-boilerplate PR is flagged and quarantined", async () => {
	const r = await analyzeSlop(
		pr({
			title: "Update",
			body: "As an AI language model, here's the updated implementation. I hope this helps! Feel free to modify.",
		}),
	);
	assert.ok(
		r.score >= DEFAULT_AGENT_POLICY.quarantineThreshold,
		`score=${r.score}`,
	);
	assert.equal(r.shouldQuarantine, true);
});

test("heuristics fire on assistant boilerplate", () => {
	const h = runHeuristics(
		pr({
			body: "As an AI language model, I hope this helps! Let me know if you need anything.",
		}),
	);
	assert.ok(h.signals.some((s) => s.id === "boilerplate_disclaimers"));
	assert.ok(h.score > 0);
});

test("provenance: stable fingerprint + model-hint detection", () => {
	const input = pr({ body: "Generated with ChatGPT. Here's the code." });
	const a = extractProvenance(input);
	const b = extractProvenance(input);
	assert.equal(a.promptFingerprint, b.promptFingerprint);
	assert.equal(a.promptFingerprint.length, 16);
	assert.ok(a.modelHints.includes("chatgpt"));
});

test("computeScore: heuristics-only when no LLM provider", () => {
	const heur = runHeuristics(pr({ title: "Update", body: "" }));
	const prov = extractProvenance(pr());
	const r = computeScore(
		heur,
		{ score: 0, verdict: "clean", reasons: [], provider: null, model: null },
		prov,
		DEFAULT_AGENT_POLICY,
	);
	assert.equal(r.score, heur.score);
});

test("computeScore: high confidence flag above threshold", () => {
	const heur = { score: 50, signals: [] };
	const prov = extractProvenance(pr());
	const r = computeScore(
		heur,
		{
			score: 95,
			verdict: "likely-slop",
			reasons: ["x"],
			provider: "anthropic",
			model: "claude",
		},
		prov,
		{ ...DEFAULT_AGENT_POLICY, heuristicWeight: 0.2 },
	);
	assert.ok(r.highConfidence, `score=${r.score}`);
	assert.equal(r.verdict, "likely-slop");
});
