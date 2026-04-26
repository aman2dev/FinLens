"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useFinancialData } from "@/hooks/use-financial-data";

const RED_COLORS = [
  "hsl(346, 84%, 61%)", // Vibrant Red
  "hsl(346, 84%, 51%)", // Darker Red
  "hsl(346, 84%, 41%)", // Deep Red
  "hsl(346, 84%, 71%)", // Light Red
  "hsl(346, 84%, 31%)", // Maroon
];

export function CategoryBreakdown() {
  const { transactions, formatCurrency } = useFinancialData();

  const processedData = transactions.reduce((acc: any[], t) => {
      if (t.type === 'expense') {
        const existing = acc.find(item => item.name === t.category);
        if (existing) {
          existing.value += t.amount;
        } else {
          acc.push({ name: t.category, value: t.amount });
        }
      }
      return acc;
    }, []).sort((a, b) => b.value - a.value);

  if (processedData.length === 0) {
    return (
        <div className="flex h-[200px] w-full items-center justify-center border border-dashed border-border/40 rounded-2xl bg-muted/5">
            <p className="text-sm text-muted-foreground italic">Log an expense to see breakdown.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="h-[180px] w-full max-w-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={RED_COLORS[index % RED_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              itemStyle={{ color: "hsl(346, 84%, 61%)" }}
              formatter={(value: any) => formatCurrency(Number(value || 0))}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="w-full space-y-3">
        {processedData.slice(0, 5).map((item, index) => (
          <div key={item.name} className="flex items-center justify-between group p-2 rounded-xl hover:bg-muted/30 transition-all cursor-default">
            <div className="flex items-center gap-3">
              <div 
                className="h-2 w-2 rounded-full ring-4 ring-muted transition-transform group-hover:scale-125" 
                style={{ backgroundColor: RED_COLORS[index % RED_COLORS.length] }} 
              />
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground opacity-40 font-bold">
                    {((item.value / processedData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%
                </span>
                <span className="text-sm font-bold font-heading tabular-nums transition-colors group-hover:text-red-500">
                    {formatCurrency(item.value)}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
