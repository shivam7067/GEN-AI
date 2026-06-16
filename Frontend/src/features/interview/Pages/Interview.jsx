import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../style/interview.scss";
import { useInterview } from "../hooks/useinterview";

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const { interviewId } = useParams();
  const location = useLocation();
  const { interviewReport, loading, handleGetReportById, setInterviewReport } = useInterview();

  useEffect(() => {
    if (location.state?.report) {
      setInterviewReport(location.state.report);
      return;
    }

    if (interviewId) {
      handleGetReportById(interviewId).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId, location.state]);

  useEffect(() => {
    const container = document.querySelector("main.interview-report");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]);

  if (loading) {
    return (
      <main className="interview-report">
        <div className="loading-screen">Loading interview report…</div>
      </main>
    );
  }

  if (!interviewReport) {
    return (
      <main className="interview-report">
        <div className="empty-screen">No interview report found.</div>
      </main>
    );
  }

  const report = interviewReport;

  const candidateName = report.candidate_name || report.name || "Candidate Report";
  const summary = report.interview_report || report.summary || "No report summary is available yet.";
  const score = report.match_score ?? report.matchScore ?? 0;
  const skillGaps = report.skill_gaps || [];
  const preparationPlanSource = report.preparation_plan || [];

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

  const technicalItems = normalizeQuestionItems(report.technical_questions_data || report.technical_questions || []);
  const behavioralItems = normalizeQuestionItems(report.behavioral_questions_data || report.behavioral_questions || []);
  const preparationPlan = preparationPlanSource.map((item) => {
    if (typeof item !== "string") return item;
    const parsed = tryParseJSON(item);
    if (parsed && typeof parsed === "object" && (parsed.day || parsed.focus || parsed.activities)) {
      return parsed;
    }
    return item;
  });

  const renderPlanItem = (item) => {
    if (typeof item === "string") {
      return <p>{item}</p>;
    }

    return (
      <>
        {item.day && <strong>{`Day ${item.day}`}</strong>}
        {item.focus && <p className="plan-focus">{item.focus}</p>}
        {item.activities && (
          Array.isArray(item.activities) ? (
            <ul>
              {item.activities.map((activity, idx) => (
                <li key={idx}>{activity}</li>
              ))}
            </ul>
          ) : (
            <p>{item.activities}</p>
          )
        )}
      </>
    );
  };


  return (
    <main className="interview-report">
      <div className="report-grid">
        <aside className="report-sidebar">
          <div className="sidebar-head">Report sections</div>

          <div className="sidebar-list">
            <button
              type="button"
              className={`sidebar-btn ${activeSection === "technical" ? "active" : ""}`}
              onClick={() => setActiveSection("technical")}
              aria-pressed={activeSection === "technical"}
            >
              Technical questions
            </button>
            <button
              type="button"
              className={`sidebar-btn ${activeSection === "behavioral" ? "active" : ""}`}
              onClick={() => setActiveSection("behavioral")}
              aria-pressed={activeSection === "behavioral"}
            >
              Behavioral questions
            </button>
            <button
              type="button"
              className={`sidebar-btn ${activeSection === "skills" ? "active" : ""}`}
              onClick={() => setActiveSection("skills")}
              aria-pressed={activeSection === "skills"}
            >
              Skill gaps
            </button>
            <button
              type="button"
              className={`sidebar-btn ${activeSection === "plan" ? "active" : ""}`}
              onClick={() => setActiveSection("plan")}
              aria-pressed={activeSection === "plan"}
            >
              Preparation plan
            </button>
          </div>

          <div className="sidebar-info">
            <h3>Report details</h3>
            <p>
              <strong>Candidate:</strong> {candidateName}
            </p>
            <p>
              <strong>Score:</strong> {score}%
            </p>
            <p>
              Use the sidebar to switch between technical questions, behavioral questions, skill gaps, and the preparation plan.
            </p>
          </div>
        </aside>

        <section className="report-main">
          <div className="score-card">
            <div>
              <span className="score-label">Interview summary</span>
              <h1>{candidateName}</h1>
              <p>{summary}</p>
            </div>
            <strong>{score}%</strong>
          </div>

          {activeSection === "technical" && (
            <div className="section-block active-section">
              <h2>Technical Questions</h2>
              {technicalItems.length === 0 ? (
                <p>No technical questions available.</p>
              ) : (
                technicalItems.map((item, index) => (
                  <div key={index} className="question-card">
                    <h3>{item.question || `Question ${index + 1}`}</h3>
                    {item.intention && <p className="meta">Intent: {item.intention}</p>}
                    {item.answer && <p>{item.answer}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeSection === "behavioral" && (
            <div className="section-block active-section">
              <h2>Behavioral Questions</h2>
              {behavioralItems.length === 0 ? (
                <p>No behavioral questions available.</p>
              ) : (
                behavioralItems.map((item, index) => (
                  <div key={index} className="question-card">
                    <h3>{item.question || `Question ${index + 1}`}</h3>
                    {item.intention && <p className="meta">Intent: {item.intention}</p>}
                    {item.answer && <p>{item.answer}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeSection === "skills" && (
            <div className="section-block active-section">
              <h2>Skill Gaps</h2>
              {skillGaps.length === 0 ? (
                <p>No skill gaps detected.</p>
              ) : (
                skillGaps.map((gap, index) => (
                  <div key={index} className="gap-item">
                    <span>{gap}</span>
                    <strong>Improve</strong>
                  </div>
                ))
              )}
            </div>
          )}

          {activeSection === "plan" && (
            <div className="section-block active-section">
              <h2>Preparation Plan</h2>
              {preparationPlan.length === 0 ? (
                <p>No preparation plan available.</p>
              ) : (
                <div className="plan-grid">
                  {preparationPlan.map((item, index) => (
                    <div key={index} className="plan-card">
                      {renderPlanItem(item)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="report-aside">
          <div className="aside-head">
            <h3>Quick overview</h3>
            <p>Review the main report summary and sections at a glance.</p>
          </div>

          <div className="aside-note">
            <h4>Next steps</h4>
            <p>Use the plan section to prioritize learning areas and prepare for your next interview.</p>
          </div>

          <div className="aside-head">
            <h3>Highlights</h3>
          </div>

          <div className="gap-list">
            {skillGaps.slice(0, 4).map((gap, index) => (
              <div key={index} className="gap-item">
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Interview;
