"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
}

interface FinancialContextType {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  isSharedView: boolean;
  setIsSharedView: (v: boolean) => void;
  getTotalWealth: () => number;
  getActiveDebt: () => number;
  getMonthlySavings: () => number;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSharedView, setIsSharedView] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("finlens_transactions");
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("finlens_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, "id">) => {
    const newTransaction = { ...t, id: Math.random().toString(36).substring(2, 11) };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const getTotalWealth = () => {
    // Basic mock wealth + sum of non-debt transactions
    return 42500 + transactions.reduce((acc, t) => acc - t.amount, 0);
  };

  const getActiveDebt = () => {
    return transactions
      .filter((t) => t.isShared && t.owesMe)
      .reduce((acc, t) => acc + (t.owesMe || 0), 0);
  };

  const getMonthlySavings = () => {
    // Mock logic for demo
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
        getMonthlySavings
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
