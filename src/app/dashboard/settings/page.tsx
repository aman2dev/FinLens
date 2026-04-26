"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Shield, 
  Moon, 
  ChevronRight,
  Check,
  Download,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useFinancialData } from "@/hooks/use-financial-data";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user, updateProfile, transactions } = useFinancialData();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.user_metadata?.full_name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  // Functional toggles (local state for now)
  const [performanceMode, setPerformanceMode] = useState(true);
  const [highDensity, setHighDensity] = useState(true);

  const handleUpdateName = async () => {
    setIsUpdating(true);
    setMessage(null);
    try {
      await updateProfile({ full_name: newName });
      setMessage({ type: "success", text: "Profile updated successfully" });
      setIsEditingName(false);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setIsUpdating(false);
    }
  };

  const exportData = () => {
    const headers = ["Date", "Description", "Category", "Amount", "Is Shared"];
    const csvContent = [
      headers.join(","),
      ...transactions.map(t => [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`,
        t.category,
        t.amount,
        t.isShared
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `finlens_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl space-y-12 pb-24">
      <div className="space-y-2">
        <h1 className="font-heading text-4xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground">Orchestrate your personal financial environment.</p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "p-4 rounded-2xl border flex items-center gap-3 text-sm font-medium",
              message.type === "success" 
                ? "bg-primary/10 border-primary/20 text-primary" 
                : "bg-destructive/10 border-destructive/20 text-destructive"
            )}
          >
            {message.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-12">
        {/* Profile Section */}
        <section className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="font-heading text-xl font-bold text-foreground">Profile Information</h2>
              <p className="text-sm text-muted-foreground">Manage your public identity and credentials.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border/40 bg-card/20 overflow-hidden divide-y divide-border/40">
            <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="space-y-1 flex-1 mr-4">
                <p className="text-sm font-bold text-foreground">Display Name</p>
                {isEditingName ? (
                  <input 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full max-w-sm bg-muted/50 border border-border/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-xs text-muted-foreground font-medium">{user?.user_metadata?.full_name || "Not set"}</p>
                )}
              </div>
              <div className="flex gap-2">
                {isEditingName ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingName(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleUpdateName} disabled={isUpdating}>
                      {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)}>Edit</Button>
                )}
              </div>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Primary Email</p>
                <p className="text-xs text-muted-foreground font-medium">{user?.email}</p>
              </div>
              <Button variant="ghost" size="sm" disabled className="opacity-50">Locked</Button>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Moon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="font-heading text-xl font-bold text-foreground">Experience</h2>
              <p className="text-sm text-muted-foreground">Customize how the dashboard feels and responds.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border/40 bg-card/20 overflow-hidden divide-y divide-border/40">
             <button 
                onClick={() => setPerformanceMode(!performanceMode)}
                className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
             >
                <div className="space-y-1 text-left">
                  <p className="text-sm font-bold text-foreground">Performance Mode</p>
                  <p className="text-xs text-muted-foreground font-medium">{performanceMode ? "High Contrast & Speed" : "Standard Visuals"}</p>
                </div>
                <div className={cn("h-6 w-11 rounded-full p-1 transition-colors", performanceMode ? 'bg-primary' : 'bg-muted')}>
                    <div className={cn("h-4 w-4 rounded-full bg-white transition-transform", performanceMode ? 'translate-x-5' : 'translate-x-0')} />
                </div>
             </button>
             <button 
                onClick={() => setHighDensity(!highDensity)}
                className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
             >
                <div className="space-y-1 text-left">
                  <p className="text-sm font-bold text-foreground">Compact Density</p>
                  <p className="text-xs text-muted-foreground font-medium">{highDensity ? "Maximum Data Visibility" : "Spacious Layout"}</p>
                </div>
                <div className={cn("h-6 w-11 rounded-full p-1 transition-colors", highDensity ? 'bg-primary' : 'bg-muted')}>
                    <div className={cn("h-4 w-4 rounded-full bg-white transition-transform", highDensity ? 'translate-x-5' : 'translate-x-0')} />
                </div>
             </button>
          </div>
        </section>

        {/* Data Management Section */}
        <section className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="font-heading text-xl font-bold text-foreground">Data Management</h2>
              <p className="text-sm text-muted-foreground">Securely manage and export your financial history.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border/40 bg-card/20 overflow-hidden divide-y divide-border/40">
            <button 
                onClick={exportData}
                className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors group"
            >
              <div className="space-y-1 text-left">
                <p className="text-sm font-bold text-foreground">Export Financial Data</p>
                <p className="text-xs text-muted-foreground font-medium">Download all transactions as .CSV</p>
              </div>
              <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors group cursor-not-allowed">
              <div className="space-y-1">
                <p className="text-sm font-bold text-destructive">Delete All Hierarchy</p>
                <p className="text-xs text-muted-foreground font-medium">Permanently wipe all financial records</p>
              </div>
              <ChevronRight className="h-5 w-5 text-destructive/40" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
