import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import ResumeUploader from "../components/ResumeUploader.jsx";
import ATSScoreboard from "../components/ATSScoreboard.jsx";
import JobMatcher from "../components/JobMatcher.jsx";
import CoverLetterGenerator from "../components/CoverLetterGenerator.jsx";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [resumeData, setResumeData] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [currentStep, setCurrentStep] = useState("view");
  const [loading, setLoading] = useState(true);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const avatarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    const savedResume = localStorage.getItem("currentResume");
    const savedResumeId = localStorage.getItem("currentResumeId");

    console.log("📋 Dashboard mounted - Checking auth:");
    console.log("  accessToken:", !!accessToken, accessToken?.substring(0, 20) + "..." || "none");
    console.log("  userData:", userData ? JSON.parse(userData).name : "none");

    if (!accessToken || !userData) {
      console.log("❌ No token or user data, redirecting to login");
      navigate("/login");
      return;
    }

    console.log("✅ User authenticated:", JSON.parse(userData).name);
    setUser(JSON.parse(userData));
    
    // Load saved resume if exists
    if (savedResume && savedResumeId) {
      console.log("📄 Loaded saved resume");
      setResumeData(JSON.parse(savedResume));
      setResumeId(savedResumeId);
      setCurrentStep("view");
    } else {
      console.log("📤 No saved resume, showing upload");
      setCurrentStep("upload");
    }
    
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("currentResume");
    localStorage.removeItem("currentResumeId");
    navigate("/login");
  };

  const handleResumeUploaded = (data, id) => {
    const parsedData = data?.parsedData || data;
    setResumeData(parsedData);
    setResumeId(id || data?.resumeId);
    
    // Save to localStorage
    localStorage.setItem("currentResume", JSON.stringify(parsedData));
    localStorage.setItem("currentResumeId", id || data?.resumeId);
    
    setCurrentStep("view");
  };

  const handleUploadNew = () => {
    setCurrentStep("upload");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={tab} onTabChange={setTab} user={user} onLogout={handleLogout} />

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-content">
            <div className="topbar-left">
              <a href="/" className="topbar-brand">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="topbar-logo-icon">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <span className="topbar-brand-text">SeekRemoteJobs</span>
              </a>
              <nav className="topbar-nav">
                <a href="/" className="topbar-nav-link">Browse Jobs</a>
                <span className="topbar-nav-divider">•</span>
                <span className="topbar-nav-link active">Dashboard</span>
              </nav>
            </div>
            <h1 className="page-title">
              {tab === "home"         ? "Dashboard"
              : tab === "resumes"     ? "My Resumes"
              : tab === "tailored"    ? "Tailored Variations"
              : tab === "saved-jobs"  ? "Saved Jobs"
              : tab === "applications"? "Applications"
              : "Dashboard"}
            </h1>
            <div className="topbar-user-section" ref={avatarRef}>
              <button
                className="topbar-avatar-btn"
                onClick={() => setAvatarDropdownOpen((v) => !v)}
                aria-label="User menu"
              >
                <div className="topbar-avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
                <span className="topbar-user-name">{user?.name}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="topbar-chevron" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {avatarDropdownOpen && (
                <div className="topbar-dropdown" role="menu">
                  <div className="topbar-dropdown-header">
                    <p className="topbar-dropdown-name">{user?.name}</p>
                    <p className="topbar-dropdown-email">{user?.email}</p>
                  </div>
                  <button
                    className="topbar-dropdown-logout"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content">
          {/* Dashboard Home */}
          {tab === "home" && (
            <div className="dashboard-home">
              <div className="welcome-section">
                <h2>Welcome back, {user?.name}!</h2>
                <p>Your remote job command centre. Pick up where you left off.</p>
              </div>

              {resumeData && (
                <div className="resume-summary-card">
                  <div className="resume-summary-header">
                    <h3>📄 Active Resume</h3>
                    <button className="btn-link" onClick={() => { setTab("resumes"); setCurrentStep("upload"); }}>
                      Upload New
                    </button>
                  </div>
                  <div className="resume-summary-content">
                    <p><strong>{resumeData?.personal?.name || "Your Resume"}</strong></p>
                    {resumeData?.skills && resumeData.skills.length > 0 && (
                      <p><strong>Key Skills:</strong> {resumeData.skills.slice(0, 5).join(", ")}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Primary CTA Banner */}
              <div className="cta-optimize-banner">
                <div className="cta-optimize-content">
                  <div className="cta-optimize-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
                      <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75z"/>
                    </svg>
                  </div>
                  <div className="cta-optimize-text">
                    <h3>Optimize Your Base Resume for a Job</h3>
                    <p>Upload your resume, let AI parse it, then tailor bullet points to any job description — country-specific formats included (US/Canada ATS, European CV, Gulf).</p>
                  </div>
                </div>
                <button
                  className="cta-optimize-btn"
                  onClick={() => { setTab("resumes"); setCurrentStep(resumeData ? "view" : "upload"); }}
                >
                  {resumeData ? "Go to My Resumes →" : "Upload Resume →"}
                </button>
              </div>

              {/* Quick Nav Cards */}
              <div className="quick-nav-grid">
                <div className="quick-nav-card" onClick={() => setTab("tailored")}>
                  <span className="quick-nav-label">Tailored Variations</span>
                  <span className="quick-nav-arrow">→</span>
                </div>
                <div className="quick-nav-card" onClick={() => setTab("saved-jobs")}>
                  <span className="quick-nav-label">Saved Jobs</span>
                  <span className="quick-nav-arrow">→</span>
                </div>
                <div className="quick-nav-card" onClick={() => setTab("applications")}>
                  <span className="quick-nav-label">Applications</span>
                  <span className="quick-nav-arrow">→</span>
                </div>
              </div>
            </div>
          )}

          {/* My Resumes */}
          {tab === "resumes" && (
            <div className="resume-builder-section">
              {resumeData && (
                <div className="builder-tabs">
                  <button
                    className={`builder-tab ${currentStep === "view" ? "active" : ""}`}
                    onClick={() => setCurrentStep("view")}
                  >
                    📋 My Resume
                  </button>
                  <button
                    className={`builder-tab ${currentStep === "ats" ? "active" : ""}`}
                    onClick={() => setCurrentStep("ats")}
                  >
                    📊 ATS Analysis
                  </button>
                  <button
                    className={`builder-tab ${currentStep === "jobs" ? "active" : ""}`}
                    onClick={() => setCurrentStep("jobs")}
                  >
                    💼 Job Matches
                  </button>
                  <button
                    className={`builder-tab ${currentStep === "letter" ? "active" : ""}`}
                    onClick={() => setCurrentStep("letter")}
                  >
                    ✍️ Cover Letter
                  </button>
                  <button className="builder-tab builder-tab-secondary" onClick={handleUploadNew}>
                    ⬆️ Upload New
                  </button>
                </div>
              )}

              {currentStep === "view" && resumeData && (
                <div className="builder-content">
                  <div className="resume-view-card">
                    <h3>📄 Your Resume</h3>
                    <div className="resume-info">
                      <div className="info-section">
                        <h4>Personal Information</h4>
                        <p><strong>Name:</strong> {resumeData?.personal?.name || "N/A"}</p>
                        <p><strong>Email:</strong> {resumeData?.personal?.email || "N/A"}</p>
                        <p><strong>Phone:</strong> {resumeData?.personal?.phone || "N/A"}</p>
                        <p><strong>Location:</strong> {resumeData?.personal?.location || "N/A"}</p>
                      </div>
                      
                      {resumeData?.skills && resumeData.skills.length > 0 && (
                        <div className="info-section">
                          <h4>Skills ({resumeData.skills.length})</h4>
                          <div className="skills-list">
                            {resumeData.skills.slice(0, 15).map((skill, idx) => (
                              <span key={idx} className="skill-badge">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData?.experience && resumeData.experience.length > 0 && (
                        <div className="info-section">
                          <h4>Experience ({resumeData.experience.length})</h4>
                          {resumeData.experience.slice(0, 3).map((exp, idx) => (
                            <p key={idx}><strong>{exp.position}</strong> at {exp.company}</p>
                          ))}
                        </div>
                      )}

                      {resumeData?.education && resumeData.education.length > 0 && (
                        <div className="info-section">
                          <h4>Education ({resumeData.education.length})</h4>
                          {resumeData.education.slice(0, 2).map((edu, idx) => (
                            <p key={idx}><strong>{edu.degree}</strong> in {edu.field}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="action-btn" onClick={handleUploadNew}>Upload Different Resume</button>
                  </div>
                </div>
              )}

              {currentStep === "upload" && (
                <div className="builder-content">
                  <div className="upload-container">
                    <ResumeUploader onUploadSuccess={handleResumeUploaded} />
                  </div>
                </div>
              )}

              {currentStep === "ats" && resumeData && (
                <div className="builder-content">
                  <ATSScoreboard resumeId={resumeId} resumeData={resumeData} />
                </div>
              )}

              {currentStep === "jobs" && resumeData && (
                <div className="builder-content">
                  <JobMatcher resumeId={resumeId} resumeData={resumeData} />
                </div>
              )}

              {currentStep === "letter" && resumeData && (
                <div className="builder-content">
                  <CoverLetterGenerator resumeId={resumeId} resumeData={resumeData} />
                </div>
              )}
            </div>
          )}

          {/* Tailored Variations */}
          {tab === "tailored" && (
            <div className="placeholder-section">
              <div className="placeholder-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
                  <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75z"/>
                </svg>
              </div>
              <h3>Tailored Variations</h3>
              <p>Your AI-rewritten resume variations for specific job applications will appear here. Start by uploading a base resume and tailoring it to a job listing.</p>
              <button className="action-btn" onClick={() => setTab("resumes")}>Go to My Resumes →</button>
            </div>
          )}

          {/* Saved Jobs */}
          {tab === "saved-jobs" && (
            <div className="placeholder-section">
              <div className="placeholder-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>Saved Jobs</h3>
              <p>Bookmark listings from our job board and manage them here. Browse remote jobs and save any role that interests you.</p>
              <a href="/" className="action-btn" style={{ display: "inline-block", textDecoration: "none" }}>Browse Jobs →</a>
            </div>
          )}

          {/* Applications */}
          {tab === "applications" && (
            <div className="placeholder-section">
              <div className="placeholder-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <h3>Applications Pipeline</h3>
              <p>Track the status of every job application you've sent — from applied to offer. Your pipeline board will appear here.</p>
              <button className="action-btn" onClick={() => setTab("saved-jobs")}>View Saved Jobs →</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
