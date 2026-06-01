export default function Home() {
	return (
		<main className="container">
			<span className="badge">SlopGuard</span>
			<h1>AI slop PR/Issue guard for OSS maintainers</h1>
			<p style={{ color: "var(--muted)", fontSize: 18 }}>
				GitHub App 하나로 AI slop PR/Issue를 자동 탐지·provenance
				태그·quarantine 라벨링 + maintainer 최종 승인
			</p>

			<div className="card">
				<h3>Status</h3>
				<p>
					✅ App shell is running. Webhook endpoint: <code>/api/webhook</code>{" "}
					(built in Step 3). Health check: <code>/api/health</code>.
				</p>
			</div>

			<div className="card">
				<h3>How it works</h3>
				<ol>
					<li>Install the GitHub App on a repo/org (1 click).</li>
					<li>
						On <code>pull_request</code> / <code>issues</code>, SlopGuard scores
						slop (0–100), tags provenance, and applies a{" "}
						<code>slop-quarantine</code> label.
					</li>
					<li>
						A maintainer replies <code>/slop approve</code> or{" "}
						<code>/slop reject</code>. Nothing is ever auto-closed.
					</li>
				</ol>
			</div>

			<p style={{ color: "var(--muted)" }}>
				Configure via <code>.github/SLOP_POLICY.yml</code>. Human-in-the-loop is
				mandatory by design.
			</p>
		</main>
	);
}
