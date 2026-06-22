import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = ["Features", "How It Works", "Career Paths", "FAQ"];

const WHO_FOR = [
  { icon: "🎓", title: "Matric Students", desc: "Confused after 10th grade? Discover which subjects and fields align with your strengths before choosing FSc, ICS, or Arts." },
  { icon: "📚", title: "Intermediate Students", desc: "Finishing FSc or FA? Get clarity on which university programs and careers match your academic performance and interests." },
  { icon: "🏛️", title: "University Students", desc: "Mid-degree confusion? Reassess your path, explore specializations, and discover opportunities within your current field." },
  { icon: "💼", title: "Working Professionals", desc: "Career change? Our AI analyzes your experience and interests to suggest realistic pivot paths and upskilling routes." },
];

const FEATURES = [
  { icon: "🤖", title: "AI-Powered Analysis", desc: "Advanced Groq AI reads your marksheet, interests, and habits to generate deeply personalized career recommendations." },
  { icon: "🇵🇰", title: "Pakistan-Focused", desc: "Recommendations include local universities, Pakistani job markets, and career paths relevant to the Pakistani economy." },
  { icon: "📄", title: "PDF Report", desc: "Download a professional career report you can share with parents, teachers, or career counselors." },
  { icon: "⚡", title: "5-Minute Assessment", desc: "No long forms or endless questionnaires. Upload your marksheet, answer a few questions, get your report." },
  { icon: "🎯", title: "Personalized Paths", desc: "Not generic advice — your report is built from your actual grades, stated interests, and daily routines." },
  { icon: "🔒", title: "Private & Secure", desc: "Your data is processed securely and never stored or shared with third parties." },
];

