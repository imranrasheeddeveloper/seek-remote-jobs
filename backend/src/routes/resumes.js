import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { processResumeFile, extractSkillsFromText, calculateYearsOfExperience } from "../services/resumeParser.js";
import { optimizeResumeForATS, calculateATSScore, recommendJobMatches } from "../ai/groq.js";
import { generateCoverLetter, extractJobKeywords } from "../ai/gemini.js";
import { calculateJobMatch, rankJobMatches } from "../services/jobMatcher.js";
import { exec } from "../db.js";
import { verifyToken } from "./auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, _file, cb) => {
    cb(null, `${uuidv4()}_${Date.now()}.pdf`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = express.Router();

/**
 * Upload and process resume PDF
 * POST /api/resumes/upload
 */
router.post("/upload", verifyToken, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📄 Processing resume:", req.file.originalname, "Size:", req.file.size);
    
    let processedResume;
    try {
      processedResume = await processResumeFile(req.file);
    } catch (parseError) {
      console.error("❌ Resume parsing failed:", parseError.message);
      return res.status(400).json({ error: "Failed to parse resume: " + parseError.message });
    }
    
    const parsedJson = processedResume.parsedJson;

    console.log("📋 Extracted data:");
    console.log("  Name:", parsedJson.personal?.name || "N/A");
    console.log("  Email:", parsedJson.personal?.email || "N/A");
    console.log("  Skills:", parsedJson.skills?.length || 0);
    console.log("  Experience:", parsedJson.experience?.length || 0);
    console.log("  Education:", parsedJson.education?.length || 0);

    // Extract skills from raw text as well
    const extractedSkills = extractSkillsFromText(processedResume.rawText);
    if (!parsedJson.skills || parsedJson.skills.length === 0) {
      parsedJson.skills = extractedSkills;
    }

    // Calculate years of experience
    const yearsOfExperience = calculateYearsOfExperience(parsedJson);

    // Use authenticated user ID from token
    const userId = req.userId;

    // Store resume in database
    const resumeId = uuidv4();
    console.log("💾 Saving resume to database:", resumeId);
    await exec(
      `INSERT INTO resumes (id, user_id, original_filename, file_path, parsed_json, raw_text, country_template)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        resumeId,
        userId,
        req.file.originalname,
        req.file.path,
        JSON.stringify(parsedJson),
        processedResume.rawText,
        req.body.country || "us",
      ]
    );

    console.log("✅ Resume saved successfully");
    res.json({
      success: true,
      resumeId,
      userId,
      parsedData: {
        ...parsedJson,
        yearsOfExperience,
        extractedSkills,
      },
      processingStatus: "completed",
    });
  } catch (error) {
    console.error("❌ Resume Upload Error:", error);
    console.error("Stack:", error.stack);
    const errorMsg = error?.message || "Unknown error occurred";
    res.status(500).json({ 
      error: errorMsg,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

/**
 * Get resume details
 * GET /api/resumes/:resumeId
 */
router.get("/:resumeId", verifyToken, async (req, res) => {
  try {
    const result = await exec(
      `SELECT * FROM resumes WHERE id = $1`,
      [req.params.resumeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const resume = result.rows[0];
    res.json({
      id: resume.id,
      filename: resume.original_filename,
      parsedData: resume.parsed_json,
      rawText: resume.raw_text,
      createdAt: resume.created_at,
    });
  } catch (error) {
    console.error("Get Resume Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Optimize resume for specific job
 * POST /api/resumes/:resumeId/optimize
 */
router.post("/:resumeId/optimize", verifyToken, async (req, res) => {
  try {
    const { jobId, jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: "jobDescription is required" });
    }

    // Get resume
    const resumeResult = await exec(
      `SELECT parsed_json, raw_text FROM resumes WHERE id = $1`,
      [req.params.resumeId]
    );

    if (resumeResult.rows.length === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const resumeData = resumeResult.rows[0].parsed_json;

    // Extract job keywords
    const jobKeywords = await extractJobKeywords(jobDescription);

    // Optimize resume bullets
    const currentBullets = resumeData.experience
      ?.flatMap((e) => e.description || [])
      .filter(Boolean) || [];

    const optimizedBullets = await optimizeResumeForATS(
      currentBullets,
      jobDescription
    );

    // Calculate ATS score
    const atsScore = await calculateATSScore(resumeData, jobKeywords);

    // Store optimization history
    const historyId = uuidv4();
    await exec(
      `INSERT INTO optimization_history (id, resume_id, job_id, original_content, optimized_content, optimization_type, improvements)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        historyId,
        req.params.resumeId,
        jobId || "direct",
        JSON.stringify(currentBullets),
        JSON.stringify(optimizedBullets),
        "ats_optimization",
        atsScore.recommendations || [],
      ]
    );

    // Store ATS score
    if (jobId) {
      await exec(
        `INSERT INTO ats_scores (id, resume_id, job_id, score, keyword_density, readability_score, formatting_score, recommendations)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (resume_id, job_id) DO UPDATE SET
           score = EXCLUDED.score,
           keyword_density = EXCLUDED.keyword_density,
           readability_score = EXCLUDED.readability_score,
           formatting_score = EXCLUDED.formatting_score,
           recommendations = EXCLUDED.recommendations`,
        [
          uuidv4(),
          req.params.resumeId,
          jobId,
          atsScore.overallScore || 0,
          atsScore.keywordMatchScore || 0,
          atsScore.readabilityScore || 0,
          atsScore.formattingScore || 0,
          JSON.stringify(atsScore.recommendations || []),
        ]
      );
    }

    res.json({
      resumeId: req.params.resumeId,
      optimizedBullets,
      atsScore,
      jobKeywords,
      recommendations: atsScore.recommendations,
    });
  } catch (error) {
    console.error("Resume Optimization Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate cover letter
 * POST /api/resumes/:resumeId/cover-letter
 */
router.post("/:resumeId/cover-letter", verifyToken, async (req, res) => {
  try {
    const { jobId, jobTitle, companyName, jobDescription } = req.body;

    if (!jobDescription || !companyName) {
      return res
        .status(400)
        .json({ error: "jobDescription and companyName are required" });
    }

    // Get resume
    const resumeResult = await exec(
      `SELECT parsed_json FROM resumes WHERE id = $1`,
      [req.params.resumeId]
    );

    if (resumeResult.rows.length === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const resumeData = resumeResult.rows[0].parsed_json;

    // Generate cover letter
    const coverLetter = await generateCoverLetter(
      resumeData,
      jobDescription,
      companyName
    );

    // Store cover letter
    if (jobId) {
      await exec(
        `INSERT INTO cover_letters (id, resume_id, job_id, content, template_used)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (resume_id, job_id) DO UPDATE SET content = EXCLUDED.content`,
        [uuidv4(), req.params.resumeId, jobId, coverLetter, "standard"]
      );
    }

    res.json({
      resumeId: req.params.resumeId,
      jobId: jobId || null,
      coverLetter,
      jobTitle,
      companyName,
    });
  } catch (error) {
    console.error("Cover Letter Generation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Match resume against jobs
 * POST /api/resumes/:resumeId/match-jobs
 */
router.post("/:resumeId/match-jobs", verifyToken, async (req, res) => {
  try {
    const { limit = 20 } = req.body;

    // Get resume
    const resumeResult = await exec(
      `SELECT parsed_json FROM resumes WHERE id = $1`,
      [req.params.resumeId]
    );

    if (resumeResult.rows.length === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const resumeData = resumeResult.rows[0].parsed_json;

    // Get recent jobs
    const jobsResult = await exec(
      `SELECT j.id, j.title, j.company, j.location, j.url,
              jd.skills_required, jd.seniority_level, jd.min_salary, jd.max_salary
       FROM jobs j
       LEFT JOIN job_details jd ON j.id = jd.job_id
       ORDER BY j.updated_at DESC
       LIMIT $1`,
      [limit]
    );

    const jobs = jobsResult.rows.map((row) => ({
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      url: row.url,
      requiredSkills: row.skills_required || [],
      seniorityLevel: row.seniority_level,
      minSalary: row.min_salary,
      maxSalary: row.max_salary,
      isRemote: (row.location || "").toLowerCase().includes("remote"),
    }));

    // Calculate matches
    const matches = rankJobMatches(resumeData, jobs);

    // Store matches in database
    for (const match of matches.slice(0, 10)) {
      await exec(
        `INSERT INTO job_matches (id, resume_id, job_id, match_score, skill_match_score, experience_match_score, location_match_score, salary_match_score, missing_keywords, matched_keywords, rank)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (resume_id, job_id) DO UPDATE SET
           match_score = EXCLUDED.match_score,
           rank = EXCLUDED.rank`,
        [
          uuidv4(),
          req.params.resumeId,
          match.jobId,
          match.overallScore,
          match.skillMatchScore,
          match.experienceMatchScore,
          match.locationMatchScore,
          match.salaryMatchScore,
          JSON.stringify(match.missingKeywords),
          JSON.stringify(match.matchedKeywords),
          match.rank,
        ]
      );
    }

    res.json({
      resumeId: req.params.resumeId,
      totalMatches: matches.length,
      topMatches: matches.slice(0, 10),
      summary: {
        excellentMatches: matches.filter((m) => m.overallScore >= 80).length,
        goodMatches: matches.filter((m) => m.overallScore >= 60 && m.overallScore < 80)
          .length,
        possibleMatches: matches.filter((m) => m.overallScore >= 40 && m.overallScore < 60)
          .length,
      },
    });
  } catch (error) {
    console.error("Match Jobs Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get match history for resume
 * GET /api/resumes/:resumeId/matches
 */
router.get("/:resumeId/matches", verifyToken, async (req, res) => {
  try {
    const result = await exec(
      `SELECT jm.*, j.title, j.company, j.location
       FROM job_matches jm
       JOIN jobs j ON jm.job_id = j.id
       WHERE jm.resume_id = $1
       ORDER BY jm.match_score DESC
       LIMIT 20`,
      [req.params.resumeId]
    );

    res.json({
      resumeId: req.params.resumeId,
      matches: result.rows,
    });
  } catch (error) {
    console.error("Get Matches Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
