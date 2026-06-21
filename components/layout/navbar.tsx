"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export function Navbar() {
  const { data: session, status } = useSession();
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">BestSeller</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products">Productos</Link>

          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {status === "loading" ? null : session ? (
            <>
              {session.user.role === "ADMIN" && <Link href="/admin">Panel admin</Link>}
              <Link href="/account">Mi cuenta</Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>Cerrar sesión</Button>
            </>
          ) : (
            <>
              <Link href="/login">Iniciar sesión</Link>
              <Button asChild size="sm"><Link href="/register">Registrarse</Link></Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}