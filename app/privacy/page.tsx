import type { Metadata } from "next";
import LegalBody from "@/app/components/LegalBody";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"What SlopGuard collects, why, who processes it, and your rights. We collect the minimum needed and never sell your data.",
	alternates: { canonical: "/privacy" },
};

export default function Page() {
	return <LegalBody doc="privacy" lang="en" />;
}
