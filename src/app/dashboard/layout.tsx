"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingDown, 
  History, 
  Settings,
  Bell,
  Search,
  User
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Wealth", href: "/dashboard/wealth", icon: Wallet },
  { name: "Debt Engine", href: "/dashboard/debt", icon: TrendingDown },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="font-heading text-xl font-bold">FinLens</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/40">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border/40">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">Premium User</p>
                    <p className="text-xs text-muted-foreground truncate">pro@finlens.io</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 sm:px-8 bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 flex-1">
                <Link href="/dashboard" className="md:hidden flex items-center gap-2 mr-2">
                    <div className="h-6 w-6 rounded bg-primary" />
                </Link>
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-muted/50 border border-border/40 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
                <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors relative">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
                </button>
                <div className="hidden sm:block h-10 w-px bg-border/40 mx-2" />
                <div className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    PRO
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar mb-20 md:mb-0">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm h-16 md:hidden rounded-2xl border border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl flex items-center justify-around px-2">
            {navItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 flex-1 py-1 px-2 rounded-xl transition-all",
                            isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
                        )}
                    >
                        <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                        <span className="text-[10px] font-bold uppercase tracking-wide">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
      </div>
    </div>
  );
}
