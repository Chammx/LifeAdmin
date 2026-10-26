"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarClock,
  Car,
  FilePlus2,
  FileText,
  Home,
  Plus,
  Receipt,
  Sparkles,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/app-shell";

const deadlines = [
  {
    title: "Insurance renewal",
    detail: "Car insurance",
    date: "3 days",
    icon: ShieldIcon,
    tone: "date-red",
  },
  {
    title: "Internet payment",
    detail: "Monthly bill",
    date: "6 days",
    icon: Receipt,
    tone: "date-orange",
  },
  {
    title: "Vehicle service",
    detail: "Hyundai • Scheduled maintenance",
    date: "12 days",
    icon: Car,
    tone: "date-green",
  },
  {
    title: "Rent payment",
    detail: "Home",
    date: "18 days",
    icon: Home,
    tone: "date-green",
  },
];

function ShieldIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 20 6v5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <main className="dashboard-content">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Good morning,</h1>
            <p>Here&apos;s what needs your attention today.</p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/documents")}
          >
            <Plus size={16} />
            Add something
          </button>
        </motion.div>

        <section className="stats-grid">
          <Stat
            icon={<FileText size={16} />}
            label="Documents"
            value="24"
            meta="+3 this month"
          />

          <Stat
            icon={<CalendarClock size={16} />}
            label="Upcoming"
            value="05"
            meta="2 need attention"
          />

          <Stat
            icon={<WalletCards size={16} />}
            label="Subscriptions"
            value="08"
            meta="₹4,290 / month"
          />

          <Stat
            icon={<Sparkles size={16} />}
            label="AI insights"
            value="03"
            meta="New recommendations"
          />
        </section>

        <section className="dashboard-grid">
          <div className="panel" id="deadlines">
            <div className="panel-header">
              <h3>Upcoming deadlines</h3>
              <span>Next 30 days</span>
            </div>

            <div className="deadline-list">
              {deadlines.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    className="deadline-item"
                    key={item.title}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="deadline-icon">
                      <Icon size={17} />
                    </div>

                    <div className="deadline-info">
                      <strong>{item.title}</strong>
                      <span>{item.detail}</span>
                    </div>

                    <div className={`deadline-date ${item.tone}`}>
                      {item.date}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="panel ai-card">
            <div className="panel-header">
              <h3>LifeAdmin AI</h3>
              <span>Assistant</span>
            </div>

            <p className="ai-summary">
              I found a few things worth looking at. You have two upcoming
              deadlines and one recurring payment that may need attention.
            </p>

            <div className="ai-suggestion">
              <strong>Insurance renewal</strong>
              <span>Due in 3 days</span>
            </div>

            <div className="ai-suggestion">
              <strong>Review subscriptions</strong>
              <span>Potential monthly saving opportunity</span>
            </div>

            <Link
              href="/assistant"
              className="btn btn-primary"
              style={{ marginTop: 12, width: "100%" }}
            >
              Ask LifeAdmin AI
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>

        <section className="quick-actions" id="documents">
          <button
            className="quick-action"
            onClick={() => (window.location.href = "/documents")}
          >
            <div className="quick-action-icon">
              <FilePlus2 size={20} />
            </div>
            <strong>Add document</strong>
            <span>Upload a receipt, policy or certificate.</span>
          </button>

          <button
            className="quick-action"
            onClick={() => alert("Reminder creation will be connected next.")}
          >
            <div className="quick-action-icon">
              <CalendarClock size={20} />
            </div>
            <strong>Create reminder</strong>
            <span>Never miss a renewal or payment.</span>
          </button>

          <Link className="quick-action" href="/assistant">
            <div className="quick-action-icon">
              <Sparkles size={20} />
            </div>
            <strong>Ask AI</strong>
            <span>Ask questions about your life administration.</span>
          </Link>
        </section>

        <section className="panel" id="payments" style={{ marginTop: 15 }}>
          <div className="panel-header">
            <h3>Recent activity</h3>
            <span>Updated just now</span>
          </div>

          <div className="deadline-list">
            <div className="deadline-item">
              <div className="deadline-icon">
                <FileText size={17} />
              </div>
              <div className="deadline-info">
                <strong>Car insurance policy added</strong>
                <span>Documents • Today</span>
              </div>
              <ArrowUpRight size={15} color="#999" />
            </div>

            <div className="deadline-item">
              <div className="deadline-icon">
                <Receipt size={17} />
              </div>
              <div className="deadline-info">
                <strong>Internet bill recorded</strong>
                <span>Payments • Yesterday</span>
              </div>
              <ArrowUpRight size={15} color="#999" />
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function Stat({
  icon,
  label,
  value,
  meta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  meta: string;
}) {
  return (
    <motion.div
      className="stat-card"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="stat-card-top">
        <span>{label}</span>
        <div className="stat-icon">{icon}</div>
      </div>

      <div className="stat-number">{value}</div>
      <div className="stat-meta">{meta}</div>
    </motion.div>
  );
}
