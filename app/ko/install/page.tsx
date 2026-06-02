import type { Metadata } from "next";
import InstallGuide from "../../components/InstallGuide";

export const metadata: Metadata = {
	title: "SlopGuard GitHub App 설치 안내",
	description:
		"설치하면 일어나는 일: 레포 선택, 요청되는 권한 확인, 1분 안에 PR 보호 시작. 공개 레포는 무료입니다.",
	alternates: {
		canonical: "/ko/install",
		languages: { en: "/install", ko: "/ko/install" },
	},
};

export default function InstallPageKo() {
	return <InstallGuide lang="ko" />;
}
