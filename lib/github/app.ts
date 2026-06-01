import { App } from "@octokit/app";
import { Octokit } from "octokit";
import { getGitHubAppEnv } from "../env.js";
import { registerWebhookHandlers } from "./handlers.js";

/** Installation-authenticated client type used across helpers. */
export type InstallationClient = Octokit;

let _app: App | null = null;

/** Lazy singleton. Throws a clear error if env is missing (only when used). */
export function getApp(): App {
	if (_app) return _app;
	const env = getGitHubAppEnv();

	const app = new App({
		appId: env.appId,
		privateKey: env.privateKey,
		Octokit,
		webhooks: { secret: env.webhookSecret },
		...(env.clientId && env.clientSecret
			? { oauth: { clientId: env.clientId, clientSecret: env.clientSecret } }
			: {}),
	});

	registerWebhookHandlers(app);
	_app = app;
	return app;
}

/** Get an installation-scoped REST client. */
export async function getInstallationClient(
	installationId: number,
): Promise<InstallationClient> {
	const app = getApp();
	return (await app.getInstallationOctokit(
		installationId,
	)) as InstallationClient;
}
