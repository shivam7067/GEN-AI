import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style/home.scss";
import { useInterview } from "../hooks/useinterview";
import { useAuth } from "../../auth/hooks/useAuth";

const SAMPLE_PRESETS = [
  {
    role: "Full Stack (MERN)",
    icon: "🚀",
    job: "Senior Full Stack Developer with 3+ years experience. Strong proficiency in React, Node.js, Express, MongoDB, RESTful APIs, JWT authentication, state management, and modern responsive CSS. Experience with Docker and CI/CD pipelines is a plus.",
    self: "3+ years of full stack web development experience building scalable web apps with React, Node.js, Express, and MongoDB. Led frontend migration to React 18, implemented secure OAuth/JWT auth, and optimized database queries."
  },
  {
    role: "Frontend Engineer (React)",
    icon: "⚡",
    job: "Frontend Engineer specializing in React, TypeScript, modern CSS architectures, performance optimization (Core Web Vitals), component design systems, and responsive web development.",
    self: "Frontend specialist with deep expertise in React, JavaScript/TypeScript, UI/UX design systems, web performance optimization, and responsive design for mobile & desktop."
  },
  {
    role: "Backend & Cloud Engineer",
    icon: "☁️",
    job: "Backend Engineer to build high-throughput microservices in Node.js/Python, manage relational and NoSQL databases (PostgreSQL, Redis), implement caching, message queues, and cloud deployments on AWS.",
    self: "Backend engineer experienced in designing scalable REST & GraphQL APIs, distributed caching with Redis, database schema design, and deploying containerized services with Docker."
  },
  {
    role: "AI & ML Engineer",
    icon: "🧠",
    job: "AI Engineer experienced in GenAI, LLM integration, prompt engineering, RAG pipelines, LangChain, Python, vector databases (Pinecone, ChromaDB), and API orchestration.",
    self: "AI engineer skilled in building generative AI applications, vector search architectures, fine-tuning prompts, and deploying production LLM agents using Python and modern frameworks."
  }
];

