"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Tag, 
  ChevronDown,
  Clock
} from "lucide-react";
import { useFinancialData } from "@/hooks/use-financial-data";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { transactions, removeTransaction } = useFinancialData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(transactions.map((t) => t.category)))];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 sm:space-y-8 pb-32 md:pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Transaction Ledger</h1>
          <p className="text-muted-foreground mt-1 text-sm">Reviewing your high-definition financial history.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Search ledger..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full bg-card/20 border border-border/40 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:border-primary/40 transition-all font-medium"
                />
            </div>
            <div className="relative w-full sm:w-auto overflow-hidden">
                <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="h-11 w-full bg-card/20 border border-border/40 rounded-2xl px-4 text-sm focus:outline-none focus:border-primary/40 appearance-none pr-10 font-bold cursor-pointer transition-all"
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/40 bg-card/20 overflow-hidden backdrop-blur-sm">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Entity & Date</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Volume</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Liability</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              <AnimatePresence mode="popLayout">
                {filteredTransactions.map((t) => (
                    <motion.tr 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={t.id} 
                        className="group hover:bg-muted/10 transition-colors"
                    >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                            t.isShared ? "bg-primary/10 text-primary" : "bg-muted/30 text-muted-foreground"
                        )}>
                            {t.isShared ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{t.description}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                            {new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/30 border border-border/40 text-[11px] font-bold">
                            <Tag className="h-3 w-3" />
                            {t.category}
                        </span>
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-heading font-bold">
                        ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="p-5">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        t.isShared ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/10 border-border/40 text-muted-foreground"
                      )}>
                        {t.isShared ? "SHARED" : "PERSONAL"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                        <button 
                            onClick={() => removeTransaction(t.id)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border/40">
            <AnimatePresence mode="popLayout">
                {filteredTransactions.map((t) => (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={t.id} 
                        className="p-5 space-y-4 bg-muted/5"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                                    t.isShared ? "bg-primary/10 text-primary" : "bg-muted/30 text-muted-foreground"
                                )}>
                                    {t.isShared ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold truncate max-w-[150px]">{t.description}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                        {new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-heading font-bold">
                                    ${t.amount.toLocaleString()}
                                </p>
                                <button 
                                    onClick={() => removeTransaction(t.id)}
                                    className="text-[10px] font-bold text-destructive uppercase tracking-widest mt-1"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted/30 border border-border/40 text-[10px] font-bold">
                                <Tag className="h-3 w-3" />
                                {t.category}
                            </span>
                            <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                t.isShared ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/10 border-border/40 text-muted-foreground"
                            )}>
                                {t.isShared ? "SHARED" : "PERSONAL"}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
        
        {filteredTransactions.length === 0 && (
            <div className="p-16 sm:p-20 text-center">
                <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <h3 className="font-heading font-bold text-xl">No records found</h3>
                <p className="text-muted-foreground text-sm mt-1">Refine your search or log a new entry.</p>
            </div>
        )}
      </div>
    </div>
  );
}
