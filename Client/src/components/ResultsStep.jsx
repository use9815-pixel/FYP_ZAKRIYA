import React from 'react';
import { jsPDF } from 'jspdf';

function addList(doc, title, items, state) {
  const lineHeight = 6;
  const pageBottom = 280;
  const marginLeft = 18;
  const contentWidth = 170;

  const ensureSpace = (requiredHeight = 10) => {
    if (state.y + requiredHeight > pageBottom) {
      doc.addPage();
      state.y = 20;
    }
  };

  ensureSpace(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(title, marginLeft, state.y);
  state.y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);

  if (!items || items.length === 0) {
    ensureSpace(8);
    doc.text('- Not available', marginLeft, state.y);
    state.y += 8;
    return;
  }

  items.forEach((item) => {
    const wrapped = doc.splitTextToSize(`- ${item}`, contentWidth);
    ensureSpace(wrapped.length * lineHeight + 2);
    doc.text(wrapped, marginLeft, state.y);
    state.y += wrapped.length * lineHeight + 1;
  });

  state.y += 2;
}

function exportReportPdf(report) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 18;

  // Cover page
  doc.setFillColor(11, 110, 110);
  doc.rect(0, 0, pageWidth, 75, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.text('CareerGuide AI', marginLeft, 30);

  doc.setFontSize(18);
  doc.text('Smart Career Counselor', marginLeft, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Professional Career Guidance Report', marginLeft, 56);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('Student Profile', marginLeft, 96);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Name: ${report.profile.name || 'N/A'}`, marginLeft, 101);
  doc.text(`Age: ${report.profile.age || 'N/A'}`, marginLeft, 110);
  doc.text(`Gender: ${report.profile.gender || 'N/A'}`, marginLeft, 119);
  doc.text(`Class: ${report.profile.classLevel || 'N/A'}`, marginLeft, 128);
  doc.text(`Report Date: ${report.generatedAt || 'N/A'}`, marginLeft, 137);
  doc.text(`Overall Score: ${report.overallScore || 'N/A'}`, marginLeft, 146);

  doc.setDrawColor(203, 213, 225);
  doc.line(marginLeft, 160, pageWidth - marginLeft, 160);
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('Generated using AI based on marksheet, interests, and habits.', marginLeft, 170);
  doc.text('This report is guidance-oriented and should be discussed with mentors/parents.', marginLeft, 178);

  // Details pages
  doc.addPage();
  const state = { y: 20 };

  addList(doc, 'Areas of Interest', report.profile.interests || [], state);
  addList(doc, 'Strong Subjects', report.strongSubjects || [], state);
  addList(doc, '1. Top 3 Career Paths', report.topCareerPaths || [], state);
  addList(doc, '2. Your Strongest Areas', report.strongestAreas || [], state);
  addList(doc, '3. Recommended Courses / Degrees', report.recommendedCourses || [], state);

  addList(doc, 'Weak Points', report.weakPoints || [], state);
  addList(doc, '4. Skills to Develop - Short Term (Next 3-6 Months)', report.skills?.shortTerm || [], state);
  addList(doc, '4. Skills to Develop - Medium Term (6-12 Months)', report.skills?.mediumTerm || [], state);
  addList(doc, '4. Skills to Develop - Long Term (1-3 Years)', report.skills?.longTerm || [], state);
  addList(doc, '5. Universities / Institutions', report.universities || [], state);

  const aiLines = doc.splitTextToSize(report.rawText || 'No AI notes available.', 170);
  addList(doc, 'AI Notes', aiLines, state);

  const safeDate = new Date().toISOString().slice(0, 10);
  doc.save(`CareerGuideAI-Report-${safeDate}.pdf`);
}

function ResultsStep({ report }) {
  if (!report) {
    return null;
  }

  return (
    <section className="step-panel results-panel fade-in">
      <div className="results-head">
        <p className="report-brand">CareerGuide AI</p>
        <h2>Smart Career Counselor</h2>
        <p className="report-date">Report Generated: {report.generatedAt}</p>
        <div className="report-actions">
          <button
            type="button"
            className="button primary"
            onClick={() => exportReportPdf(report)}
          >
            Download PDF Report
          </button>
        </div>
      </div>

      <article className="report-cover-preview slide-up">
        <p className="cover-kicker">Title Page Preview</p>
        <h3>CareerGuide AI</h3>
        <p>Smart Career Counselor</p>
        <small>Professional Career Guidance Report</small>
      </article>

      <article className="report-card slide-up">
        <h3>Career Guidance Report</h3>
        <p className="report-subtitle">
          Personalized career recommendations based on your academic profile and interests.
        </p>

        <div className="summary-grid">
          <div><span>Name</span><strong>{report.profile.name || 'N/A'}</strong></div>
          <div><span>Age</span><strong>{report.profile.age || 'N/A'} years</strong></div>
          <div><span>Gender</span><strong>{report.profile.gender || 'N/A'}</strong></div>
          <div><span>Class</span><strong>{report.profile.classLevel || 'N/A'}</strong></div>
          <div><span>Overall Score</span><strong>{report.overallScore || 'Not detected'}</strong></div>
        </div>

        <div className="result-section">
          <h4>Areas of Interest</h4>
          <ul>
            {report.profile.interests.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="result-section section-strong">
          <h4>Strong Subjects</h4>
          <ul>
            {report.strongSubjects.length > 0 ? report.strongSubjects.map((item) => (
              <li key={item}>{item}</li>
            )) : <li>Could not extract strong subjects from file.</li>}
          </ul>
        </div>

        <div className="result-section section-weak">
          <h4>Weak Points</h4>
          <ul>
            {report.weakPoints && report.weakPoints.length > 0 ? report.weakPoints.map((item) => (
              <li key={item}>{item}</li>
            )) : <li>Weak points are not available for this report.</li>}
          </ul>
        </div>

        <div className="result-section">
          <h4>1. Top 3 Career Paths</h4>
          <ul>
            {report.topCareerPaths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="result-section">
          <h4>2. Your Strongest Areas</h4>
          <ul>
            {report.strongestAreas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="result-section">
          <h4>3. Recommended Courses / Degrees</h4>
          <ul>
            {report.recommendedCourses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="result-section section-growth">
          <h4>4. Skills to Develop</h4>
          <div className="skills-grid">
            <div className="skill-box short-term">
              <p><strong>Short Term (Next 3-6 Months)</strong></p>
              <ul>
                {report.skills.shortTerm.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="skill-box medium-term">
              <p><strong>Medium Term (6-12 Months)</strong></p>
              <ul>
                {report.skills.mediumTerm.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="skill-box long-term">
              <p><strong>Long Term (1-3 Years)</strong></p>
              <ul>
                {report.skills.longTerm.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="result-section">
          <h4>5. Universities / Institutions</h4>
          <ul>
            {report.universities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="result-section ai-notes-card">
          <h4>AI Notes</h4>
          <p className="ai-notes-subtitle">Detailed interpretation generated by CareerGuide AI, including strengths and weak points</p>
          <pre>{report.rawText}</pre>
        </div>
      </article>
    </section>
  );
}

export default ResultsStep;
