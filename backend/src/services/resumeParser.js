import pdf from "pdf-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { extractResumeLayout } from "../ai/gemini.js";
import { withBrowserPage } from "./browserPool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Convert PDF to high-quality image for Gemini Vision
 * @param {string} pdfPath - Path to PDF file
 * @returns {Promise<string>} - Path to generated image
 */
export async function convertPdfToImage(pdfPath) {
  try {
    const imageBuffer = await withBrowserPage(async (page) => {
      await page.goto(`file://${pdfPath}`, { waitUntil: "networkidle0" });

      return page.screenshot({
        type: "jpeg",
        quality: 95,
        fullPage: true,
      });
    });

    const imagePath = pdfPath.replace(/\.pdf$/, ".jpg");
    fs.writeFileSync(imagePath, imageBuffer);
    return imagePath;
  } catch (error) {
    console.error("PDF to Image Conversion Error:", error);
    throw new Error(`Failed to convert PDF to image: ${error.message}`);
  }
}

/**
 * Extract raw text from PDF
 * @param {string} pdfPath - Path to PDF file
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromPDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("PDF Text Extraction Error:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Process uploaded resume file
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>} - Processed resume data
 */
export async function processResumeFile(file) {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const validMimeTypes = ["application/pdf"];
    if (!validMimeTypes.includes(file.mimetype)) {
      throw new Error("Only PDF files are supported");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size must be less than 10MB");
    }

    const pdfPath = file.path;

    // Extract raw text from PDF
    console.log("📖 Extracting text from PDF...");
    const rawText = await extractTextFromPDF(pdfPath);
    console.log("✅ Text extracted, length:", rawText.length);

    let structuredData;
    
    // Try using Gemini Vision for better parsing
    try {
      console.log("🤖 Converting PDF to image for Gemini Vision...");
      const imagePath = await convertPdfToImage(pdfPath);
      
      console.log("🔍 Parsing resume with Gemini Vision...");
      structuredData = await extractResumeLayout(imagePath);
      console.log("✅ Gemini Vision parsing successful");
      
      // Clean up the image file
      try {
        fs.unlinkSync(imagePath);
      } catch (e) {
        // Ignore cleanup errors
      }
    } catch (geminiError) {
      console.warn("⚠️  Gemini Vision parsing failed, falling back to regex:", geminiError.message);
      // Fall back to basic regex parsing
      structuredData = parseResumeFromText(rawText);
    }

    return {
      filename: file.originalname,
      path: pdfPath,
      parsedJson: structuredData,
      rawText,
      processingStatus: "completed",
      processedAt: new Date(),
    };
  } catch (error) {
    console.error("❌ Resume Processing Error:", error);
    throw error;
  }
}

/**
 * Extract skills from resume text
 * @param {string} resumeText - Resume content
 * @returns {Array<string>} - Extracted skills
 */
export function extractSkillsFromText(resumeText) {
  const commonSkills = [
    // Programming Languages
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "R",
    "MATLAB",

    // Frontend
    "React",
    "Angular",
    "Vue",
    "HTML",
    "CSS",
    "Svelte",
    "Next.js",
    "Vite",

    // Backend
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring",
    "FastAPI",
    "NestJS",

    // Databases
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "Redis",
    "Elasticsearch",
    "Firebase",
    "DynamoDB",

    // Cloud
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "Terraform",

    // Tools
    "Git",
    "Jenkins",
    "GitLab",
    "GitHub",
    "Jira",
    "Figma",
    "VS Code",

    // Soft Skills
    "Leadership",
    "Communication",
    "Project Management",
    "Agile",
    "Scrum",
    "Problem Solving",
    "Team Collaboration",
    "Strategic Planning",
  ];

  const foundSkills = [];
  const lowerText = resumeText.toLowerCase();

  for (const skill of commonSkills) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }

  return [...new Set(foundSkills)];
}

/**
 * Calculate years of experience from resume data
 * @param {Object} structuredData - Parsed resume data
 * @returns {number} - Total years of experience
 */
export function calculateYearsOfExperience(structuredData) {
  if (!structuredData.experience || structuredData.experience.length === 0) {
    return 0;
  }

  let totalMonths = 0;

  for (const job of structuredData.experience) {
    const start = new Date(job.startDate || job.duration?.split("-")[0]);
    const end = job.endDate?.toLowerCase() === "current"
      ? new Date()
      : new Date(job.endDate || job.duration?.split("-")[1]);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const months = (end - start) / (1000 * 60 * 60 * 24 * 30);
      totalMonths += months;
    }
  }

  return Math.round(totalMonths / 12 * 10) / 10;
}

/**
 * Parse resume from plain text (no AI required)
 * @param {string} resumeText - Resume content
 * @returns {Object} - Structured resume data
 */
