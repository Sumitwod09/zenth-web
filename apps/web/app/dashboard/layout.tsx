import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { SupabaseProvider } from "@/components/SupabaseProvider";
import "./dashboard.css";

export const metadata = {
  title: "Dashboard — Zenth",
  description: "Your ADHD-friendly productivity dashboard. Dump thoughts, focus on tasks, track your wins.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <SupabaseProvider>
      <div className="dashboard-shell">
        <Sidebar />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </SupabaseProvider>
  );
}
