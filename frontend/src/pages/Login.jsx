import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleAuthButton } from "../components/GoogleAuthButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Save tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleId: response.credential,
          email: response.email,
          name: response.name,
          profilePictureUrl: response.picture,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Google login failed");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed");
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
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn-primary btn-block" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="auth-divider">Or continue with</div>

            <GoogleAuthButton
              onError={(err) => setError(err)}
              mode="login"
            />

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
