"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          BestSeller
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/productos">Productos</Link>
          {status === "loading" ? null : session ? (
            <>
              {session.user.role === "ADMIN" && <Link href="/admin">Panel admin</Link>}
              <Link href="/cuenta">Mi cuenta</Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">Iniciar sesión</Link>
              <Button asChild size="sm">
                <Link href="/registro">Registrarse</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}