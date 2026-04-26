"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function StorytellingSection() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.3], [0.8, 1]);

  return (
    <section ref={containerRef} id="story" className="py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
            style={{ opacity, scale }}
            className="rounded-[3rem] border border-border/40 bg-gradient-to-b from-card/50 to-transparent p-6 sm:p-12 md:p-24 text-center"
        >
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                Philosophy in <span className="text-primary italic">Motion</span>
            </h2>
            <p className="mx-auto max-w-3xl text-sm sm:text-base md:text-xl text-muted-foreground leading-relaxed">
                We believe that financial health isn&apos;t just about numbers—it&apos;s about perspective. 
                FinLens was born from a desire to turn the terrifying reality of debt into 
                manageable, visual stories that empower people to reclaim their financial legacy.
            </p>
            
            <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 md:gap-16">
                <div className="text-center">
                    <div className="font-heading text-5xl md:text-6xl font-bold text-primary">72%</div>
                    <p className="text-[10px] md:text-sm text-muted-foreground mt-2 font-bold uppercase tracking-[0.2em]">Better Clarity</p>
                </div>
                <div className="text-center">
                    <div className="font-heading text-5xl md:text-6xl font-bold text-destructive">0.02s</div>
                    <p className="text-[10px] md:text-sm text-muted-foreground mt-2 font-bold uppercase tracking-[0.2em]">Lag Latency</p>
                </div>
                <div className="text-center">
                    <div className="font-heading text-5xl md:text-6xl font-bold">100%</div>
                    <p className="text-[10px] md:text-sm text-muted-foreground mt-2 font-bold uppercase tracking-[0.2em]">Privacy First</p>
                </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
}
