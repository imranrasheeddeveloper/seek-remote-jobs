/**
 * Job Matching Algorithm
 * Scores resume against job postings
 */

/**
 * Calculate skill match score
 * @param {Array<string>} resumeSkills - Skills from resume
 * @param {Array<string>} jobSkills - Required skills from job posting
 * @returns {number} - Match score 0-100
 */
export function calculateSkillMatch(resumeSkills, jobSkills) {
  if (!jobSkills || jobSkills.length === 0) return 100;
  if (!resumeSkills || resumeSkills.length === 0) return 0;

  const normalizedResumeSkills = resumeSkills.map((s) => s.toLowerCase());
  const normalizedJobSkills = jobSkills.map((s) => s.toLowerCase());

  let matchedCount = 0;

  for (const jobSkill of normalizedJobSkills) {
    for (const resumeSkill of normalizedResumeSkills) {
      // Exact match or partial match
      if (
        jobSkill === resumeSkill ||
        jobSkill.includes(resumeSkill) ||
        resumeSkill.includes(jobSkill)
      ) {
        matchedCount++;
        break;
      }
    }
  }

  return Math.round((matchedCount / normalizedJobSkills.length) * 100);
}

/**
 * Calculate experience match score
 * @param {number} resumeYears - Years of experience in resume
 * @param {number} requiredYears - Required years for job
 * @returns {number} - Match score 0-100
 */
export function calculateExperienceMatch(resumeYears, requiredYears) {
  if (!requiredYears || requiredYears === 0) return 100;
  if (resumeYears >= requiredYears) return 100;

  // Allow some flexibility - 80% of required experience is still strong
  const matchRatio = resumeYears / requiredYears;
  const score = matchRatio * 100;

  return Math.min(score, 95);
}

/**
 * Calculate location match score
 * @param {string} resumeLocation - Resume location
 * @param {Array<string>} jobLocations - Acceptable job locations
 * @param {boolean} allowRemote - If job allows remote work
 * @returns {number} - Match score 0-100
 */
export function calculateLocationMatch(resumeLocation, jobLocations, allowRemote) {
  // Remote jobs get 100% score
  if (allowRemote) return 100;

  if (!jobLocations || jobLocations.length === 0) return 50;
  if (!resumeLocation) return 50;

  const normalizedResume = resumeLocation.toLowerCase().trim();

  for (const location of jobLocations) {
    const normalizedJob = location.toLowerCase().trim();
    if (normalizedResume === normalizedJob) {
      return 100;
    }
    // Partial match (same city or region)
    if (normalizedResume.includes(normalizedJob) || normalizedJob.includes(normalizedResume)) {
      return 75;
    }
  }

  return 30; // Different location, but not impossible
}

/**
 * Calculate salary match score
 * @param {number} resumeExpectation - Salary expectation from resume
 * @param {number} minSalary - Job minimum salary
 * @param {number} maxSalary - Job maximum salary
 * @returns {number} - Match score 0-100
 */
export function calculateSalaryMatch(resumeExpectation, minSalary, maxSalary) {
  if (!minSalary || !maxSalary) return 100;
  if (!resumeExpectation) return 100;

  if (resumeExpectation >= minSalary && resumeExpectation <= maxSalary) {
    return 100;
  }

  if (resumeExpectation < minSalary) {
    // Under budget is positive
    return Math.min(95, (resumeExpectation / minSalary) * 100);
  }

  // Over budget
  const overage = ((resumeExpectation - maxSalary) / maxSalary) * 100;
  const score = 100 - overage;
  return Math.max(30, score);
}

/**
 * Calculate seniority alignment score
 * @param {string} resumeSeniority - Resume seniority level (entry, mid, senior, lead)
 * @param {string} jobSeniority - Job required seniority level
 * @returns {number} - Match score 0-100
 */
export function calculateSeniorityMatch(resumeSeniority, jobSeniority) {
  const levels = ["entry", "mid", "senior", "lead"];
  const resumeLevel = levels.indexOf(resumeSeniority?.toLowerCase() || "mid");
  const jobLevel = levels.indexOf(jobSeniority?.toLowerCase() || "mid");

  if (resumeLevel === -1 || jobLevel === -1) return 80;
  if (resumeLevel === jobLevel) return 100;
  if (resumeLevel > jobLevel) return 95; // Overqualified is usually fine
  if (resumeLevel === jobLevel - 1) return 85; // One level below
  if (resumeLevel === jobLevel - 2) return 70; // Two levels below
  return 50; // Too junior
}

