import { ArrowRight, ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-badge">
        <span>New</span> Built for ADHD minds
      </div>
      <h1>
        Think it.<br />
        <span className="accent">Do it.</span>
      </h1>
      <p className="hero-subtitle">
        Zenth removes the gap between thinking and doing. Capture a thought, focus on one task, track your wins. No folders, no tags, no friction.
      </p>
      <div className="hero-actions">
        <a href="#waitlist" className="btn-primary">
          Join the Waitlist <ArrowRight size={18} />
        </a>
        <a href="#features" className="btn-secondary">
          See How It Works <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}
