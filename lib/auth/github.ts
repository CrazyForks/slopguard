// GitHub OAuth (user-to-server) for "Sign in with GitHub". Uses the GitHub
// App's OAuth credentials (GITHUB_APP_CLIENT_ID / GITHUB_APP_CLIENT_SECRET).

import { getAppBaseUrl } from "../env.js";

export function oauthConfigured(): boolean {
	return Boolean(
		process.env.GITHUB_APP_CLIENT_ID && process.env.GITHUB_APP_CLIENT_SECRET,
	);
}

export function callbackUrl(): string {
	return `${getAppBaseUrl()}/api/auth/callback`;
}

/** Build the GitHub authorize URL the user is redirected to. */
export function authorizeUrl(state: string): string {
	const params = new URLSearchParams({
		client_id: process.env.GITHUB_APP_CLIENT_ID ?? "",
		redirect_uri: callbackUrl(),
		state,
		// GitHub App user-to-server: identity is implicit. read:user/user:email
		// are honoured if the app requests the Email/Profile account permissions.
		scope: "read:user user:email",
		allow_signup: "true",
	});
	return `https://github.com/login/oauth/authorize?${params}`;
}

interface GitHubUser {
	login: string;
	name: string | null;
	avatar_url: string;
	email: string | null;
	html_url: string;
}

/** Exchange the OAuth code for a user-to-server token. */
export async function exchangeCode(code: string): Promise<string | null> {
	const res = await fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		headers: { "Content-Type": "application/json", Accept: "application/json" },
		body: JSON.stringify({
			client_id: process.env.GITHUB_APP_CLIENT_ID,
			client_secret: process.env.GITHUB_APP_CLIENT_SECRET,
			code,
			redirect_uri: callbackUrl(),
		}),
		cache: "no-store",
	});
	if (!res.ok) return null;
	const data = (await res.json()) as { access_token?: string };
	return data.access_token ?? null;
}

/** Fetch the authenticated user's profile (and primary email if available). */
export async function fetchUser(token: string): Promise<{
	login: string;
	name: string | null;
	avatar: string;
	email: string | null;
	profileUrl: string;
} | null> {
	const headers = {
		Authorization: `Bearer ${token}`,
		Accept: "application/vnd.github+json",
		"User-Agent": "slopguard",
	};
	const res = await fetch("https://api.github.com/user", {
		headers,
		cache: "no-store",
	});
	if (!res.ok) return null;
	const u = (await res.json()) as GitHubUser;

	let email = u.email;
	if (!email) {
		try {
			const er = await fetch("https://api.github.com/user/emails", {
				headers,
				cache: "no-store",
			});
			if (er.ok) {
				const emails = (await er.json()) as {
					email: string;
					primary: boolean;
					verified: boolean;
				}[];
				email =
					emails.find((e) => e.primary && e.verified)?.email ??
					emails.find((e) => e.verified)?.email ??
					null;
			}
		} catch {
			// best effort
		}
	}

	return {
		login: u.login,
		name: u.name,
		avatar: u.avatar_url,
		email,
		profileUrl: u.html_url,
	};
}
