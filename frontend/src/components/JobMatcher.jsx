import React, { useState } from "react";
import "../styles/JobMatcher.css";

export function JobMatcher({ resumeId, resumeData }) {
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState(null);

  const handleMatchJobs = async () => {
    setMatching(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        setError("Not authenticated. Please log in first.");
        setMatching(false);
        return;
      }

      const response = await fetch(`/api/resumes/${resumeId}/match-jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ limit: 50 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Matching failed");
      }

      setMatches(data);
    } catch (err) {
      console.error("Matching error:", err);
      setError(err.message || "Failed to match jobs");
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="job-matcher">
      <div className="matcher-header">
        <h2>🎯 Match Against Jobs</h2>
        <p>Find the best fitting positions from {matches?.totalMatches || "1000+"} available jobs</p>
      </div>

      {!matches ? (
        <button
          className="match-button"
          onClick={handleMatchJobs}
          disabled={matching}
        >
          {matching ? "Analyzing..." : "Find Matching Jobs"}
        </button>
      ) : (
        <div className="matches-container">
          <div className="match-summary">
            <div className="summary-card excellent">
              <div className="summary-number">{matches.summary.excellentMatches}</div>
              <div className="summary-label">Excellent Matches</div>
              <div className="summary-desc">80%+ compatibility</div>
            </div>
            <div className="summary-card good">
              <div className="summary-number">{matches.summary.goodMatches}</div>
              <div className="summary-label">Good Matches</div>
              <div className="summary-desc">60-80% compatibility</div>
            </div>
            <div className="summary-card possible">
              <div className="summary-number">{matches.summary.possibleMatches}</div>
              <div className="summary-label">Possible Matches</div>
              <div className="summary-desc">40-60% compatibility</div>
            </div>
          </div>

          <div className="top-matches">
            <h3>Top 10 Matches</h3>
            <div className="matches-list">
              {matches.topMatches.map((match, idx) => (
                <div key={idx} className={`match-item score-${match.recommendation}`}>
                  <div className="match-score">{Math.round(match.overallScore)}%</div>
                  <div className="match-details">
                    <h4>{match.jobTitle}</h4>
                    <p className="company">{match.company}</p>
                    <p className="location">{match.location}</p>
                    <div className="match-breakdown">
                      <span className="skill">Skills: {match.skillMatchScore}%</span>
                      <span className="experience">Exp: {match.experienceMatchScore}%</span>
                      <span className="location-match">Location: {match.locationMatchScore}%</span>
                    </div>
                    {match.missingKeywords && match.missingKeywords.length > 0 && (
                      <div className="missing-skills">
                        <strong>Missing:</strong> {match.missingKeywords.slice(0, 3).join(", ")}
                        {match.missingKeywords.length > 3 && " +more"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <div className="matcher-error">{error}</div>}
    </div>
  );
}

export default JobMatcher;
