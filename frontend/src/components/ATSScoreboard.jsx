import React, { useState } from "react";
import "../styles/ATSScoreboard.css";

export function ATSScoreboard({ resumeId }) {
  const [jobDescription, setJobDescription] = useState("");
  const [scoring, setScoring] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description");
      return;
    }

    setScoring(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        setError("Not authenticated. Please log in first.");
        setScoring(false);
        return;
      }

      const response = await fetch(`/api/resumes/${resumeId}/optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          jobDescription: jobDescription,
          jobId: "direct-score",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Scoring failed");
      }

      setScore(data.atsScore);
    } catch (err) {
      console.error("Scoring error:", err);
      setError(err.message || "Failed to analyze job description");
    } finally {
      setScoring(false);
    }
  };

  return (
    <div className="ats-scoreboard">
      <div className="scoreboard-header">
        <h2>🎯 ATS Readiness Analyzer</h2>
        <p>Check how well your resume matches the job description</p>
      </div>

      {!score ? (
        <div className="score-input-section">
          <textarea
            className="job-description-input"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={scoring}
          />

          <button
            className="analyze-button"
            onClick={handleOptimize}
            disabled={scoring || !jobDescription.trim()}
          >
            {scoring ? "Analyzing..." : "Analyze ATS Score"}
          </button>
        </div>
      ) : (
        <div className="score-results">
          <div className="main-score">
            <div className={`score-circle score-${Math.round(score.overallScore / 20)}`}>
              <div className="score-value">{Math.round(score.overallScore)}%</div>
              <div className="score-label">ATS Score</div>
            </div>
            <div className="score-status">
              {score.overallScore >= 80 ? (
                <span className="status excellent">✓ Excellent Match</span>
              ) : score.overallScore >= 60 ? (
                <span className="status good">~ Good Match</span>
              ) : score.overallScore >= 40 ? (
                <span className="status fair">→ Fair Match</span>
              ) : (
                <span className="status poor">✗ Needs Improvement</span>
              )}
            </div>
          </div>

          <div className="score-breakdown">
            <h3>Score Breakdown</h3>
            <div className="breakdown-item">
              <span className="label">Keyword Density</span>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{ width: `${score.keywordMatchScore}%` }}
                />
              </div>
              <span className="value">{Math.round(score.keywordMatchScore || 0)}%</span>
            </div>

            <div className="breakdown-item">
              <span className="label">Readability</span>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{ width: `${score.readabilityScore}%` }}
                />
              </div>
              <span className="value">{Math.round(score.readabilityScore || 0)}%</span>
            </div>

            <div className="breakdown-item">
              <span className="label">Formatting</span>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{ width: `${score.formattingScore}%` }}
                />
              </div>
              <span className="value">{Math.round(score.formattingScore || 0)}%</span>
            </div>
          </div>

          {score.missingKeywords && score.missingKeywords.length > 0 && (
            <div className="missing-section">
              <h3>⚠️ Missing Keywords</h3>
              <div className="keywords-list">
                {score.missingKeywords.slice(0, 10).map((keyword, idx) => (
                  <span key={idx} className="keyword">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {score.recommendations && score.recommendations.length > 0 && (
            <div className="recommendations-section">
              <h3>💡 Recommendations</h3>
              <ul className="recommendations-list">
                {score.recommendations.slice(0, 5).map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <button className="reset-button" onClick={() => setScore(null)}>
            Analyze Another Job
          </button>
        </div>
      )}

      {error && <div className="score-error">{error}</div>}
    </div>
  );
}

export default ATSScoreboard;