/**
 * Extract missing keywords
 * @param {Array<string>} resumeSkills - Resume skills
 * @param {Array<string>} jobSkills - Job required skills
 * @returns {Array<string>} - Missing skills
 */
export function findMissingKeywords(resumeSkills, jobSkills) {
  if (!jobSkills || jobSkills.length === 0) return [];
  if (!resumeSkills || resumeSkills.length === 0) return jobSkills;

  const normalizedResumeSkills = resumeSkills.map((s) => s.toLowerCase());
  const missing = [];

  for (const jobSkill of jobSkills) {
    let found = false;
    const normalizedJobSkill = jobSkill.toLowerCase();

    for (const resumeSkill of normalizedResumeSkills) {
      if (
        normalizedJobSkill === resumeSkill ||
        normalizedJobSkill.includes(resumeSkill) ||
        resumeSkill.includes(normalizedJobSkill)
      ) {
        found = true;
        break;
      }
    }

    if (!found) {
      missing.push(jobSkill);
    }
  }

  return missing;
}

/**
 * Calculate comprehensive job match score
 * @param {Object} resumeData - Parsed resume data
 * @param {Object} jobData - Job posting data
 * @returns {Object} - Detailed match score breakdown
 */
export function calculateJobMatch(resumeData, jobData) {
  const skillScore = calculateSkillMatch(
    resumeData.skills || [],
    jobData.requiredSkills || []
  );

  const experienceScore = calculateExperienceMatch(
    resumeData.yearsOfExperience || 0,
    jobData.minYearsExperience || 0
  );

  const locationScore = calculateLocationMatch(
    resumeData.location || "",
    jobData.locations || [],
    jobData.isRemote || false
  );

  const seniorityScore = calculateSeniorityMatch(
    resumeData.seniority || "mid",
    jobData.seniorityLevel || "mid"
  );

  const salaryScore = calculateSalaryMatch(
    resumeData.expectedSalary,
    jobData.minSalary,
    jobData.maxSalary
  );

  // Weighted score calculation
  const weights = {
    skill: 0.40,
    experience: 0.30,
    location: 0.10,
    seniority: 0.15,
    salary: 0.05,
  };

  const overallScore = Math.round(
    skillScore * weights.skill +
      experienceScore * weights.experience +
      locationScore * weights.location +
      seniorityScore * weights.seniority +
      salaryScore * weights.salary
  );

  const missingKeywords = findMissingKeywords(
    resumeData.skills || [],
    jobData.requiredSkills || []
  );

  return {
    overallScore: Math.min(100, overallScore),
    skillMatchScore: skillScore,
    experienceMatchScore: experienceScore,
    locationMatchScore: locationScore,
    seniorityMatchScore: seniorityScore,
    salaryMatchScore: salaryScore,
    missingKeywords: missingKeywords,
    matchedKeywords: (resumeData.skills || []).filter((s) =>
      (jobData.requiredSkills || []).some(
        (js) => js.toLowerCase() === s.toLowerCase()
      )
    ),
    recommendation:
      overallScore >= 80
        ? "excellent_match"
        : overallScore >= 60
          ? "good_match"
          : overallScore >= 40
            ? "possible_match"
            : "learning_opportunity",
  };
}

/**
 * Rank multiple job listings against a resume
 * @param {Object} resumeData - Parsed resume data
 * @param {Array<Object>} jobListings - Array of job postings
 * @returns {Array<Object>} - Ranked job matches
 */
export function rankJobMatches(resumeData, jobListings) {
  const matches = jobListings.map((job, index) => ({
    jobId: job.id,
    jobIndex: index,
    jobTitle: job.title,
    company: job.company,
    ...calculateJobMatch(resumeData, job),
  }));

  // Sort by overall score (descending)
  matches.sort((a, b) => b.overallScore - a.overallScore);

  // Add rank
  return matches.map((match, rank) => ({
    ...match,
    rank: rank + 1,
  }));
}

export default {
  calculateSkillMatch,
  calculateExperienceMatch,
  calculateLocationMatch,
  calculateSalaryMatch,
  calculateSeniorityMatch,
  findMissingKeywords,
  calculateJobMatch,
  rankJobMatches,
};
