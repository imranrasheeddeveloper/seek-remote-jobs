import express from "express";
import { v4 as uuidv4 } from "uuid";
import { exec } from "../db.js";
import { verifyToken } from "./auth.js";
import { tailorResumeForRemoteJob } from "../ai/groq.js";
import { compileTailoredResumePdf } from "../services/resumeCompiler.js";

const router = express.Router();

function buildJobContext(row) {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    sourceLabel: row.source_label,
    description: row.job_description || "",
    skillsRequired: row.skills_required || [],
    seniorityLevel: row.seniority_level || null,
    employmentType: row.employment_type || null,
  };
}

router.post("/tailor/:jobId", verifyToken, async (req, res) => {
  try {
    const { userResumeId } = req.body;

    const baselineResult = await exec(
      userResumeId
        ? `SELECT id, layout_schema, target_country FROM user_resumes WHERE id = $1 AND user_id = $2`
        : `SELECT id, layout_schema, target_country
           FROM user_resumes
           WHERE user_id = $1 AND is_active = TRUE
           ORDER BY updated_at DESC
           LIMIT 1`,
      userResumeId ? [userResumeId, req.userId] : [req.userId]
    );

    if (baselineResult.rows.length === 0) {
      return res.status(404).json({ error: "Baseline resume not found for user" });
    }

    const baseline = baselineResult.rows[0];

    const jobResult = await exec(
      `SELECT j.id, j.title, j.company, j.location, j.source_label,
              jd.job_description, jd.skills_required, jd.seniority_level, jd.employment_type
       FROM jobs j
       LEFT JOIN job_details jd ON jd.job_id = j.id
       WHERE j.id = $1`,
      [req.params.jobId]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    const jobContext = buildJobContext(jobResult.rows[0]);
    const tailoredSchema = await tailorResumeForRemoteJob(baseline.layout_schema, jobContext);

    const rewrittenBullets = (tailoredSchema.experience || [])
      .flatMap((entry) => (Array.isArray(entry.description) ? entry.description : []))
      .filter(Boolean);

    const fileName = `${req.userId}_${req.params.jobId}_${Date.now()}`;
    const compiledPdfPath = await compileTailoredResumePdf(tailoredSchema, fileName);

    const tailoredId = uuidv4();
    await exec(
      `INSERT INTO tailored_resumes (
        id, user_id, user_resume_id, job_id, rewritten_bullets, tailored_layout_schema, compiled_pdf_path, ai_model, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (user_id, user_resume_id, job_id)
      DO UPDATE SET
        rewritten_bullets = EXCLUDED.rewritten_bullets,
        tailored_layout_schema = EXCLUDED.tailored_layout_schema,
        compiled_pdf_path = EXCLUDED.compiled_pdf_path,
        ai_model = EXCLUDED.ai_model,
        created_at = NOW()`,
      [
        tailoredId,
        req.userId,
        baseline.id,
        req.params.jobId,
        JSON.stringify(rewrittenBullets),
        JSON.stringify(tailoredSchema),
        compiledPdfPath,
        process.env.GROQ_TAILOR_MODEL || "llama-3.1-8b-instant",
      ]
    );

    res.json({
      success: true,
      data: {
        userResumeId: baseline.id,
        jobId: req.params.jobId,
        targetCountry: baseline.target_country,
        rewrittenBullets,
        tailoredLayoutSchema: tailoredSchema,
        compiledPdfPath,
      },
    });
  } catch (error) {
    console.error("Tailor resume error:", error);
    res.status(500).json({ error: "Failed to tailor resume for this job" });
  }
});

export default router;
