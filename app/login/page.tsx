"use client";

import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  }

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <Link href="/" className="logo auth-logo">
          <span className="logo-mark">L</span>
          LifeAdmin
        </Link>

        <div className="auth-brand-content">
          <h1>Your life. One calm command center.</h1>
          <p>
            Keep your documents, deadlines, subscriptions and responsibilities
            organized without keeping everything in your head.
          </p>
        </div>

        <div className="auth-proof">
          <span className="auth-proof-dot" />
          Built around privacy and simplicity
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form">
          <h2>Welcome back</h2>
          <p>Sign in to continue to your LifeAdmin workspace.</p>

          <form onSubmit={submit}>
            <div className="form-group">
              <label>Email address</label>
              <div className="input-wrap">
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  className="input password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              <LockKeyhole size={16} />
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="demo-note">
            Demo mode is enabled. The form currently opens the dashboard. Real
            authentication can be connected to Supabase next.
          </div>

          <div className="auth-switch">
            Don&apos;t have an account?{" "}
            <Link href="/signup">Create one</Link>
          </div>

          <div className="auth-switch">
            <Link href="/">← Back to LifeAdmin</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
