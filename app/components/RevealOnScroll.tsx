"use client";

import { useEffect } from "react";

/** Adds a tasteful scroll-reveal to matching elements without touching their
 * markup. The initial hidden state is applied by JS, so if JS never runs the
 * content stays visible (no blank sections). Honors reduced motion. */
export default function RevealOnScroll({
	selector = ".section, .docs-section",
}: {
	selector?: string;
} = {}) {
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const els = Array.from(
			document.querySelectorAll<HTMLElement>(selector),
		).filter((el) => !el.classList.contains("reveal"));
		if (!els.length) return;
		els.forEach((el) => el.classList.add("reveal"));
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						e.target.classList.add("reveal-in");
						io.unobserve(e.target);
					}
				}
			},
			{ threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, [selector]);
	return null;
}
