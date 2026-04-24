"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, slideUp } from "@/lib/motion-variants";
import { 
  ArrowUpRight, 
  CreditCard, 
  DollarSign, 
  Plus
} from "lucide-react";
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
    getMonthlySavings, 
    transactions, 
    isSharedView, 
    setIsSharedView 
  } = useFinancialData();

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  const stats = [
    { label: "Total Wealth", value: `$${getTotalWealth().toLocaleString()}`, trend: "+12.5%", color: "primary", icon: DollarSign },
    { label: "Active Debt", value: `$${getActiveDebt().toLocaleString()}`, trend: "-5.2%", color: "destructive", icon: CreditCard },
    { label: "Monthly Savings", value: `$${getMonthlySavings().toLocaleString()}`, trend: "+8.1%", color: "primary", icon: ArrowUpRight },
    { label: "Recent Activity", value: transactions.length.toString(), trend: "New", color: "muted", icon: Plus },
  ];

  return (
    <div className="space-y-8">
      <AddEntryModal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl font-bold">Financial Ecosystem</h1>
            <button 
              onClick={() => setIsSharedView(!isSharedView)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border",
                isSharedView 
                  ? "bg-primary/20 border-primary text-primary" 
                  : "bg-muted/30 border-border/40 text-muted-foreground hover:border-primary/40"
              )}
            >
              {isSharedView ? "Shared Context" : "Core Context"}
            </button>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">Visualizing {isSharedView ? "total shared volume" : "actual out-of-pocket metrics"}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsEntryModalOpen(true)}
            className="rounded-full gap-2 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all px-6"
          >
              <Plus className="h-4 w-4" />
              Log Entry
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
                    className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center",
                            stat.color === 'primary' ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                        )}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <span className={cn(
                            "text-xs font-bold px-2 py-1 rounded-full",
                            stat.trend.startsWith('+') ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                        )}>
                            {stat.trend}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1 tracking-tight font-heading">{stat.value}</h3>
                    

                    <div className={cn(
                        "absolute -bottom-10 -right-10 h-32 w-32 blur-[60px] opacity-0 transition-opacity group-hover:opacity-10",
                        stat.color === 'primary' ? "bg-primary" : "bg-destructive"
                    )} />
                </motion.div>
            )
        })}
      </motion.div>


      <div className="grid gap-6 lg:grid-cols-3 pb-24 md:pb-0">

        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/20 min-h-[350px] sm:min-h-[400px] flex flex-col order-1">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading text-xl font-bold">Wealth Performance</h2>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="rounded-full text-[10px] sm:text-xs h-7 sm:h-8">1W</Button>
                    <Button variant="ghost" size="sm" className="rounded-full text-[10px] sm:text-xs h-7 sm:h-8 bg-muted">1M</Button>
                    <Button variant="ghost" size="sm" className="rounded-full text-[10px] sm:text-xs h-7 sm:h-8">1Y</Button>
                </div>
            </div>
            
            <WealthPerformance />
        </div>


        <div className="space-y-6 sm:space-y-8 order-2">
            <div className="p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/20 h-fit">
                <h3 className="font-heading font-bold text-lg mb-6">Categorical Split</h3>
                <CategoryBreakdown />
            </div>

            <div className="p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/20 h-fit">
                <SocialSplit />
            </div>
        </div>
      </div>
    </div>
  );
}
