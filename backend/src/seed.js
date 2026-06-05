import { exec } from "./db.js";

/**
 * Generate 1000+ tech job listings with realistic data
 */
const jobsData = [
  // FAANG Companies
  {
    title: "Senior Backend Engineer",
    company: "Google",
    location: "Remote",
    source_key: "google",
    url: "https://careers.google.com/jobs/results/",
    description: "Build scalable backend systems for Google Cloud",
  },
  {
    title: "Frontend Engineer - React",
    company: "Google",
    location: "Mountain View, CA",
    source_key: "google",
    url: "https://careers.google.com/jobs/results/",
    description: "Develop user interfaces for Google products",
  },
  {
    title: "Cloud Solutions Architect",
    company: "Google",
    location: "Remote",
    source_key: "google",
    url: "https://careers.google.com/jobs/results/",
    description: "Design and implement cloud solutions for enterprise clients",
  },
  {
    title: "DevOps Engineer",
    company: "Google",
    location: "Remote",
    source_key: "google",
    url: "https://careers.google.com/jobs/results/",
    description: "Manage infrastructure and deployment pipelines",
  },
  {
    title: "Machine Learning Engineer",
    company: "Google",
    location: "San Francisco, CA",
    source_key: "google",
    url: "https://careers.google.com/jobs/results/",
    description: "Build ML models and systems at scale",
  },
  
  // Meta (Facebook)
  {
    title: "Senior Software Engineer",
    company: "Meta",
    location: "Menlo Park, CA",
    source_key: "meta",
    url: "https://www.metacareers.com/jobs/",
    description: "Work on core platform infrastructure",
  },
  {
    title: "Product Manager",
    company: "Meta",
    location: "Remote",
    source_key: "meta",
    url: "https://www.metacareers.com/jobs/",
    description: "Lead product strategy and development",
  },
  {
    title: "Security Engineer",
    company: "Meta",
    location: "Remote",
    source_key: "meta",
    url: "https://www.metacareers.com/jobs/",
    description: "Protect Meta's infrastructure and user data",
  },
  {
    title: "Data Scientist",
    company: "Meta",
    location: "Menlo Park, CA",
    source_key: "meta",
    url: "https://www.metacareers.com/jobs/",
    description: "Analyze data and drive insights",
  },
  {
    title: "Solutions Engineer",
    company: "Meta",
    location: "Remote",
    source_key: "meta",
    url: "https://www.metacareers.com/jobs/",
    description: "Support enterprise customers",
  },

  // Apple
  {
    title: "iOS Developer",
    company: "Apple",
    location: "Cupertino, CA",
    source_key: "apple",
    url: "https://www.apple.com/jobs/",
    description: "Build iOS applications for Apple ecosystem",
  },
  {
    title: "Systems Engineer",
    company: "Apple",
    location: "Remote",
    source_key: "apple",
    url: "https://www.apple.com/jobs/",
    description: "Develop system-level software",
  },
  {
    title: "QA Engineer",
    company: "Apple",
    location: "Cupertino, CA",
    source_key: "apple",
    url: "https://www.apple.com/jobs/",
    description: "Ensure quality of Apple products",
  },
  {
    title: "Hardware Engineer",
    company: "Apple",
    location: "Cupertino, CA",
    source_key: "apple",
    url: "https://www.apple.com/jobs/",
    description: "Design and develop hardware components",
  },
  {
    title: "Network Engineer",
    company: "Apple",
    location: "Remote",
    source_key: "apple",
    url: "https://www.apple.com/jobs/",
    description: "Manage Apple's global network",
  },

  // Amazon
  {
    title: "AWS Solutions Architect",
    company: "Amazon",
    location: "Remote",
    source_key: "amazon",
    url: "https://amazon.jobs/",
    description: "Design cloud solutions for customers",
  },
  {
    title: "SDE II (Backend)",
    company: "Amazon",
    location: "Seattle, WA",
    source_key: "amazon",
    url: "https://amazon.jobs/",
    description: "Build backend services for Amazon retail",
  },
  {
    title: "Technical Program Manager",
    company: "Amazon",
    location: "Remote",
    source_key: "amazon",
    url: "https://amazon.jobs/",
    description: "Manage technical initiatives",
  },
  {
    title: "Database Administrator",
    company: "Amazon",
    location: "Remote",
    source_key: "amazon",
    url: "https://amazon.jobs/",
    description: "Manage and optimize databases",
  },
  {
    title: "Data Engineer",
    company: "Amazon",
    location: "Remote",
    source_key: "amazon",
    url: "https://amazon.jobs/",
    description: "Build data infrastructure",
  },

  // Microsoft
  {
    title: "Azure Cloud Engineer",
    company: "Microsoft",
    location: "Redmond, WA",
    source_key: "microsoft",
    url: "https://careers.microsoft.com/",
    description: "Build Azure platform services",
  },
  {
    title: "C# Developer",
    company: "Microsoft",
    location: "Remote",
    source_key: "microsoft",
    url: "https://careers.microsoft.com/",
    description: "Develop .NET applications",
  },
  {
    title: "Software Architect",
    company: "Microsoft",
    location: "Remote",
    source_key: "microsoft",
    url: "https://careers.microsoft.com/",
    description: "Design enterprise software systems",
  },
  {
    title: "AI/ML Engineer",
    company: "Microsoft",
    location: "Redmond, WA",
    source_key: "microsoft",
    url: "https://careers.microsoft.com/",
    description: "Work on AI and machine learning",
  },
  {
    title: "Security Architect",
    company: "Microsoft",
    location: "Remote",
    source_key: "microsoft",
    url: "https://careers.microsoft.com/",
    description: "Design security solutions",
  },

  // Stripe
  {
    title: "Senior Backend Engineer",
    company: "Stripe",
    location: "Remote",
    source_key: "stripe",
    url: "https://stripe.com/jobs/",
    description: "Build payment infrastructure",
  },
  {
    title: "Frontend Engineer",
    company: "Stripe",
    location: "Remote",
    source_key: "stripe",
    url: "https://stripe.com/jobs/",
    description: "Build Stripe dashboard",
  },
  {
    title: "Infrastructure Engineer",
    company: "Stripe",
    location: "Remote",
    source_key: "stripe",
    url: "https://stripe.com/jobs/",
    description: "Manage Stripe infrastructure",
  },
  {
    title: "Product Manager",
    company: "Stripe",
    location: "San Francisco, CA",
    source_key: "stripe",
    url: "https://stripe.com/jobs/",
    description: "Lead product initiatives",
  },
  {
    title: "Data Engineer",
    company: "Stripe",
    location: "Remote",
    source_key: "stripe",
    url: "https://stripe.com/jobs/",
    description: "Build analytics infrastructure",
  },

  // Uber
  {
    title: "Senior Engineer",
    company: "Uber",
    location: "San Francisco, CA",
    source_key: "uber",
    url: "https://www.uber.com/en-US/careers/",
    description: "Build Uber platform",
  },
  {
    title: "Maps Engineer",
    company: "Uber",
    location: "Remote",
    source_key: "uber",
    url: "https://www.uber.com/en-US/careers/",
    description: "Work on Uber Maps",
  },
  {
    title: "ML Engineer",
    company: "Uber",
    location: "San Francisco, CA",
    source_key: "uber",
    url: "https://www.uber.com/en-US/careers/",
    description: "Build ML systems for Uber",
  },
  {
    title: "Mobile Engineer - iOS",
    company: "Uber",
    location: "Remote",
    source_key: "uber",
    url: "https://www.uber.com/en-US/careers/",
    description: "Develop Uber iOS app",
  },
  {
    title: "DevOps Engineer",
    company: "Uber",
    location: "Remote",
    source_key: "uber",
    url: "https://www.uber.com/en-US/careers/",
    description: "Manage Uber infrastructure",
  },

  // Airbnb
  {
    title: "Software Engineer",
    company: "Airbnb",
    location: "San Francisco, CA",
    source_key: "airbnb",
    url: "https://www.airbnb.com/careers",
    description: "Build Airbnb platform",
  },
  {
    title: "Full Stack Engineer",
    company: "Airbnb",
    location: "Remote",
    source_key: "airbnb",
    url: "https://www.airbnb.com/careers",
    description: "Develop full stack features",
  },
  {
    title: "Data Scientist",
    company: "Airbnb",
    location: "San Francisco, CA",
    source_key: "airbnb",
    url: "https://www.airbnb.com/careers",
    description: "Work on analytics and ML",
  },
  {
    title: "Designer",
    company: "Airbnb",
    location: "Remote",
    source_key: "airbnb",
    url: "https://www.airbnb.com/careers",
    description: "Design Airbnb experiences",
  },
  {
    title: "Infrastructure Engineer",
    company: "Airbnb",
    location: "San Francisco, CA",
    source_key: "airbnb",
    url: "https://www.airbnb.com/careers",
    description: "Build infrastructure systems",
  },

  // Spotify
  {
    title: "Backend Engineer",
    company: "Spotify",
    location: "Remote",
    source_key: "spotify",
    url: "https://www.spotify.com/careers",
    description: "Build Spotify services",
  },
  {
    title: "Mobile Engineer",
    company: "Spotify",
    location: "Remote",
    source_key: "spotify",
    url: "https://www.spotify.com/careers",
    description: "Develop Spotify mobile apps",
  },
  {
    title: "Audio Engineer",
    company: "Spotify",
    location: "Stockholm, Sweden",
    source_key: "spotify",
    url: "https://www.spotify.com/careers",
    description: "Work on audio streaming technology",
  },
  {
    title: "ML Engineer",
    company: "Spotify",
    location: "Remote",
    source_key: "spotify",
    url: "https://www.spotify.com/careers",
    description: "Build recommendation systems",
  },
  {
    title: "Platform Engineer",
    company: "Spotify",
    location: "Remote",
    source_key: "spotify",
    url: "https://www.spotify.com/careers",
    description: "Build platform infrastructure",
  },

  // Netflix
  {
    title: "Senior Software Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    source_key: "netflix",
    url: "https://jobs.netflix.com/",
    description: "Build Netflix platform",
  },
  {
    title: "ML Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    source_key: "netflix",
    url: "https://jobs.netflix.com/",
    description: "Build recommendation engine",
  },
  {
    title: "Frontend Engineer",
    company: "Netflix",
    location: "Remote",
    source_key: "netflix",
    url: "https://jobs.netflix.com/",
    description: "Develop Netflix UI",
  },
  {
    title: "Infrastructure Engineer",
    company: "Netflix",
    location: "Remote",
    source_key: "netflix",
    url: "https://jobs.netflix.com/",
    description: "Manage Netflix infrastructure",
  },
  {
    title: "Data Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    source_key: "netflix",
    url: "https://jobs.netflix.com/",
    description: "Build data pipeline",
  },

  // Tesla
  {
    title: "Software Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    source_key: "tesla",
    url: "https://www.tesla.com/careers",
    description: "Build autonomous driving software",
  },
  {
    title: "Firmware Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    source_key: "tesla",
    url: "https://www.tesla.com/careers",
    description: "Develop vehicle firmware",
  },
  {
    title: "ML Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    source_key: "tesla",
    url: "https://www.tesla.com/careers",
    description: "Build ML for autonomous systems",
  },
  {
    title: "Hardware Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    source_key: "tesla",
    url: "https://www.tesla.com/careers",
    description: "Design vehicle hardware",
  },
  {
    title: "Robotics Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    source_key: "tesla",
    url: "https://www.tesla.com/careers",
    description: "Build robotic systems",
  },

  // Databricks
  {
    title: "Senior Software Engineer",
    company: "Databricks",
    location: "Remote",
    source_key: "databricks",
    url: "https://databricks.com/careers",
    description: "Build data platform",
  },
  {
    title: "ML Engineer",
    company: "Databricks",
    location: "Remote",
    source_key: "databricks",
    url: "https://databricks.com/careers",
    description: "Develop ML tools",
  },
  {
    title: "Solutions Architect",
    company: "Databricks",
    location: "Remote",
    source_key: "databricks",
    url: "https://databricks.com/careers",
    description: "Help customers with data solutions",
  },
  {
    title: "DevOps Engineer",
    company: "Databricks",
    location: "Remote",
    source_key: "databricks",
    url: "https://databricks.com/careers",
    description: "Manage cloud infrastructure",
  },
  {
    title: "Data Engineer",
    company: "Databricks",
    location: "Remote",
    source_key: "databricks",
    url: "https://databricks.com/careers",
    description: "Build data pipelines",
  },

  // Canva
  {
    title: "Frontend Engineer",
    company: "Canva",
    location: "Sydney, Australia",
    source_key: "canva",
    url: "https://www.canva.com/careers",
    description: "Build Canva design tools",
  },
  {
    title: "Backend Engineer",
    company: "Canva",
    location: "Remote",
    source_key: "canva",
    url: "https://www.canva.com/careers",
    description: "Build scalable backends",
  },
  {
    title: "ML Engineer",
    company: "Canva",
    location: "Remote",
    source_key: "canva",
    url: "https://www.canva.com/careers",
    description: "Build AI-powered design features",
  },
  {
    title: "Product Manager",
    company: "Canva",
    location: "Sydney, Australia",
    source_key: "canva",
    url: "https://www.canva.com/careers",
    description: "Lead product strategy",
  },
  {
    title: "DevOps Engineer",
    company: "Canva",
    location: "Remote",
    source_key: "canva",
    url: "https://www.canva.com/careers",
    description: "Manage infrastructure",
  },
];

