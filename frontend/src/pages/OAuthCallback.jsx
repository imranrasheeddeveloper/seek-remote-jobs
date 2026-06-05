/**
 * OAuthCallback - Handles Google OAuth redirect
 * This component exchanges the authorization code for tokens
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        console.log("🔐 OAuth callback received with code:", code?.substring(0, 20) + "...");

        if (!code) {
          const errorCode = searchParams.get("error");
          const errorDescription = searchParams.get("error_description");
          throw new Error(errorDescription || errorCode || "No authorization code received");
        }

        // Exchange code for tokens
        console.log("🔄 Exchanging code for tokens...");
        const response = await fetch("/api/oauth/google-callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Token exchange failed:", errorData);
          throw new Error(errorData.error || "Token exchange failed");
        }

        const { accessToken, refreshToken, user } = await response.json();
        console.log("✅ Got tokens:", accessToken?.substring(0, 20) + "...", "User:", user);

        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("💾 Tokens saved to localStorage");

        // Redirect to dashboard
        console.log("🚀 Redirecting to /dashboard");
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("❌ OAuth callback error:", err);
        setError(err.message || "Authentication failed");
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {loading && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              gap: "0.4rem",
              marginBottom: "1rem",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "10px",
                  height: "10px",
                  background: "#4f46e5",
                  borderRadius: "50%",
                  animation: `dot-bounce 0.6s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <p style={{ color: "#64748b", fontSize: "1rem" }}>Completing sign in...</p>
        </div>
      )}

      {error && (
        <div
          style={{
            textAlign: "center",
            maxWidth: "400px",
            padding: "2rem",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ color: "#0f172a", marginBottom: "0.5rem" }}>Sign In Failed</h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>{error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>
        </div>
      )}

      <style>{`
        @keyframes dot-bounce {
          from {
            transform: translateY(0);
            opacity: 0.6;
          }
          to {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default OAuthCallback;
