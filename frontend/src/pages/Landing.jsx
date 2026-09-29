import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const STATS = [
  { value: '50K+', label: 'Active Students', icon: '👨‍🎓' },
  { value: '95%', label: 'Prediction Accuracy', icon: '🎯' },
  { value: '200+', label: 'Video Courses', icon: '📹' },
  { value: '500+', label: 'Students Placed', icon: '🏆' },
];

const FEATURES = [
  { icon: '🧠', title: 'AI Career Prediction', desc: 'ML models predict your ideal IT career with 95% accuracy', color: '#6366f1' },
  { icon: '📊', title: 'Skill Gap Detection', desc: 'Compare your skills with industry requirements in real-time', color: '#8b5cf6' },
  { icon: '📄', title: 'AI Resume Builder', desc: 'Create ATS-friendly resumes with AI-powered suggestions', color: '#06b6d4' },
  { icon: '🗺️', title: 'Learning Roadmap', desc: 'Personalized month-by-month learning plan powered by AI', color: '#10b981' },
  { icon: '🎤', title: 'Mock Interviews', desc: 'Practice with AI interviewer — get scored on confidence & knowledge', color: '#f59e0b' },
  { icon: '💻', title: 'Coding Practice', desc: 'Daily DSA challenges, competitive coding & leaderboard', color: '#ef4444' },
  { icon: '📹', title: 'Video Courses & LMS', desc: 'HD courses, live classes, assignments, and certifications', color: '#ec4899' },
  { icon: '💼', title: 'Job & Internship Portal', desc: 'Apply directly to top companies with one-click applications', color: '#14b8a6' },
];

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Flipkart', 'Infosys', 'TCS', 'Wipro', 'Accenture', 'Deloitte'];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Software Engineer @ Google', text: 'This platform predicted my career path perfectly. The roadmap helped me land my dream job!', avatar: '👩‍💻', rating: 5 },
  { name: 'Rahul Verma', role: 'Data Scientist @ Amazon', text: 'The skill gap analysis showed me exactly what to learn. Went from fresher to placed in 6 months.', avatar: '👨‍💼', rating: 5 },
  { name: 'Ananya Reddy', role: 'ML Engineer @ Microsoft', text: 'Resume builder and mock interviews were game changers. Got 3 offers in my first month!', avatar: '👩‍🔬', rating: 5 },
];

const TRENDING = [
  { name: 'Python', growth: '+32%', icon: '🐍' },
  { name: 'React.js', growth: '+28%', icon: '⚛️' },
  { name: 'GenAI / LLMs', growth: '+85%', icon: '🤖' },
  { name: 'Cloud (AWS)', growth: '+24%', icon: '☁️' },
  { name: 'DevOps', growth: '+22%', icon: '🔄' },
  { name: 'Cybersecurity', growth: '+30%', icon: '🔒' },
];

