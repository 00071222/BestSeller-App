"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tag, DollarSign, Users, User } from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const links = [
    {
      href: "/admin/products",
      label: "Productos",
      icon: Tag,
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
        // Check if pathname starts with the link's href (to keep active on sub-routes like new/edit)
        // Except for exact matches if needed. Since admin has /admin/products, /admin/products/new, etc.
        const isActive = pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 relative group",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            {/* Active Indicator Bar on Left */}
            {isActive && (
              <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-primary-foreground animate-fade-in" />
            )}
            <Icon className={cn("h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110", isActive && "stroke-[2.5px]")} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
