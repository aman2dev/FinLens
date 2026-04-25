"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export type Category = 
  | "Food & Dining" 
  | "Rent & Housing" 
  | "Utilities" 
  | "Shopping" 
  | "Entertainment" 
  | "Health" 
  | "Transport" 
  | "Other";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  isShared: boolean;
  totalSharedAmount?: number;
  owesMe?: number;
  user_id?: string;
}

interface FinancialContextType {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  isSharedView: boolean;
  setIsSharedView: (v: boolean) => void;
  getTotalWealth: () => number;
  getActiveDebt: () => number;
  getMonthlySavings: () => number;
  user: User | null;
  loading: boolean;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSharedView, setIsSharedView] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [user]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data || []);
    }
  };

  const addTransaction = async (t: Omit<Transaction, "id">) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...t, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error adding transaction:", error);
    } else if (data) {
      setTransactions((prev) => [data, ...prev]);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting transaction:", error);
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const getTotalWealth = () => {
    return 42500 + transactions.reduce((acc, t) => acc - t.amount, 0);
  };

  const getActiveDebt = () => {
    return transactions
      .filter((t) => t.isShared && t.owesMe)
      .reduce((acc, t) => acc + (t.owesMe || 0), 0);
  };

  const getMonthlySavings = () => {
    return 3100;
  };

  return (
    <FinancialContext.Provider 
      value={{ 
        transactions, 
        addTransaction, 
        deleteTransaction, 
        isSharedView, 
        setIsSharedView,
        getTotalWealth,
        getActiveDebt,
        getMonthlySavings,
        user,
        loading
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancialData() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error("useFinancialData must be used within a FinancialProvider");
  }
  return context;
}
