/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Standalone output: a minimal self-contained server bundle. Drastically
	// reduces runtime memory + disk on small (256MB) hosts like Cloudtype.
	output: "standalone",
	// LangChain + Octokit are server-only; keep them out of the client bundle.
	serverExternalPackages: [
		"@langchain/langgraph",
		"@langchain/core",
		"@langchain/anthropic",
		"@langchain/openai",
		"@octokit/app",
		"@octokit/webhooks",
		"octokit",
		// SAML SP: native/wasm xmllint validator must not be webpack-bundled.
		"samlify",
		"@authenio/samlify-node-xmllint",
		"node-xmllint",
	],
	// Resolve ESM-style ".js" import specifiers to their TypeScript sources
	// (lib/** uses NodeNext-style ".js" extensions; webpack needs this mapping).
	webpack: (config) => {
		config.resolve.extensionAlias = {
			".js": [".ts", ".tsx", ".js"],
			".jsx": [".tsx", ".jsx"],
			".mjs": [".mts", ".mjs"],
		};
		return config;
	},
};

export default nextConfig;
