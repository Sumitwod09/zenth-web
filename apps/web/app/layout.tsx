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

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <html lang="en">
        <body style={{ 
          backgroundColor: "#0f0f12", 
          color: "#f2f2f5", 
          fontFamily: "'Space Grotesk', 'Inter', sans-serif", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          height: "100vh", 
          margin: 0, 
          padding: "20px", 
          boxSizing: "border-box", 
          textAlign: "center" 
        }}>
          <div style={{ 
            background: "#1a1a1f", 
            border: "1px solid #2a2a30", 
            padding: "40px 30px", 
            borderRadius: "14px", 
            maxWidth: "500px", 
            boxShadow: "0 0 30px rgba(124, 92, 255, 0.15)" 
          }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              background: "rgba(124, 92, 255, 0.12)",
              borderRadius: "50%",
              color: "#7c5cff",
              fontSize: "28px",
              marginBottom: "20px"
            }}>
              ✓
            </div>
            <h1 style={{ color: "#f2f2f5", margin: "0 0 12px 0", fontFamily: "Space Grotesk, sans-serif", fontSize: "24px" }}>
              Zenth Deployed Successfully!
            </h1>
            <p style={{ color: "#9a9aa5", fontSize: "14px", lineHeight: "1.6", margin: "0 0 24px 0" }}>
              Your web application has been built and hosted on Vercel. To enable authentication and start using the app, you need to configure your Clerk environment variables.
            </p>
            <div style={{ 
              textAlign: "left", 
              background: "#0f0f12", 
              padding: "16px", 
              borderRadius: "8px", 
              border: "1px solid #2a2a30", 
              fontSize: "13px", 
              fontFamily: "monospace", 
              margin: "0 0 24px 0" 
            }}>
              <div style={{ color: "#ef4444", marginBottom: "8px", fontWeight: "bold" }}>⚠️ Configuration Required:</div>
              <div style={{ color: "#9a9aa5" }}>• NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</div>
              <div style={{ color: "#9a9aa5" }}>• CLERK_SECRET_KEY</div>
            </div>
            <p style={{ color: "#9a9aa5", fontSize: "13px", margin: 0, lineHeight: "1.5" }}>
              Add these keys in your Vercel project under <strong>Settings &gt; Environment Variables</strong>, then trigger a redeploy.
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <ClerkProvider publishableKey={publishableKey}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
