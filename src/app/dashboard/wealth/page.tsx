"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  TrendingUp, 
  ShieldCheck,
  Building2,
  Coins,
  ArrowRight,
  TrendingDown,
  Layout
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useFinancialData } from "@/hooks/use-financial-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function WealthPage() {
  const { transactions, getTotalWealth, getActiveDebt, formatCurrency } = useFinancialData();

  // Dynamic Wealth History (Last 6 entries)
  const wealthHistory = useMemo(() => {
    const sorted = [...transactions]
        .filter(t => !t.description.includes("Benchmark") && !t.description.includes("Expense Baseline"))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningBalance = 0;
    return sorted.map((t) => {
      if (t.type === 'income') runningBalance += t.amount;
      else runningBalance -= (t.amount || 0);
      return {
        month: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: runningBalance
      };
    }).slice(-12);
  }, [transactions]);

  // Dynamic Asset Breakdown
  const assetBreakdown = useMemo(() => {
    const assets = transactions.reduce((acc: any, t) => {
        if (t.type === 'income' && !t.description.includes("Benchmark")) {
            const cat = t.category || "Other";
            acc[cat] = (acc[cat] || 0) + (t.amount || 0);
        }
        return acc;
    }, {});

    const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899"];
    return Object.entries(assets).map(([name, value], i) => ({
        name,
        value: value as number,
        color: COLORS[i % COLORS.length]
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // KPIs
  const totalWealth = getTotalWealth();
  const liquidCash = transactions
    .filter(t => t.description.includes("Liquid") || t.category === "Assets")
    .reduce((acc, t) => acc + (t.type === 'income' ? (t.amount || 0) : -(t.amount || 0)), 0);

  const crypto = transactions
    .filter(t => t.category === "Crypto" || t.description.toLowerCase().includes("crypto"))
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  if (transactions.length === 0) {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="text-center space-y-6 max-w-md p-8 rounded-[3rem] border border-dashed border-border/40 bg-card/10">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Wallet className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-heading">No Data Found</h2>
                <p className="text-muted-foreground text-sm">Please set up your profile or add your first entry to see your wealth dashboard.</p>
                <Link href="/auth/onboarding">
                    <button className="mt-4 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                        Set Up Profile
                    </button>
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 md:pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight">Wealth Tracker</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">See how your total net worth is changing.</p>
        </div>
        <div className="flex items-center gap-4 p-5 bg-card/30 backdrop-blur-md border border-border/40 rounded-[2rem] shadow-xl group">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Total Net Worth</p>
                <p className="text-2xl font-bold font-heading text-foreground">{formatCurrency(totalWealth)}</p>
            </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Wealth Chart */}
        <div className="lg:col-span-2 p-8 sm:p-10 rounded-[2.5rem] border border-border/40 bg-card/20 min-h-[450px] flex flex-col shadow-inner relative overflow-hidden group">
            <div className="flex items-center justify-between mb-12 relative z-10">
                <div>
                   <h2 className="font-heading text-2xl font-bold">Your Growth</h2>
                   <p className="text-xs text-muted-foreground font-medium">How your money has grown recently.</p>
                </div>
                <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                    Live Updates
                </div>
            </div>
            
            <div className="flex-1 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={wealthHistory}>
                        <defs>
                            <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                        />
                        <Tooltip 
                            formatter={(value: any) => formatCurrency(Number(value || 0))}
                            contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border)/0.5)', 
                                borderRadius: '1.5rem',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                padding: '12px 16px'
                            }}
                            itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10b981" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#wealthGradient)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Asset Distribution */}
        <div className="p-8 sm:p-10 rounded-[2.5rem] border border-border/40 bg-card/20 flex flex-col items-center shadow-inner">
            <h2 className="font-heading text-2xl font-bold w-full text-left mb-10">Money Mix</h2>
            <div className="flex-1 w-full flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Pie
                            data={assetBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={75}
                            outerRadius={100}
                            paddingAngle={10}
                            dataKey="value"
                            stroke="none"
                        >
                            {assetBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value: any) => formatCurrency(Number(value || 0))}
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '1rem' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-1 gap-3 w-full mt-10">
                    {assetBreakdown.slice(0, 4).map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-muted/5 border border-border/20 group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="h-2.5 w-2.5 rounded-full ring-4 ring-muted transition-all group-hover:scale-125" style={{ backgroundColor: item.color }} />
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{item.name}</span>
                            </div>
                            <span className="text-sm font-bold font-heading tabular-nums">{formatCurrency(item.value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
            { 
                icon: Wallet, 
                label: "Available Cash", 
                value: formatCurrency(Math.abs(liquidCash)), 
                sub: liquidCash >= 0 ? "Money in hand" : "Low Cash Warning",
                color: liquidCash >= 0 ? "text-primary" : "text-destructive"
            },
            { 
                icon: Coins, 
                label: "Crypto", 
                value: formatCurrency(crypto), 
                sub: "Digital investments",
                color: "text-purple-400"
            },
            { 
                icon: ShieldCheck, 
                label: "Safety Margin", 
                value: "9.2 Months", 
                sub: "Emergency fund",
                color: "text-blue-400"
            }
        ].map((kit, i) => (
            <motion.div 
                whileHover={{ y: -8, scale: 1.02 }}
                key={i} 
                className="p-8 rounded-[2rem] border border-border/40 bg-card/20 hover:bg-card/30 transition-all cursor-default shadow-xl group border-b-4 border-b-primary/5 hover:border-b-primary/20"
            >
                <div className="h-14 w-14 rounded-2xl bg-muted/20 flex items-center justify-center mb-6 border border-border/40 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all shadow-inner">
                    <kit.icon className={cn("h-7 w-7", kit.color)} />
                </div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">{kit.label}</h3>
                <p className="text-3xl font-heading font-bold tracking-tight">{kit.value}</p>
                <p className="text-[11px] text-muted-foreground mt-4 font-bold uppercase tracking-wider bg-muted/30 w-fit px-2 py-0.5 rounded-lg">{kit.sub}</p>
            </motion.div>
        ))}
      </div>
    </div>
  );
}
