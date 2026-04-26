import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-20 relative overflow-hidden">
      {/* Decorative gradient for a premium feel */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4 items-start">
          <div className="col-span-2 space-y-6">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="font-heading text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">FinLens</span>
            </Link>
            <p className="max-w-xs text-base text-muted-foreground leading-relaxed">
              Master your money with simple tracking and quiet intelligence. Built for those who demand excellence.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-foreground">Product</h4>
            <ul className="space-y-3 text-sm font-medium text-muted-foreground">
              <li><Link href="#specs" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/auth/login" className="hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-foreground">Company</h4>
            <ul className="space-y-3 text-sm font-medium text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <p>© 2026 FinLens. Competing in Kalyug. Built with passion.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors underline decoration-primary/20 underline-offset-4">Twitter</Link>
            <Link href="#" className="hover:text-primary transition-colors underline decoration-primary/20 underline-offset-4">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
