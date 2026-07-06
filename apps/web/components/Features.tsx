"use client";
import { useEffect, useRef } from "react";
import { Brain, Zap, Timer, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Brain Dump",
    description: "One tap to capture any thought. No categories, no tags, no decisions. Just type and submit.",
  },
  {
    icon: Zap,
    title: "Do Now Mode",
    description: "See exactly one task. Mark it done or skip it. Zero list paralysis, zero scrolling.",
  },
  {
    icon: Timer,
    title: "Focus Mode",
    description: "Start a timer. Block everything else out. 10 to 25 minutes of protected execution time.",
  },
  {
    icon: BarChart3,
    title: "Daily Tracker",
    description: "See what you did today at a glance. Progress ring, checkboxes, no complex dashboards.",
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const el = sectionRef.current;
    if (el) {
      el.querySelectorAll(".animate-in").forEach((child) => observer.observe(child));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className="features" id="features" ref={sectionRef}>
      <p className="section-label animate-in">Core Features</p>
      <h2 className="section-title animate-in">Everything you need. Nothing you don&apos;t.</h2>
      <p className="section-subtitle animate-in">
        Four tools, zero setup. Each one solves a specific ADHD bottleneck.
      </p>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={f.title} className="feature-card animate-in" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="feature-icon">
              <f.icon size={24} strokeWidth={1.8} />
            </div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
