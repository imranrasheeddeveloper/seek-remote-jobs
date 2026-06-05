import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleAuthButton } from "../components/GoogleAuthButton";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Signing up with email:", email);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      console.log("📦 Signup response:", res.status, data);

      if (!res.ok) {
        setError(data.error || "Signup failed");
        console.error("❌ Signup failed:", data.error);
        return;
      }

      // Save tokens
      console.log("💾 Saving tokens to localStorage");
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("✅ Tokens saved. AccessToken:", data.accessToken?.substring(0, 20) + "...");

      console.log("🚀 Navigating to /dashboard");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left side - Brand */}
        <div className="auth-brand">
          <div className="auth-logo-wrap">
            <svg viewBox="0 0 24 24" fill="none" className="auth-logo">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="url(#grad)" />
              <path d="M8 15.5l3-3 2 2 3.5-3.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="grad" x1="3" y1="3" x2="22" y2="22">
                  <stop stopColor="#4f46e5" />
                  <stop offset="1" stopColor="#0284c7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>SeekRemoteJobs</h1>
          <p>AI-Powered Resume Builder & Job Matching</p>
          <div className="auth-benefits">
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span>Upload & optimize your resume with AI</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span>Get ATS-ready scores & recommendations</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span>Match with 1000+ remote jobs</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span>AI-generated personalized cover letters</span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-form-wrap">
          <div className="auth-form">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Join thousands of job seekers using AI to land remote roles</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength="6"
                  required
                  disabled={loading}
                />
                <small>Must be at least 6 characters</small>
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={loading}
                />
                I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>

              <button type="submit" className="btn-primary btn-block" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="auth-divider">Or sign up with</div>

            <GoogleAuthButton
              onError={(err) => setError(err)}
              mode="signup"
            />

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
