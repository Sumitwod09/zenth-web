"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Brain, Zap, BarChart3, Settings, Sparkles } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Brain Dump", icon: Brain },
  { href: "/dashboard/do-now", label: "Do Now", icon: Zap },
  { href: "/dashboard/tracker", label: "Tracker", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar" id="sidebar-nav">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo-icon">
              <Sparkles size={20} strokeWidth={1.8} />
            </div>
            <span className="sidebar-logo-text">Zenth</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                id={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <item.icon size={20} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "sidebar-avatar",
              },
            }}
          />
        </div>
      </aside>

      {/* Mobile Bottom Tabs */}
      <nav className="mobile-tabs" id="mobile-tabs-nav">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-tab ${isActive ? "active" : ""}`}
            >
              <item.icon size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
