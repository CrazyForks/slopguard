import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
	const providers = {
		gemini: Boolean(process.env.GEMINI_API_KEY),
		anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
		grok: Boolean(process.env.XAI_API_KEY),
		openai: Boolean(process.env.OPENAI_API_KEY),
	};

	return NextResponse.json({
		name: "slopguard",
		status: "ok",
		time: new Date().toISOString(),
		githubAppConfigured: Boolean(
			process.env.GITHUB_APP_ID && process.env.GITHUB_WEBHOOK_SECRET,
		),
		llmProviders: providers,
		providerOrder: (
			process.env.LLM_PROVIDER_ORDER ?? "gemini,anthropic,grok,openai"
		)
			.split(",")
			.map((s) => s.trim()),
	});
}
