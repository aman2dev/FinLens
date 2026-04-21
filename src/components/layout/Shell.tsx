"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion-variants";
import { cn } from "@/lib/utils";

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

export function Shell({ children, className }: ShellProps) {
  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={cn("relative flex min-h-screen flex-col overflow-hidden", className)}
    >
      {/* Premium Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-destructive/5 blur-[120px]" />
      </div>
      {children}
    </motion.main>
  );
}
