import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/login" });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors duration-300">
      <AdminSidebar onSignOut={handleSignOut} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen bg-background/30 w-full">
        {children}
      </main>
    </div>
  );
}