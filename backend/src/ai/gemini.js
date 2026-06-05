import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const client = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

/**
 * Extract resume layout and text from PDF image
 * @param {string} imagePath - Path to PDF converted to image
 * @returns {Promise<Object>} - Structured resume data with coordinates
 */
export async function extractResumeLayout(imagePath) {
  try {
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString("base64");

    const prompt = `You are a resume parser expert. Analyze this resume image and extract ALL information with precision.

Return a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "personal": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string or null"
  },
  "summary": "string or null",
  "experience": [
    {
      "company": "string",
      "position": "string",
      "duration": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or current",
      "description": ["bullet1", "bullet2"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "graduationDate": "YYYY-MM or YYYY"
    }
  ],
  "skills": ["skill1", "skill2"],
  "certifications": ["cert1", "cert2"],
  "languages": [{"language": "string", "level": "string"}],
  "layoutAnalysis": {
    "pageCount": 1,
    "columnCount": 1 or 2,
    "hasPhoto": boolean,
    "colorScheme": "black-white or color",
    "fontFamily": "string"
  }
}

Extract ONLY what exists. For arrays, return empty array if none exist. Be precise with dates.`;

    const response = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
      prompt,
    ]);

    const responseText = response.response.text();
    
    // Try to extract JSON from the response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    return parsedData;
  } catch (error) {
    console.error("Gemini Vision API Error:", error);
    throw new Error(`Failed to extract resume layout: ${error.message}`);
  }
}

/**
 * Generate cover letter based on resume and job description
 * @param {Object} resumeData - Parsed resume data
 * @param {string} jobDescription - Job posting description
 * @param {string} companyName - Target company name
 * @returns {Promise<string>} - Generated cover letter
 */
export async function generateCoverLetter(resumeData, jobDescription, companyName) {
  try {
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert cover letter writer. Generate a professional, personalized cover letter.

Resume Information:
- Name: ${resumeData.personal?.name || "Professional"}
- Current Position: ${resumeData.experience?.[0]?.position || "Experienced Professional"}
- Key Skills: ${resumeData.skills?.slice(0, 5).join(", ") || "Professional"}

Target Job Description:
${jobDescription}

Company: ${companyName}

Generate a compelling 3-paragraph cover letter that:
1. Opens with enthusiasm and specific mention of the company
2. Highlights relevant experience and how it matches the job requirements
3. Closes with a call to action and professional sign-off

Format as plain text (no markdown, no special formatting).`;

    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error("Cover Letter Generation Error (Gemini):", error.message);
    // Fallback to local template-based generation
    return generateCoverLetterLocally(resumeData, companyName, jobDescription);
  }
}

/**
 * Local cover letter generation fallback when Gemini is unavailable
 */
function generateCoverLetterLocally(resumeData, companyName, jobDescription) {
  const name = resumeData.personal?.name || "Professional";
  const position = resumeData.experience?.[0]?.position || "Software Engineer";
  const company = resumeData.experience?.[0]?.company || "Previous Company";
  const skills = resumeData.skills?.slice(0, 3).join(", ") || "technical skills";

  return `Dear Hiring Manager,

I am writing to express my strong interest in the position at ${companyName}. With my background as a ${position} and proven expertise in ${skills}, I am confident in my ability to contribute meaningfully to your team. Your company's innovative approach and commitment to excellence align perfectly with my professional values, and I am excited about the opportunity to bring my experience and passion to your organization.

Throughout my career at ${company}, I have consistently delivered high-quality solutions and demonstrated my ability to adapt to new challenges. My experience directly aligns with the key requirements you've outlined, including my proficiency in ${skills} and my track record of successfully collaborating with cross-functional teams. I am particularly drawn to this role because it combines my technical expertise with the opportunity to work on impactful projects that matter.

I would welcome the opportunity to discuss how my background and skills can contribute to ${companyName}'s continued success. Thank you for considering my application. I look forward to speaking with you soon and exploring how I can add value to your team.

Best regards,
${name}`;
}

/**
 * Extract keywords from job description
 * @param {string} jobDescription - Job posting description
 * @returns {Promise<Object>} - Structured job requirements
 */
export async function extractJobKeywords(jobDescription) {
  try {
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analyze this job description and extract requirements as JSON:

${jobDescription}

Return ONLY valid JSON (no markdown):
{
  "title": "extracted job title",
  "company": "extracted company if present",
  "hardSkills": ["skill1", "skill2"],
  "softSkills": ["skill1", "skill2"],
  "experienceYears": number,
  "seniorityLevel": "entry|mid|senior|lead",
  "industry": "string",
  "keywordDensity": {
    "high_priority": ["keyword1", "keyword2"],
    "medium_priority": ["keyword3"],
    "low_priority": ["keyword4"]
  }
}`;

    const response = await model.generateContent(prompt);
    const responseText = response.response.text();
    
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Keyword Extraction Error (Gemini):", error.message);
    // Fallback to local keyword extraction
    return extractKeywordsLocally(jobDescription);
  }
}

/**
 * Local keyword extraction fallback when Gemini is unavailable
 */
function extractKeywordsLocally(jobDescription) {
  const text = jobDescription.toLowerCase();
  
  // Common tech skills
  const allSkills = [
    "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "ruby", "php",
    "react", "vue", "angular", "node.js", "express", "django", "flask", "spring", "fastapi",
    "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra",
    "aws", "gcp", "azure", "docker", "kubernetes", "terraform", "jenkins", "git",
    "rest api", "graphql", "microservices", "agile", "scrum", "ci/cd", "devops",
    "html", "css", "sass", "webpack", "git", "testing", "jest", "selenium", "rspec"
  ];

  const hardSkills = allSkills.filter(skill => text.includes(skill));
  
  const softSkillsKeywords = [
    "communication", "leadership", "teamwork", "problem solving", "collaboration",
    "documentation", "mentoring", "cross-functional", "remote", "async"
  ];
  
  const softSkills = softSkillsKeywords.filter(skill => text.includes(skill));
  
  // Extract years of experience
  const yearsMatch = jobDescription.match(/(\d+)\+?\s*(?:years?|yrs)/i);
  const experienceYears = yearsMatch ? parseInt(yearsMatch[1]) : 3;
  
  // Determine seniority
  let seniorityLevel = "mid";
  if (text.includes("lead") || text.includes("principal")) seniorityLevel = "lead";
  else if (text.includes("senior")) seniorityLevel = "senior";
  else if (text.includes("junior") || text.includes("entry")) seniorityLevel = "entry";

  return {
    title: "Software Engineer",
    company: "Unknown",
    hardSkills: hardSkills.length > 0 ? hardSkills : ["software development"],
    softSkills: softSkills.length > 0 ? softSkills : ["communication", "teamwork"],
    experienceYears,
    seniorityLevel,
    industry: "Technology",
    keywordDensity: {
      high_priority: hardSkills.slice(0, 3),
      medium_priority: hardSkills.slice(3, 6),
      low_priority: softSkills.slice(0, 2)
    }
  };
}

export default {
  extractResumeLayout,
  generateCoverLetter,
  extractJobKeywords,
};
