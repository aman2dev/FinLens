"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Rent", value: 1200 },
  { name: "Food", value: 600 },
  { name: "Transit", value: 300 },
  { name: "Shopping", value: 450 },
  { name: "Entertainment", value: 250 },
];

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary)/0.8)",
  "hsl(var(--primary)/0.6)",
  "hsl(var(--primary)/0.4)",
  "hsl(var(--primary)/0.2)",
];

export function CategoryBreakdown() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "12px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
