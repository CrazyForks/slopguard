"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RepoLookup() {
	const router = useRouter();
	const [value, setValue] = useState("");

	function go(e: React.FormEvent) {
		e.preventDefault();
		const m = value.trim().replace(/^https?:\/\/github\.com\//, "");
		const [owner, repo] = m.split("/");
		if (owner && repo) router.push(`/dashboard/${owner}/${repo}`);
	}

	return (
		<form onSubmit={go} className="card" style={{ display: "flex", gap: 8 }}>
			<input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="owner/repo"
				style={{
					flex: 1,
					padding: "10px 12px",
					background: "#0d1117",
					color: "var(--fg)",
					border: "1px solid var(--border)",
					borderRadius: 8,
				}}
			/>
			<button type="submit" className="btn btn-primary">
				View
			</button>
		</form>
	);
}
