import React, { useState } from "react";
import "../styles/CoverLetterGenerator.css";

export function CoverLetterGenerator({ resumeId }) {
  const [jobDetails, setJobDetails] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
  });
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!jobDetails.jobDescription || !jobDetails.companyName) {
      setError("Please fill in company name and job description");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        setError("Not authenticated. Please log in first.");
        setGenerating(false);
        return;
      }

      const response = await fetch(`/api/resumes/${resumeId}/cover-letter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(jobDetails),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setCoverLetter(data.coverLetter);
    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate cover letter");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cover_letter_${jobDetails.companyName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="cover-letter-generator">
      <div className="generator-header">
        <h2>✨ Cover Letter Generator</h2>
        <p>AI-powered personalized cover letters in seconds</p>
      </div>

      {!coverLetter ? (
        <div className="generator-form">
          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              placeholder="e.g., Google, Meta, Stripe"
              value={jobDetails.companyName}
              onChange={(e) =>
                setJobDetails({ ...jobDetails, companyName: e.target.value })
              }
              disabled={generating}
            />
          </div>

          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              placeholder="e.g., Senior Backend Engineer"
              value={jobDetails.jobTitle}
              onChange={(e) =>
                setJobDetails({ ...jobDetails, jobTitle: e.target.value })
              }
              disabled={generating}
            />
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea
              placeholder="Paste the full job description..."
              value={jobDetails.jobDescription}
              onChange={(e) =>
                setJobDetails({ ...jobDetails, jobDescription: e.target.value })
              }
              disabled={generating}
              rows={6}
            />
          </div>

          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={generating || !jobDetails.companyName || !jobDetails.jobDescription}
          >
            {generating ? "Generating..." : "Generate Cover Letter"}
          </button>
        </div>
      ) : (
        <div className="letter-preview">
          <div className="letter-content">{coverLetter}</div>

          <div className="letter-actions">
            <button className="copy-button" onClick={() => {
              navigator.clipboard.writeText(coverLetter);
              alert("Copied to clipboard!");
            }}>
              📋 Copy to Clipboard
            </button>
            <button className="download-button" onClick={handleDownload}>
              ⬇️ Download
            </button>
            <button className="regenerate-button" onClick={() => setCoverLetter(null)}>
              🔄 Generate Another
            </button>
          </div>
        </div>
      )}

      {error && <div className="generator-error">{error}</div>}
    </div>
  );
}

export default CoverLetterGenerator;
