"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Package, Layers, DollarSign, Users, User } from "lucide-react";

export function SidebarNav({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const pathname = usePathname();

  const links = [
    {
      href: "/admin/products",
      label: "Productos",
      icon: Package,
    },
    {
      href: "/admin/categories",
      label: "Categorías y Marcas",
      icon: Layers,
    },
    {
      href: "/admin/sales",
      label: "Ventas",
      icon: DollarSign,
    },
    {
      href: "/admin/users",
      label: "Usuarios",
      icon: Users,
    },
    {
      href: "/admin/profile",
      label: "Mi Perfil",
      icon: User,
    },
  ];

  return (
    <nav className="flex flex-col gap-2 text-sm font-medium">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            title={isCollapsed ? link.label : undefined}
            className={cn(
              "flex items-center rounded-xl transition-all duration-300 relative group",
              isCollapsed ? "justify-center p-3" : "gap-3.5 px-4 py-3",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            {isActive && !isCollapsed && (
              <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-primary-foreground animate-fade-in" />
            )}
            <Icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", isActive && "stroke-[2.5px]")} />
            {!isCollapsed && <span>{link.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
