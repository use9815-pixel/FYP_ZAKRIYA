import React from 'react';

function Landing({ onStart }) {
  return (
    <div className="landing-hero">
      <div className="landing-inner">
        <div className="hero-left fade-in">
          <h1>Pakistan's #1 AI Career Counselor</h1>
          <p className="hero-sub">Find Your Perfect Career Path with AI — personalized in minutes.</p>

          <ul className="feature-list">
            <li>Free to use</li>
            <li>AI-powered</li>
            <li>PDF Report</li>
            <li>Pakistan focused</li>
            <li>No signup needed</li>
          </ul>

          <div className="hero-cta">
            <button className="button primary" onClick={onStart}>Start Free Assessment</button>
            <button className="button ghost" onClick={() => window.scrollTo({ top: 520, behavior: 'smooth' })}>My Reports</button>
          </div>

          <p className="small-meta">Takes only 5 minutes · No account required</p>
        </div>

        <aside className="hero-right slide-up">
          <div className="stats-grid">
            <div className="stat card">
              <strong>10,000+</strong>
              <span>Students Guided</span>
            </div>
            <div className="stat card">
              <strong>50+</strong>
              <span>Career Paths</span>
            </div>
            <div className="stat card">
              <strong>95%</strong>
              <span>Satisfaction Rate</span>
            </div>
            <div className="stat card">
              <strong>5 min</strong>
              <span>Time to Report</span>
            </div>
          </div>

          <div className="highlight card">
            <h4>Best Match</h4>
            <p className="match-role">Software Engineer</p>
            <p className="match-score">95% Match Score · AI Analysis Complete</p>
          </div>
        </aside>
      </div>

      <section className="how-it-works fade-in">
        <h3>How It Works</h3>
        <div className="how-grid">
          <div className="how-step card">
            <strong>01</strong>
            <p>Share Your Profile</p>
          </div>
          <div className="how-step card">
            <strong>02</strong>
            <p>Pick Your Interests</p>
          </div>
          <div className="how-step card">
            <strong>03</strong>
            <p>Upload Marksheet</p>
          </div>
          <div className="how-step card">
            <strong>04</strong>
            <p>Get Your Report</p>
          </div>
        </div>
      </section>

      <section className="career-samples slide-up">
        <h3>Explore Career Paths</h3>
        <div className="career-grid">
          <div className="card career-card">
            <h4>Software Engineer</h4>
            <p className="muted">Technology & IT • PKR 80k–300k/mo</p>
          </div>
          <div className="card career-card">
            <h4>Medical Doctor</h4>
            <p className="muted">Medicine & Health • PKR 100k–500k/mo</p>
          </div>
          <div className="card career-card">
            <h4>Business Analyst</h4>
            <p className="muted">Business & Finance • PKR 60k–200k/mo</p>
          </div>
          <div className="card career-card">
            <h4>UX Designer</h4>
            <p className="muted">Arts & Design • PKR 60k–200k/mo</p>
          </div>
        </div>
      </section>

      <section className="testimonials fade-in">
        <h3>What Students Say</h3>
        <div className="test-grid">
          <blockquote className="card">“CareerGuide AI helped me realize I should pursue Computer Science.”<cite> — Ali H., Lahore</cite></blockquote>
          <blockquote className="card">“The PDF report impressed my parents — very professional.”<cite> — Fatima M., Karachi</cite></blockquote>
          <blockquote className="card">“Clear roadmap and university suggestions saved me time.”<cite> — Usman R., Islamabad</cite></blockquote>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <strong>CareerGuide AI</strong>
            <p>Pakistan's #1 AI-powered career counseling platform.</p>
          </div>

          <div>
            <p>Questions? <a href="mailto:support@careerguide.ai">support@careerguide.ai</a></p>
            <p className="muted">© 2026 CareerGuide AI · Made in Pakistan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
