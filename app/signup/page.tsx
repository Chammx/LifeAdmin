"use client";

import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  }

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <Link href="/" className="logo auth-logo">
          <span className="logo-mark">L</span>
          LifeAdmin
        </Link>

        <div className="auth-brand-content">
          <h1>Stop remembering everything yourself.</h1>
          <p>
            Create one private workspace for the administrative side of your
            life and let LifeAdmin help you stay ahead.
          </p>
        </div>

        <div className="auth-proof">
          <span className="auth-proof-dot" />
          Free to start • No credit card required
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form">
          <h2>Create your workspace</h2>
          <p>Start building your personal life administration system.</p>

          <form onSubmit={submit}>
            <div className="form-group">
              <label>Full name</label>
              <input
                className="input"
                type="text"
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email address</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <div className="input-wrap">
                <input
                  className="input password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  minLength={8}
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
              <UserPlus size={16} />
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <div className="demo-note">
            Demo mode is enabled. Connect Supabase authentication when you are
            ready for real accounts.
          </div>

          <div className="auth-switch">
            Already have an account?{" "}
            <Link href="/login">Sign in</Link>
          </div>

          <div className="auth-switch">
            <Link href="/">← Back to LifeAdmin</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
