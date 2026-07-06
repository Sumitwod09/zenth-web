"use client";
import { useEffect, useRef } from "react";

export function CTA() {
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
    <section className="cta" id="waitlist" ref={sectionRef}>
      <div className="cta-card animate-in">
        <h2>Ready to stop planning and start doing?</h2>
        <p>Join the waitlist. Be the first to try Zenth when it launches.</p>
        <form className="cta-form" action="https://formspree.io/f/placeholder" method="POST" onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
          if (email) {
            alert(`Thanks! We'll notify ${email} when Zenth launches.`);
            form.reset();
          }
        }}>
          <input type="email" name="email" className="cta-input" placeholder="your@email.com" required />
          <button type="submit" className="cta-submit">Join Waitlist</button>
        </form>
      </div>
    </section>
  );
}