const Landing = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: '#0f0f1a', color: '#f1f5f9', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.3)} 50%{box-shadow:0 0 40px rgba(99,102,241,0.6)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      `}</style>

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>🧠</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>AI CareerHub</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {['Features', 'Courses', 'Careers', 'Success Stories'].map(t => (
            <a key={t} href={`#${t.toLowerCase().replace(' ', '-')}`} style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}>{t}</a>
          ))}
          <Link to="/login" style={{ color: '#a5b4fc', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          <Link to="/register" style={{ padding: '8px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>Get Started Free</Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', position: 'relative', paddingTop: 64,
        background: 'radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(6,182,212,0.08) 0%, transparent 60%), #0f0f1a',
      }}>
        <div style={{ position: 'absolute', width: 500, height: 500, background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(100px)', top: '10%', left: '-5%', animation: 'float 10s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, background: 'rgba(139,92,246,0.08)', borderRadius: '50%', filter: 'blur(100px)', bottom: '5%', right: '-5%', animation: 'float 12s ease-in-out infinite reverse' }} />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} style={{ maxWidth: 800, padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 30, padding: '6px 18px', marginBottom: 28, fontSize: 13, color: '#a5b4fc', fontWeight: 600 }}>
            🚀 AI-Powered Career Intelligence Platform
          </motion.div>

          <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            <span style={{ color: '#fff' }}>Your </span>
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI-Powered</span>
            <br />
            <span style={{ color: '#fff' }}>Career Development Ecosystem</span>
          </h1>

          <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.7, marginBottom: 36, maxWidth: 600, margin: '0 auto 36px' }}>
            From skill detection to placement — one intelligent platform that predicts your career, builds your resume, teaches you skills, and gets you hired.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <Link to="/register" style={{ padding: '14px 32px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(99,102,241,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
              🚀 Get Started Free
            </Link>
            <a href="#features" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              📖 Explore Features
            </a>
            <a href="#demo" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#94a3b8', fontSize: 15, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              ▶️ Watch Demo
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>✨ Features</span>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginTop: 12 }}>Everything You Need to <span style={{ background: 'linear-gradient(135deg,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Launch Your Career</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6, borderColor: f.color + '55' }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '28px 24px', cursor: 'default', transition: 'all 0.3s' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: f.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TRENDING TECHNOLOGIES ─── */}
      <section style={{ padding: '80px 40px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 12, color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>🔥 Trending</span>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 12 }}>Most In-Demand Technologies</h2>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {TRENDING.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05, borderColor: '#6366f155' }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 28px', textAlign: 'center', transition: 'all 0.3s', minWidth: 140 }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>{t.growth}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: '100px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{ fontSize: 12, color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>🎯 How It Works</span>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 12 }}>Your Career Journey in 6 Steps</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { step: 1, icon: '📝', title: 'Create Your Profile', desc: 'Sign up and fill in your skills, education, and career interests.' },
            { step: 2, icon: '🧠', title: 'AI Analyzes You', desc: 'Our ML models analyze your profile and predict your ideal career.' },
            { step: 3, icon: '📊', title: 'Get Skill Gap Report', desc: 'See exactly what skills you need to learn with priority rankings.' },
            { step: 4, icon: '📚', title: 'Follow Your Roadmap', desc: 'Personalized learning plan with courses, projects, and certifications.' },
            { step: 5, icon: '🎤', title: 'Practice & Prepare', desc: 'Mock interviews, coding challenges, and daily practice.' },
            { step: 6, icon: '🚀', title: 'Get Hired', desc: 'Apply to matching jobs and internships with your optimized resume.' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, fontWeight: 800, color: '#fff' }}>
                {s.step}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="success-stories" style={{ padding: '80px 40px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>🏆 Success Stories</span>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 12, marginBottom: 40 }}>Students Who Landed Their Dream Jobs</h2>
          <AnimatePresence mode="wait">
            <motion.div key={currentTestimonial} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '36px 32px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{TESTIMONIALS[currentTestimonial].avatar}</div>
              <p style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{TESTIMONIALS[currentTestimonial].text}"</p>
              <div style={{ color: '#f59e0b', marginBottom: 8 }}>{'★'.repeat(TESTIMONIALS[currentTestimonial].rating)}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{TESTIMONIALS[currentTestimonial].name}</div>
              <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 500 }}>{TESTIMONIALS[currentTestimonial].role}</div>
            </motion.div>
          </AnimatePresence>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
            {TESTIMONIALS.map((_, i) => (
              <div key={i} onClick={() => setCurrentTestimonial(i)} style={{ width: i === currentTestimonial ? 24 : 8, height: 8, borderRadius: 4, background: i === currentTestimonial ? '#6366f1' : 'rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOP HIRING COMPANIES ─── */}
      <section style={{ padding: '60px 0', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>💼 Our Students Work At</span>
        </div>
        <div style={{ display: 'flex', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[...COMPANIES, ...COMPANIES].map((c, i) => (
            <div key={i} style={{ padding: '12px 32px', fontSize: 16, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>{c}</div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{
        padding: '80px 40px', textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 60%)',
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 16 }}>
          Ready to Launch Your <span style={{ background: 'linear-gradient(135deg,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Career</span>?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          Join 50,000+ students already using AI to accelerate their careers.
        </p>
        <Link to="/register" style={{ display: 'inline-flex', padding: '16px 40px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 30px rgba(99,102,241,0.5)', animation: 'pulse-glow 2s infinite', alignItems: 'center', gap: 8 }}>
          🚀 Get Started — It's Free
        </Link>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: '48px 40px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🧠</div>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>AI CareerHub</span>
            </div>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>AI-powered career development ecosystem for the next generation.</p>
          </div>
          {[
            { title: 'Platform', links: ['Dashboard', 'Courses', 'Career Prediction', 'Resume Builder'] },
            { title: 'Resources', links: ['Blog', 'Documentation', 'API', 'Community'] },
            { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>{col.title}</h4>
              {col.links.map(l => <div key={l} style={{ fontSize: 13, color: '#475569', marginBottom: 8, cursor: 'pointer' }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.04)', color: '#374151', fontSize: 12 }}>
          © 2026 AI CareerHub. All rights reserved. Built with ❤️ using AI.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
