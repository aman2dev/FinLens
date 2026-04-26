"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingDown, 
  Zap, 
  Snowflake, 
  ArrowRight, 
  Info,
  Calendar,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useFinancialData } from "@/hooks/use-financial-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DebtStrategyPage() {
  const { getActiveDebt } = useFinancialData();
  const [strategy, setStrategy] = useState<"snowball" | "avalanche">("avalanche");
  const [isLaunching, setIsLaunching] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);

  const totalDebt = getActiveDebt();

  const strategies = [
    {
      id: "avalanche",
      name: "Debt Avalanche",
      icon: Zap,
      color: "text-primary",
      bg: "bg-primary/10",
      description: "Mathematically superior. Pay off debts with the highest interest rates first to minimize total interest paid.",
      benefits: ["Lowest total cost", "Faster path to zero real debt", "Optimal for high-interest credit cards"],
      saveAmount: 2450
    },
    {
      id: "snowball",
      name: "Debt Snowball",
      icon: Snowflake,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      description: "Psychologically rewarding. Pay off the smallest balances first to build momentum and quick wins.",
      benefits: ["Instant morale boost", "Simplifies number of accounts", "Best for emotional momentum"],
      saveAmount: 1100
    }
  ];

  const handleLaunchPlan = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setIsLaunched(true);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-32 md:pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Strategy Engine</h1>
          <p className="text-muted-foreground mt-1 text-sm">Visualizing the optimal path to financial freedom.</p>
        </div>
        <div className="p-3 bg-muted/20 border border-border/40 rounded-2xl flex items-center gap-3">
            <TrendingDown className="h-5 w-5 text-destructive" />
            <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Liability</p>
                <p className="text-sm font-bold font-heading text-foreground">${totalDebt.toLocaleString()}</p>
            </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Select Methodology
            </h2>
            <div className="grid gap-4">
                {strategies.map((s) => {
                    const Icon = s.icon;
                    const isActive = strategy === s.id;
                    return (
                        <button
                            key={s.id}
                            onClick={() => {
                                setStrategy(s.id as any);
                                setIsLaunched(false); // Reset if they change strategy
                            }}
                            className={cn(
                                "group p-6 rounded-3xl border transition-all text-left relative overflow-hidden",
                                isActive 
                                    ? "bg-card border-primary ring-1 ring-primary/20" 
                                    : "bg-card/20 border-border/40 hover:border-primary/20"
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn("p-3 rounded-2xl", s.bg, s.color)}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className={cn(
                                    "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                                    isActive ? "border-primary bg-primary text-black" : "border-border/40"
                                )}>
                                    {isActive && <CheckCircle2 className="h-4 w-4" />}
                                </div>
                            </div>
                            <h3 className="font-heading font-bold text-xl mb-2">{s.name}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                            
                            {isActive && (
                                <motion.div 
                                    layoutId="active-bg"
                                    className="absolute -bottom-12 -right-12 h-24 w-24 bg-primary/10 blur-3xl rounded-full"
                                />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>

        <div className="space-y-6">
             <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Freedom Projection
            </h2>
            <div className="p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-card/30 to-transparent relative overflow-hidden h-fit">
                <div className="space-y-8 relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Estimated Zero-Debt Date</p>
                            <h3 className="text-4xl font-heading font-bold text-primary">Jan 2027</h3>
                        </div>
                        <div className="text-right">
                             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Potential Interest Savings</p>
                             <h4 className="text-2xl font-heading font-bold text-foreground">
                                 ${strategies.find(s => s.id === strategy)?.saveAmount.toLocaleString()}
                             </h4>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Key Strategy benefits</p>
                        <ul className="space-y-3">
                            {strategies.find(s => s.id === strategy)?.benefits.map((b, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="h-3 w-3 text-primary" />
                                    </div>
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex gap-4">
                        <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                        <p className="text-xs text-destructive leading-relaxed">
                            Based on current trends, your minimum monthly contribution should be <span className="font-bold underline">$450.00</span> to remain on track.
                        </p>
                    </div>

                    <Button 
                        onClick={handleLaunchPlan}
                        disabled={isLaunching || isLaunched}
                        className={cn(
                            "w-full h-14 rounded-2xl font-bold transition-all",
                            isLaunched 
                                ? "bg-primary/20 text-primary border border-primary animate-pulse shadow-none" 
                                : "shadow-xl shadow-primary/20"
                        )}
                    >
                        {isLaunching ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                Analyzing Path...
                            </div>
                        ) : isLaunched ? (
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                {strategy.charAt(0).toUpperCase() + strategy.slice(1)} Plan Active
                            </div>
                        ) : (
                            <>Launch Automated Plan <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                </div>

                <div className="absolute top-0 right-0 h-full w-1/3 bg-primary/5 -skew-x-12 translate-x-1/2" />
            </div>
        </div>
      </div>
    </div>
  );
}
