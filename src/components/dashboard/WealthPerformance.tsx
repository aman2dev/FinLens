"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useFinancialData } from "@/hooks/use-financial-data";

export function WealthPerformance({ range = "1M" }: { range?: string }) {
  const { transactions, currency } = useFinancialData();

  // Generate dynamic data based on transactions
  const chartData = React.useMemo(() => {
    if (transactions.length === 0) return [];

    // Filter out benchmarks and sort chronologically
    const sorted = [...transactions]
        .filter(t => !t.description.includes("Benchmark") && !t.description.includes("Expense Baseline"))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningBalance = 0;
    const history = sorted.map((t) => {
      if (t.type === 'income') runningBalance += t.amount;
      else runningBalance -= (t.amount || 0);

      return {
        name: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: runningBalance
      };
    });

    return history.slice(-12); // Show last 12 points for better resolution
  }, [transactions]);

  // Formatter for YAxis (e.g. 15000 -> $15k)
  const formatYAxis = (value: number) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    if (value >= 1000) return `${symbol}${(value / 1000).toFixed(1)}k`;
    if (value <= -1000) return `-${symbol}${Math.abs(value / 1000).toFixed(1)}k`;
    return `${symbol}${value}`;
  };

  if (chartData.length === 0) {
    return (
        <div className="h-[300px] w-full flex items-center justify-center border border-dashed border-border/40 rounded-[2rem] bg-muted/5">
            <p className="text-sm text-muted-foreground italic">No performance telemetry available.</p>
        </div>
    );
  }

  return (
    <div className="h-[280px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 20, // Increased margin for larger labels
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.1)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis 
            width={60} // Fixed width for labels
            axisLine={false} 
            tickLine={false} 
            tickFormatter={formatYAxis}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 'bold' }}
          />
          <Tooltip 
            formatter={(value: any) => [formatYAxis(Number(value || 0)), "Net Worth"]}
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              border: "1px solid hsl(var(--border))",
              borderRadius: "1rem",
              fontSize: "12px",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)"
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorValue)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
