import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary" />
              <span className="font-heading text-lg font-bold">FinLens</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Master your financial destiny with premium debt visualization and sophisticated tracking tools.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Features</Link></li>
              <li><Link href="#" className="hover:text-primary">Dashboard</Link></li>
              <li><Link href="#" className="hover:text-primary">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">About</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border/10 pt-8 text-center text-xs text-muted-foreground">
          © 2026 FinLens. Competing in Kalyug.js. Built with passion.
        </div>
      </div>
    </footer>
  );
}
