import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r p-4 space-y-2 shrink-0">
        <p className="font-bold mb-4">Panel admin</p>
        <nav className="flex flex-col gap-1 text-sm">
          <Link href="/admin" className="px-3 py-2 rounded hover:bg-muted">Dashboard</Link>
          <Link href="/admin/products" className="px-3 py-2 rounded hover:bg-muted">Productos</Link>
          <Link href="/admin/sales" className="px-3 py-2 rounded hover:bg-muted">Ventas</Link>
          <Link href="/admin/users" className="px-3 py-2 rounded hover:bg-muted">Usuarios</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}