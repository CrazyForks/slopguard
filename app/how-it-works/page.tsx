import type { Metadata } from "next";
import HowItWorksBody from "@/app/components/HowItWorksBody";

export const metadata: Metadata = {
	title: "How SlopGuard works",
	description:
		"From a GitHub webhook to a scored, labelled, commented PR in seconds: rule heuristics, provenance tracking, and an optional LLM judge. No CI, no server.",
	alternates: { canonical: "/how-it-works" },
};

export default function Page() {
	return <HowItWorksBody lang="en" />;
}
