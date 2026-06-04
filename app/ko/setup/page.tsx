import type { Metadata } from "next";
import SetupClient from "@/app/setup/SetupClient";

export const metadata: Metadata = {
	title: "SlopGuard 셀프호스팅",
	description:
		"매니페스트로 나만의 SlopGuard GitHub App을 만들어 직접 서버에 올려 운영합니다. 대부분은 호스팅된 앱을 쓰는 게 좋습니다.",
	alternates: {
		canonical: "/ko/setup",
		languages: { en: "/setup", ko: "/ko/setup" },
	},
};

export default function KoSetupPage() {
	return <SetupClient lang="ko" />;
}
