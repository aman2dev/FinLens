"use client";

import React from "react";
import { Users, Bell } from "lucide-react";
import { useFinancialData } from "@/hooks/use-financial-data";

export function SocialSplit() {
  const { transactions, formatCurrency } = useFinancialData();

  // Filter for shared transactions where someone owes money
  const socialDebts = transactions
    .filter(t => t.is_shared && t.owes_me && t.owes_me > 0)
    .map(t => ({
      name: t.shared_with || t.description,
      originalDesc: t.description,
      amount: t.owes_me || 0,
      type: "owes-me",
      avatar: (t.shared_with || t.description).substring(0, 2).toUpperCase()
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-xl">Sharing</h2>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Users className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-4">
        {socialDebts.length > 0 ? (
          socialDebts.map((debt, i) => (
            <div key={i} className="group p-4 rounded-2xl border border-border/40 bg-card/10 hover:bg-card/30 transition-all flex items-center justify-between cursor-default">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center font-bold text-[10px] tracking-widest text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all">
                  {debt.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate max-w-[120px] mb-0.5">{debt.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary flex items-center gap-1.5 leading-none">
                      OWES YOU <span className="h-1 w-1 rounded-full bg-primary/40 block" /> <span className="text-muted-foreground/60 normal-case tracking-normal font-medium truncate max-w-[60px]">{debt.originalDesc}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-bold text-primary tabular-nums">
                  +{formatCurrency(debt.amount)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center border border-dashed border-border/40 rounded-[2.5rem] bg-muted/5 group">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.25em] leading-relaxed group-hover:text-primary transition-colors">
                No active shared debts.<br/>
                <span className="text-[9px] opacity-40 font-medium normal-case tracking-normal mt-1 block italic">Split a bill to see it here.</span>
            </p>
          </div>
        )}
      </div>

      <button className="w-full py-4 rounded-2xl border border-dashed border-border/60 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-2 group">
        <Bell className="h-3.5 w-3.5 group-hover:animate-bounce" />
        Settle Balances
      </button>
    </div>
  );
}