// Generate additional jobs to reach 1000+
function generateAdditionalJobs(baseJobs, targetCount) {
  const companies = [
    "Google", "Meta", "Apple", "Amazon", "Microsoft",
    "Stripe", "Uber", "Airbnb", "Spotify", "Netflix",
    "Tesla", "Databricks", "Canva", "Slack", "Figma",
    "Notion", "Discord", "Shopify", "Square", "Twilio",
    "Okta", "Atlassian", "JetBrains", "IntelliJ", "Docker",
    "GitLab", "GitHub", "NPM", "Vercel", "Netlify"
  ];

  const roles = [
    "Software Engineer", "Senior Software Engineer", "Staff Engineer",
    "Frontend Engineer", "Backend Engineer", "Full Stack Engineer",
    "DevOps Engineer", "Cloud Engineer", "Systems Engineer",
    "ML Engineer", "Data Engineer", "Data Scientist",
    "Product Manager", "Engineering Manager", "Tech Lead",
    "Security Engineer", "Solutions Architect", "QA Engineer",
    "Mobile Engineer", "iOS Developer", "Android Developer",
    "Database Engineer", "Infrastructure Engineer", "Network Engineer"
  ];

  const locations = [
    "Remote", "San Francisco, CA", "New York, NY", "Seattle, WA",
    "Los Angeles, CA", "Austin, TX", "Denver, CO", "Chicago, IL",
    "Boston, MA", "London, UK", "Berlin, Germany", "Amsterdam, Netherlands",
    "Singapore", "Sydney, Australia", "Toronto, Canada", "Mountain View, CA",
    "Menlo Park, CA", "Cupertino, CA", "Redmond, WA", "Seattle, WA"
  ];

  const allJobs = [...baseJobs];
  let id = baseJobs.length;

  while (allJobs.length < targetCount) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];

    allJobs.push({
      title: `${role}${Math.random() > 0.7 ? " - " + role.split(" ")[0] : ""}`,
      company,
      location,
      source_key: company.toLowerCase(),
      url: `https://${company.toLowerCase()}.com/careers`,
      description: `Join ${company} as a ${role}. Build innovative products and grow your career.`,
    });

    id++;
  }

  return allJobs;
}

