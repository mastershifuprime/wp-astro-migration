import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">THEA</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, {user?.firstName ?? "there"}!
        </h2>
        <p className="text-gray-500">
          Your workspace is ready. Knowledge base features arrive in Phase 4.
        </p>
      </main>
    </div>
  );
}
