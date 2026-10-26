"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarClock,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Settings,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Documents", href: "/dashboard#documents", icon: FileText },
  { label: "Deadlines", href: "/dashboard#deadlines", icon: CalendarClock },
  { label: "Payments", href: "/dashboard#payments", icon: WalletCards },
  { label: "AI Assistant", href: "/assistant", icon: Sparkles },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function logout() {
    router.push("/");
  }

  return (
    <div className="app-layout">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">
          <Link href="/" className="logo">
            <span className="logo-mark">L</span>
            LifeAdmin
          </Link>
        </div>

        <div className="sidebar-section-label">Workspace</div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/assistant"
                ? pathname === "/assistant"
                : pathname === "/dashboard";

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`sidebar-link ${active ? "active" : ""}`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-section-label" style={{ marginTop: 28 }}>
          Account
        </div>

        <nav className="sidebar-nav">
          <button className="sidebar-link">
            <Settings size={17} />
            Settings
          </button>

          <button className="sidebar-link" onClick={logout}>
            <X size={17} />
            Log out
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-mini">
            <div className="avatar">C</div>
            <div className="profile-info">
              <strong>Chammu</strong>
              <span>Personal workspace</span>
            </div>
            <ChevronRight size={14} color="#aaa" />
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>

          <div className="top-search">
            <Search size={15} />
            <input placeholder="Search your life administration..." />
            <span style={{ fontSize: 10 }}>⌘ K</span>
          </div>

          <div className="top-actions">
            <button className="icon-button" title="Notifications">
              <Bell size={16} />
            </button>
            <button className="icon-button" title="Appearance">
              <Moon size={16} />
            </button>
            <div className="avatar">C</div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
