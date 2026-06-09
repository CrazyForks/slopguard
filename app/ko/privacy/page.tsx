import type { Metadata } from "next";
import LegalBody from "@/app/components/LegalBody";

export const metadata: Metadata = {
	title: "개인정보처리방침",
	description:
		"SlopGuard가 무엇을, 왜 수집하고 누가 처리하며 어떤 권리가 있는지. 최소한만 수집하고 데이터를 판매하지 않습니다.",
	alternates: { canonical: "/ko/privacy" },
};

export default function Page() {
	return <LegalBody doc="privacy" lang="ko" />;
}
