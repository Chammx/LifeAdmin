"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CalendarClock,
  CheckCircle2,
  FileText,
  LockKeyhole,
  Search,
  Sparkles,
  WalletCards,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Everything in one place",
    text: "Keep warranties, policies, receipts, certificates and important files organized instead of scattered across folders.",
  },
  {
    icon: CalendarClock,
    title: "Never miss a deadline",
    text: "Track renewals, payments, expirations and important dates before they become problems.",
  },
  {
    icon: Brain,
    title: "AI that understands your life",
    text: "Ask natural questions about your documents and responsibilities instead of searching through folders.",
  },
  {
    icon: LockKeyhole,
    title: "Designed around privacy",
    text: "Your personal administration should stay personal. Build the system around controlled access and minimal data collection.",
  },
  {
    icon: Search,
    title: "Find things instantly",
    text: "Search by document, company, date, category or plain-language questions.",
  },
  {
    icon: WalletCards,
    title: "Understand recurring costs",
    text: "See subscriptions, upcoming payments and recurring commitments from one clean dashboard.",
  },
];

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="logo">
            <span className="logo-mark">L</span>
            LifeAdmin
          </Link>

          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#ai">AI Assistant</a>
            <a href="#how">How it works</a>
          </nav>

          <div className="header-actions">
            <Link href="/login" className="btn btn-secondary">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge">
              <span className="badge-dot" />
              Your personal life administration system
            </span>

            <h1>
              Your life has too many tabs.
              <br />
              <span className="gradient-text">LifeAdmin closes them.</span>
            </h1>

            <p className="hero-copy">
              One calm place for the documents, deadlines, subscriptions,
              warranties and everyday responsibilities that are easy to forget
              but important to remember.
            </p>

            <div className="hero-buttons">
              <Link href="/signup" className="btn btn-primary btn-large">
                Start for free
                <ArrowRight size={16} />
              </Link>

              <Link href="/dashboard" className="btn btn-secondary btn-large">
                View demo
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="product-preview"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="preview-window">
              <div className="preview-top">
                <span className="preview-dot" />
                <span className="preview-dot" />
                <span className="preview-dot" />
              </div>

              <div className="preview-content">
                <aside className="preview-side">
                  <div className="preview-side-title">LifeAdmin</div>
                  <div className="preview-nav active">Overview</div>
                  <div className="preview-nav">Documents</div>
                  <div className="preview-nav">Deadlines</div>
                  <div className="preview-nav">Payments</div>
                  <div className="preview-nav">AI Assistant</div>
                </aside>

                <div className="preview-main">
                  <h3>Good morning, Chammu</h3>
                  <p>Here&apos;s what needs your attention.</p>

                  <div className="preview-cards">
                    <div className="preview-card">
                      <span>DOCUMENTS</span>
                      <strong>24</strong>
                    </div>
                    <div className="preview-card">
                      <span>UPCOMING</span>
                      <strong>05</strong>
                    </div>
                    <div className="preview-card">
                      <span>SUBSCRIPTIONS</span>
                      <strong>08</strong>
                    </div>
                  </div>

                  <div className="preview-table">
                    <div className="preview-row">
                      <span>Insurance renewal</span>
                      <strong>3 days</strong>
                    </div>
                    <div className="preview-row">
                      <span>Car service</span>
                      <strong>12 days</strong>
                    </div>
                    <div className="preview-row">
                      <span>Internet bill</span>
                      <strong>18 days</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-heading">
          <span className="eyebrow">The system</span>
          <h2>All the boring important stuff, finally organized.</h2>
          <p>
            LifeAdmin turns scattered administration into one simple workflow.
            Less searching. Less remembering. Less mental overhead.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                className="feature-card"
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="feature-icon">
                  <Icon size={19} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="section" id="ai">
        <div className="ai-banner">
          <div>
            <span className="eyebrow">LifeAdmin AI</span>
            <h2>Ask your life instead of searching it.</h2>
            <p>
              “When does my insurance expire?” “Which subscriptions renew this
              month?” “Show me everything related to my car.”
            </p>

            <Link
              href="/assistant"
              className="btn btn-primary btn-large"
              style={{ marginTop: 18 }}
            >
              Try the AI assistant
              <Sparkles size={16} />
            </Link>
          </div>

          <div className="ai-chat-preview">
            <div className="chat-bubble user">
              What needs my attention this week?
            </div>
            <div className="chat-bubble ai">
              You have 2 important deadlines this week. Your insurance renewal
              is in 3 days and your internet payment is due Friday.
            </div>
            <div className="chat-bubble user">
              Anything I might forget?
            </div>
            <div className="chat-bubble ai">
              Your vehicle service is due in 12 days. I&apos;d add a reminder
              now so it doesn&apos;t sneak up on you.
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>Capture once. Stay organized automatically.</h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">01</div>
            <h3>Add your information</h3>
            <p>
              Upload a document, add a deadline, or record a recurring
              responsibility.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">02</div>
            <h3>LifeAdmin organizes it</h3>
            <p>
              Information is grouped by type, date, importance and relationship
              to other items.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">03</div>
            <h3>AI helps you act</h3>
            <p>
              Ask questions, discover forgotten responsibilities and get a
              clear picture of what needs attention.
            </p>
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="cta-box">
          <CheckCircle2
            size={30}
            color="#635bff"
            style={{ marginBottom: 12 }}
          />
          <h2>Make life administration boring again.</h2>
          <p>
            Start with a clean dashboard. Add your documents and deadlines.
            Let LifeAdmin handle the remembering.
          </p>
          <Link href="/signup" className="btn btn-primary btn-large">
            Create your LifeAdmin
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <span>© 2026 LifeAdmin</span>
          <span>Private by design.</span>
        </div>
      </footer>
    </main>
  );
}
