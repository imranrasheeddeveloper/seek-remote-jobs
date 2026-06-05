import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [stats, setStats] = useState({ totalJobs: 0, totalCompanies: 0, totalLocations: 0 });
  const navigate = useNavigate();
  const jobsSectionRef = useRef(null);

  useEffect(() => {
    loadJobs();
    loadStats();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await fetch("/api/jobs?limit=25");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleGetStarted = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="job-board-page">
      {/* Navigation */}
      <header className="page-header">
        <div className="header-container">
          <div className="logo-section">
            <svg viewBox="0 0 24 24" fill="none" className="logo-small">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="url(#grad)" />
              <path d="M8 15.5l3-3 2 2 3.5-3.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="grad" x1="3" y1="3" x2="22" y2="22">
                  <stop stopColor="#4f46e5" />
                  <stop offset="1" stopColor="#0284c7" />
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">SeekRemoteJobs</span>
          </div>

          <div className="nav-links">
            <a href="#jobs">Browse Jobs</a>
            <a href="#features">Features</a>
          </div>

          <div className="auth-buttons">
            <button className="btn-secondary" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Find Your <span className="gradient-text">Remote Dream Job</span>
          </h1>
          <p className="hero-subtitle">
            AI-powered resume optimization and job matching. Browse {stats.totalJobs.toLocaleString()}+ remote positions from {stats.totalCompanies}+ top companies.
          </p>

          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="search-input-wrap">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by job title or company..."
                className="search-input"
              />
            </div>
            <button type="button" className="btn-primary" onClick={handleGetStarted}>
              Get Started with AI Resume Builder
            </button>
          </form>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-value">{stats.totalJobs.toLocaleString()}+</span>
              <span className="stat-label">Remote Jobs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.totalCompanies}+</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Daily</span>
              <span className="stat-label">Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-container">
          <h2>Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>AI Resume Builder</h3>
              <p>Upload your resume and let AI optimize it for ATS compatibility and job matches.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>ATS Score Analysis</h3>
              <p>Get instant ATS scores and recommendations to improve your resume's effectiveness.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Job Matching</h3>
              <p>Match your resume against 1000+ jobs with AI-powered compatibility scoring.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✍️</div>
              <h3>Cover Letter AI</h3>
              <p>Generate personalized cover letters in seconds for each job application.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📧</div>
              <h3>Job Alerts</h3>
              <p>Receive personalized job recommendations directly in your inbox.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>100% Private</h3>
              <p>Your resume and data are never stored or shared with third parties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs-section" id="jobs" ref={jobsSectionRef}>
        <div className="jobs-container">
          <h2>Latest Remote Opportunities</h2>

          {loading ? (
            <div className="loading-state">
              <p>Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              <p>No jobs found. Try a different search.</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="job-card"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="job-header">
                    <div>
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-company">{job.company}</p>
                    </div>
                    <span className="job-remote-badge">🌐 Remote</span>
                  </div>
                  <div className="job-meta">
                    <span>📍 {job.location || "Worldwide"}</span>
                    <span>📅 {new Date(job.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="job-apply-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Apply Now →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Land Your Remote Job?</h2>
          <p>Join thousands of job seekers using AI to get hired faster.</p>
          <button className="btn-primary btn-large" onClick={handleGetStarted}>
            Start with Free AI Resume Builder
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="page-footer">
        <div className="footer-content">
          <p>&copy; 2026 SeekRemoteJobs. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedJob(null)}>×</button>
            <h2>{selectedJob.title}</h2>
            <p className="job-company-modal">{selectedJob.company}</p>
            <div className="modal-meta">
              <span>📍 {selectedJob.location || "Worldwide"}</span>
              <span>📅 {new Date(selectedJob.updatedAt).toLocaleDateString()}</span>
            </div>
            <a href={selectedJob.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
              View Full Job & Apply
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
