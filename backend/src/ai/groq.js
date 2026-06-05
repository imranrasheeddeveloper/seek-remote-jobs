import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function extractJsonObject(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No JSON object found in model response");
  }
  return JSON.parse(match[0]);
}

export function buildRemoteTailorPrompt({ baselineResume, jobContext }) {
  const baseline = JSON.stringify(baselineResume);
  const job = JSON.stringify(jobContext);

  return `You are an expert remote recruiter and ATS writer.

TASK:
Rewrite only resume summary + experience bullet text for this target role.

PRIORITIES (strict):
1) Integrate explicit remote-work signals: asynchronous communication, documentation-first delivery, ownership, cross-time-zone collaboration, self-direction, stakeholder updates.
2) Integrate hard technical keywords from the target role (languages, frameworks, cloud, tooling) without keyword stuffing.
3) Preserve facts and measurable outcomes. Do not fabricate tools, employers, impact metrics, or tenure.
4) Keep bullet style concise and ATS-friendly.

BASELINE_RESUME_JSON:
${baseline}

TARGET_JOB_JSON:
${job}

OUTPUT RULES:
- Return ONLY valid JSON (no markdown).
- Keep the same top-level schema as BASELINE_RESUME_JSON.
- Do not delete sections.
- Rewrite only summary and experience[].description.
- Also return metadata in a top-level key named tailoringMeta.

Expected output shape:
{
  ...baseline schema...,
  "tailoringMeta": {
    "remoteKeywordsUsed": ["async", "distributed", "timezone overlap"],
    "techKeywordsUsed": ["node.js", "postgresql"],
    "qualityChecks": ["no_fabrication", "ats_readable"]
  }
}`;
}

/**
 * Optimize resume bullets for ATS using Groq Llama
 * @param {Array<string>} bullets - Original resume bullets
 * @param {string} jobDescription - Target job description
 * @returns {Promise<Array<string>>} - ATS-optimized bullets
 */