export function parseResumeFromText(resumeText) {
  const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l);
  
  return {
    personal: {
      name: extractName(resumeText),
      email: extractEmail(resumeText),
      phone: extractPhone(resumeText),
      location: extractLocation(resumeText),
      website: extractWebsite(resumeText) || null,
    },
    summary: extractSummary(resumeText),
    experience: extractExperience(resumeText),
    education: extractEducation(resumeText),
    skills: extractSkillsFromText(resumeText),
    certifications: extractCertifications(resumeText),
    languages: [],
  };
}

function extractName(text) {
  const lines = text.split('\n').filter(l => l.trim());
  // Look for first 3 lines that aren't emails, phone numbers, or URLs
  for (let line of lines.slice(0, 5)) {
    const cleaned = line.trim();
    
    // Skip if it's an email, phone, URL, or special character-heavy
    if (cleaned.includes('@') || cleaned.match(/\d{3}[-.\s]?\d{3}/) || cleaned.includes('www.') || cleaned.includes('http')) {
      continue;
    }
    
    // Should be 5-60 characters and start with capital letter
    if (cleaned.length >= 5 && cleaned.length <= 60 && /^[A-Z]/.test(cleaned)) {
      // Remove extra whitespace and return
      return cleaned.replace(/\s+/g, ' ').split(' - ')[0].split(' | ')[0].trim();
    }
  }
  return 'Unknown';
}

function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

function extractPhone(text) {
  const phonePatterns = [
    /\b(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})\b/,
    /\b(\+\d{1,3}[-.\s]?\d{1,14})\b/,
    /\b(\(\d{3}\)\s*\d{3}[-.\s]?\d{4})\b/,
  ];
  for (let pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractLocation(text) {
  const us_cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Miami', 'Denver', 'Boston', 'Seattle', 'Las Vegas', 'Portland', 'San Francisco', 'Washington', 'Atlanta', 'Brooklyn', 'New Jersey', 'Manhattan', 'Silicon Valley', 'Bay Area', 'NYC'];
  const locationPattern = new RegExp(`\\b(${us_cities.join('|')})\\b`, 'i');
  const match = text.match(locationPattern);
  return match ? match[1] : 'Remote';
}

function extractWebsite(text) {
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
  const match = text.match(urlPattern);
  return match ? match[1] : null;
}

function extractSummary(text) {
  const summaryKeywords = ['summary', 'objective', 'about', 'profile'];
  for (let keyword of summaryKeywords) {
    const regex = new RegExp(`${keyword}[:\\s]+([^\\n]{20,200})`, 'i');
    const match = text.match(regex);
    if (match) return match[1].trim();
  }
  return null;
}

function extractExperience(text) {
  const experiences = [];
  
  // First, try the structured section-based approach
  const expSectionMatch = text.match(/(?:work\s+)?experience[:\s]+(.+?)(?=education|skills|certification|projects|awards|$)/is);
  
  if (expSectionMatch) {
    const expSection = expSectionMatch[1];
    
    // Split by double newlines or position patterns
    const jobBlocks = expSection.split(/\n\s*\n|\n(?=[A-Z][a-z\s]+(?:Engineer|Developer|Manager|Analyst|Lead|Architect|Specialist|Director|Coordinator|Officer|Consultant|Associate|Assistant|Intern))/);
    
    for (const block of jobBlocks) {
      if (block.trim().length < 20) continue;
      const job = parseJobBlock(block);
      if (job.position) {
        experiences.push(job);
      }
    }
  }
  
  // If no structured section found, try to extract jobs from full text
  if (experiences.length === 0) {
    experiences.push(...extractJobsFromText(text));
  }
  
  return experiences.slice(0, 5);
}

function parseJobBlock(block) {
  const lines = block.split('\n').map(l => l.trim()).filter(l => l && l.length > 2);
  
  let position = '';
  let company = '';
  let duration = '';
  let startDate = null;
  let endDate = null;
  const description = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line contains dates
    const dateMatch = line.match(/\d{1,2}[\s/-]*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|\d{1,2})[\s/-]*\d{4}|(\d{4}[\s-]*){1,2}|present|current/i);
    
    if (dateMatch && !position) {
      // This line is a date, might be at the end
      duration = line;
      const dates = extractDatesFromDuration(line);
      startDate = dates.start;
      endDate = dates.end;
      continue;
    }
    
    if (!position) {
      // Check if this looks like a job title
      if (/(Engineer|Developer|Manager|Analyst|Lead|Architect|Specialist|Director|Coordinator|Officer|Consultant|Associate|Assistant|Intern|Designer|Scientist|Technician|Administrator|Accountant|Lawyer|Doctor|Nurse|Teacher)/i.test(line)) {
        position = line;
        continue;
      }
    }
    
    if (position && !company && line.length < 100 && !/^[-•*\s]/.test(line)) {
      // Next meaningful line after position is likely company
      company = line;
      continue;
    }
    
    // Bullet points as description
    if (position && /^[-•*]\s+/.test(line)) {
      const desc = line.replace(/^[-•*]\s+/, '').trim();
      if (desc.length > 3) {
        description.push(desc);
      }
    }
  }
  
  // If we only found position but no company, try to extract from first line
  if (position && !company) {
    const posMatch = position.match(/(.+?)\s+(?:at|@)\s+(.+)/i);
    if (posMatch) {
      position = posMatch[1];
      company = posMatch[2];
    }
  }
  
  return {
    position: position || 'Position',
    company: company || 'Company',
    duration: duration || 'Dates not found',
    startDate,
    endDate,
    description: description.slice(0, 3),
  };
}

