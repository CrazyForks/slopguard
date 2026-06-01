/**
 * Standalone agent smoke test — NO GitHub setup required.
 *
 *   npx --yes tsx scripts/test-agent.ts
 *   # with LLM keys (optional):
 *   node --env-file=.env.local --import tsx scripts/test-agent.ts
 *
 * With no LLM keys it runs heuristics-only (still scores). With keys it blends.
 */
import { analyzeSlop } from "../lib/agent/graph.js";
import type { SlopInput } from "../lib/agent/types.js";

const SAMPLES: SlopInput[] = [
	{
		kind: "pull_request",
		repo: "acme/widgets",
		number: 101,
		title: "Update",
		body: "As an AI language model, here's the updated implementation. I hope this helps! Feel free to modify.",
		diff: `--- a/src/index.ts
+++ b/src/index.ts
@@
+// This function adds two numbers together
+// It takes two parameters a and b
+// and returns their sum
+export function add(a: number, b: number): number {
+  // return the sum
+  return a + b;
+}`,
		author: "random-newcomer",
		changedFiles: ["src/index.ts"],
		additions: 8,
		deletions: 0,
		createdAt: new Date().toISOString(),
	},
	{
		kind: "issue",
		repo: "acme/widgets",
		number: 102,
		title: "🚀 Amazing Feature Request ✨",
		body: "## Overview\nThis is a great project! 🎉\n## Key Features\n## Benefits\n## Conclusion\nLet me know if you need anything.",
		diff: "",
		author: "spammy",
		changedFiles: [],
		additions: 0,
		deletions: 0,
		createdAt: new Date().toISOString(),
	},
	{
		kind: "pull_request",
		repo: "acme/widgets",
		number: 103,
		title: "Fix off-by-one in pagination offset calculation",
		body: "The `offset` was computed as `page * size` but should be `(page - 1) * size`, so page 1 skipped the first batch. Added a regression test in pagination.test.ts.",
		diff: `--- a/src/pagination.ts
+++ b/src/pagination.ts
@@
-  const offset = page * size;
+  const offset = (page - 1) * size;`,
		author: "trusted-dev",
		changedFiles: ["src/pagination.ts", "src/pagination.test.ts"],
		additions: 12,
		deletions: 2,
		createdAt: new Date().toISOString(),
	},
];

async function main() {
	for (const sample of SAMPLES) {
		const r = await analyzeSlop(sample);
		console.log("\n" + "─".repeat(64));
		console.log(`#${sample.number} [${sample.kind}] "${sample.title}"`);
		console.log(
			`  SCORE: ${r.score}/100  →  ${r.verdict.toUpperCase()}  ` +
				`(quarantine=${r.shouldQuarantine}, highConf=${r.highConfidence})`,
		);
		console.log(
			`  llm: ${r.llm.provider ?? "heuristics-only"}` +
				(r.llm.model ? ` (${r.llm.model})` : "") +
				`  heuristics=${r.heuristics.score}`,
		);
		console.log(
			`  provenance: hints=[${r.provenance.modelHints.join(", ")}] ` +
				`fp=${r.provenance.promptFingerprint} leaked=${r.provenance.leakedAssistantPhrases.length}`,
		);
		console.log("  reasons:");
		for (const reason of r.reasons) console.log(`    ${reason}`);
	}
	console.log("\n" + "─".repeat(64));
	console.log("✓ agent smoke test complete");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
