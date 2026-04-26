"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Settings,
  Search,
  User,
  LogOut
} from "lucide-react";
import { useFinancialData } from "@/hooks/use-financial-data";
import { supabase } from "@/lib/supabase";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Wealth", href: "/dashboard/wealth", icon: Wallet },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useFinancialData();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    } else if (!loading && user) {
      // Redirect to onboarding if profile is incomplete
      const isOnboardingComplete = user.user_metadata?.currency_preference;
      if (!isOnboardingComplete) {
        router.push("/auth/onboarding");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 hidden md:flex flex-col">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-heading text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">FinLens</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary stroke-[2.5px]" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="font-bold text-sm">{item.name}</span>
                {isActive && (
                    <div className="ml-auto h-1 w-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/40">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/40 shadow-sm">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                        {user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : "Account")}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate font-bold tracking-tighter">
                        {user?.email || "finlens@user.id"}
                    </p>
                </div>
                <button 
                    onClick={handleSignOut}
                    className="h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    title="Sign Out"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-12 border-b border-border/40 flex items-center justify-between px-8 sm:px-10 bg-background/50 backdrop-blur-md">
            <div className="flex items-center gap-4 flex-1">
                <Link href="/dashboard" className="md:hidden flex items-center gap-2 mr-4">
                    <span className="font-heading text-lg font-bold tracking-tight">FinLens</span>
                </Link>
                <div className="relative w-full max-w-md hidden sm:block" />
            </div>
            
            <div className="flex items-center gap-4" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar mb-20 md:mb-0">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm h-18 md:hidden rounded-[2rem] border border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl flex items-center justify-around px-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1.5 flex-1 py-1.5 px-2 rounded-2xl transition-all",
                            isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                        <span className="text-[9px] font-bold uppercase tracking-wider">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
      </div>
    </div>
  );
}