const Home = () => {
  const { handleGenerateReport, loading } = useInterview();
  const { user, handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const resumeRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("Please upload a valid PDF document.");
        setFileName("");
        setFileSize("");
        return;
      }
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + " KB");
      setError("");
    } else {
      setFileName("");
      setFileSize("");
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFileName("");
    setFileSize("");
    if (resumeRef.current) {
      resumeRef.current.value = "";
    }
  };

  const applyPreset = (preset) => {
    setJobDescription(preset.job);
    setSelfDescription(preset.self);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const resume = resumeRef.current?.files?.[0];

    if (!jobDescription.trim()) {
      setError("Please provide a target job description to analyze.");
      return;
    }

    if (!resume && !selfDescription.trim()) {
      setError("Please upload a resume PDF or enter your background summary.");
      return;
    }

    try {
      const data = await handleGenerateReport({ selfDescription, jobDescription, resume });
      const reportData = data?.report || data?.interviewReport || data;

      navigate("/interview", {
        state: {
          report: reportData
        }
      });
    } catch (err) {
      console.error("Failed to generate interview report:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate interview report. Please verify backend connectivity and try again."
      );
    }
  };

  const userDisplayName = user?.username || user?.email?.split("@")[0] || "Candidate";
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <div className="home-container">
      {/* Top Navigation */}
      <header className="home-navbar">
        <div className="nav-brand">
          <div className="brand-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <span className="brand-title">SR-GENAI</span>
          <span className="brand-tag">Coach AI</span>
        </div>

        <div className="nav-user-actions">
          <div className="user-pill" title={user?.email || ""}>
            <span className="avatar-circle">{userInitial}</span>
            <span className="user-name">{userDisplayName}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="button danger-button btn-logout"
            title="Sign out of your session"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="home-main-content">
        {/* Hero Section */}
        <section className="home-hero">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            Next-Gen AI Interview Intelligence
          </div>
          <h1>
            Prepare for Your Dream Job with{" "}
            <span className="gradient-text-cyan">Precision AI</span>
          </h1>
          <p className="hero-subtitle">
            Upload your resume and the target job description to get predictive technical questions,
            behavioral prompts, skill gap diagnostics, and a tailored preparation roadmap.
          </p>
        </section>

        {/* Quick Role Presets */}
        <section className="preset-section">
          <span className="preset-title">⚡ Quick Presets (Click to autofill)</span>
          <div className="preset-chips">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-chip"
                onClick={() => applyPreset(preset)}
                disabled={loading}
              >
                <span>{preset.icon}</span>
                <span>{preset.role}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Generator Form Card */}
        <section className="generator-card">
          {error && (
            <div className="error-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* 2-Column Responsive Inputs Grid */}
          <div className="inputs-grid">
            {/* Target Job Description */}
            <div className="input-box">
              <div className="box-header">
                <label htmlFor="jobDescription">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#10b981" }}>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <span>Target Job Description</span>
                  <span className="required-star">*</span>
                </label>
                {jobDescription && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => setJobDescription("")}
                    disabled={loading}
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                name="jobDescription"
                id="jobDescription"
                placeholder="Paste the job requirements, tech stack, and responsibilities here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={loading}
              />
              <div className="box-footer">
                <span>Required for AI targeting</span>
                <span>{jobDescription.length} characters</span>
              </div>
            </div>

            {/* Self Description / Background */}
            <div className="input-box">
              <div className="box-header">
                <label htmlFor="selfDescription">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#06b6d4" }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Candidate Profile & Strengths</span>
                </label>
                {selfDescription && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => setSelfDescription("")}
                    disabled={loading}
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly summarize your experience, tech stack, top projects, or key skills..."
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                disabled={loading}
              />
              <div className="box-footer">
                <span>Can be supplemented by PDF resume below</span>
                <span>{selfDescription.length} characters</span>
              </div>
            </div>
          </div>

          {/* Resume Upload Box */}
          <div className="resume-upload-wrapper">
            <span className="upload-label">Resume Attachment (PDF)</span>

            {fileName ? (
              <div className="file-selected-badge">
                <div className="file-info">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <strong>{fileName}</strong>
                  <span style={{ opacity: 0.8, fontSize: "0.8rem" }}>({fileSize})</span>
                </div>
                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={handleRemoveFile}
                  disabled={loading}
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <label
                className={`dropzone ${isDragging ? "dragging" : ""}`}
                htmlFor="resume"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const dropped = e.dataTransfer.files[0];
                    if (dropped.name.toLowerCase().endsWith(".pdf")) {
                      setFileName(dropped.name);
                      setFileSize((dropped.size / 1024).toFixed(1) + " KB");
                      if (resumeRef.current) {
                        resumeRef.current.files = e.dataTransfer.files;
                      }
                    } else {
                      setError("Please drop a valid PDF file.");
                    }
                  }
                }}
              >
                <div className="dropzone-left">
                  <div className="upload-icon-box">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div className="dropzone-text">
                    <span className="title">Upload your Resume (PDF)</span>
                    <span className="desc">Drag & drop your PDF file here, or click to browse</span>
                  </div>
                </div>
                <span className="dropzone-action">Browse PDF</span>
              </label>
            )}

            <input
              ref={resumeRef}
              hidden
              type="file"
              id="resume"
              name="resume"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          {/* Submit Action */}
          <div className="submit-action">
            <button
              onClick={handleSubmit}
              type="button"
              disabled={loading}
              className="button primary-button btn-generate"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Synthesizing Interview Strategy...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  <span>Generate Interview Intelligence Report →</span>
                </>
              )}
            </button>
            <span className="action-caption">
              ⚡ Powered by Gemini AI • Real-time analysis of job requirements vs your profile
            </span>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="features-strip">
          <div className="feature-card">
            <div className="feature-icon-wrapper tech">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <h3>Predictive Technical Questions</h3>
            <p>Targeted technical scenarios tailored to the tech stack and level specified in the job description.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper skills">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m4.93 4.93 4.24 4.24"></path>
                <path d="m14.83 9.17 4.24-4.24"></path>
                <path d="m14.83 14.83 4.24 4.24"></path>
                <path d="m9.17 14.83-4.24 4.24"></path>
              </svg>
            </div>
            <h3>Skill Gap Diagnostics</h3>
            <p>Identify missing prerequisites, critical blindspots, and severity levels before you enter the interview.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper plan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3>Day-by-Day Preparation Plan</h3>
            <p>A structured, actionable revision timeline with daily focus areas, study tasks, and mock scenarios.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;