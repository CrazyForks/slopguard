"use client";

import { useEffect, useRef, useState } from "react";

/** Counts a numeric value up from 0 when it scrolls into view. Values without a
 * leading number (e.g. "MIT") render unchanged. Honors reduced motion. */
export default function CountUp({ value }: { value: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const match = value.match(/^(\d+)(.*)$/);
	const target = match ? Number(match[1]) : null;
	const suffix = match ? match[2] : "";
	const [n, setN] = useState(target == null ? null : 0);

	useEffect(() => {
		if (target == null) return;
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setN(target);
			return;
		}
		const io = new IntersectionObserver(
			([e]) => {
				if (!e.isIntersecting) return;
				io.disconnect();
				const dur = 900;
				const start = performance.now();
				const tick = (now: number) => {
					const p = Math.min(1, (now - start) / dur);
					const eased = 1 - (1 - p) ** 3;
					setN(Math.round(eased * target));
					if (p < 1) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
			},
			{ threshold: 0.4 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [target]);

	if (target == null) return <span ref={ref}>{value}</span>;
	return (
		<span ref={ref}>
			{n}
			{suffix}
		</span>
	);
}