export async function optimizeResumeForATS(bullets, jobDescription) {
  try {
    const prompt = `You are an ATS optimization expert. Rewrite these resume bullets to match the job description while maintaining authenticity.

Original Bullets:
${bullets.map((b) => `- ${b}`).join("\n")}

Target Job Description:
${jobDescription}

Requirements:
1. Keep 80-90 character line length for ATS readability
2. Use action verbs (Implemented, Designed, Developed, etc.)
3. Incorporate high-priority keywords from the job description
4. Maintain quantifiable metrics where present
5. Preserve truthfulness - don't fabricate achievements

Return ONLY a JSON array of optimized bullets (no markdown):
["bullet1", "bullet2", "bullet3"]`;

    const message = await client.messages.create({
      model: "llama-3.1-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Groq ATS Optimization Error:", error);
    throw new Error(`Failed to optimize resume: ${error.message}`);
  }
}

/**
 * Calculate ATS compatibility score
 * @param {Object} resumeData - Parsed resume data
 * @param {Object} jobKeywords - Extracted job keywords
 * @returns {Promise<Object>} - ATS score and analysis
 */
export async function calculateATSScore(resumeData, jobKeywords) {
  try {
    const resumeText = JSON.stringify(resumeData);
    const jobKeywordsText = JSON.stringify(jobKeywords);

    const prompt = `Analyze ATS compatibility between resume and job posting.

Resume Data:
${resumeText}

Job Requirements:
${jobKeywordsText}

Rate on:
1. Keyword match (0-100)
2. Experience alignment (0-100)
3. Formatting compliance (0-100)
4. Readability (0-100)

Return ONLY JSON (no markdown):
{
  "overallScore": number (0-100),
  "keywordMatchScore": number,
  "experienceScore": number,
  "formattingScore": number,
  "readabilityScore": number,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3", "keyword4"],
  "recommendations": ["tip1", "tip2"],
  "passScore": boolean
}`;

    const message = await client.messages.create({
      model: "llama-3.1-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Groq ATS Score Error:", error);
    throw new Error(`Failed to calculate ATS score: ${error.message}`);
  }
}

/**
 * Generate job match recommendations
 * @param {Object} resumeData - Parsed resume data
 * @param {Array<Object>} jobListings - Array of job listings
 * @returns {Promise<Array<Object>>} - Ranked job matches with recommendations
 */
export async function recommendJobMatches(resumeData, jobListings) {
  try {
    const resumeSummary = `
Skills: ${resumeData.skills?.join(", ")}
Experience: ${resumeData.experience?.map((e) => e.position).join(", ")}
Years: ${resumeData.experience?.length || 0}
Education: ${resumeData.education?.map((e) => e.degree).join(", ")}
    `.trim();

    const jobsSummary = jobListings
      .slice(0, 10)
      .map(
        (j, i) =>
          `Job ${i + 1}: ${j.title} at ${j.company} - Requirements: ${j.description?.substring(0, 200)}`
      )
      .join("\n");

    const prompt = `Match resume to job listings and rank them.

Resume Profile:
${resumeSummary}

Job Listings:
${jobsSummary}

For each job, score:
1. Skill alignment (0-100)
2. Experience match (0-100)
3. Career progression fit (0-100)

Return ONLY JSON array (no markdown):
[
  {
    "jobIndex": 0,
    "skillMatch": number,
    "experienceMatch": number,
    "fitScore": number,
    "recommendation": "strong match|moderate match|learning opportunity",
    "strengths": ["strength1"],
    "gaps": ["gap1"]
  }
]`;

    const message = await client.messages.create({
      model: "llama-3.1-70b-versatile",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Groq Job Match Error:", error);
    throw new Error(`Failed to recommend job matches: ${error.message}`);
  }
}

/**
 * Rewrite a baseline resume for a remote role and return the full tailored schema.
 * @param {Object} baselineResume - Baseline schema from user_resumes.layout_schema
 * @param {Object} jobContext - Job context from crawler DB
 * @returns {Promise<Object>} - Tailored resume schema + metadata
 */
export async function tailorResumeForRemoteJob(baselineResume, jobContext) {
  try {
    const prompt = buildRemoteTailorPrompt({ baselineResume, jobContext });

    const message = await client.messages.create({
      model: process.env.GROQ_TAILOR_MODEL || "llama-3.1-8b-instant",
      max_tokens: 4096,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    return extractJsonObject(responseText);
  } catch (error) {
    console.error("Groq Tailor Error:", error);
    throw new Error(`Failed to tailor resume for role: ${error.message}`);
  }
}

/**
 * Generate interview preparation tips
 * @param {Object} resumeData - Parsed resume data
 * @param {Object} jobData - Job description and requirements
 * @returns {Promise<Object>} - Interview tips and talking points
 */
export async function generateInterviewTips(resumeData, jobData) {
  try {
    const prompt = `Generate interview preparation tips for this candidate.

Resume Experience:
${resumeData.experience
  ?.slice(0, 2)
  .map((e) => `${e.position} at ${e.company}: ${e.description?.join(" ")}`)
  .join("\n")}

Target Job:
${jobData.title} at ${jobData.company}
${jobData.description}

Generate:
1. Top 5 likely interview questions
2. STAR method talking points (3 examples)
3. Technical discussion areas
4. Red flags to avoid
5. Questions to ask interviewer

Return ONLY JSON (no markdown):
{
  "likelyQuestions": ["q1", "q2", "q3", "q4", "q5"],
  "starExamples": ["example1", "example2", "example3"],
  "technicalDiscussionAreas": ["area1", "area2"],
  "redFlags": ["flag1", "flag2"],
  "questionsToAsk": ["question1", "question2"]
}`;

    const message = await client.messages.create({
      model: "llama-3.1-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Groq Interview Tips Error:", error);
    throw new Error(`Failed to generate interview tips: ${error.message}`);
  }
}

export default {
  optimizeResumeForATS,
  calculateATSScore,
  recommendJobMatches,
  generateInterviewTips,
  tailorResumeForRemoteJob,
  buildRemoteTailorPrompt,
};
