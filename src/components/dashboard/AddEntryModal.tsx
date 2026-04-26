"use client";

import React, { useState } from "react";
import { 
  X, 
  DollarSign, 
  Tag, 
  Users as UsersIcon, 
  Utensils,
  Home,
  Zap,
  ShoppingBag,
  Ticket,
  HeartPulse,
  Car,
  CircleDollarSign,
  Landmark,
  Layers,
  Check,
  ChevronDown,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinancialData, Category } from "@/hooks/use-financial-data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const categoryConfigs: { label: Category; icon: any; color: string }[] = [
  { label: "Food & Dining", icon: Utensils, color: "text-orange-400" },
  { label: "Rent & Housing", icon: Home, color: "text-blue-400" },
  { label: "Utilities", icon: Zap, color: "text-yellow-400" },
  { label: "Shopping", icon: ShoppingBag, color: "text-pink-400" },
  { label: "Entertainment", icon: Ticket, color: "text-purple-400" },
  { label: "Health", icon: HeartPulse, color: "text-red-400" },
  { label: "Transport", icon: Car, color: "text-teal-400" },
  { label: "Debt", icon: Landmark, color: "text-destructive" },
  { label: "Assets", icon: CircleDollarSign, color: "text-primary" },
  { label: "Other", icon: Layers, color: "text-muted-foreground" },
];

export function AddEntryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addTransaction, currency } = useFinancialData();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food & Dining");
  const [isShared, setIsShared] = useState(false);
  const [sharedWith, setSharedWith] = useState("");
  const [owesMe, setOwesMe] = useState("");
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const selectedCategory = categoryConfigs.find(c => c.label === category) || categoryConfigs[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const finalAmount = Math.abs(parseFloat(amount));
    
    await addTransaction({
      description,
      amount: finalAmount,
      category,
      date: new Date().toISOString(),
      type,
      is_shared: isShared,
      owes_me: isShared ? parseFloat(owesMe) || 0 : 0,
      shared_with: isShared ? sharedWith : undefined
    });

    onClose();
    // Reset
    setDescription("");
    setAmount("");
    setOwesMe("");
    setSharedWith("");
    setIsShared(false);
    setType('expense');
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
            className="fixed left-[50%] top-[50%] z-[70] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-4 sm:p-6"
          >
            <div className="rounded-[2.5rem] border border-border/40 bg-card p-6 sm:p-10 shadow-2xl shadow-primary/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              
              <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-heading text-2xl font-bold">New Entry</h2>
                    <p className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-widest">Update your ledger</p>
                </div>
                <button onClick={onClose} className="rounded-full p-2 hover:bg-muted transition-colors border border-border/40">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Type Selector */}
              <div className="flex p-1.5 bg-muted/20 rounded-2xl mb-8 border border-border/40">
                <button 
                  type="button"
                  onClick={() => setType('expense')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all text-sm",
                    type === 'expense' ? "bg-destructive text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                   Expense
                </button>
                <button 
                  type="button"
                  onClick={() => setType('income')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all text-sm",
                    type === 'income' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                   Income
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">What is this for?</label>
                  <div className="relative group/input">
                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                    <input 
                      autoFocus
                      required
                      placeholder="e.g. Weekly Groceries"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-card border-2 border-border/60 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-primary/80 focus:ring-4 focus:ring-primary/5 transition-all font-bold shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Amount ({currency})</label>
                        <div className="relative group/input">
                            <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                            <input 
                                required
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-card border-2 border-border/60 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-primary/80 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-lg shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 relative">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                        <button 
                            type="button"
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="w-full bg-card border border-border/60 rounded-2xl py-5 px-6 flex items-center justify-between shadow-inner group hover:border-primary/40 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <selectedCategory.icon className={cn("h-5 w-5", selectedCategory.color)} />
                                <span className="font-bold text-sm">{selectedCategory.label}</span>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", isCategoryOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {isCategoryOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] bg-card border border-border/60 rounded-[2rem] p-3 shadow-2xl max-h-[250px] overflow-y-auto scrollbar-hide"
                                >
                                    <div className="grid grid-cols-1 gap-1">
                                        {categoryConfigs.map((config) => {
                                            const Icon = config.icon;
                                            const isActive = category === config.label;
                                            return (
                                                <button
                                                    key={config.label}
                                                    type="button"
                                                    onClick={() => {
                                                        setCategory(config.label);
                                                        setIsCategoryOpen(false);
                                                    }}
                                                    className={cn(
                                                        "flex items-center justify-between p-3 rounded-xl transition-all group/item",
                                                        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon className={cn("h-4 w-4", config.color)} />
                                                        <span className={cn("text-xs font-bold", !isActive && "text-muted-foreground font-semibold")}>
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                    {isActive && <Check className="h-3.5 w-3.5" />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center justify-between p-5 rounded-3xl bg-muted/10 border border-border/40 group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 transition-transform group-hover:scale-110">
                            <UsersIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Split this bill?</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Sharing with others</p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setIsShared(!isShared)}
                        className={cn(
                            "h-7 w-12 rounded-full transition-all relative border border-border/40 p-1",
                            isShared ? "bg-primary border-primary" : "bg-muted/50"
                        )}
                    >
                        <motion.div 
                            animate={{ x: isShared ? 20 : 0 }}
                            className="h-5 w-5 rounded-full bg-white shadow-sm"
                        />
                    </button>
                </div>

                {isShared && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                    >
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Friend's Name</label>
                           <div className="relative">
                               <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                               <input 
                                   required={isShared}
                                   placeholder="Who's paying?"
                                   value={sharedWith}
                                   onChange={(e) => setSharedWith(e.target.value)}
                                   className="w-full bg-primary/5 border border-primary/20 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-primary/40 transition-all font-bold shadow-inner text-sm"
                               />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Their Share ({currency})</label>
                           <div className="relative">
                               <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                               <input 
                                   required={isShared}
                                   type="number"
                                   step="0.01"
                                   placeholder="0.00"
                                   value={owesMe}
                                   onChange={(e) => setOwesMe(e.target.value)}
                                   className="w-full bg-primary/5 border border-primary/20 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-primary/40 transition-all font-bold shadow-inner text-sm"
                               />
                           </div>
                        </div>
                    </motion.div>
                )}

                <Button 
                    type="submit" 
                    className={cn(
                        "w-full h-18 rounded-3xl font-bold text-lg transition-all shadow-xl relative group overflow-hidden",
                        type === 'expense' 
                            ? "bg-destructive hover:bg-destructive shadow-destructive/20" 
                            : "bg-primary hover:bg-primary shadow-primary/20"
                    )}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        Save Entry
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
