import React, { useState, useEffect } from "react";
import "../styles/RemoteJobs.css";

const Icons = {
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  DollarSign: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Bookmark: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

const MOCK_JOBS = [
  {
    id: "1",
    title: "Senior Full Stack Engineer",
    company: "Stripe",
    location: "Remote (US)",
    salary: "$180k - $240k",
    type: "Full-time",
    skills: ["React", "Node.js", "PostgreSQL"],
    postedDate: "2 days ago",
    description: "Join our team to build payment infrastructure",
  },
  {
    id: "2",
    title: "Product Designer",
    company: "Figma",
    location: "Remote (Global)",
    salary: "$150k - $200k",
    type: "Full-time",
    skills: ["Figma", "UI/UX", "Prototyping"],
    postedDate: "1 week ago",
    description: "Design the future of collaborative design tools",
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "GitHub",
    location: "Remote (US/EU)",
    salary: "$160k - $220k",
    type: "Full-time",
    skills: ["Kubernetes", "Docker", "AWS"],
    postedDate: "3 days ago",
    description: "Build infrastructure for millions of developers",
  },
  {
    id: "4",
    title: "Machine Learning Engineer",
    company: "OpenAI",
    location: "Remote (Flexible)",
    salary: "$200k - $300k",
    type: "Full-time",
    skills: ["Python", "TensorFlow", "ML"],
    postedDate: "4 days ago",
    description: "Work on cutting-edge AI systems",
  },
  {
    id: "5",
    title: "Frontend Engineer",
    company: "Vercel",
    location: "Remote (Global)",
    salary: "$140k - $200k",
    type: "Full-time",
    skills: ["Next.js", "TypeScript", "React"],
    postedDate: "1 day ago",
    description: "Build the frontend development platform",
  },
  {
    id: "6",
    title: "Backend Engineer",
    company: "Databricks",
    location: "Remote (US/EU)",
    salary: "$170k - $230k",
    type: "Full-time",
    skills: ["Scala", "Spark", "JVM"],
    postedDate: "5 days ago",
    description: "Scale the data and AI platform",
  },
];

export default function RemoteJobs() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("/api/jobs?limit=20", {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
        } else {
          setJobs(MOCK_JOBS);
        }
      } else {
        setJobs(MOCK_JOBS);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs(MOCK_JOBS);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="remote-jobs-container">
      <div className="jobs-header">
        <h1>Remote Job Opportunities</h1>
        <p>Browse {filteredJobs.length} remote positions from top companies</p>
      </div>

      <div className="jobs-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="jobs-loading">
          <div className="spinner"></div>
          <p>Loading remote jobs...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                </div>
                <button className="bookmark-btn">
                  <Icons.Bookmark />
                </button>
              </div>

              <div className="job-details">
                <div className="detail-item">
                  <Icons.MapPin />
                  <span>{job.location}</span>
                </div>
                <div className="detail-item">
                  <Icons.DollarSign />
                  <span>{job.salary}</span>
                </div>
                <div className="detail-item">
                  <Icons.Clock />
                  <span>{job.type}</span>
                </div>
              </div>

              <p className="job-description">{job.description}</p>

              <div className="job-skills">
                {job.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="job-footer">
                <span className="posted-date">{job.postedDate}</span>
                <div className="job-actions">
                  <button className="btn-secondary">View</button>
                  <button className="btn-primary">Apply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="jobs-empty">
          <p>No jobs found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
