"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { cn } from "@/lib/utils";

export function AdminSidebar({ onSignOut }: { onSignOut: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const sidebarContent = (
    <aside className={cn(
      "border-r border-border bg-card/95 backdrop-blur-md p-6 flex flex-col justify-between h-screen fixed md:sticky top-0 z-40 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[88px] items-center px-3" : "w-64"
    )}>
      <div className="space-y-6 w-full">
        <div className={cn("flex items-center w-full", isCollapsed ? "justify-center" : "justify-between px-2")}>
          {/* Desktop collapse/expand toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <Menu className="h-8 w-8" />
          </Button>

          {/* Mobile close button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <SidebarNav isCollapsed={isCollapsed} />
      </div>

      <div className="space-y-2 border-t border-border pt-4 w-full">

        <Link
          href="/"
          title={isCollapsed ? "Vista Cliente" : undefined}
          className={cn(
            "flex items-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground text-base font-medium transition-all duration-200",
            isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"
          )}
        >
          <ArrowLeft className="h-6 w-6" />
          {!isCollapsed && <span>Pagina Principal</span>}
        </Link>
        
        <button
          onClick={onSignOut}
          title={isCollapsed ? "Cerrar Sesión" : undefined}
          className={cn(
            "flex w-full items-center rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive text-sm font-medium transition-all duration-200 cursor-pointer",
            isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"
          )}
        >
          <LogOut className="h-6 w-6" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="md:hidden p-4 bg-card border-b border-border flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="h-5 w-1.5 rounded-full bg-primary" />
          <p className="font-bold text-base tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div className={cn(
        "fixed md:relative top-0 left-0 md:top-auto md:left-auto h-screen md:h-auto z-40 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {sidebarContent}
      </div>
    </>
  );
}
