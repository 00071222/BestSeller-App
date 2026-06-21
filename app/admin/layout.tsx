import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { SidebarNav } from "@/components/admin/sidebar-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-md p-6 flex flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <span className="h-6 w-2 rounded-full bg-primary" />
            <p className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Panel Admin
            </p>
          </div>
          
          <SidebarNav />
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Vista Cliente</span>
          </Link>
          
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto max-h-screen bg-background/30">
        {children}
      </main>
    </div>
  );
}