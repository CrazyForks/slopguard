import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "SlopGuard — AI slop PR/Issue guard for maintainers",
	description:
		"GitHub App 하나로 AI slop PR/Issue를 자동 탐지·provenance 태그·quarantine 라벨링 + maintainer 최종 승인",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
