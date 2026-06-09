import type { Metadata } from "next";
import LegalBody from "@/app/components/LegalBody";

export const metadata: Metadata = {
	title: "이용약관",
	description:
		"호스팅 SlopGuard 서비스 약관: 분류 도구, Polar 결제, 허용되는 사용, 보증 부인, 책임 제한.",
	alternates: { canonical: "/ko/terms" },
};

export default function Page() {
	return <LegalBody doc="terms" lang="ko" />;
}
