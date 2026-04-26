"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
    CreditCard, 
    ArrowRight, 
    Loader2, 
    Sparkles, 
    TrendingUp, 
    Coins, 
    Check,
    Globe,
    Utensils,
    Car,
    Home,
    Zap,
    HeartPulse,
    ShoppingBag
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useFinancialData } from "@/hooks/use-financial-data";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); 
  const [isLoading, setIsLoading] = useState(false);
  
  // Data State
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [totalWealth, setTotalWealth] = useState("");
  const [income, setIncome] = useState("");
  const [debt, setDebt] = useState("");

  // Expense Categories
  const [expenseCategories, setExpenseCategories] = useState({
    food: "",
    travel: "",
    rent: "",
    utilities: "",
    health: "",
    shopping: ""
  });

  const totalMonthlyExpenses = useMemo(() => {
    return Object.values(expenseCategories).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  }, [expenseCategories]);

  const { refreshData } = useFinancialData();

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.auth.updateUser({
            data: { currency_preference: currency }
        });

        const initialTransactions = [];

        // Initial Wealth Adjustment (Total Net Worth)
        if (parseFloat(totalWealth) > 0) {
          initialTransactions.push({
            user_id: user.id,
            description: "Initial Wealth Baseline",
            amount: parseFloat(totalWealth),
            category: "Assets",
            type: "income",
            date: new Date().toISOString(),
            is_shared: false
          });
        }

        // Debt Position
        if (parseFloat(debt) > 0) {
          initialTransactions.push({
            user_id: user.id,
            description: "Initial Debt Obligations",
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

        // Expense Breakdown Seeding
        Object.entries(expenseCategories).forEach(([key, val]) => {
            const amount = parseFloat(val);
            if (amount > 0) {
                initialTransactions.push({
                    user_id: user.id,
                    description: `Monthly ${key.charAt(0).toUpperCase() + key.slice(1)} Baseline`,
                    amount: amount,
                    category: key === 'rent' ? 'Rent & Housing' : (key === 'food' ? 'Food & Dining' : 'Other'),
                    type: "expense",
                    date: new Date().toISOString(),
                    is_shared: false
                });
            }
        });

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
        title: "Total Wealth",
        description: "What is your current total net worth (Cash + Assets + Crypto)?",
        icon: Sparkles,
        color: "primary",
        value: totalWealth,
        setter: setTotalWealth
    },
    {
        id: 2,
        title: "Monthly Income",
        description: "Your average monthly take-home pay after taxes.",
        icon: TrendingUp,
        color: "primary",
        value: income,
        setter: setIncome
    },
    {
        id: 3,
        title: "Total Debt",
        description: "Total balances on loans, credit cards, or mortgages.",
        icon: CreditCard,
        color: "destructive",
        value: debt,
        setter: setDebt
    }
  ];

  const categoryIcons = [
    { id: 'food', label: 'Food', icon: Utensils, color: 'text-orange-400' },
    { id: 'travel', label: 'Travel', icon: Car, color: 'text-teal-400' },
    { id: 'rent', label: 'Rent', icon: Home, color: 'text-blue-400' },
    { id: 'utilities', label: 'Utilities', icon: Zap, color: 'text-yellow-400' },
    { id: 'health', label: 'Health', icon: HeartPulse, color: 'text-red-400' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-pink-400' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <div className="mb-12 flex items-center justify-between gap-3">
             <div className={cn("h-1.5 flex-1 rounded-full", step >= 0 ? "bg-primary" : "bg-muted/40")} />
             {[1,2,3,4].map((i) => (
                <div 
                    key={i} 
                    className={cn(
                        "h-1.5 flex-1 rounded-full transition-all duration-500",
                        step >= i ? "bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-muted/40"
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
                        <p className="text-muted-foreground text-lg">Your entire dashboard will use this currency.</p>
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
                        Begin Audit <ArrowRight className="h-6 w-6" />
                    </Button>
                </motion.div>
            ) : step <= 3 ? (
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
                        className="h-16 rounded-2xl text-lg font-bold"
                    >
                        Back
                    </Button>
                    <Button 
                        onClick={() => setStep(step + 1)}
                        disabled={!steps[step-1].value}
                        className="h-16 rounded-2xl text-lg font-bold gap-3 shadow-xl shadow-primary/20"
                    >
                        Continue <ArrowRight className="h-6 w-6" />
                    </Button>
                </div>
              </motion.div>
            ) : (
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-4">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl mb-4 bg-primary/10 text-primary shadow-2xl">
                            <Utensils className="h-10 w-10" />
                        </div>
                        <h1 className="font-heading text-4xl font-bold tracking-tight">Spending Split</h1>
                        <p className="text-muted-foreground text-lg">Break down your average monthly costs.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {categoryIcons.map((cat) => (
                            <div key={cat.id} className="relative group">
                                <cat.icon className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4", cat.color)} />
                                <input 
                                    type="number"
                                    placeholder={cat.label}
                                    value={expenseCategories[cat.id as keyof typeof expenseCategories]}
                                    onChange={(e) => setExpenseCategories({...expenseCategories, [cat.id]: e.target.value})}
                                    className="w-full bg-card/40 border border-border/40 rounded-xl py-4 pl-12 pr-16 outline-none focus:border-primary/40 focus:bg-primary/5 transition-all font-bold text-sm shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40 uppercase group-focus-within:text-primary transition-colors pointer-events-none">
                                    {cat.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Calculated Monthly Total</p>
                            <p className="text-2xl font-bold font-heading text-foreground">
                                {currency === 'USD' ? '$' : '₹'}{totalMonthlyExpenses.toLocaleString()}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button 
                            variant="ghost"
                            onClick={() => setStep(step - 1)}
                            className="h-16 rounded-2xl text-lg font-bold"
                        >
                            Back
                        </Button>
                        <Button 
                            onClick={handleComplete}
                            disabled={isLoading || totalMonthlyExpenses === 0}
                            className="h-16 rounded-2xl text-lg font-bold gap-3 shadow-xl shadow-primary/20"
                        >
                            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Finalize Audit <ArrowRight className="h-6 w-6" /></>}
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
