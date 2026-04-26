"use client";

import React from "react";
import { motion } from "framer-motion";
import { slideUp } from "@/lib/motion-variants";
import { ArrowUpRight, Cpu, Shield, Zap } from "lucide-react";

export function SpecsSection() {
  return (
    <section id="intelligence" className="py-32 bg-background border-t border-border/40">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-20">
            <div className="space-y-6">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <h2 className="font-heading text-5xl font-bold tracking-tighter sm:text-7xl">
                    Smart <br />
                    Simple.
                </h2>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-md pb-2">
                FinLens works in the background to keep your money safe and your tracking easy. 
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* Bento Card 1 - Large */}
            <motion.div 
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                whileHover={{ y: -5, scale: 1.01 }}
                viewport={{ once: true }}
                className="md:col-span-2 md:row-span-2 p-10 rounded-[2.5rem] bg-card/10 border border-border/40 flex flex-col justify-between group hover:bg-card/20 hover:border-primary/30 transition-all cursor-pointer overflow-hidden relative"
            >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                    <Cpu className="h-9 w-9 text-primary mb-8 transition-transform group-hover:rotate-12" />
                    <h3 className="text-3xl font-bold font-heading tracking-tight mb-4 text-foreground">Smart Tracking</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                        Our app finds patterns in your spending that you might miss, making it easy to see where your money goes.
                    </p>
                </div>
                <div className="relative z-10 mt-12 flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase group-hover:gap-3 transition-all">
                    Learn More <ArrowUpRight className="h-4 w-4" />
                </div>
            </motion.div>

            {/* Bento Card 2 */}
            <motion.div 
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true, delay: 0.1 }}
                className="p-8 rounded-[2.5rem] bg-card/10 border border-border/40 hover:bg-card/20 hover:border-primary/20 transition-all cursor-pointer relative group"
            >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                <Shield className="h-7 w-7 text-muted-foreground mb-6 transition-colors group-hover:text-primary relative z-10" />
                <h3 className="text-xl font-bold font-heading mb-3 relative z-10">Safe & Secure</h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                    Your data is locked and safe on every device.
                </p>
            </motion.div>

            {/* Bento Card 3 */}
            <motion.div 
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true, delay: 0.2 }}
                className="p-8 rounded-[2.5rem] bg-card/10 border border-border/40 hover:bg-card/20 hover:border-primary/20 transition-all cursor-pointer relative group"
            >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                <Zap className="h-7 w-7 text-muted-foreground mb-6 transition-colors group-hover:text-amber-400 relative z-10" />
                <h3 className="text-xl font-bold font-heading mb-3 relative z-10">Quick Sync</h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                    Instantly update your numbers across all your devices.
                </p>
            </motion.div>

            {/* Bento Card 4  */}
            <motion.div 
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                whileHover={{ y: -5, scale: 1.01 }}
                viewport={{ once: true, delay: 0.3 }}
                className="md:col-span-2 lg:col-span-2 p-8 rounded-[2.5rem] bg-card/10 border border-border/40 hover:bg-card/20 hover:border-primary/20 transition-all cursor-pointer flex items-center justify-between gap-6 relative group"
            >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                <div className="relative z-10">
                    <h3 className="text-xl font-bold font-heading mb-2">Global Currency</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Track your money in Dollars or Rupees easily.
                    </p>
                </div>
                <div className="h-16 w-32 bg-primary/10 rounded-2xl flex items-center justify-center font-heading font-bold text-primary text-2xl shadow-inner relative z-10 transition-transform group-hover:scale-110">
                    ₹ / $
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
