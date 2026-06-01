// Local webhook proxy: forwards GitHub webhooks → your local Next.js dev server.
// Usage:
//   1) Create a channel at https://smee.io/new and copy the URL
//   2) SMEE_URL=https://smee.io/xxxx npm run smee
//   3) Set that same smee URL as the App's webhook URL while developing.
import SmeeClient from "smee-client";

const source = process.env.SMEE_URL;
const target = process.env.SMEE_TARGET ?? "http://localhost:3000/api/webhook";

if (!source) {
	console.error(
		"✖ Missing SMEE_URL. Create one at https://smee.io/new then run:\n" +
			"  SMEE_URL=https://smee.io/xxxx npm run smee",
	);
	process.exit(1);
}

const smee = new SmeeClient({ source, target, logger: console });
const events = await smee.start();
console.log(`✓ Forwarding ${source} → ${target}`);

process.on("SIGINT", () => {
	events.close();
	process.exit(0);
});
