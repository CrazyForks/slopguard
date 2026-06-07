import { getServiceProvider } from "@/lib/auth/saml";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// SP metadata — the customer's IdP admin points their SAML app at this.
export function GET() {
	const sp = getServiceProvider();
	return new Response(sp.getMetadata(), {
		headers: { "content-type": "application/xml; charset=utf-8" },
	});
}
