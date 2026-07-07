"use client";
import { useEffect, useRef } from "react";

const steps = [
  { number: "1", title: "Dump it", description: "Open the app, type whatever is in your head, hit send. Done in under 3 seconds." },
  { number: "2", title: "Break it down", description: "Tap a dump to split it into concrete tasks. One line per task, no structure required." },
  { number: "3", title: "Focus on one", description: "Do Now Mode shows you a single task. Start a timer, block distractions, execute." },
  { number: "4", title: "Track your wins", description: "Check off completed tasks. Watch your daily progress ring fill up. Repeat." },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const el = sectionRef.current;
    if (el) el.querySelectorAll(".animate-in").forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="how-it-works" id="how-it-works" ref={sectionRef}>
      <p className="section-label animate-in">How It Works</p>
      <h2 className="section-title animate-in">Four steps. No learning curve.</h2>
      <p className="section-subtitle animate-in">From thought to done in under a minute.</p>
      <div className="steps animate-in">
        {steps.map((s, i) => (
          <div key={s.number} className="step">
            <div className="step-number">{s.number}</div>
            <div className="step-content">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
