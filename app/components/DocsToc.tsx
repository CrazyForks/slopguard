"use client";

import { useEffect, useState } from "react";

/** Sticky on-page table of contents with scroll-spy active highlighting. */
export default function DocsToc({
	items,
}: {
	items: { id: string; label: string }[];
}) {
	const [active, setActive] = useState(items[0]?.id ?? "");

	useEffect(() => {
		const els = items
			.map((i) => document.getElementById(i.id))
			.filter((el): el is HTMLElement => Boolean(el));
		if (!els.length) return;
		const io = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort(
						(a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
					);
				if (visible[0]) setActive(visible[0].target.id);
			},
			{ rootMargin: "-18% 0px -72% 0px", threshold: 0 },
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, [items]);

	return (
		<nav className="docs-toc" aria-label="On this page">
			<ul>
				{items.map((i) => (
					<li key={i.id}>
						<a href={`#${i.id}`} className={active === i.id ? "is-active" : ""}>
							{i.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
