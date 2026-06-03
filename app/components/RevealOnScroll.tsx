"use client";

import { useEffect } from "react";

/** Tasteful scroll-reveal that can NEVER leave content hidden: elements already
 * in view reveal immediately, an IntersectionObserver reveals the rest on
 * scroll, and a short safety timer reveals anything still hidden. */
export default function RevealOnScroll({
	selector = ".section, .docs-section",
}: {
	selector?: string;
} = {}) {
	useEffect(() => {
		const els = Array.from(
			document.querySelectorAll<HTMLElement>(selector),
		).filter((el) => !el.classList.contains("reveal"));
		if (!els.length) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		els.forEach((el) => el.classList.add("reveal"));
		const show = (el: Element) => el.classList.add("reveal-in");
		const vh = window.innerHeight || document.documentElement.clientHeight;

		// anything already in (or near) view: reveal now
		els.forEach((el) => {
			if (el.getBoundingClientRect().top < vh * 0.9) show(el);
		});

		let io: IntersectionObserver | null = null;
		if ("IntersectionObserver" in window) {
			io = new IntersectionObserver(
				(entries) =>
					entries.forEach((e) => {
						if (e.isIntersecting) {
							show(e.target);
							io?.unobserve(e.target);
						}
					}),
				{ threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
			);
			els.forEach((el) => {
				if (!el.classList.contains("reveal-in")) io?.observe(el);
			});
		}

		// safety net: never leave a section invisible
		const t = window.setTimeout(() => els.forEach(show), 1600);
		return () => {
			io?.disconnect();
			clearTimeout(t);
		};
	}, [selector]);
	return null;
}
