import Link from "next/link";
import MarketingNav from "@/app/components/MarketingNav";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
	title: "SlopGuard: Org Dashboard — Team",
	description:
		"Org-wide slop activity, audit log, and cross-repo intelligence for Team plans.",
};

export default function OrgDashboard() {
	return (
		<>
			<MarketingNav lang="en" enHref="/org" koHref="/ko/org" />

			<main style={{ paddingTop: 0 }}>
				<div className="flex min-h-[calc(100vh-60px)]">
					{/* Sidebar mimicking the photo */}
					<div className="w-64 bg-[#161b22] border-r border-[#30363d] p-4 text-sm flex flex-col">
						<div className="font-bold text-[#3fb950] mb-4">SlopGuard Team</div>
						<ul className="space-y-1 text-[#8b949e] flex-1">
							<li className="px-2 py-1 rounded hover:bg-[#21262d]">OVERVIEW</li>
							<li className="px-2 py-1 rounded bg-[#21262d] text-[#e6edf3]">
								DASHBOARD
							</li>
							<li className="px-2 py-1 rounded hover:bg-[#21262d]">REPOS</li>
							<li className="px-2 py-1 rounded hover:bg-[#21262d]">ALERTS</li>
							<li className="px-2 py-1 rounded hover:bg-[#21262d]">
								CAMPAIGNS
							</li>
							<li className="px-2 py-1 rounded hover:bg-[#21262d]">SETTINGS</li>
						</ul>
						<div className="text-xs text-[#8b949e] mt-auto">Blue-B (Team)</div>
					</div>

					{/* Main */}
					<div className="flex-1 p-6 overflow-auto">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h1 className="text-2xl font-bold">Org Dashboard</h1>
								<p className="text-[#8b949e] text-sm">
									Cross-repo slop intelligence • Last 30 days
								</p>
							</div>
							<div className="flex gap-2">
								<Link href="/account" className="btn btn-ghost btn-sm">
									Account
								</Link>
								<Link href="/pricing" className="btn btn-primary btn-sm">
									Upgrade
								</Link>
							</div>
						</div>

						{/* The photo as hero */}
						<img
							src="/images/slopguard-team-dashboard.png"
							alt="Team Org Dashboard"
							className="w-full rounded border border-[#30363d] mb-4"
						/>

						{/* Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
							<div className="card p-3">
								<div className="text-xl font-bold text-[#3fb950]">142</div>
								<div className="text-xs text-[#8b949e]">Quarantined</div>
							</div>
							<div className="card p-3">
								<div className="text-xl font-bold">89</div>
								<div className="text-xs text-[#8b949e]">Cleared</div>
							</div>
							<div className="card p-3">
								<div className="text-xl font-bold">17</div>
								<div className="text-xs text-[#8b949e]">Repos</div>
							</div>
							<div className="card p-3">
								<div className="text-xl font-bold text-[#f85149]">3</div>
								<div className="text-xs text-[#8b949e]">Campaigns</div>
							</div>
						</div>

						{/* Table */}
						<div className="card">
							<div className="card-head">
								<h3>Recent activity</h3>
							</div>
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-[#30363d]">
										<th className="text-left p-2">Item</th>
										<th className="text-left p-2">Repo</th>
										<th className="text-left p-2">Score</th>
										<th className="text-left p-2">Status</th>
										<th className="text-left p-2">Cleared by</th>
										<th className="text-left p-2">When</th>
									</tr>
								</thead>
								<tbody>
									{[
										{
											item: "feat: add new auth flow",
											repo: "acme/web",
											score: 78,
											status: "quarantined",
											by: "—",
											when: "2h ago",
										},
										{
											item: "fix: update deps",
											repo: "acme/api",
											score: 42,
											status: "cleared",
											by: "@jane",
											when: "yesterday",
										},
										{
											item: "docs: onboarding guide",
											repo: "acme/docs",
											score: 91,
											status: "quarantined",
											by: "—",
											when: "2d ago",
										},
									].map((row, i) => (
										<tr key={i} className="border-b border-[#21262d]">
											<td className="p-2 font-mono">{row.item}</td>
											<td className="p-2">{row.repo}</td>
											<td className="p-2 text-[#3fb950]">{row.score}/100</td>
											<td className="p-2">
												<span
													className={
														row.status === "quarantined"
															? "text-[#f85149]"
															: "text-[#3fb950]"
													}
												>
													{row.status}
												</span>
											</td>
											<td className="p-2">{row.by}</td>
											<td className="p-2 text-[#8b949e]">{row.when}</td>
										</tr>
									))}
								</tbody>
							</table>
							<p className="text-xs text-[#8b949e] mt-2">
								Real data from GitHub after App install on your repos. Full
								history in /account.
							</p>
						</div>
					</div>
				</div>
			</main>

			<SiteFooter lang="en" />
		</>
	);
}
