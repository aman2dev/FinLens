"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History as HistoryIcon,
  Search, 
  ChevronDown, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  ArrowRight,
  Tag,
  Clock,
  LayoutGrid,
  List,
  Check,
  FilterX
} from "lucide-react";
import { useFinancialData } from "@/hooks/use-financial-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const { transactions, deleteTransaction, formatCurrency } = useFinancialData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...Array.from(new Set(transactions.map(t => t.category)))];

  return (
    <div className="space-y-8 pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl shadow-primary/5">
                <HistoryIcon className="h-7 w-7" />
            </div>
            <div>
                <h1 className="font-heading text-4xl font-bold tracking-tight">Your History</h1>
                <p className="text-sm text-muted-foreground font-medium mt-1 uppercase tracking-wider">All your past spending and income</p>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search history..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 w-full md:w-64 bg-card/40 border border-border/40 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all shadow-inner"
                />
            </div>
            
            {/* Custom Filter */}
            <div className="relative">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                        "h-12 px-6 rounded-2xl border flex items-center gap-3 transition-all font-bold text-sm",
                        filterCategory !== "All" 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-card/40 border-border/40 text-muted-foreground hover:border-primary/40"
                    )}
                >
                    <Filter className={cn("h-4 w-4", filterCategory !== "All" ? "text-primary" : "text-muted-foreground")} />
                    {filterCategory}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isFilterOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isFilterOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-56 rounded-[2rem] bg-card/90 backdrop-blur-2xl border border-border/40 shadow-2xl p-3 z-50 overflow-hidden"
                            >
                                <div className="space-y-1">
                                    {categories.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setFilterCategory(c);
                                                setIsFilterOpen(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                                filterCategory === c 
                                                    ? "bg-primary/20 text-primary" 
                                                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                                            )}
                                        >
                                            {c}
                                            {filterCategory === c && <Check className="h-4 w-4" />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>

      {/* Stats Quickbar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
              { label: "Total Rows", value: transactions.length },
              { label: "Matching", value: filteredTransactions.length },
              { label: "Shared", value: transactions.filter(t => t.is_shared).length },
              { label: "Status", value: "Updated" }
          ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-muted/20 border border-border/40 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
              </div>
          ))}
      </div>

      {/* Ledger Feed */}
      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
            <AnimatePresence mode="popLayout">
                {filteredTransactions.map((t, idx) => (
                    <motion.div 
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-[2rem] bg-card/30 border border-border/40 hover:border-primary/20 hover:bg-card/40 transition-all shadow-lg backdrop-blur-sm relative overflow-hidden group">
                           <div className={cn(
                               "absolute left-0 top-0 bottom-0 w-1 transition-all",
                               t.type === 'income' ? "bg-primary/40 group-hover:bg-primary shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-destructive/40 group-hover:bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                           )} />

                            <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-0">
                                <div className={cn(
                                    "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shrink-0",
                                    t.type === 'income' ? "bg-primary/5 text-primary" : "bg-destructive/5 text-destructive"
                                )}>
                                    {t.type === 'income' ? <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" /> : <ArrowDownRight className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />}
                                </div>
                                <div className="space-y-1 min-w-0">
                                    <h3 className="text-base sm:text-lg font-bold group-hover:text-primary transition-all tracking-tight leading-tight truncate">
                                        {t.description}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            <Tag className="h-2.5 w-2.5" />
                                            {t.category}
                                        </div>
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            <Clock className="h-2.5 w-2.5" />
                                            {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
                                <div className="text-right flex-1 sm:flex-none">
                                    <p className={cn(
                                        "text-xl sm:text-2xl font-bold font-heading tracking-tight",
                                        t.type === 'income' ? "text-primary" : "text-destructive"
                                    )}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </p>
                                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">
                                        Saved
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={() => deleteTransaction(t.id)}
                                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center text-muted-foreground opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-destructive/5 hover:bg-destructive hover:text-white transition-all shadow-lg"
                                    title="Delete Entry"
                                >
                                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        ) : (
            <div className="flex flex-col items-center justify-center p-20 rounded-[3rem] border-2 border-dashed border-border/40 bg-card/10 text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground">
                    <FilterX className="h-10 w-10 opacity-20" />
                </div>
                <h3 className="text-xl font-bold font-heading">Nothing found</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">We couldn't find any entries that match your search.</p>
                <Button 
                    onClick={() => {
                        setSearchQuery("");
                        setFilterCategory("All");
                    }}
                    className="rounded-full px-8 font-bold gap-2"
                >
                    Clear Filters
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
