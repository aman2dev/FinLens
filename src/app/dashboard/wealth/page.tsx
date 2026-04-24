"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  TrendingUp, 
  BarChart3, 
  PieChart as PieIcon,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Coins
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useFinancialData } from "@/hooks/use-financial-data";
import { cn } from "@/lib/utils";

const wealthData = [
  { month: "Jan", value: 38000 },
  { month: "Feb", value: 39500 },
  { month: "Mar", value: 41200 },
  { month: "Apr", value: 42500 }
];

const assetBreakdown = [
  { name: "Liquid Cash", value: 12500, color: "#10b981" },
  { name: "Investments", value: 22000, color: "#3b82f6" },
  { name: "Retirement", value: 8000, color: "#8b5cf6" }
];

export default function WealthPage() {
  const { getTotalWealth } = useFinancialData();

  return (
    <div className="space-y-8 pb-32 md:pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Wealth Architect</h1>
          <p className="text-muted-foreground mt-1 text-sm">Quantifying your total financial power.</p>
        </div>
        <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Net Worth</p>
                <p className="text-xl font-bold font-heading text-foreground">${getTotalWealth().toLocaleString()}</p>
            </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/20 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading text-xl font-bold">Growth Velocity</h2>
                <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">
                    +11.8% vs Last QTR
                </span>
            </div>
            
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={wealthData}>
                        <defs>
                            <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#888' }}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                            itemStyle={{ color: '#10b981' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#wealthGradient)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/20 flex flex-col items-center">
            <h2 className="font-heading text-xl font-bold w-full text-left mb-8 font-heading">Asset Distribution</h2>
            <div className="flex-1 w-full flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={assetBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {assetBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                    {assetBreakdown.map((item) => (
                        <div key={item.name} className="flex flex-col gap-1 p-3 rounded-2xl bg-muted/10 border border-border/40">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.name}</span>
                            </div>
                            <span className="text-sm font-bold">${item.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
            { icon: Building2, label: "Real Estate Exposure", value: "$0.00", sub: "No properties linked" },
            { icon: Coins, label: "Crypto Assets", value: "$2,450.20", sub: "Managed in Ledger" },
            { icon: ShieldCheck, label: "Safety Margin", value: "6.2 Months", sub: "Emergency Runway" }
        ].map((kit, i) => (
            <motion.div 
                whileHover={{ y: -5 }}
                key={i} 
                className="p-6 rounded-3xl border border-border/40 bg-card/20 hover:bg-card/40 transition-all cursor-default"
            >
                <div className="h-12 w-12 rounded-2xl bg-muted/20 flex items-center justify-center mb-4">
                    <kit.icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{kit.label}</h3>
                <p className="text-2xl font-heading font-bold">{kit.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{kit.sub}</p>
            </motion.div>
        ))}
      </div>
    </div>
  );
}
