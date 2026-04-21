"use client";

import React from "react";
import { motion } from "framer-motion";
import { staggerContainer, slideUp } from "@/lib/motion-variants";
import { TrendingUp, Shield, BarChart3, Cloud } from "lucide-react";

const features = [
  {
    title: "Real-time Tracking",
    desc: "Instant updates for every transaction with high-fidelity visualization.",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "primary"
  },
  {
    title: "OLED Precision",
    desc: "Optimized for infinite contrast. Deep blacks meet vibrant emerald greens.",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "primary"
  },
  {
    title: "Bank-Grade Security",
    desc: "End-to-end encryption for all your financial data and credentials.",
    icon: <Shield className="h-6 w-6" />,
    color: "primary"
  },
  {
    title: "Seamless Cloud Sync",
    desc: "Access your dashboard anywhere, anytime, across all premium devices.",
    icon: <Cloud className="h-6 w-6" />,
    color: "primary"
  }
];

export function SpecsSection() {
  return (
    <section id="specs" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-20 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">Technical Specifications</h2>
            <p className="mt-4 text-muted-foreground">Premium features built for those who demand excellence.</p>
        </div>

        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={slideUp}
              className="group relative rounded-2xl border border-border/50 bg-card/30 p-8 transition-all hover:border-primary/50 hover:bg-card/50"
            >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    {f.icon}
                </div>
                <h3 className="mb-2 font-heading text-xl font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                
                {/* Micro-interaction highlight */}
                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
