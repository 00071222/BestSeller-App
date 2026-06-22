"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/admin/sidebar-nav";

export function AdminSidebar({ onSignOut }: { onSignOut: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <aside className="w-64 border-r border-border bg-card/95 backdrop-blur-md p-6 flex flex-col justify-between h-screen fixed md:sticky top-0 z-40">
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="h-6 w-2 rounded-full bg-primary" />
            <p className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Panel Admin
            </p>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
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
        
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive text-sm font-medium transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
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
      <div className={`fixed md:relative z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        {sidebarContent}
      </div>
    </>
  );
}
