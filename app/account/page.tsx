import Account from "../components/Account";

export const dynamic = "force-dynamic";
export const metadata = { title: "SlopGuard — Account" };

export default async function AccountPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string }>;
}) {
	const { error } = await searchParams;
	return <Account lang="en" error={error} />;
}
