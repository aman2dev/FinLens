"use client";

import React from "react";
import { motion } from "framer-motion";
import { slideUp, fadeIn } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]"
        >
          <Sparkles className="h-4 w-4" />
          <span>Kalyug.js 2026 Submission</span>
        </motion.div>

        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
          className="mx-auto max-w-4xl font-heading text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl"
        >
          See Your <span className="text-primary italic">Wealth</span>, <br /> 
          Visualize Your <span className="text-destructive">Debt</span>.
        </motion.h1>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
          className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          The premiere platform for sophisticated financial clarity. FinLens brings high-definition precision to your personal economy.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button size="lg" className="h-14 rounded-full px-8 text-lg font-bold group">
            Launch Dashboard
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-lg font-bold">
            Watch Story
          </Button>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20"
        >
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-2 backdrop-blur-sm shadow-2xl">
            <div className="aspect-[16/9] w-full rounded-xl bg-black overflow-hidden relative border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-destructive/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/30 font-heading text-4xl font-bold uppercase tracking-widest rotate-[-15deg]">
                    FinLens Preview
                </div>
            </div>
          </div>
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />
        </motion.div>
      </div>
    </section>
  );
}
