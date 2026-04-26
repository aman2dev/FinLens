"use client";

import React, { useState } from "react";
import { Users, Bell, Check, Loader2 } from "lucide-react";
import { useFinancialData } from "@/hooks/use-financial-data";
import { cn } from "@/lib/utils";

export function SocialSplit() {
  const { transactions, formatCurrency, settleAllDebts, settleUserDebts } = useFinancialData();
  const [isSettlingAll, setIsSettlingAll] = useState(false);
  const [settlingUser, setSettlingUser] = useState<string | null>(null);

  // Group debts by user
  const socialDebts = React.useMemo(() => {
    const groups: Record<string, { amount: number; description: string }> = {};
    
    transactions
      .filter(t => t.is_shared === true && Number(t.owes_me || 0) > 0)
      .forEach(t => {
        const name = t.shared_with || "Shared Expense";
        if (!groups[name]) {
          groups[name] = { amount: 0, description: t.description };
        }
        groups[name].amount += Number(t.owes_me || 0);
      });

    return Object.entries(groups).map(([name, data]) => ({
      name,
      originalDesc: data.description,
      amount: data.amount,
      avatar: name.substring(0, 2).toUpperCase()
    }));
  }, [transactions]);

  const handleSettleAll = async () => {
    setIsSettlingAll(true);
    await settleAllDebts();
    setIsSettlingAll(false);
  };

  const handleSettleUser = async (name: string) => {
    setSettlingUser(name);
    await settleUserDebts(name);
    setSettlingUser(null);
  };

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
          socialDebts.map((debt) => (
            <div key={debt.name} className="group p-4 rounded-2xl border border-border/40 bg-card/10 hover:bg-card/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center font-bold text-[10px] tracking-widest text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all">
                  {debt.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate max-w-[80px] sm:max-w-[150px] mb-0.5">{debt.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">
                      OWES {formatCurrency(debt.amount)}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => handleSettleUser(debt.name)}
                disabled={settlingUser === debt.name}
                className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm border border-primary/20"
                title="Settle this user"
              >
                {settlingUser === debt.name ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="p-10 text-center border border-dashed border-border/40 rounded-[2.5rem] bg-muted/5">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.25em] leading-relaxed">
                Clean Slate.<br/>
                <span className="text-[9px] opacity-40 font-medium normal-case tracking-normal mt-1 block italic">No active debts found.</span>
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={handleSettleAll}
        disabled={isSettlingAll || socialDebts.length === 0}
        className="w-full py-4 rounded-2xl border border-dashed border-border/60 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
      >
        {isSettlingAll ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
            <><Bell className="h-3.5 w-3.5 group-hover:animate-bounce" /> Settle All Balances</>
        )}
      </button>
    </div>
  );
}
