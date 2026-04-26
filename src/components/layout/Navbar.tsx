"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-[500] w-full transition-all duration-300",
        isScrolled 
          ? "border-b border-border/40 bg-background/80 py-3 backdrop-blur-xl shadow-lg" 
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-12">
        <Link href="/" className="group flex items-center gap-2 shrink-0">
          <span className="font-heading text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            FinLens
          </span>
        </Link>

        {/* Right: Auth */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/auth/login" className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary">
            Sign In
          </Link>
          <Link href="/auth/signup">
            <Button className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95">
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
