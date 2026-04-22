"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Users, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const debts = [
  { name: "Sarah Miller", amount: 120.50, type: "owes-me", avatar: "SM" },
  { name: "John Doe", amount: 45.00, type: "i-owe", avatar: "JD" },
  { name: "Roommate Group", amount: 840.00, type: "owes-me", avatar: "RG" },
];

export function SocialSplit() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg">Social Liabilities</h3>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Users className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-4">
        {debts.map((debt, i) => (
          <div key={i} className="group p-4 rounded-2xl border border-border/40 bg-card/10 hover:bg-card/30 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-muted to-muted/20 flex items-center justify-center font-bold text-xs ring-2 ring-border/20">
                {debt.avatar}
              </div>
              <div>
                <p className="text-sm font-bold">{debt.name}</p>
                <p className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    debt.type === "owes-me" ? "text-primary" : "text-destructive"
                )}>
                    {debt.type === "owes-me" ? "Owes You" : "You Owe"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className={cn(
                "font-heading font-bold",
                debt.type === "owes-me" ? "text-primary" : "text-destructive"
              )}>
                {debt.type === "owes-me" ? "+" : "-"}${debt.amount.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-3 rounded-2xl border border-dashed border-border/60 text-xs font-bold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2">
        <Bell className="h-3.5 w-3.5" />
        Settle All Balances
      </button>
    </div>
  );
}
