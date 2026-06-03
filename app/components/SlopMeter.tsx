"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";

interface Sample {
	n: string;
	t: string;
	score: number;
}

const SAMPLES: Record<Lang, Sample[]> = {
	en: [
		{ n: "PR #218", t: "Bump dependencies to latest", score: 16 },
		{ n: "PR #241", t: "Refactor the auth callback", score: 43 },
		{ n: "#312", t: "Feature request, clear repro", score: 28 },
		{ n: "PR #233", t: "Add 12 emoji-headed doc pages", score: 79 },
		{ n: "PR #239", t: "Rewrite README (machine-generated)", score: 93 },
	],
	ko: [
		{ n: "PR #218", t: "의존성 최신 버전으로 올림", score: 16 },
		{ n: "PR #241", t: "인증 콜백 리팩터", score: 43 },
		{ n: "#312", t: "재현 명확한 기능 요청", score: 28 },
		{ n: "PR #233", t: "이모지 헤더 문서 12개 추가", score: 79 },
		{ n: "PR #239", t: "README 통째로 재작성 (기계 생성)", score: 93 },
	],
};

const T = {
	en: {
		label: "Drag the threshold",
		threshold: "threshold",
		quarantined: "quarantined",
		passed: "passed silently",
		q: "quarantine",
		ok: "pass",
		note: "At or above the threshold SlopGuard adds a label and a review comment. Below it, it stays silent. You set the line; a human always has the final word.",
	},
	ko: {
		label: "임계값을 드래그해 보세요",
		threshold: "임계값",
		quarantined: "격리",
		passed: "조용히 통과",
		q: "격리됨",
		ok: "통과",
		note: "임계값 이상이면 라벨과 리뷰 코멘트를 답니다. 아래면 조용히 둡니다. 기준은 당신이 정하고, 최종 결정은 늘 사람 몫입니다.",
	},
} as const;

/** Interactive threshold demo: drag the slider and sample PRs reclassify live
 * between quarantined and passed. Mirrors SlopGuard's core gating mechanic. */
export default function SlopMeter({ lang }: { lang: Lang }) {
	const t = T[lang];
	const samples = SAMPLES[lang];
	const [threshold, setThreshold] = useState(50);
	const qCount = samples.filter((s) => s.score >= threshold).length;

	return (
		<div className="meter">
			<div className="meter-top">
				<span className="meter-label">{t.label}</span>
				<span className="meter-val mono">
					{t.threshold} <strong>{threshold}</strong> / 100
				</span>
			</div>

			<input
				className="meter-range"
				type="range"
				min={0}
				max={100}
				value={threshold}
				onChange={(e) => setThreshold(Number(e.target.value))}
				aria-label={t.threshold}
				style={{ ["--pct" as string]: `${threshold}%` }}
			/>

			<div className="meter-track" aria-hidden="true">
				<div className="meter-zone" style={{ left: `${threshold}%` }} />
				{samples.map((s) => (
					<span
						key={s.n}
						className={`meter-dot ${s.score >= threshold ? "is-q" : "is-ok"}`}
						style={{ left: `${s.score}%` }}
					/>
				))}
			</div>

			<div className="meter-counts mono">
				<span className="is-q">
					{t.quarantined} {qCount}
				</span>
				<span className="is-ok">
					{t.passed} {samples.length - qCount}
				</span>
			</div>

			<ul className="meter-list">
				{samples.map((s) => {
					const flagged = s.score >= threshold;
					return (
						<li key={s.n} className={flagged ? "is-q" : "is-ok"}>
							<span className="meter-pr mono">{s.n}</span>
							<span className="meter-title">{s.t}</span>
							<span className="meter-score mono">{s.score}</span>
							<span className={`meter-tag ${flagged ? "tag-q" : "tag-ok"}`}>
								{flagged ? t.q : t.ok}
							</span>
						</li>
					);
				})}
			</ul>

			<p className="meter-note">{t.note}</p>
		</div>
	);
}
