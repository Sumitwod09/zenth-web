import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenth — Execute, Don't Organize",
  description: "Execution-first productivity for ADHD minds. Capture thoughts, focus on one task, track progress. No folders, no tags, no friction.",
  keywords: ["ADHD", "productivity", "focus", "task management", "brain dump", "ADHD app"],
  openGraph: {
    title: "Zenth — Execute, Don't Organize",
    description: "Execution-first productivity for ADHD minds.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
