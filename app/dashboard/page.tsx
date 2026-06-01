"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardIndex() {
	const router = useRouter();
	const [value, setValue] = useState("");

	function go(e: React.FormEvent) {
		e.preventDefault();
		const m = value.trim().replace(/^https?:\/\/github\.com\//, "");
		const [owner, repo] = m.split("/");
		if (owner && repo) router.push(`/dashboard/${owner}/${repo}`);
	}

	return (
		<main className="container">
			<h1>🛡️ SlopGuard dashboard</h1>
			<p style={{ color: "var(--muted)" }}>
				Enter an <code>owner/repo</code> where SlopGuard is installed.
			</p>
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
				<button
					type="submit"
					style={{
						padding: "10px 18px",
						background: "var(--accent)",
						color: "#1c1300",
						fontWeight: 700,
						border: 0,
						borderRadius: 8,
						cursor: "pointer",
					}}
				>
					View
				</button>
			</form>
		</main>
	);
}
