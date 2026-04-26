"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, slideUp } from "@/lib/motion-variants";
import { 
  ArrowUpRight, 
  CreditCard, 
  DollarSign, 
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  History as HistoryIcon,
  Search,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  MoreVertical,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFinancialData } from "@/hooks/use-financial-data";
import { WealthPerformance } from "@/components/dashboard/WealthPerformance";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { SocialSplit } from "@/components/dashboard/SocialSplit";
import { AddEntryModal } from "@/components/dashboard/AddEntryModal";

export default function DashboardPage() {
  const { 
    getTotalWealth, 
    getActiveDebt, 
    transactions, 
    isSharedView, 
    setIsSharedView,
    formatCurrency,
    deleteTransaction 
  } = useFinancialData();

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("1M");

  const stats = [
    { label: "Total Wealth", value: formatCurrency(getTotalWealth()), trend: "Live", color: "primary", icon: Wallet, desc: "Your net worth" },
    { label: "Active Debt", value: formatCurrency(getActiveDebt()), trend: "Live", color: "destructive", icon: CreditCard, desc: "What you owe" },
    { label: "Savings Rate", value: "88%", trend: "+2.4%", color: "primary", icon: TrendingUp, desc: "How much you save" },
    { label: "Total Activity", value: transactions.length.toString(), trend: "Live", color: "muted", icon: Activity, desc: "Number of entries" },
  ];

  return (
    <div className="space-y-8 pb-20">
      <AddEntryModal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-4xl font-bold tracking-tight">Your Dashboard</h1>
            <div className="h-6 w-px bg-border/40 hidden sm:block mx-1" />
            <button 
              onClick={() => setIsSharedView(!isSharedView)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all border",
                isSharedView 
                  ? "bg-primary/20 border-primary text-primary" 
                  : "bg-muted/30 border-border/40 text-muted-foreground hover:border-primary/40"
              )}
            >
              {isSharedView ? "Shared List" : "Private List"}
            </button>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Tracking your money in {isSharedView ? "the shared group" : "your private account"}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsEntryModalOpen(true)}
            className="rounded-2xl gap-2 font-bold shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all px-8 h-14 bg-primary text-primary-foreground group"
          >
              <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
              New Entry
          </Button>
        </div>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
                <motion.div
                    key={i}
                    variants={slideUp}
                    className="p-6 rounded-[2rem] border border-border/40 bg-card/30 backdrop-blur-md relative overflow-hidden group hover:border-primary/30 transition-all cursor-default shadow-lg"
                >
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner",
                            stat.color === 'primary' ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                        )}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border",
                            stat.trend === 'Live' || stat.trend.startsWith('+') ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/20 border-border/40 text-muted-foreground"
                        )}>
                            {stat.trend}
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-3xl font-bold mt-1 tracking-tight font-heading">{stat.value}</h3>
                        <p className="text-[10px] text-muted-foreground mt-2 font-medium opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">{stat.desc}</p>
                    </div>
                    
                    <div className={cn(
                        "absolute -bottom-10 -right-10 h-32 w-32 blur-[60px] opacity-0 transition-opacity group-hover:opacity-10",
                        stat.color === 'primary' ? "bg-primary" : "bg-destructive"
                    )} />
                </motion.div>
            )
        })}
      </motion.div>


      <div className="grid gap-8 lg:grid-cols-3">

        <div className="lg:col-span-2 p-6 sm:p-10 rounded-[2.5rem] border border-border/40 bg-card/20 min-h-[380px] flex flex-col shadow-inner relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                   <h2 className="font-heading text-2xl font-bold">Wealth Chart</h2>
                   <p className="text-xs text-muted-foreground font-medium mt-1">How your money has grown over time.</p>
                </div>
                <div className="flex gap-1.5 p-1 bg-muted/20 rounded-full border border-border/20">
                    {["1W", "1M", "1Y"].map((r) => (
                        <button 
                            key={r}
                            onClick={() => setSelectedRange(r)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all",
                                selectedRange === r ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex-1 w-full relative z-10">
                <WealthPerformance range={selectedRange} />
            </div>
        </div>


        <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-[2.5rem] border border-border/40 bg-card/20 shadow-inner group transition-all">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-heading font-bold text-xl">Spending Split</h3>
                    <div className="h-8 w-8 rounded-full bg-red-400/10 flex items-center justify-center text-red-500">
                        <Activity className="h-4 w-4" />
                    </div>
                </div>
                <CategoryBreakdown />
            </div>

            <div className="p-6 sm:p-8 rounded-[2.5rem] border border-border/40 bg-card/20 shadow-inner hover:border-primary/20 transition-all">
                <SocialSplit />
            </div>
        </div>
      </div>

      <div className="p-6 sm:p-10 rounded-[3rem] border border-border/40 bg-card/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner shrink-0">
                    <HistoryIcon className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight">Recent Activity</h2>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 font-medium line-climb-1 sm:line-clamp-none">A quick look at your latest spending.</p>
                </div>
            </div>
            <Link 
                href="/dashboard/history" 
                className="group flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-muted/20 border border-border/40 text-[10px] font-bold text-muted-foreground hover:text-primary hover:border-primary/20 transition-all uppercase tracking-widest w-fit sm:w-auto"
            >
                See Full History <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
        
        <div className="grid gap-3 relative z-10">
            {transactions.length > 0 ? (
                transactions.slice(0, 5).map((t) => (
                  <div 
                    key={t.id} 
                    className="flex items-center justify-between p-3 sm:p-4 rounded-3xl bg-card/20 border border-border/10 group hover:border-primary/20 transition-all shadow-sm"
                  >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className={cn(
                                "h-11 w-11 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 border shrink-0",
                                t.type === 'income' ? "bg-primary/5 border-primary/10 text-primary" : "bg-destructive/5 border-destructive/10 text-destructive"
                            )}>
                                {t.type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-bold group-hover:text-primary transition-colors truncate">{t.description}</p>
                                <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                                    <span className="text-[8px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-widest py-0.5 px-1.5 bg-muted/30 rounded-lg whitespace-nowrap truncate">
                                        {t.category}
                                    </span>
                                    <span className="text-[8px] sm:text-[9px] text-muted-foreground opacity-60 font-bold uppercase tracking-tighter whitespace-nowrap shrink-0">
                                        {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-6 shrink-0 ml-2">
                            <div className="text-right">
                                <p className={cn(
                                    "text-sm sm:text-lg font-bold font-heading tabular-nums",
                                    t.type === 'income' ? "text-primary" : "text-destructive"
                                )}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                </p>
                                <span className={cn(
                                    "text-[7px] sm:text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter border",
                                    t.is_shared 
                                        ? "bg-primary/10 border-primary/20 text-primary cursor-help" 
                                        : "bg-muted/10 border-border/40 text-muted-foreground"
                                )}>
                                    {t.is_shared ? "SHARED" : "PRIVATE"}
                                </span>
                            </div>
                            <button 
                                onClick={() => deleteTransaction(t.id)}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-16 text-center border border-dashed border-border/40 rounded-[3rem] bg-muted/5 relative overflow-hidden group">
                    <p className="text-sm text-muted-foreground font-medium italic relative z-10">No entries yet. Add your first one to start tracking!</p>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEntryModalOpen(true)}
                        className="mt-6 text-xs font-bold gap-2 text-primary hover:bg-primary/10 rounded-full px-6 h-10 border border-primary/20 relative z-10 shadow-lg shadow-primary/10"
                    >
                        <Plus className="h-4 w-4" /> Add Your First Log
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
