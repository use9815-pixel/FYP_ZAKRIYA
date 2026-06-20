import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function renderList(items, emptyText = 'Not available') {
  if (!items || items.length === 0) {
    return <p className="report-subtitle">{emptyText}</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function HistoryPage() {
  const [reports, setReports] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('careerGuideReports') || '[]');
    } catch {
      return [];
    }
  });

  const persistReports = (nextReports) => {
    localStorage.setItem('careerGuideReports', JSON.stringify(nextReports));
    setReports(nextReports);
  };

  const deleteReport = (id) => {
    const confirmed = window.confirm('Delete this report from history?');
    if (!confirmed) {
      return;
    }

    const nextReports = reports.filter((item) => item.id !== id);
    persistReports(nextReports);
  };

  const clearAllReports = () => {
    const confirmed = window.confirm('Delete all history reports? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    localStorage.removeItem('careerGuideReports');
    setReports([]);
  };

  return (
    <div className="app-shell">
      <header className="app-header rise">
        <div className="app-header-top">
          <h1>My Reports</h1>
          <div className="header-links">
            <Link to="/" className="button ghost">Website</Link>
            <Link to="/assessment" className="button primary">New Assessment</Link>
          </div>
        </div>
        <p>Previously generated AI career guidance reports.</p>
        {reports.length > 0 ? (
          <div className="history-actions">
            <button type="button" className="button danger" onClick={clearAllReports}>Delete All History</button>
          </div>
        ) : null}
      </header>

      <main className="main-card fade-in">
        {reports.length === 0 ? (
          <div className="report-card">
            <h3>No reports saved yet</h3>
            <p className="report-subtitle">Complete an assessment to see your history here.</p>
          </div>
        ) : (
          reports.map((item) => (
            <article className="report-card slide-up" key={item.id} style={{ marginBottom: 12 }}>
              <div className="history-header-meta">
                <h3>{item.report?.topCareerPaths?.[0] || 'Career report'}</h3>
                <div className="history-card-actions">
                  <p className="report-subtitle">
                    Generated on {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <button
                    type="button"
                    className="button danger"
                    onClick={() => deleteReport(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="summary-grid" style={{ marginTop: 10 }}>
                <div><span>Name</span><strong>{item.report?.profile?.name || 'N/A'}</strong></div>
                <div><span>Age</span><strong>{item.report?.profile?.age || 'N/A'}</strong></div>
                <div><span>Gender</span><strong>{item.report?.profile?.gender || 'N/A'}</strong></div>
                <div><span>Class</span><strong>{item.report?.profile?.classLevel || 'N/A'}</strong></div>
                <div><span>Score</span><strong>{item.report?.overallScore || 'N/A'}</strong></div>
              </div>

              <div className="history-report-grid">
                <section className="result-section">
                  <h4>Areas of Interest</h4>
                  {renderList(item.report?.profile?.interests, 'No interests found.')}
                </section>

                <section className="result-section">
                  <h4>Habits</h4>
                  {renderList(item.report?.profile?.habits, 'No habits found.')}
                  {item.report?.profile?.habitDescription ? (
                    <p className="report-subtitle">{item.report.profile.habitDescription}</p>
                  ) : null}
                </section>

                <section className="result-section section-strong">
                  <h4>Strong Subjects</h4>
                  {renderList(item.report?.strongSubjects, 'No strong subjects found.')}
                </section>

                <section className="result-section section-weak">
                  <h4>Weak Points</h4>
                  {renderList(item.report?.weakPoints, 'No weak points found.')}
                </section>

                <section className="result-section">
                  <h4>Top 3 Career Paths</h4>
                  {renderList(item.report?.topCareerPaths, 'No career paths found.')}
                </section>

                <section className="result-section">
                  <h4>Your Strongest Areas</h4>
                  {renderList(item.report?.strongestAreas, 'No strongest areas found.')}
                </section>

                <section className="result-section">
                  <h4>Recommended Courses / Degrees</h4>
                  {renderList(item.report?.recommendedCourses, 'No courses found.')}
                </section>

                <section className="result-section section-growth">
                  <h4>Skills to Develop</h4>
                  <div className="skills-grid">
                    <div className="skill-box short-term">
                      <p><strong>Short Term (Next 3-6 Months)</strong></p>
                      {renderList(item.report?.skills?.shortTerm, 'No short-term skills found.')}
                    </div>
                    <div className="skill-box medium-term">
                      <p><strong>Medium Term (6-12 Months)</strong></p>
                      {renderList(item.report?.skills?.mediumTerm, 'No medium-term skills found.')}
                    </div>
                    <div className="skill-box long-term">
                      <p><strong>Long Term (1-3 Years)</strong></p>
                      {renderList(item.report?.skills?.longTerm, 'No long-term skills found.')}
                    </div>
                  </div>
                </section>

                <section className="result-section">
                  <h4>Universities / Institutions</h4>
                  {renderList(item.report?.universities, 'No universities found.')}
                </section>

                <section className="result-section ai-notes-card history-notes-full">
                  <h4>AI Notes</h4>
                  <pre>{item.report?.rawText || 'No AI notes found.'}</pre>
                </section>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}

export default HistoryPage;
