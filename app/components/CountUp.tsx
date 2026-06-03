"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up to a numeric value when it enters view. Initial state is the real
 * value, so if the observer never fires (or JS is slow) the correct number is
 * always shown, never a stuck 0. Non-numeric values (e.g. "MIT") render as-is. */
export default function CountUp({ value }: { value: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const match = value.match(/^(\d+)(.*)$/);
	const target = match ? Number(match[1]) : null;
	const suffix = match ? match[2] : "";
	const [n, setN] = useState<number | null>(target);

	useEffect(() => {
		if (target == null) return;
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		let done = false;
		const animate = () => {
			if (done) return;
			done = true;
			const dur = 900;
			const start = performance.now();
			setN(0);
			const tick = (now: number) => {
				const p = Math.min(1, (now - start) / dur);
				setN(Math.round((1 - (1 - p) ** 3) * target));
				if (p < 1) requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		};

		const vh = window.innerHeight || 800;
		if (el.getBoundingClientRect().top < vh * 0.9) {
			animate();
			return;
		}
		if (!("IntersectionObserver" in window)) return;
		const io = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					io.disconnect();
					animate();
				}
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
