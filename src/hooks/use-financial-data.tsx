"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type Category = 
  | "Food & Dining" 
  | "Rent & Housing" 
  | "Utilities" 
  | "Shopping" 
  | "Entertainment" 
  | "Health" 
  | "Transport" 
  | "Other"
  | "Debt"
  | "Assets"
  | "Investments"
  | "Retirement"
  | "Real Estate"
  | "Crypto";

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: Category;
  type: 'income' | 'expense';
  date: string;
  is_shared?: boolean;
  owes_me?: number;
  shared_with?: string;
}

interface FinancialContextType {
  transactions: Transaction[];
  loading: boolean;
  user: any;
  currency: "USD" | "INR";
  setCurrency: (c: "USD" | "INR") => void;
  formatCurrency: (amount: number) => string;
  addTransaction: (t: Omit<Transaction, "id" | "user_id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  refreshData: () => Promise<void>;
  getTotalWealth: () => number;
  getActiveDebt: () => number;
  settleAllDebts: () => Promise<void>;
  settleUserDebts: (name: string) => Promise<void>;
  isSharedView: boolean;
  setIsSharedView: (v: boolean) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSharedView, setIsSharedView] = useState(false);
  const [currency, setCurrencyState] = useState<"USD" | "INR">("USD");

  const refreshData = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (!error && data) {
      setTransactions(data as Transaction[]);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Load currency preference from metadata
        const pref = session.user.user_metadata?.currency_preference;
        if (pref === "INR" || pref === "USD") {
            setCurrencyState(pref as "INR" | "USD");
        }
      }
      
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const pref = session.user.user_metadata?.currency_preference;
        if (pref === "INR" || pref === "USD") {
            setCurrencyState(pref as "INR" | "USD");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) refreshData();
  }, [user]);

  const setCurrency = async (newCurr: "USD" | "INR") => {
    setCurrencyState(newCurr);
    if (user) {
        await supabase.auth.updateUser({
            data: { currency_preference: newCurr }
        });
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) return;
    const { error } = await supabase.auth.updateUser({ data });
    if (error) {
        console.error("DEBUG: Error updating profile:", error);
    }
    // Note: onAuthStateChange will automatically update the user state
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const addTransaction = async (t: Omit<Transaction, "id" | "user_id">) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("transactions")
      .insert([{ ...t, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error("DEBUG: Error adding transaction:", error);
    } else if (data) {
      setTransactions((prev) => [data, ...prev]);
    }
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const getTotalWealth = () => {
    return transactions.reduce((acc, t) => {
      // Exclude income/expense benchmarks, but INCLUDE the initial wealth baseline
      if (t.description.includes("Benchmark")) return acc;
      if (t.description.includes("Expense Baseline")) return acc;
      
      if (t.type === 'income') return acc + (t.amount || 0);
      if (t.type === 'expense') return acc - (t.amount || 0); 
      return acc;
    }, 0);
  };

  const getActiveDebt = () => {
    return transactions
      .filter((t) => t.category === 'Debt' || t.description.includes("Obligations"))
      .reduce((acc, t) => acc + (t.amount || 0), 0);
  };

  const settleAllDebts = async () => {
    if (!user) return;
    const debtsToSettle = transactions.filter(t => t.is_shared && Number(t.owes_me || 0) > 0);
    if (debtsToSettle.length === 0) return;

    try {
      const { error } = await supabase
        .from("transactions")
        .update({ owes_me: 0 })
        .in("id", debtsToSettle.map(t => t.id));

      if (!error) {
        // Group by user to create history entries
        const groups: Record<string, number> = {};
        debtsToSettle.forEach(t => {
            const name = t.shared_with || "Shared Expense";
            groups[name] = (groups[name] || 0) + Number(t.owes_me || 0);
        });

        const paybackEntries = Object.entries(groups).map(([name, amount]) => ({
            user_id: user.id,
            description: `Payback from ${name}`,
            amount: amount,
            category: "Other" as Category,
            type: "income" as const,
            date: new Date().toISOString()
        }));

        if (paybackEntries.length > 0) {
            await supabase.from("transactions").insert(paybackEntries);
        }

        // Update local state
        setTransactions(prev => prev.map(t => 
          (t.is_shared && Number(t.owes_me || 0) > 0) ? { ...t, owes_me: 0 } : t
        ));

        await refreshData();
      }
    } catch (err) {
      console.error("Error settling debts:", err);
    }
  };

  const settleUserDebts = async (name: string) => {
    if (!user) return;
    
    // Group debts by user name or description
    const userDebts = transactions.filter(t => 
      t.is_shared && 
      (t.shared_with === name || (!t.shared_with && name === "Shared Expense")) && 
      Number(t.owes_me || 0) > 0
    );
    
    if (userDebts.length === 0) return;

    try {
      const { error } = await supabase
        .from("transactions")
        .update({ owes_me: 0 })
        .in("id", userDebts.map(t => t.id));

      if (!error) {
        // Calculate total settled to create an income entry
        const totalSettled = userDebts.reduce((acc, t) => acc + Number(t.owes_me || 0), 0);
        
        // Create an "Income" transaction representing the payback
        if (totalSettled > 0) {
            await supabase.from("transactions").insert([{
                user_id: user.id,
                description: `Payback from ${name}`,
                amount: totalSettled,
                category: "Other",
                type: "income",
                date: new Date().toISOString()
            }]);
        }

        setTransactions(prev => prev.map(t => {
          const isTarget = t.is_shared && (t.shared_with === name || (!t.shared_with && name === "Shared Expense")) && Number(t.owes_me || 0) > 0;
          return isTarget ? { ...t, owes_me: 0 } : t;
        }));
        
        // Refresh to see the new income entry
        await refreshData();
      }
    } catch (err) {
      console.error("Error settling user debts:", err);
    }
  };

  return (
    <FinancialContext.Provider value={{ 
      transactions, 
      loading, 
      user, 
      currency,
      setCurrency,
      formatCurrency,
      addTransaction, 
      deleteTransaction,
      updateProfile,
      refreshData,
      getTotalWealth,
      getActiveDebt,
      settleAllDebts,
      settleUserDebts,
      isSharedView,
      setIsSharedView
    }}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancialData() {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error("useFinancialData must be used within a FinancialProvider");
  }
  return context;
}