function extractJobsFromText(text) {
  const jobs = [];
  
  // Look for lines that contain job titles
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Pattern: "Job Title at Company" or "Job Title - Company" or just "Job Title"
    const jobPattern = /^([A-Z][^-@\n]*(?:Engineer|Developer|Manager|Analyst|Lead|Architect|Specialist|Director|Officer|Consultant)[^-@\n]*)(?:\s+(?:at|@|-)\s*(.+))?$/;
    const match = line.match(jobPattern);
    
    if (match) {
      const position = match[1].trim();
      const company = match[2]?.trim() || 'Company';
      
      // Look for dates in nearby lines
      let duration = '';
      let startDate = null;
      let endDate = null;
      let description = [];
      
      // Check next few lines for dates and description
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const nextLine = lines[j];
        
        if (/\d{4}|present|current/.test(nextLine)) {
          duration = nextLine;
          const dates = extractDatesFromDuration(nextLine);
          startDate = dates.start;
          endDate = dates.end;
        }
        
        if (/^[-•*]/.test(nextLine)) {
          const desc = nextLine.replace(/^[-•*]\s+/, '').trim();
          if (desc.length > 3) {
            description.push(desc);
          }
        }
        
        // Stop if we hit another job title or section
        if (j > i + 1 && /^([A-Z][^-@\n]*(?:Engineer|Developer|Manager|Analyst)[^-@\n]*)(?:\s+(?:at|@|-)\s*(.+))?$/.test(nextLine)) {
          break;
        }
      }
      
      jobs.push({
        position,
        company,
        duration: duration || 'Dates not found',
        startDate,
        endDate,
        description: description.slice(0, 3),
      });
    }
  }
  
  return jobs.slice(0, 5);
}

function extractDatesFromDuration(durationStr) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthRegex = months.join('|');
  
  const datePattern = new RegExp(`(?:(${monthRegex})\\s+)?(\\d{4})\\s*[-–]\\s*(?:(${monthRegex})\\s+)?(\\d{4}|present)`, 'i');
  const match = durationStr.match(datePattern);
  
  if (match) {
    const startYear = match[2];
    const endYear = match[4];
    return {
      start: `${startYear}-01`,
      end: endYear.toLowerCase() === 'present' ? 'current' : `${endYear}-12`
    };
  }
  
  const yearMatch = durationStr.match(/(\d{4})\s*[-–]\s*(\d{4}|present)/i);
  if (yearMatch) {
    return {
      start: `${yearMatch[1]}-01`,
      end: yearMatch[2].toLowerCase() === 'present' ? 'current' : `${yearMatch[2]}-12`
    };
  }
  
  return { start: null, end: null };
}

function extractEducation(text) {
  const educations = [];
  
  // Split by education section
  const eduSectionMatch = text.match(/education[:\s]+(.+?)(?=skills|certification|experience|$)/is);
  if (!eduSectionMatch) return [];
  
  const eduSection = eduSectionMatch[1];
  
  // Look for degree patterns
  const degreePatterns = [
    /(?:^|\n)((?:B[.S]|B[.A]|M[.S]|M[.A]|M\.E|Ph\.D|MBA|BSc|MSc|BA|MA|BS|MS|Bachelor|Master|Associate|Diploma)[^,\n]*)\s*(?:in|from)?\s*([^\n,]+?)(?:\s+from|\s+at|\n|,)/i,
    /(?:^|\n)([A-Z][A-Za-z\s&-]+(?:University|College|Institute|School|Academy)[^\n]*)(?:\n|,)/i,
  ];
  
  for (const pattern of degreePatterns) {
    let match;
    const regex = new RegExp(pattern.source, 'gmi');
    while ((match = regex.exec(eduSection)) !== null) {
      const degree = match[1]?.trim() || '';
      const field = match[2]?.trim() || '';
      
      if (degree.length > 2) {
        educations.push({
          institution: 'Institution Name',
          degree: degree.replace(/\s+/g, ' '),
          field: field || 'Field not specified',
          graduationDate: null,
        });
      }
    }
  }
  
  return educations.slice(0, 3);
}

function extractCertifications(text) {
  const certs = [];
  const certKeywords = ['certified', 'certification', 'certificate'];
  for (let keyword of certKeywords) {
    const regex = new RegExp(`${keyword}[:\\s]+([^\\n,]+)`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      certs.push(match[1].trim());
    }
  }
  return certs.slice(0, 5);
}

export default {
  processResumeFile,
  convertPdfToImage,
  extractTextFromPDF,
  extractSkillsFromText,
  calculateYearsOfExperience,
  parseResumeFromText,
};
