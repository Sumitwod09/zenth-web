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
        <p>Zenth is ready. Start executing your thoughts today.</p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 2 }}>
          <button className="btn-primary" onClick={() => alert("Downloading Android APK...")}>
            Download for Android
          </button>
          <button className="btn-secondary" onClick={() => alert("iOS version coming soon!")}>
            Download for iOS
          </button>
        </div>
      </div>
    </section>
  );
}
