"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <motion.nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "border-b border-border/40 bg-background/60 py-3 backdrop-blur-md" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
            <div className="h-4 w-4 bg-background rounded-sm rotate-45" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            FinLens
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Features
          </Link>
          <Link href="#story" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Our Story
          </Link>
          <Link href="#specs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Specs
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hidden sm:block">
            Dashboard
          </Link>
          <Button className="rounded-full px-6 font-semibold">
            Get Pro
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
