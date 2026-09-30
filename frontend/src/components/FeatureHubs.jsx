import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/api';

// --- FEATURE 6: Industry Skill Tracker ---
export const IndustrySkillTrackerView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>📊 Industry Skill Tracker</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Real-time demand metrics for languages, frameworks, tools & future tech</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
        <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🔥 Top Programming Languages (2026 Demand)</h3>
        {[
          { name: 'Python (AI & Data)', demand: 94, color: '#6366f1' },
          { name: 'JavaScript / TypeScript', demand: 90, color: '#06b6d4' },
          { name: 'Java (Enterprise)', demand: 78, color: '#f59e0b' },
          { name: 'C++ / Rust (Systems)', demand: 72, color: '#8b5cf6' },
          { name: 'Go (Cloud Native)', demand: 68, color: '#10b981' }
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#cbd5e1' }}>{item.name}</span>
              <span style={{ color: item.color, fontWeight: 700 }}>{item.demand}% Demand</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${item.demand}%`, height: '100%', background: item.color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
        <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🚀 Demanded Frameworks & Cloud Tools</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['React.js', 'Next.js', 'FastAPI', 'PyTorch', 'Docker', 'Kubernetes', 'AWS', 'TailwindCSS', 'LangChain', 'Redis', 'GraphQL', 'PostgreSQL'].map(tool => (
            <span key={tool} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              ⚡ {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// --- FEATURE 8: AI Mentor ---
export const AIMentorView = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I am your personal AI Mentor 🧠 Ask me anything about tech stacks, preparation strategies, or interview readiness!" }
  ]);
  const [input, setInput] = useState('');

  const sendMsg = async (txt) => {
    const query = txt || input;
    if (!query.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');

    try {
      const res = await api.post('/api/ai/chat', { message: query });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch {
      // Fallback to built-in responses if backend unavailable
      let reply = "Based on current hiring trends, focus 70% of your time on building production-ready projects and 30% on LeetCode DSA patterns!";
      if (query.toLowerCase().includes('learn')) reply = "I recommend learning Full-Stack Web Dev (React + Node.js) combined with AI integration. This stack has the highest hiring growth right now.";
      if (query.toLowerCase().includes('ready')) reply = "You are ready for interviews when you can solve LeetCode Medium problems in under 25 minutes and clearly explain your capstone project's system design.";
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🧠 AI Personal Mentor</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>Ask your mentor for tailored advice on career choices, tech stacks & interview readiness</p>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, minHeight: 340, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)',
              padding: '12px 16px', borderRadius: 14, maxWidth: '75%', color: '#fff', fontSize: 13, lineHeight: 1.5
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {['Which technology should I learn?', 'How should I prepare for technical rounds?', 'Am I ready for interviews?'].map(q => (
          <button key={q} onClick={() => sendMsg(q)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>
            {q}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
          placeholder="Ask your mentor anything..."
          style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 13, outline: 'none' }}
        />
        <button onClick={() => sendMsg()} style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          Send ↗
        </button>
      </div>
    </motion.div>
  );
};

// --- FEATURE 9: Freelancing Readiness ---
export const FreelancingReadinessView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>💼 Freelancing Readiness Hub</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Skill assessments, proposal templates, pricing calculators & top freelance platforms</p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
      <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: 20 }}>
        <div style={{ color: '#10b981', fontWeight: 700, fontSize: 12 }}>PORTFOLIO READINESS SCORE</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginTop: 4 }}>84<span style={{ fontSize: 18, color: '#6ee7b7' }}>/100</span></div>
        <div style={{ fontSize: 11, color: '#6ee7b7', marginTop: 4 }}>Ready for Upwork & Fiverr gigs</div>
      </div>
      <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 16, padding: 20 }}>
        <div style={{ color: '#a5b4fc', fontWeight: 700, fontSize: 12 }}>ESTIMATED HOURLY RATE</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 4 }}>$35–$65 <span style={{ fontSize: 14, color: '#64748b' }}>/ hr</span></div>
        <div style={{ fontSize: 11, color: '#a5b4fc', marginTop: 4 }}>Based on Full-Stack & React skill set</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
        <div style={{ color: '#64748b', fontWeight: 700, fontSize: 12 }}>RECOMMENDED PLATFORMS</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 8 }}>Upwork, Toptal, Fiverr Pro, Contra</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Top rated web dev categories</div>
      </div>
    </div>

    {/* Proposal Template Generator */}
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
      <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📑 AI Client Proposal Template Generator</h3>
      <pre style={{ background: 'rgba(0,0,0,0.4)', padding: 16, borderRadius: 10, color: '#6ee7b7', fontSize: 12, fontFamily: 'monospace', overflowX: 'auto' }}>
{`Hi [Client Name],

I saw your requirement for building [Project Title]. With 3+ years of experience in React.js, Node.js, and MongoDB, I can deliver a clean, responsive, and high-performance solution.

Here is how I will approach your project:
1. UI/UX Design & Scaffolding (Day 1-2)
2. API Integration & Business Logic (Day 3-5)
3. Testing, Optimization & Live Deployment (Day 6-7)

Check out my portfolio: https://github.com/my-portfolio

Looking forward to working together!
Best regards,
[Your Name]`}
      </pre>
    </div>
  </motion.div>
);

// --- FEATURE 10: Interview Experience Hub ---
export const InterviewExperienceHubView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🏆 Interview Experience Hub</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Student-contributed interview questions, rounds breakdowns, difficulty ratings & compensation packages</p>

    <div style={{ display: 'grid', gap: 14 }}>
      {[
        { company: 'Google', role: 'Software Engineer L3', rounds: '4 Rounds (1 Screen + 3 Onsite DSA)', diff: 'Hard', salary: '₹28 LPA', tips: 'Focus heavily on Graph algorithms, Dynamic Programming, and clean modular code.' },
        { company: 'Amazon', role: 'SDE-1', rounds: '3 Rounds (OA + 2 Tech Rounds)', diff: 'Medium-Hard', salary: '₹22 LPA', tips: 'Prepare Amazon Leadership Principles deeply for behavioral questions!' },
        { company: 'Microsoft', role: 'Full Stack Engineer', rounds: '3 Tech Rounds', diff: 'Medium', salary: '₹20 LPA', tips: 'Brush up System Design basics, OOP principles, and React state management.' },
        { company: 'Zoho', role: 'Software Developer', rounds: '5 Rounds (Aptitude + C Coding + Advanced Coding + Tech HR + General HR)', diff: 'Medium', salary: '₹8.5 LPA', tips: 'Strong C/C++ fundamentals and recursion logic are required.' }
      ].map((exp, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{exp.company}</h3>
              <span style={{ fontSize: 12, color: '#a5b4fc', background: 'rgba(99,102,241,0.15)', padding: '2px 10px', borderRadius: 20 }}>{exp.role}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>{exp.salary}</span>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: exp.diff === 'Hard' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: exp.diff === 'Hard' ? '#fca5a5' : '#fcd34d' }}>{exp.diff}</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>📋 {exp.rounds}</div>
          <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>💡 <strong>Selection Tip:</strong> {exp.tips}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- FEATURE 15: AI Certificate Verification ---
export const CertificateVerificationView = () => {
  const [certId, setCertId] = useState('CERT-AI-2026-9842');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🎓 AI Certificate Verification</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Verifiable credentials with QR verification, Certificate IDs & Blockchain proof simulation</p>

      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: 32, maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🏅</div>
        <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>OFFICIAL CERTIFICATE OF COMPLETION</span>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 6, marginBottom: 4 }}>Full-Stack & AI Engineering Masterclass</h2>
        <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20 }}>Awarded to <strong>Student Candidate</strong> for passing all capstones & code audits.</div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 12 }}>
          {/* QR Code representation */}
          <div style={{ width: 70, height: 70, background: '#fff', borderRadius: 8, padding: 6, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 3 }}>
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} style={{ background: (i * 7 + 2) % 3 === 0 ? '#000' : '#fff', borderRadius: 1 }} />
            ))}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Certificate ID</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#a5b4fc', fontFamily: 'monospace' }}>{certId}</div>
            <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>✓ Blockchain Verified Signature</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- FEATURE 16: Company Interview Pattern ---
export const CompanyInterviewPatternView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🧩 Company Interview Pattern Hub</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Recruitment patterns, coding difficulty levels, hiring rounds & FAQs for top IT firms</p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
      {[
        { name: 'Google', rounds: 4, diff: 'Hard (DSA & Systems)', level: 'Advanced', icon: '🔵' },
        { name: 'Amazon', rounds: 3, diff: 'Medium-Hard + LP', level: 'Advanced', icon: '🟠' },
        { name: 'Microsoft', rounds: 3, diff: 'Medium (Algorithms)', level: 'Intermediate', icon: '🟦' },
        { name: 'TCS Digital/NQT', rounds: 2, diff: 'Easy-Medium', level: 'Beginner', icon: '🏢' },
        { name: 'Infosys SP/DSE', rounds: 2, diff: 'Medium Coding', level: 'Intermediate', icon: '🔷' },
        { name: 'Zoho', rounds: 5, diff: 'Complex C/Recursion', level: 'Advanced', icon: '⚙️' }
      ].map((c, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>{c.icon}</span>
            <div>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{c.name}</h3>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>{c.level} Level</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>📋 Rounds: {c.rounds} Stages</div>
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>🎯 Focus: {c.diff}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- FEATURE 17: Salary Predictor ---
export const SalaryPredictorView = () => {
  const [role, setRole] = useState('Full Stack Developer');
  const [exp, setExp] = useState('1-2 Years');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>💰 AI Salary Predictor</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Predict expected salary bands based on skills, experience, project score & target company tier</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Enter Profile Parameters</h3>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>Target Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="AI Engineer">AI Engineer</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>Experience Level</label>
            <select value={exp} onChange={e => setExp(e.target.value)} style={{ width: '100%', padding: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}>
              <option value="Fresher (0 Years)">Fresher (0 Years)</option>
              <option value="1-2 Years">1-2 Years</option>
              <option value="3-5 Years">3-5 Years</option>
            </select>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(99,102,241,0.1))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>ESTIMATED COMPENSATION</span>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginTop: 4 }}>₹10–18 LPA</h2>
          <div style={{ fontSize: 13, color: '#6ee7b7', marginTop: 4 }}>High growth trajectory (+30% bonus for AWS & Docker skills)</div>
        </div>
      </div>
    </motion.div>
  );
};

// --- FEATURE 19: Team Project Collaboration ---
export const TeamCollaborationView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>👨‍💻 Team Project Collaboration</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Manage student development teams, Kanban task boards, file sharing & video meeting room</p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
      {['Backlog / To-Do', 'In Progress', 'Completed'].map((col, i) => (
        <div key={col} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 16 }}>
          <h3 style={{ color: '#a5b4fc', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{col}</h3>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{i === 0 ? 'Design Mongo ER Schema' : i === 1 ? 'Build JWT Auth Endpoint' : 'Setup Scaffolding'}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Assigned to: Alex & Sarah</div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- FEATURE 20: Hackathon & Contest Hub ---
export const HackathonHubView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🏅 Hackathon & Coding Contest Hub</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Upcoming global hackathons, Google Solution Challenge, Imagine Cup & SIH links</p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {[
        { name: 'Google Solution Challenge 2026', org: 'Google Developers', prize: '$12,000 USD', daysLeft: '14 Days Left', link: 'https://developers.google.com' },
        { name: 'Smart India Hackathon (SIH)', org: 'Govt. of India', prize: '₹1,00,000', daysLeft: '22 Days Left', link: 'https://sih.gov.in' },
        { name: 'Microsoft Imagine Cup', org: 'Microsoft', prize: '$100,000 USD + Azure Credits', daysLeft: '30 Days Left', link: 'https://imaginecup.microsoft.com' }
      ].map((h, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontWeight: 600 }}>🔥 {h.daysLeft}</span>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginTop: 8, marginBottom: 4 }}>{h.name}</h3>
          <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 12 }}>Host: {h.org} · Prize Pool: <strong style={{ color: '#10b981' }}>{h.prize}</strong></div>
          <a href={h.link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '8px 16px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
            Register Now →
          </a>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- FEATURE 21: Open Source Guide ---
export const OpenSourceGuideView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🌍 Open Source Contribution Guide</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Curated "Good First Issues", top GitHub repositories, PR tutorials & workflow cheat sheet</p>

    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
      <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📌 Good First Issues for Beginners</h3>
      {[
        { repo: 'facebook/react', issue: '#28410 Fix typo in documentation hooks reference', tag: 'good first issue' },
        { repo: 'vercel/next.js', issue: '#59201 Add missing TypeScript return type for image loader', tag: 'good first issue' },
        { repo: 'expressjs/express', issue: '#4102 Add extra unit test for routing parameter decoder', tag: 'good first issue' }
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
          <div>
            <span style={{ color: '#a5b4fc', fontSize: 13, fontWeight: 600 }}>{item.repo}</span>
            <div style={{ color: '#cbd5e1', fontSize: 12 }}>{item.issue}</div>
          </div>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }}>{item.tag}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- FEATURE 22: AI Career Success Predictor ---
export const CareerSuccessPredictorView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🤖 AI Career Success Predictor</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Predict probability of getting selected, placement readiness, interview performance & salary forecast</p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: 24 }}>
        <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, textTransform: 'uppercase' }}>SELECTION PROBABILITY</span>
        <h2 style={{ fontSize: 44, fontWeight: 900, color: '#fff', marginTop: 2 }}>82%</h2>
        <div style={{ fontSize: 13, color: '#6ee7b7', marginTop: 4 }}>High chance of clearing Tier-1 & Mid-size tech company interviews</div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>EXPECTED INTERVIEW PERFORMANCE</span>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#a5b4fc', marginTop: 6 }}>8.4 / 10</h2>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Strong problem solving & technical articulation</div>
      </div>
    </div>
  </motion.div>
);

// --- FEATURE 23 & 24: Daily Challenge & Tech News ---
export const DailyChallengeAndNewsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🔥 AI Daily Challenge & Tech News</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Everyday coding challenge, quiz, resume task & real-time tech news feed</p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Daily Challenge */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
        <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>TODAY'S DAILY CHALLENGE</span>
        <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginTop: 4, marginBottom: 8 }}>Two Sum — Hash Map Optimization</h3>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
          Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.
        </p>
        <button style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
          Solve Challenge →
        </button>
      </div>

      {/* Tech News */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
        <span style={{ fontSize: 11, color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>🌐 LATEST TECH & AI NEWS</span>
        <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
          {[
            { title: 'OpenAI releases new reasoning model API', time: '2 hours ago' },
            { title: 'React 19 official release brings Server Actions to production', time: '5 hours ago' },
            { title: 'Tech hiring spikes 24% for Full-Stack & AI engineers', time: '1 day ago' }
          ].map((news, i) => (
            <div key={i} style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingBottom: 6 }}>
              <div style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 500 }}>{news.title}</div>
              <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{news.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);
