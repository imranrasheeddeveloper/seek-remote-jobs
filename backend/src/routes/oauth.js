/**
 * OAuth Routes - Google Sign In / Sign Up
 * Integrates Google OAuth 2.0 for seamless authentication
 */
import express from "express";
import jwt from "jsonwebtoken";
import { exec } from "../db.js";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI || "http://localhost:5173/auth/callback";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production";

/**
 * POST /api/oauth/google-callback
 * Handle Google OAuth token exchange and user creation/login
 */
router.post("/google-callback", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ error: "Google OAuth not configured" });
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error("Token exchange failed:", error);
      return res.status(400).json({ error: "Failed to exchange authorization code" });
    }

    const { access_token } = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userInfoResponse.ok) {
      return res.status(400).json({ error: "Failed to fetch user info" });
    }

    const googleUser = await userInfoResponse.json();
    const { email, name, picture, id: googleId } = googleUser;

    if (!email) {
      return res.status(400).json({ error: "Email not provided by Google" });
    }

    // Check if user exists by email
    const existingUserResult = await exec("SELECT id, email FROM users WHERE email = $1", [email]);
    let userId;

    if (existingUserResult.rows.length === 0) {
      // Create new user from Google OAuth
      userId = uuidv4();
      const randomPassword = Math.random().toString(36).slice(-12);
      const hashedPassword = bcryptjs.hashSync(randomPassword, 10);

      await exec(
        "INSERT INTO users (id, email, name, password_hash, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())",
        [userId, email, name || email.split("@")[0], hashedPassword]
      );
    } else {
      // User exists, use their ID
      userId = existingUserResult.rows[0].id;
    }

    // Generate JWT tokens (match auth.js format with userId)
    const accessToken = jwt.sign(
      { userId },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { userId },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Get user data to return
    const userResult = await exec("SELECT id, email, name FROM users WHERE id = $1", [userId]);
    const userData = userResult.rows[0];

    // Return tokens and user data
    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
      },
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

/**
 * GET /api/oauth/google-auth-url
 * Generate Google OAuth authorization URL for frontend
 */
router.get("/google-auth-url", (req, res) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: "Google OAuth not configured" });
  }

  const scope = encodeURIComponent("openid email profile");
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&access_type=offline` +
    `&prompt=consent`;

  res.json({ authUrl });
});

export default router;
