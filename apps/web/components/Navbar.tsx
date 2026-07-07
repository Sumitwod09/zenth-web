"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Show } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <div className="navbar-logo-icon">
          <Sparkles size={18} strokeWidth={1.8} />
        </div>
        <span className="navbar-name">Zenth</span>
      </div>
      <Show when="signed-out">
        <Link href="/sign-in" className="navbar-cta">
          Get Started <ArrowRight size={16} />
        </Link>
      </Show>
      <Show when="signed-in">
        <Link href="/dashboard" className="navbar-cta">
          Open App <ArrowRight size={16} />
        </Link>
      </Show>
    </nav>
  );
}
