import type { ReactNode } from "react";

/**
 * Left-aligned section header in the "field-manual" language: an index number
 * and a small kicker on a thin rule, then a confident title and optional sub.
 * Shared by every section so headers read as one structured document, not a
 * stack of centered titles.
 */
export default function SectionHead({
	no,
	kicker,
	title,
	sub,
}: {
	no: string;
	kicker: string;
	title: ReactNode;
	sub?: ReactNode;
}) {
	return (
		<div className="sec-head">
			<div className="sec-rule">
				<span className="sec-no">{no}</span>
				<span className="sec-kicker">{kicker}</span>
			</div>
			<h2 className="sec-title">{title}</h2>
			{sub ? <p className="sec-sub">{sub}</p> : null}
		</div>
	);
}
