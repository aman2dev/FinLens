"use client";

import React, { useState } from "react";
import { X, DollarSign, Tag, Calendar, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinancialData, Category } from "@/hooks/use-financial-data";
import { motion, AnimatePresence } from "framer-motion";

const categories: Category[] = [
  "Food & Dining",
  "Rent & Housing",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Health",
  "Transport",
  "Other"
];

export function AddEntryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addTransaction } = useFinancialData();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food & Dining");
  const [isShared, setIsShared] = useState(false);
  const [owesMe, setOwesMe] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    addTransaction({
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
      isShared,
      owesMe: isShared ? parseFloat(owesMe) || 0 : undefined
    });

    onClose();
    // Reset
    setDescription("");
    setAmount("");
    setOwesMe("");
    setIsShared(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-[50%] top-[50%] z-[70] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-6"
          >
            <div className="rounded-3xl border border-border/40 bg-card p-8 shadow-2xl shadow-primary/10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading text-2xl font-bold">New Financial Record</h2>
                <button onClick={onClose} className="rounded-full p-2 hover:bg-muted transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Entity / Description</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      autoFocus
                      required
                      placeholder="e.g. Whole Foods Market"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-muted/30 border border-border/40 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/40 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Volume (USD)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input 
                                required
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-muted/30 border border-border/40 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/40 transition-all font-medium"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Categorization</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                            className="w-full bg-muted/30 border border-border/40 rounded-2xl py-4 px-4 outline-none focus:border-primary/40 transition-all font-medium appearance-none cursor-pointer"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/20">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <UsersIcon className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Shared Liability</p>
                            <p className="text-[10px] text-muted-foreground">Split entry with others</p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setIsShared(!isShared)}
                        className={cn(
                            "h-6 w-11 rounded-full transition-all relative",
                            isShared ? "bg-primary" : "bg-muted"
                        )}
                    >
                        <div className={cn(
                            "h-4 w-4 rounded-full bg-white absolute top-1 transition-all",
                            isShared ? "left-6" : "left-1"
                        )} />
                    </button>
                </div>

                {isShared && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                    >
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Receivables (Owes You)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <input 
                                type="number"
                                step="0.01"
                                placeholder="How much do they owe you?"
                                value={owesMe}
                                onChange={(e) => setOwesMe(e.target.value)}
                                className="w-full bg-primary/5 border border-primary/20 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/40 transition-all font-medium"
                            />
                        </div>
                    </motion.div>
                )}

                <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20">
                    Finalize Entry
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
