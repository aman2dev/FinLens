"use client";

import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-destructive/5 blur-[120px] -translate-x-1/2 translate-y-1/2" />

      {/* Branding Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between border-r border-border/40 bg-card/20 p-12 lg:flex backdrop-blur-3xl">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_50%)]" />
        
        <Link href="/" className="group flex items-center gap-2 w-fit">
          <span className="font-heading text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            FinLens
          </span>
        </Link>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-widest"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Join the Elite Elite Cohort</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-heading text-6xl font-bold leading-[1.1]"
          >
            Your <span className="text-primary italic">Wealth</span> <br />
            Redefined.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md text-lg text-muted-foreground"
          >
            Enter a world where financial data becomes beautiful, actionable intelligence. Start your journey toward high-definition clarity today.
          </motion.p>
          
          <div className="grid grid-cols-2 gap-6 pt-12">
            {[
                { label: "5-Second", text: "Insights" },
                { label: "Zero-Friction", text: "Entry" }
            ].map((stat, i) => (
                <div key={i} className="space-y-1">
                    <p className="font-heading text-2xl font-bold text-primary">{stat.label}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{stat.text}</p>
                </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground font-medium">
          © 2026 FinLens Inc. All rights reserved.
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 lg:hidden">
                <ArrowLeft className="h-4 w-4" />
                Back to home
            </Link>
            <AuthForm type="signup" />
        </div>
      </div>
    </div>
  );
}
