import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "../db.js";
import { sendWelcomeEmail } from "../services/emailService.js";
import { processResumeFile, extractSkillsFromText } from "../services/resumeParser.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-change-in-production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baselineUploadDir = path.join(__dirname, "../../uploads/baseline");

if (!fs.existsSync(baselineUploadDir)) {
  fs.mkdirSync(baselineUploadDir, { recursive: true });
}

const baselineUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, baselineUploadDir),
    filename: (_req, file, cb) => cb(null, `${uuid()}_${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`),
  }),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
      return;
    }
    cb(new Error("Only PDF files are allowed"), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Helper: Create JWT tokens
function createTokens(userId) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

async function createLocalUser({ email, password, name }) {
  // Legacy DB compatibility: older installs may miss auth columns/tables.
  await exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)");
  await exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255)");
  await exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()");
  await exec(`
    CREATE TABLE IF NOT EXISTS user_subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      newsletter_enabled BOOLEAN DEFAULT TRUE,
      job_alerts_enabled BOOLEAN DEFAULT TRUE,
      alert_frequency VARCHAR(50) DEFAULT 'weekly',
      alert_skills TEXT[],
      alert_companies TEXT[],
      alert_min_salary INTEGER,
      last_alert_sent TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const existingUser = await exec("SELECT id FROM users WHERE email = $1", [email]);
  if (existingUser.rows.length > 0) {
    throw new Error("USER_EXISTS");
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const userId = uuid();

  await exec(
    "INSERT INTO users (id, email, name, password_hash) VALUES ($1, $2, $3, $4)",
    [userId, email, name, passwordHash]
  );

  await exec(
    "INSERT INTO user_subscriptions (id, user_id) VALUES ($1, $2)",
    [uuid(), userId]
  );

  return { userId, email, name };
}

// Middleware: Verify JWT token
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

// POST /api/auth/signup - Register with email
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const { userId } = await createLocalUser({ email, password, name });

    // Create tokens
    const { accessToken, refreshToken } = createTokens(userId);

  // Send welcome email (async, don't wait)
  sendWelcomeEmail(email, name).catch(console.error);

    res.json({
      success: true,
      user: { id: userId, email, name },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.message === "USER_EXISTS") {
      return res.status(400).json({ error: "User already exists" });
    }
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

// POST /api/auth/signup-with-resume - Register and extract baseline resume once
router.post("/signup-with-resume", baselineUpload.single("resume"), async (req, res) => {
  try {
    const { email, password, name, target_country: targetCountry = "us" } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Baseline resume PDF is required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const { userId } = await createLocalUser({ email, password, name });

    // Run one-time baseline extraction (Gemini Vision + text parse)
    const processed = await processResumeFile(req.file);
    const layoutSchema = processed.parsedJson;
    const primarySkillTags = extractSkillsFromText(processed.rawText).slice(0, 20);

    const userResumeId = uuid();
    await exec(
      `INSERT INTO user_resumes (
        id, user_id, baseline_pdf_path, layout_schema, raw_text, target_country, primary_skill_tags, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, NOW(), NOW())`,
      [
        userResumeId,
        userId,
        req.file.path,
        JSON.stringify(layoutSchema),
        processed.rawText,
        String(targetCountry).toLowerCase(),
        primarySkillTags,
      ]
    );

    const { accessToken, refreshToken } = createTokens(userId);
    sendWelcomeEmail(email, name).catch(console.error);

    res.json({
      success: true,
      user: { id: userId, email, name },
      baselineResume: {
        id: userResumeId,
        targetCountry: String(targetCountry).toLowerCase(),
        primarySkillTags,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.message === "USER_EXISTS") {
      return res.status(400).json({ error: "User already exists" });
    }

    console.error("Signup with resume error:", error);
    res.status(500).json({ error: "Signup with baseline extraction failed" });
  }
});

// POST /api/auth/login - Login with email
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const userResult = await exec("SELECT id, email, name, password_hash FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    // Verify password
    const passwordValid = bcrypt.compareSync(password, user.password_hash || "");
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create tokens
    const { accessToken, refreshToken } = createTokens(user.id);

    res.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/auth/google - Google OAuth login/signup
router.post("/google", async (req, res) => {
  try {
    const { googleId, email, name, profilePictureUrl } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ error: "Google ID and email are required" });
    }

    // Check if user exists
    let userResult = await exec("SELECT id, email, name FROM users WHERE google_id = $1", [googleId]);

    let user;
    if (userResult.rows.length > 0) {
      // User exists, just update profile picture
      user = userResult.rows[0];
      if (profilePictureUrl) {
        await exec("UPDATE users SET profile_picture_url = $1, updated_at = NOW() WHERE id = $2", [
          profilePictureUrl,
          user.id,
        ]);
      }
    } else {
      // Check if email exists
      userResult = await exec("SELECT id FROM users WHERE email = $1", [email]);
      if (userResult.rows.length > 0) {
        // Email exists, link Google ID
        const existingUser = userResult.rows[0];
        await exec("UPDATE users SET google_id = $1, profile_picture_url = $2, updated_at = NOW() WHERE id = $3", [
          googleId,
          profilePictureUrl,
          existingUser.id,
        ]);
        user = { id: existingUser.id, email, name };
      } else {
        // Create new user
        const userId = uuid();
        await exec(
          "INSERT INTO users (id, email, name, google_id, profile_picture_url, email_verified, email_verified_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, TRUE, NOW(), NOW(), NOW())",
          [userId, email, name, googleId, profilePictureUrl]
        );

        // Create subscription preferences
        await exec(
          "INSERT INTO user_subscriptions (id, user_id, newsletter_enabled, job_alerts_enabled, alert_frequency) VALUES ($1, $2, $3, $4, $5)",
          [uuid(), userId, true, true, "weekly"]
        );

        user = { id: userId, email, name };
      }
    }

    // Create tokens
    const { accessToken, refreshToken } = createTokens(user.id);

    res.json({
      success: true,
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
});

// POST /api/auth/refresh - Refresh access token
router.post("/refresh", (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = createTokens(decoded.userId);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
});

// GET /api/auth/me - Get current user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userResult = await exec("SELECT id, email, name, phone, profile_picture_url FROM users WHERE id = $1", [
      req.userId,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    // Get subscription preferences
    const subResult = await exec("SELECT * FROM user_subscriptions WHERE user_id = $1", [req.userId]);
    const subscription = subResult.rows[0] || {};

    res.json({ user, subscription });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

// PUT /api/auth/profile - Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, phone, bio } = req.body;

    await exec("UPDATE users SET name = $1, phone = $2, bio = $3, updated_at = NOW() WHERE id = $4", [
      name,
      phone,
      bio,
      req.userId,
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// PUT /api/auth/password - Change password
router.put("/password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }

    // Get user
    const userResult = await exec("SELECT password_hash FROM users WHERE id = $1", [req.userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    // Verify current password
    const passwordValid = bcrypt.compareSync(currentPassword, user.password_hash || "");
    if (!passwordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const newPasswordHash = bcrypt.hashSync(newPassword, 10);

    await exec("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [newPasswordHash, req.userId]);

    res.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// PUT /api/auth/subscriptions - Update subscription preferences
router.put("/subscriptions", verifyToken, async (req, res) => {
  try {
    const { newsletter_enabled, job_alerts_enabled, alert_frequency, alert_skills, alert_companies, alert_min_salary } =
      req.body;

    await exec(
      `UPDATE user_subscriptions 
       SET newsletter_enabled = $1, job_alerts_enabled = $2, alert_frequency = $3, 
           alert_skills = $4, alert_companies = $5, alert_min_salary = $6, updated_at = NOW() 
       WHERE user_id = $7`,
      [newsletter_enabled, job_alerts_enabled, alert_frequency, alert_skills, alert_companies, alert_min_salary, req.userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Update subscriptions error:", error);
    res.status(500).json({ error: "Failed to update subscriptions" });
  }
});

export default router;
