import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../style/interview.scss";
import { useInterview } from "../hooks/useinterview";
import { useAuth } from "../../auth/hooks/useAuth";

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [reportCopied, setReportCopied] = useState(false);

  const { interviewId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewReport, loading, handleGetReportById, setInterviewReport } = useInterview();
  const { handleLogout } = useAuth();

  useEffect(() => {
    if (location.state?.report) {
      setInterviewReport(location.state.report);
      return;
    }

    if (interviewId) {
      handleGetReportById(interviewId).catch((err) => {
        console.error("Failed to load interview report:", err);
      });
    }
  }, [interviewId, location.state]);

  useEffect(() => {
    const mainEl = document.querySelector(".report-main");
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]);

  const toggleAnswer = (idx) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  if (loading) {
    return (
      <main className="interview-report">
        <div className="state-screen">
          <div className="spinner" style={{ width: "40px", height: "40px", borderWidth: "3px", borderTopColor: "#10b981" }}></div>
          <h2>Synthesizing Interview Strategy...</h2>
          <p>Extracting competencies, generating targeted questions, and mapping your study plan.</p>
        </div>
      </main>
    );
  }

  if (!interviewReport) {
    return (
      <main className="interview-report">
        <div className="state-screen">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2>No Interview Report Found</h2>
          <p>Generate a new report with your resume and target job description to get started.</p>
          <button
            type="button"
            className="button primary-button"
            style={{ marginTop: "1rem" }}
            onClick={() => navigate("/")}
          >
            ← Return to Generator
          </button>
        </div>
      </main>
    );
  }

  const report = interviewReport;

  const candidateName =
    report.candidateName || report.candidate_name || report.name || "Candidate Assessment";
  const summary =
    report.summary || report.interview_report || "Comprehensive interview readiness analysis and tailored questions based on your profile.";
  const rawScore = report.matchScore ?? report.match_score ?? 75;
  const score = Math.max(0, Math.min(100, Number(rawScore) || 75));

  const tryParseJSON = (value) => {
    if (typeof value !== "string") return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const normalizeQuestionItems = (items) =>
    Array.isArray(items)
      ? items.map((item) => {
          if (typeof item !== "string") return item;
          const parsed = tryParseJSON(item);
          if (parsed && typeof parsed === "object" && parsed.question) {
            return parsed;
          }
          return { question: item };
        })
      : [];

  const rawTech =
    report.technicalQuestions ||
    report.technical_questions_data ||
    report.technical_questions ||
    [];
  const technicalItems = normalizeQuestionItems(rawTech);

  const rawBehavioral =
    report.behavioralQuestions ||
    report.behavioral_questions_data ||
    report.behavioral_questions ||
    [];
  const behavioralItems = normalizeQuestionItems(rawBehavioral);

  const rawSkillGaps = report.skillGaps || report.skill_gaps || [];
  const skillGaps = Array.isArray(rawSkillGaps)
    ? rawSkillGaps.map((item) => {
        if (typeof item === "string") {
          const parsed = tryParseJSON(item);
          return parsed || { skill: item, severity: "Medium" };
        }
        return item;
      })
    : [];

  const rawPlan = report.preparationPlan || report.preparation_plan || [];
  const preparationPlan = Array.isArray(rawPlan)
    ? rawPlan.map((item) => {
        if (typeof item === "string") {
          const parsed = tryParseJSON(item);
          if (parsed && typeof parsed === "object" && (parsed.day || parsed.focus || parsed.tasks || parsed.activities)) {
            return parsed;
          }
          return item;
        }
        return item;
      })
    : [];

  const getSkillName = (gap) => {
    if (!gap) return "";
    if (typeof gap === "string") return gap;
    return gap.skill || JSON.stringify(gap);
  };

  const getSkillSeverity = (gap) => {
    if (!gap || typeof gap !== "object") return "Medium";
    const sev = (gap.severity || gap.saverity || "Medium").toLowerCase();
    if (sev.includes("high") || sev.includes("crit")) return "High";
    if (sev.includes("low")) return "Low";
    return "Medium";
  };

  const handleCopyFullReport = () => {
    const reportText = `SR-GENAI Interview Preparation Report
Candidate: ${candidateName}
Match Score: ${score}%

SUMMARY:
${summary}

TECHNICAL QUESTIONS:
${technicalItems.map((q, i) => `${i + 1}. ${q.question}\nIntent: ${q.intention || "N/A"}\nAnswer: ${q.answer || "N/A"}`).join("\n\n")}

BEHAVIORAL QUESTIONS:
${behavioralItems.map((q, i) => `${i + 1}. ${q.question}\nIntent: ${q.intention || "N/A"}\nAnswer: ${q.answer || "N/A"}`).join("\n\n")}

SKILL GAPS:
${skillGaps.map((g) => `- ${getSkillName(g)} (${getSkillSeverity(g)})`).join("\n")}
`;

    navigator.clipboard.writeText(reportText);
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2500);
  };

  const scoreDegrees = `${(score / 100) * 360}deg`;
  const fitClass = score >= 80 ? "high" : score >= 60 ? "medium" : "low";
  const fitText = score >= 80 ? "Strong Fit" : score >= 60 ? "Solid Alignment" : "Needs Targeted Prep";

  return (
    <div className="interview-report">
      {/* Topbar */}
      <header className="report-topbar">
        <div className="topbar-left">
          <button
            type="button"
            className="button secondary-button btn-back"
            onClick={() => navigate("/")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back</span>
          </button>
          <div className="report-title-badge">
            <span>Report for:</span>
            <strong>{candidateName}</strong>
          </div>
        </div>

        <div className="topbar-right">
          <button
            type="button"
            className="button secondary-button btn-copy-report"
            onClick={handleCopyFullReport}
            title="Copy entire interview report to clipboard"
          >
            {reportCopied ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span style={{ color: "#6ee7b7" }}>Copied!</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Export Report</span>
              </>
            )}
          </button>
          <button
            type="button"
            className="button danger-button"
            onClick={handleLogout}
            style={{ padding: "0.45rem 0.95rem", fontSize: "0.85rem" }}
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="report-content-wrapper">
        {/* Mobile Horizontal Tabs */}
        <nav className="mobile-section-tabs" aria-label="Section tabs">
          <button
            type="button"
            className={`mobile-tab-btn ${activeSection === "technical" ? "active" : ""}`}
            onClick={() => setActiveSection("technical")}
          >
            💻 Technical ({technicalItems.length})
          </button>
          <button
            type="button"
            className={`mobile-tab-btn ${activeSection === "behavioral" ? "active" : ""}`}
            onClick={() => setActiveSection("behavioral")}
          >
            💬 Behavioral ({behavioralItems.length})
          </button>
          <button
            type="button"
            className={`mobile-tab-btn ${activeSection === "skills" ? "active" : ""}`}
            onClick={() => setActiveSection("skills")}
          >
            ⚠️ Skill Gaps ({skillGaps.length})
          </button>
          <button
            type="button"
            className={`mobile-tab-btn ${activeSection === "plan" ? "active" : ""}`}
            onClick={() => setActiveSection("plan")}
          >
            📅 Prep Plan ({preparationPlan.length})
          </button>
        </nav>

        {/* 3-Column Responsive Grid */}
        <div className="report-grid">
          {/* Left Desktop Sidebar */}
          <aside className="report-sidebar">
            <span className="sidebar-head">Navigation</span>
            <div className="sidebar-list">
              <button
                type="button"
                className={`sidebar-btn ${activeSection === "technical" ? "active" : ""}`}
                onClick={() => setActiveSection("technical")}
              >
                <div className="btn-left">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  <span>Technical Questions</span>
                </div>
                <span className="badge-count">{technicalItems.length}</span>
              </button>

              <button
                type="button"
                className={`sidebar-btn ${activeSection === "behavioral" ? "active" : ""}`}
                onClick={() => setActiveSection("behavioral")}
              >
                <div className="btn-left">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>Behavioral Questions</span>
                </div>
                <span className="badge-count">{behavioralItems.length}</span>
              </button>

              <button
                type="button"
                className={`sidebar-btn ${activeSection === "skills" ? "active" : ""}`}
                onClick={() => setActiveSection("skills")}
              >
                <div className="btn-left">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span>Skill Gaps</span>
                </div>
                <span className="badge-count">{skillGaps.length}</span>
              </button>

              <button
                type="button"
                className={`sidebar-btn ${activeSection === "plan" ? "active" : ""}`}
                onClick={() => setActiveSection("plan")}
              >
                <div className="btn-left">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Preparation Plan</span>
                </div>
                <span className="badge-count">{preparationPlan.length}d</span>
              </button>
            </div>

            <div className="sidebar-stats">
              <div className="stat-item">
                <span className="stat-label">Match Assessment</span>
                <span className="stat-value">{score}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Identified Gaps</span>
                <span className="stat-value">{skillGaps.length} areas</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Questions</span>
                <span className="stat-value">{technicalItems.length + behavioralItems.length}</span>
              </div>
            </div>
          </aside>

          {/* Center Main Panel */}
          <main className="report-main">
            {/* Score Summary Banner */}
            <section className="score-banner">
              <div className="score-meta">
                <span className={`badge-fit ${fitClass}`}>
                  <span className="pulse-dot"></span>
                  {fitText}
                </span>
                <h1>{candidateName}</h1>
                <p className="summary-text">{summary}</p>
              </div>

              <div
                className="score-meter"
                style={{ "--score-angle": scoreDegrees }}
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div className="meter-inner">
                  <strong>{score}%</strong>
                  <span>Match</span>
                </div>
              </div>
            </section>

            {/* Technical Questions Section */}
            {activeSection === "technical" && (
              <section className="section-content-box">
                <div className="section-heading-bar">
                  <h2>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                    <span>Technical Interview Questions</span>
                  </h2>
                  <span className="heading-badge">{technicalItems.length} questions targeted</span>
                </div>

                <div className="questions-list">
                  {technicalItems.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No technical questions detected in this report.</p>
                  ) : (
                    technicalItems.map((item, index) => {
                      const qText = item.question || `Technical Question ${index + 1}`;
                      const isExpanded = !!expandedAnswers[`tech-${index}`];
                      const isCopied = copiedIndex === `tech-${index}`;

                      return (
                        <article key={index} className="question-card">
                          <div className="card-top">
                            <span className="q-badge">Question #{index + 1}</span>
                            <button
                              type="button"
                              className="btn-copy"
                              onClick={() => copyToClipboard(qText, `tech-${index}`)}
                            >
                              {isCopied ? "✓ Copied" : "Copy"}
                            </button>
                          </div>

                          <h3 className="question-title">{qText}</h3>

                          {item.intention && (
                            <div className="intention-box">
                              <span className="intent-icon">💡</span>
                              <div>
                                <strong style={{ color: "#e0f2fe", display: "block", marginBottom: "2px" }}>
                                  Interviewer Intent:
                                </strong>
                                {item.intention}
                              </div>
                            </div>
                          )}

                          {item.answer && (
                            <div className="answer-accordion">
                              <button
                                type="button"
                                className="toggle-answer-btn"
                                onClick={() => toggleAnswer(`tech-${index}`)}
                              >
                                <span>{isExpanded ? "▾ Hide Recommended Answer" : "▸ Show Recommended Answer / Key Points"}</span>
                              </button>
                              {isExpanded && (
                                <div className="answer-body">
                                  {item.answer}
                                </div>
                              )}
                            </div>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            )}

            {/* Behavioral Questions Section */}
            {activeSection === "behavioral" && (
              <section className="section-content-box">
                <div className="section-heading-bar">
                  <h2>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>Behavioral & Situational Questions</span>
                  </h2>
                  <span className="heading-badge">{behavioralItems.length} questions targeted</span>
                </div>

                <div className="questions-list">
                  {behavioralItems.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No behavioral questions detected in this report.</p>
                  ) : (
                    behavioralItems.map((item, index) => {
                      const qText = item.question || `Behavioral Question ${index + 1}`;
                      const isExpanded = !!expandedAnswers[`beh-${index}`];
                      const isCopied = copiedIndex === `beh-${index}`;

                      return (
                        <article key={index} className="question-card">
                          <div className="card-top">
                            <span className="q-badge" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#d8b4fe", borderColor: "rgba(168, 85, 247, 0.3)" }}>
                              Behavioral #{index + 1}
                            </span>
                            <button
                              type="button"
                              className="btn-copy"
                              onClick={() => copyToClipboard(qText, `beh-${index}`)}
                            >
                              {isCopied ? "✓ Copied" : "Copy"}
                            </button>
                          </div>

                          <h3 className="question-title">{qText}</h3>

                          {item.intention && (
                            <div className="intention-box">
                              <span className="intent-icon">🎯</span>
                              <div>
                                <strong style={{ color: "#e0f2fe", display: "block", marginBottom: "2px" }}>
                                  Interviewer Looking For:
                                </strong>
                                {item.intention}
                              </div>
                            </div>
                          )}

                          {item.answer && (
                            <div className="answer-accordion">
                              <button
                                type="button"
                                className="toggle-answer-btn"
                                onClick={() => toggleAnswer(`beh-${index}`)}
                              >
                                <span>{isExpanded ? "▾ Hide Recommended Answer" : "▸ Show Recommended Answer / STAR Method"}</span>
                              </button>
                              {isExpanded && (
                                <div className="answer-body">
                                  {item.answer}
                                </div>
                              )}
                            </div>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            )}

            {/* Skill Gaps Section */}
            {activeSection === "skills" && (
              <section className="section-content-box">
                <div className="section-heading-bar">
                  <h2>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span>Skill Gaps & Growth Areas</span>
                  </h2>
                  <span className="heading-badge">{skillGaps.length} areas identified</span>
                </div>

                <div className="skill-gaps-grid">
                  {skillGaps.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No significant skill gaps identified. Great match!</p>
                  ) : (
                    skillGaps.map((gap, index) => {
                      const sev = getSkillSeverity(gap);
                      const sevClass = sev.toLowerCase();
                      const name = getSkillName(gap);

                      return (
                        <div key={index} className="skill-gap-card">
                          <div className="gap-top">
                            <span className={`severity-pill ${sevClass}`}>
                              {sev} Priority
                            </span>
                          </div>
                          <div className="skill-name">{name}</div>
                          <div className="skill-recommendation">
                            {gap.recommendation || gap.description || "Review fundamental concepts, hands-on tutorials, and practice questions for this area."}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            )}

            {/* Preparation Plan Section */}
            {activeSection === "plan" && (
              <section className="section-content-box">
                <div className="section-heading-bar">
                  <h2>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Tailored Preparation Roadmap</span>
                  </h2>
                  <span className="heading-badge">{preparationPlan.length} Days Roadmap</span>
                </div>

                <div className="plan-timeline">
                  {preparationPlan.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No preparation plan data available.</p>
                  ) : (
                    preparationPlan.map((item, index) => {
                      const isString = typeof item === "string";
                      const dayLabel = isString ? `Day ${index + 1}` : item.day ? `Day ${item.day}` : `Phase ${index + 1}`;
                      const focus = isString ? item : item.focus || item.topic || "Core Practice";
                      const rawTasks = isString ? [] : item.tasks || item.activities || item.task;
                      const tasks = Array.isArray(rawTasks) ? rawTasks : rawTasks ? [rawTasks] : [];

                      return (
                        <div key={index} className="plan-timeline-card">
                          <div className="plan-card-header">
                            <span className="day-pill">{dayLabel}</span>
                            <span className="plan-focus-title">{focus}</span>
                          </div>

                          {tasks.length > 0 && (
                            <ul className="task-list">
                              {tasks.map((task, tIdx) => {
                                const taskText = typeof task === "object" ? task.task || JSON.stringify(task) : task;
                                return (
                                  <li key={tIdx}>
                                    <svg className="task-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    <span>{taskText}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            )}
          </main>

          {/* Right Desktop Aside */}
          <aside className="report-aside">
            <div className="aside-block">
              <h3>Executive Insights</h3>
              <p>
                Based on real-time comparative analysis between the job description requirements and your profile.
              </p>
            </div>

            <div className="prep-tip-card">
              <strong>💡 Pro Tip</strong>
              Practice articulating the "Interviewer Intent" points when answering technical questions during live mock sessions.
            </div>

            <div className="aside-block">
              <h3>Top Focus Skills</h3>
              <div className="mini-gap-list">
                {skillGaps.slice(0, 6).map((gap, index) => (
                  <span key={index} className="mini-gap-tag">
                    {getSkillName(gap)}
                  </span>
                ))}
              </div>
            </div>

            <div className="aside-block">
              <h3>Next Action</h3>
              <p>
                Use the day-by-day roadmap timeline to pace your revision. Bookmark this page or export the report to review offline.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Interview;
