import React, { useState, useRef } from "react";
import "../styles/ResumeUploader.css";

export function ResumeUploader({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("country", "us");

    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log("📝 Resume upload - Token check:", !!accessToken);
      
      if (!accessToken) {
        setError("Not authenticated. Please log in first.");
        setUploading(false);
        return;
      }

      console.log("🚀 Uploading resume with token:", accessToken.substring(0, 20) + "...");
      const response = await fetch("/api/resumes/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      console.log("📥 Server response status:", response.status);
      console.log("📥 Response headers:", response.headers);
      
      // Get response text first to debug
      const responseText = await response.text();
      console.log("📥 Raw response:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("❌ Failed to parse JSON response:", parseErr);
        console.error("Response was:", responseText);
        setError("Server error: Invalid response format. Check browser console.");
        setUploading(false);
        return;
      }
      
      console.log("📦 Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || `Upload failed (${response.status})`);
      }

      if (onUploadSuccess) {
        onUploadSuccess(data, data.resumeId);
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err.message || "Upload failed. Please check your API keys and network connection.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="resume-uploader">
      <div
        className={`upload-area ${isDragging ? "dragging" : ""} ${uploading ? "uploading" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-icon">📄</div>
        <h3>Upload Your Resume</h3>
        <p>Drag and drop your PDF here or click to browse</p>
        <p className="upload-hint">PDF file, max 10MB</p>

        {uploading && <div className="uploading-spinner">⏳ Processing your resume with AI...</div>}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          disabled={uploading}
          hidden
        />
      </div>

      {error && <div className="upload-error">❌ {error}</div>}
    </div>
  );
}

export default ResumeUploader;