const STEPS = [
  { num: "01", title: "Upload Your Marksheet", desc: "Upload a photo or PDF of your latest result card — matric, intermediate, or university transcript.", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80" },
  { num: "02", title: "Share Your Interests", desc: "Tell us about your hobbies, favorite subjects, daily habits, and what you enjoy doing most.", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80" },
  { num: "03", title: "AI Analyzes Your Profile", desc: "Groq AI combines your academic results with your personal profile to find the best career matches.", img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80" },
  { num: "04", title: "Get Your Career Report", desc: "Receive a detailed report with top career matches, recommended courses, universities, and action steps.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" },
];

const FAQS = [
  { q: "Is CareerGuide AI really free?", a: "Yes, completely free. No hidden charges, no premium tiers for the basic assessment. We believe every Pakistani student deserves access to quality career guidance." },
  { q: "Do I need to create an account?", a: "No account required. Simply start the assessment, upload your marksheet, answer a few questions, and receive your report instantly." },
  { q: "How accurate are the career recommendations?", a: "Our AI analyzes your actual academic performance, interests, and habits — not just generic personality types. The more honest your answers, the more accurate your results." },
  { q: "Which marksheets are accepted?", a: "We accept matric (9th & 10th), intermediate (11th & 12th), O-levels, A-levels, and university transcripts. Both photos and PDFs work." },
  { q: "Can I retake the assessment?", a: "Yes, as many times as you like. Many students retake it after new exam results or when their interests change." },
  { q: "Is my data safe?", a: "Your uploaded documents are processed in real-time and not stored on our servers. We take student privacy very seriously." },
];

function useCountUp(target, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function AnimSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function CareerGuideAI() {
  const navigate = useNavigate();
  // const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef(null);

  const count1 = useCountUp(10000, 2000, statsActive);
  const count2 = useCountUp(50, 1500, statsActive);
  const count3 = useCountUp(98, 1800, statsActive);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsActive(true); obs.disconnect(); } }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  function openAssessmentFlow() {
    navigate('/assessment');
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>C</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>CareerGuide <span style={{ color: "#4f46e5" }}>AI</span></span>
            <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4, display: "none" }}>Smart Career Counselor</span>
          </div>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <a key={l} href="#" style={{ fontSize: 14, color: "#475569", textDecoration: "none", fontWeight: 500, transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = "#4f46e5"} onMouseLeave={e => e.target.style.color = "#475569"}>{l}</a>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => navigate('/history')} style={{ fontSize: 14, color: "#475569", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: "6px 12px" }}>My Reports</button>
            {localStorage.getItem('token') && (
              <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ fontSize: 14, color: "#ef4444", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: "6px 12px" }}>Logout</button>
            )}
            <button onClick={openAssessmentFlow} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(79,70,229,0.35)", transition: "transform .2s, box-shadow .2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(79,70,229,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(79,70,229,0.35)"; }}>
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 96, paddingBottom: 80, background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 40%, #f5f3ff 100%)", position: "relative", overflow: "hidden" }}>
        {/* Blobs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          {/* Left */}
          <div style={{ animation: "fadeUp 0.8s ease forwards" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#eef2ff", color: "#4338ca", fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 999, marginBottom: 24 }}>
              🇵🇰 Pakistan's #1 AI Career Counselor
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: 24, margin: "0 0 24px 0" }}>
              Find Your Perfect<br />
              <span style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Career Path</span> with AI
            </h1>
            <p style={{ fontSize: 18, color: "#475569", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
              CareerGuide AI combines your academic results, personal interests, and daily habits to generate a professional, personalized career report — in just 5 minutes.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
              {["✓ Free to use", "✓ AI-powered", "✓ PDF Report", "✓ Pakistan focused", "✓ No signup needed"].map(tag => (
                <span key={tag} style={{ fontSize: 13, color: "#475569", background: "#fff", border: "1px solid #e2e8f0", padding: "6px 14px", borderRadius: 999, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={openAssessmentFlow} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontWeight: 800, fontSize: 16, padding: "14px 28px", borderRadius: 14, border: "none", cursor: "pointer", boxShadow: "0 8px 24px rgba(79,70,229,0.35)", transition: "all .25s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                🚀 Start Free Assessment
              </button>
              <button onClick={() => navigate('/history')} style={{ background: "#fff", color: "#334155", fontWeight: 600, fontSize: 16, padding: "14px 28px", borderRadius: 14, border: "1px solid #e2e8f0", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all .25s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                📁 My Reports
              </button>
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 14 }}>Takes only 5 minutes · No account required</p>
          </div>

          {/* Right */}
          <div style={{ animation: "fadeUp 0.8s ease 0.2s both", position: "relative" }}>
            <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 60px rgba(79,70,229,0.18)" }}>
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=80" alt="Students studying" style={{ width: "100%", height: 340, objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.1) 60%, transparent 100%)" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                <div style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderRadius: 14, padding: 18, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>AI Report Preview</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>Powered by Groq AI</div>
                      <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Career matches, courses, universities & action steps generated after you submit.</p>
                    </div>
                    <div style={{ background: "#eef2ff", borderRadius: 10, padding: "8px 12px", textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#4338ca" }}>Live AI</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Real results only</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ padding: "48px 24px", background: "#fff", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }}>
          {[
            { val: `${count1.toLocaleString()}+`, label: "Students Guided" },
            { val: `${count2}+`, label: "Career Paths" },
            { val: `${count3}%`, label: "Satisfaction Rate" },
            { val: "5 min", label: "Time to Report" },
          ].map((s, i) => (
            <div key={i} style={{ padding: 16 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: "#4f46e5", lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
              <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <AnimSection className="text-center" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: 40, fontWeight: 900, color: "#0f172a", marginBottom: 16 }}>Who Is It For?</h2>
              <p style={{ fontSize: 18, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>Designed for every Pakistani student at every stage of their educational journey.</p>
            </div>
          </AnimSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {WHO_FOR.map((w, i) => (
              <AnimSection key={i} delay={i * 100}>
                <div style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", height: "100%", transition: "all .3s", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(79,70,229,0.12)"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{w.icon}</div>
                  <h3 style={{ fontWeight: 800, color: "#0f172a", marginBottom: 10, fontSize: 16 }}>{w.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{w.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CAREERGUIDE ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <AnimSection>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: 40, fontWeight: 900, color: "#0f172a", marginBottom: 16 }}>Why CareerGuide AI?</h2>
              <p style={{ fontSize: 18, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>Cutting-edge AI with deep educational expertise to give every student a clear path forward.</p>
            </div>
          </AnimSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <AnimSection key={i} delay={i * 80}>
                <div style={{ background: "#f8fafc", borderRadius: 20, padding: 28, border: "1px solid #e2e8f0", height: "100%", transition: "all .3s", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#eef2ff,#f5f3ff)"; e.currentTarget.style.borderColor = "#c7d2fe"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(79,70,229,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                  <h3 style={{ fontWeight: 800, color: "#0f172a", marginBottom: 10, fontSize: 16 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(135deg,#0f172a,#1e1b4b)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(circle at 25% 25%, #818cf8 0%, transparent 50%), radial-gradient(circle at 75% 75%, #a78bfa 0%, transparent 50%)" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <AnimSection>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: 40, fontWeight: 900, color: "#fff", marginBottom: 16 }}>How It Works</h2>
              <p style={{ fontSize: 18, color: "#a5b4fc" }}>Four simple steps to your personalized career report</p>
            </div>
          </AnimSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {STEPS.map((s, i) => (
              <AnimSection key={i} delay={i * 120}>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, overflow: "hidden", transition: "all .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 48px rgba(79,70,229,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                    <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", bottom: 12, left: 12, width: 36, height: 36, background: "#4f46e5", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff" }}>{s.num}</div>
                  </div>
                  <div style={{ padding: "20px 20px 24px" }}>
                    <h3 style={{ fontWeight: 800, color: "#fff", marginBottom: 10, fontSize: 15 }}>{s.title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(165,180,252,0.85)", lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
          <AnimSection delay={400}>
            <div style={{ textAlign: "center", marginTop: 44 }}>
              <button onClick={openAssessmentFlow} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 36px", borderRadius: 14, border: "none", cursor: "pointer", boxShadow: "0 8px 32px rgba(79,70,229,0.4)", transition: "all .25s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                Start Your Assessment →
              </button>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── GROQ OUTPUT ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <AnimSection>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: 40, fontWeight: 900, color: "#0f172a", marginBottom: 16 }}>What Your AI Report Includes</h2>
              <p style={{ fontSize: 18, color: "#64748b" }}>Generated in real-time from your marksheet and profile. No fake or templated content.</p>
            </div>
          </AnimSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {[
              { icon: "🏆", title: "Top 3 Career Matches", desc: "Ranked recommendations based on your interests, habits, and academic performance.", color: "#eef2ff", border: "#c7d2fe" },
              { icon: "📖", title: "Course Roadmap", desc: "Recommended degrees, short courses, and skills to build for your chosen career.", color: "#f0fdf4", border: "#bbf7d0" },
              { icon: "🏛️", title: "University Suggestions", desc: "Pakistani institutes aligned with your profile, location preference, and career path.", color: "#fff7ed", border: "#fed7aa" },
              { icon: "🎯", title: "Action Plan", desc: "Practical next steps to move from career analysis to university application and beyond.", color: "#fdf4ff", border: "#e9d5ff" },
            ].map((item, i) => (
              <AnimSection key={i} delay={i * 80}>
                <div style={{ height: "100%", borderRadius: 20, border: `1px solid ${item.border}`, background: item.color, padding: 28, transition: "transform .3s, box-shadow .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
          <AnimSection delay={200}>
            <div style={{ marginTop: 28, borderRadius: 16, border: "1px solid #c7d2fe", background: "linear-gradient(135deg,#eef2ff,#f5f3ff)", padding: "20px 28px", textAlign: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#4338ca" }}>✨ No fake careers, no mock data, no pre-written testimonials. Real results appear only after Groq AI responds to your uploaded profile.</p>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80" alt="Students" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(49,46,129,0.92) 0%, rgba(109,40,217,0.88) 100%)" }} />
        </div>
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#fff" }}>
          <AnimSection>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", fontSize: 14, fontWeight: 500, padding: "8px 20px", borderRadius: 999, marginBottom: 28 }}>
              🎓 Trusted by 10,000+ Students Across Pakistan
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>Ready to Find Your<br />Dream Career?</h2>
            <p style={{ fontSize: 18, color: "rgba(196,181,253,0.9)", marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>Join thousands of students who discovered their perfect career path. Free, fast, and 100% personalized.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={openAssessmentFlow} style={{ background: "#fff", color: "#4338ca", fontWeight: 800, fontSize: 16, padding: "16px 32px", borderRadius: 14, border: "none", cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", transition: "all .25s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                🚀 Get Started Free
              </button>
              <button onClick={() => navigate('/history')} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, fontSize: 16, padding: "16px 32px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", transition: "all .25s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                📁 My History
              </button>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <AnimSection>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: 40, fontWeight: 900, color: "#0f172a", marginBottom: 16 }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: 18, color: "#64748b" }}>Everything you need to know about CareerGuide AI</p>
            </div>
          </AnimSection>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((f, i) => (
              <AnimSection key={i} delay={i * 60}>
                <div style={{ border: `1px solid ${openFaq === i ? "#a5b4fc" : "#e2e8f0"}`, borderRadius: 16, overflow: "hidden", transition: "border-color .25s", boxShadow: openFaq === i ? "0 4px 16px rgba(79,70,229,0.08)" : "none" }}>
                  <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 15, paddingRight: 16 }}>{f.q}</span>
                    <span style={{ color: "#4f46e5", fontSize: 22, flexShrink: 0, transition: "transform .25s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 24px 20px", fontSize: 14, color: "#475569", lineHeight: 1.7, borderTop: "1px solid #f1f5f9" }}>
                      <p style={{ paddingTop: 16, margin: 0 }}>{f.a}</p>
                    </div>
                  )}
                </div>
              </AnimSection>
            ))}
          </div>
          <AnimSection delay={300}>
            <div style={{ textAlign: "center", marginTop: 40, padding: "24px 32px", background: "#f8fafc", borderRadius: 16, border: "1px solid #e2e8f0" }}>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 6 }}>Still have questions? We're here to help.</p>
              <a href="mailto:support@careerguide.ai" style={{ color: "#4f46e5", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>support@careerguide.ai</a>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0f172a", color: "#fff", padding: "64px 24px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>C</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: 18 }}>CareerGuide <span style={{ color: "#818cf8" }}>AI</span></span>
              </div>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>Pakistan's #1 AI-powered career counseling platform. Helping students find their purpose and plan their future.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 12, marginBottom: 16, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Quick Links</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Features", "How It Works", "Career Paths", "FAQ"].map(l => (
                  <a key={l} href="#" style={{ fontSize: 14, color: "#64748b", textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#64748b"}>{l}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 12, marginBottom: 16, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Start Today</h4>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>Your career clarity is just 5 minutes away.</p>
              <button onClick={openAssessmentFlow} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 20px", borderRadius: 12, border: "none", cursor: "pointer", width: "100%", transition: "opacity .2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                Start Free Assessment →
              </button>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1e293b", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "#475569" }}>
            <span>© 2026 CareerGuide AI · All rights reserved</span>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <a href="#" style={{ color: "#475569", textDecoration: "none" }}>Privacy Policy</a>
              <span>🇵🇰 Made in Pakistan</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; }
        h1,h2,h3,h4,h5,h6 { margin: 0; }
        p { margin: 0; }

        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .four-col { grid-template-columns: 1fr 1fr !important; }
          .three-col { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-h1 { font-size: 36px !important; }
        }
        @media (max-width: 480px) {
          .four-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}