"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
    CreditCard, 
    ArrowRight, 
    Loader2, 
    Sparkles, 
    TrendingUp, 
    Landmark, 
    Landmark as Building, 
    Coins, 
    Shield,
    Check,
    Globe
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useFinancialData } from "@/hooks/use-financial-data";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // Start at 0 for currency
  const [isLoading, setIsLoading] = useState(false);
  
  // Data State
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [cash, setCash] = useState("");
  const [investments, setInvestments] = useState("");
  const [retirement, setRetirement] = useState("");
  const [debt, setDebt] = useState("");
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");

  const { refreshData } = useFinancialData();

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save currency preference in user metadata or a settings table
        // For simplicity, we can use metadata or just keep it in context
        await supabase.auth.updateUser({
            data: { currency_preference: currency }
        });

        const initialTransactions = [];

        // Cash Position
        if (parseFloat(cash) > 0) {
          initialTransactions.push({
            user_id: user.id,
            description: "Liquid Cash Reserves",
            amount: parseFloat(cash),
            category: "Assets",
            type: "income",
            date: new Date().toISOString(),
            is_shared: false
          });
        }

        // Investments
        if (parseFloat(investments) > 0) {
          initialTransactions.push({
            user_id: user.id,
            description: "Market Portfolio",
            amount: parseFloat(investments),
            category: "Investments",
            type: "income",
            date: new Date().toISOString(),
            is_shared: false
          });
        }

        // Retirement
        if (parseFloat(retirement) > 0) {
          initialTransactions.push({
            user_id: user.id,
            description: "Retirement Fund (401k/IRA)",
            amount: parseFloat(retirement),
            category: "Retirement",
            type: "income",
            date: new Date().toISOString(),
            is_shared: false
          });
        }

        // Debt Position
        if (parseFloat(debt) > 0) {
          initialTransactions.push({
            user_id: user.id,
            description: "Existing Obligations",
            amount: parseFloat(debt),
            category: "Debt",
            type: "expense",
            date: new Date().toISOString(),
            is_shared: false
          });
        }

        // Income Benchmark
        if (parseFloat(income) > 0) {
          initialTransactions.push({
            user_id: user.id,
            description: "Monthly Income Benchmark",
            amount: parseFloat(income),
            category: "Other",
            type: "income",
            date: new Date().toISOString(),
            is_shared: false
          });
        }

        // Expense Baseline
        if (parseFloat(expenses) > 0) {
          initialTransactions.push({
            user_id: user.id,
            description: "Monthly Expense Baseline",
            amount: parseFloat(expenses),
            category: "Other",
            type: "expense",
            date: new Date().toISOString(),
            is_shared: false
          });
        }

        if (initialTransactions.length > 0) {
            const { error } = await supabase.from("transactions").insert(initialTransactions);
            if (!error) await refreshData();
        }
      }
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      router.push("/dashboard");
    }
  };

  const steps = [
    {
        id: 1,
        title: "Liquid Cash",
        description: "How much cash do you have accessible in savings and checking accounts?",
        icon: Sparkles,
        color: "primary",
        value: cash,
        setter: setCash
    },
    {
        id: 2,
        title: "Investments",
        description: "Total value of your stocks, bonds, and crypto portfolios.",
        icon: Coins,
        color: "primary",
        value: investments,
        setter: setInvestments
    },
    {
        id: 3,
        title: "Retirement",
        description: "Consolidated value of your 401k, IRA, or pension funds.",
        icon: Shield,
        color: "primary",
        value: retirement,
        setter: setRetirement
    },
    {
        id: 4,
        title: "Current Debt",
        description: "Total outstanding balances on credit cards, loans, or mortgages.",
        icon: CreditCard,
        color: "destructive",
        value: debt,
        setter: setDebt
    },
    {
        id: 5,
        title: "Monthly Income",
        description: "Your average monthly take-home pay after taxes.",
        icon: TrendingUp,
        color: "primary",
        value: income,
        setter: setIncome
    },
    {
        id: 6,
        title: "Monthly Expenses",
        description: "Total fixed costs like rent, utilities, and daily essentials.",
        icon: Building,
        color: "destructive",
        value: expenses,
        setter: setExpenses
    }
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <div className="mb-12 flex items-center justify-between gap-3">
             <div className={cn("h-1.5 flex-1 rounded-full", step >= 0 ? "bg-primary" : "bg-muted/40")} />
            {steps.map((s) => (
                <div 
                    key={s.id} 
                    className={cn(
                        "h-1.5 flex-1 rounded-full transition-all duration-500",
                        step >= s.id ? "bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-muted/40"
                    )} 
                />
            ))}
        </div>

        <AnimatePresence mode="wait">
            {step === 0 ? (
                <motion.div
                    key="currency"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-4">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-4">
                            <Globe className="h-10 w-10" />
                        </div>
                        <h1 className="font-heading text-4xl font-bold tracking-tight">Select Base Currency</h1>
                        <p className="text-muted-foreground text-lg">Every ledger entry will be tracked in this denomination.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { id: "USD", label: "US Dollar", symbol: "$" },
                            { id: "INR", label: "Indian Rupee", symbol: "₹" }
                        ].map((curr) => (
                            <button
                                key={curr.id}
                                onClick={() => setCurrency(curr.id as any)}
                                className={cn(
                                    "p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 relative overflow-hidden group",
                                    currency === curr.id 
                                        ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" 
                                        : "border-border/40 bg-card/20 hover:border-primary/20"
                                )}
                            >
                                <span className={cn(
                                    "text-5xl font-bold font-heading transition-transform group-hover:scale-110",
                                    currency === curr.id ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {curr.symbol}
                                </span>
                                <span className="font-bold text-sm tracking-widest uppercase">{curr.label}</span>
                                {currency === curr.id && (
                                    <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="h-3 w-3 text-black font-bold" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <Button 
                        onClick={() => setStep(1)}
                        className="w-full h-16 rounded-2xl text-lg font-bold gap-3 shadow-xl shadow-primary/20"
                    >
                        Set Currency & Continue <ArrowRight className="h-6 w-6" />
                    </Button>
                </motion.div>
            ) : (
                <motion.div
                key={step}
                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className={cn(
                      "inline-flex h-20 w-20 items-center justify-center rounded-3xl mb-4 transition-all duration-500 shadow-2xl",
                      steps[step-1].color === 'primary' ? "bg-primary/10 text-primary shadow-primary/10" : "bg-destructive/10 text-destructive shadow-destructive/10"
                  )}>
                    {React.createElement(steps[step-1].icon, { className: "h-10 w-10" })}
                  </div>
                  <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">{steps[step-1].title}</h1>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                      {steps[step-1].description}
                  </p>
                </div>
  
                <div className="relative group">
                  <div className={cn(
                      "absolute left-8 top-1/2 -translate-y-1/2 font-heading text-4xl font-bold transition-colors",
                      steps[step-1].color === 'primary' ? "text-primary/40 group-focus-within:text-primary" : "text-destructive/40 group-focus-within:text-destructive"
                  )}>
                    {currency === 'USD' ? '$' : '₹'}
                  </div>
                  <input
                    type="number"
                    autoFocus
                    placeholder="0.00"
                    value={steps[step-1].value}
                    onChange={(e) => steps[step-1].setter(e.target.value)}
                    className={cn(
                      "w-full bg-card/40 border-2 border-border/40 rounded-[2rem] py-16 pl-16 pr-8 text-6xl font-bold font-heading outline-none transition-all placeholder:text-muted-foreground/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center",
                      steps[step-1].color === 'primary' ? "focus:border-primary/40 focus:bg-primary/5 shadow-xl shadow-primary/5" : "focus:border-destructive/40 focus:bg-destructive/5 shadow-xl shadow-destructive/5"
                    )}
                  />
                </div>
  
                <div className="grid grid-cols-2 gap-4">
                    <Button 
                        variant="ghost"
                        onClick={() => setStep(step - 1)}
                        className="h-16 rounded-2xl text-lg font-bold hover:bg-muted/50"
                    >
                        Back
                    </Button>
                  
                  {step < steps.length ? (
                      <Button 
                          onClick={() => setStep(step + 1)}
                          disabled={!steps[step-1].value}
                          className="h-16 rounded-2xl text-lg font-bold gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                          Continue <ArrowRight className="h-6 w-6" />
                      </Button>
                  ) : (
                      <Button 
                          onClick={handleComplete}
                          disabled={isLoading || !steps[step-1].value}
                          className="h-16 rounded-2xl text-lg font-bold gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                          {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Finalize Profile <ArrowRight className="h-6 w-6" /></>}
                      </Button>
                  )}
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