/**
 * Seed jobs database with 1000+ entries
 */
export async function seedJobsDatabase() {
  try {
    const allJobs = generateAdditionalJobs(jobsData, 1050);

    let inserted = 0;
    for (const job of allJobs) {
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      try {
        await exec(
          `INSERT INTO jobs (id, title, company, location, url, source_key, updated_at, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
           ON CONFLICT (id) DO NOTHING`,
          [jobId, job.title, job.company, job.location, job.url, job.source_key]
        );

        // Add job details
        const skills = extractSkillsForRole(job.title);
        const seniority = extractSeniorityLevel(job.title);
        
        await exec(
          `INSERT INTO job_details (id, job_id, skills_required, seniority_level, employment_type)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (job_id) DO NOTHING`,
          [
            `jobdetail_${jobId}`,
            jobId,
            JSON.stringify(skills),
            seniority,
            "FULL_TIME"
          ]
        );

        inserted++;
      } catch (e) {
        console.warn(`Skipped job: ${job.title}`, e.message);
      }
    }

    console.log(`✅ Seeded ${inserted} jobs into database`);
    return inserted;
  } catch (error) {
    console.error("Seed Jobs Error:", error);
    throw error;
  }
}

function extractSkillsForRole(title) {
  const skills = [];
  const titleLower = title.toLowerCase();

  // Programming languages
  if (titleLower.includes("python")) skills.push("Python");
  if (titleLower.includes("java")) skills.push("Java");
  if (titleLower.includes("c#") || titleLower.includes("c sharp")) skills.push("C#");
  if (titleLower.includes("go")) skills.push("Go");
  if (titleLower.includes("rust")) skills.push("Rust");

  // Frontend
  if (titleLower.includes("frontend") || titleLower.includes("react"))
    skills.push("React", "JavaScript", "HTML", "CSS");
  if (titleLower.includes("angular")) skills.push("Angular", "TypeScript");
  if (titleLower.includes("vue")) skills.push("Vue", "JavaScript");

  // Backend
  if (titleLower.includes("backend") || titleLower.includes("node"))
    skills.push("Node.js", "Express", "JavaScript");
  if (titleLower.includes("django")) skills.push("Django", "Python");
  if (titleLower.includes("flask")) skills.push("Flask", "Python");

  // Cloud & DevOps
  if (titleLower.includes("devops") || titleLower.includes("cloud"))
    skills.push("Docker", "Kubernetes", "AWS");
  if (titleLower.includes("aws")) skills.push("AWS");
  if (titleLower.includes("azure")) skills.push("Azure");
  if (titleLower.includes("gcp")) skills.push("GCP");

  // Databases
  if (titleLower.includes("database"))
    skills.push("PostgreSQL", "MongoDB", "SQL");

  // ML/AI
  if (titleLower.includes("ml") || titleLower.includes("machine learning"))
    skills.push("Python", "TensorFlow", "PyTorch", "Machine Learning");
  if (titleLower.includes("data")) skills.push("SQL", "Python", "Analytics");

  // Mobile
  if (titleLower.includes("ios")) skills.push("Swift", "iOS");
  if (titleLower.includes("android")) skills.push("Kotlin", "Android");

  // Default skills
  if (skills.length === 0) {
    skills.push("Problem Solving", "Communication", "Teamwork");
  }

  return [...new Set(skills)];
}

function extractSeniorityLevel(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("staff") || titleLower.includes("principal"))
    return "lead";
  if (titleLower.includes("senior")) return "senior";
  if (titleLower.includes("junior")) return "entry";
  return "mid";
}

export default { seedJobsDatabase };
