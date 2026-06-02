import type { Metadata } from "next";
import InstallGuide from "../components/InstallGuide";

export const metadata: Metadata = {
	title: "Install SlopGuard on GitHub",
	description:
		"What happens when you install SlopGuard: choose repos, review the exact permissions, and start guarding PRs in a minute. Free for public repos.",
	alternates: {
		canonical: "/install",
		languages: { en: "/install", ko: "/ko/install" },
	},
};

export default function InstallPage() {
	return <InstallGuide lang="en" />;
}
