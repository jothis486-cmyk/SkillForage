import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/api';

// --- FEATURE 6: Industry Skill Tracker ---
export const IndustrySkillTrackerView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>ðŸ“Š Industry Skill Tracker</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Real-time demand metrics for languages, frameworks, tools & future tech</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
        <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>ðŸ”¥ Top Programming Languages (2026 Demand)</h3>
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
        <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>ðŸš€ Demanded Frameworks & Cloud Tools</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['React.js', 'Next.js', 'FastAPI', 'PyTorch', 'Docker', 'Kubernetes', 'AWS', 'TailwindCSS', 'LangChain', 'Redis', 'GraphQL', 'PostgreSQL'].map(tool => (
            <span key={tool} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              âš¡ {tool}
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
    { role: 'ai', text: "Hello! I am your personal AI Mentor ðŸ§  Ask me anything about tech stacks, preparation strategies, or interview readiness!" }
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
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>ðŸ§  AI Personal Mentor</h1>
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
          Send â†—
        </button>
      </div>
    </motion.div>
  );
};

// --- FEATURE 9: Freelancing Readiness ---
export const FreelancingReadinessView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>ðŸ’¼ Freelancing Readiness Hub</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Skill assessments, proposal templates, pricing calculators & top freelance platforms</p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
      <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: 20 }}>
        <div style={{ color: '#10b981', fontWeight: 700, fontSize: 12 }}>PORTFOLIO READINESS SCORE</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginTop: 4 }}>84<span style={{ fontSize: 18, color: '#6ee7b7' }}>/100</span></div>
        <div style={{ fontSize: 11, color: '#6ee7b7', marginTop: 4 }}>Ready for Upwork & Fiverr gigs</div>
      </div>
      <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 16, padding: 20 }}>
        <div style={{ color: '#a5b4fc', fontWeight: 700, fontSize: 12 }}>ESTIMATED HOURLY RATE</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 4 }}>$35â€“$65 <span style={{ fontSize: 14, color: '#64748b' }}>/ hr</span></div>
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
      <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>ðŸ“‘ AI Client Proposal Template Generator</h3>
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
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>ðŸ† Interview Experience Hub</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Student-contributed interview questions, rounds breakdowns, difficulty ratings & compensation packages</p>

    <div style={{ display: 'grid', gap: 14 }}>
      {[
        { company: 'Google', role: 'Software Engineer L3', rounds: '4 Rounds (1 Screen + 3 Onsite DSA)', diff: 'Hard', salary: 'â‚¹28 LPA', tips: 'Focus heavily on Graph algorithms, Dynamic Programming, and clean modular code.' },
        { company: 'Amazon', role: 'SDE-1', rounds: '3 Rounds (OA + 2 Tech Rounds)', diff: 'Medium-Hard', salary: 'â‚¹22 LPA', tips: 'Prepare Amazon Leadership Principles deeply for behavioral questions!' },
        { company: 'Microsoft', role: 'Full Stack Engineer', rounds: '3 Tech Rounds', diff: 'Medium', salary: 'â‚¹20 LPA', tips: 'Brush up System Design basics, OOP principles, and React state management.' },
        { company: 'Zoho', role: 'Software Developer', rounds: '5 Rounds (Aptitude + C Coding + Advanced Coding + Tech HR + General HR)', diff: 'Medium', salary: 'â‚¹8.5 LPA', tips: 'Strong C/C++ fundamentals and recursion logic are required.' }
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
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>ðŸ“‹ {exp.rounds}</div>
          <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>ðŸ’¡ <strong>Selection Tip:</strong> {exp.tips}</div>
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
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>ðŸŽ“ AI Certificate Verification</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Verifiable credentials with QR verification, Certificate IDs & Blockchain proof simulation</p>

      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: 32, maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>ðŸ…</div>
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
            <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>âœ“ Blockchain Verified Signature</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


// --- FEATURE 17: Salary Predictor ---
export const SalaryPredictorView = () => {
  const [role, setRole] = useState('Full Stack Developer');
  const [exp, setExp] = useState('1-2 Years');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>ðŸ’° AI Salary Predictor</h1>
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
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginTop: 4 }}>â‚¹10â€“18 LPA</h2>
          <div style={{ fontSize: 13, color: '#6ee7b7', marginTop: 4 }}>High growth trajectory (+30% bonus for AWS & Docker skills)</div>
        </div>
      </div>
    </motion.div>
  );
};

// --- FEATURE 19: Team Project Collaboration ---
export const TeamCollaborationView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>ðŸ‘¨â€ðŸ’» Team Project Collaboration</h1>
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

import HackathonRegisterModal from './HackathonRegisterModal';

// --- FEATURE 20: Hackathon & Contest Hub ---
export const HackathonHubView = ({ user }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [registeredIds, setRegisteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('registeredHackathons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const HACKATHONS = [
    // Coimbatore College Hackathons
    {
      id: 'psg-kriya',
      name: 'PSG Kriya National Tech Hackathon 2026',
      org: 'PSG College of Technology (PSG Tech)',
      location: 'PSG Tech Campus, Peelamedu, Coimbatore',
      category: 'Coimbatore Colleges',
      prize: 'â‚¹2,50,000',
      daysLeft: '12 Days Left',
      badge: 'Coimbatore Campus',
      tag: 'AI, IoT & Robotics',
      link: 'https://psgtech.edu'
    },
    {
      id: 'cit-cybervision',
      name: 'CIT CyberVision AI & ML Hackathon',
      org: 'Coimbatore Institute of Technology (CIT)',
      location: 'CIT Campus, Civil Aerodrome, Coimbatore',
      category: 'Coimbatore Colleges',
      prize: 'â‚¹1,50,000',
      daysLeft: '18 Days Left',
      badge: 'Coimbatore Campus',
      tag: 'AI & Data Science',
      link: 'https://cit.edu.in'
    },
    {
      id: 'skcet-hackfest',
      name: 'SKCET National HackFest 2026',
      org: 'Sri Krishna College of Engg & Tech (SKCET)',
      location: 'SKCET Campus, Kuniamuthur, Coimbatore',
      category: 'Coimbatore Colleges',
      prize: 'â‚¹2,00,000',
      daysLeft: '8 Days Left',
      badge: 'Coimbatore Campus',
      tag: 'Full Stack & Web3',
      link: 'https://skcet.ac.in'
    },
    {
      id: 'kct-yugam',
      name: 'KCT Yugam Innovation Grand Hackathon',
      org: 'Kumaraguru College of Technology (KCT)',
      location: 'KCT Campus, Saravanampatti, Coimbatore',
      category: 'Coimbatore Colleges',
      prize: 'â‚¹3,00,000',
      daysLeft: '15 Days Left',
      badge: 'Coimbatore Campus',
      tag: 'Smart Cities & AI',
      link: 'https://kct.ac.in'
    },
    {
      id: 'amrita-anokha',
      name: 'Amrita Anokha AI & Robotics Hackathon',
      org: 'Amrita Vishwa Vidyapeetham',
      location: 'Amrita Campus, Ettimadai, Coimbatore',
      category: 'Coimbatore Colleges',
      prize: 'â‚¹5,00,000',
      daysLeft: '25 Days Left',
      badge: 'Coimbatore Campus',
      tag: 'Robotics & Deep Tech',
      link: 'https://amrita.edu'
    },
    {
      id: 'srec-smart-city',
      name: 'SREC Smart City & IoT Techathon',
      org: 'Sri Ramakrishna Engineering College (SREC)',
      location: 'SREC Campus, Vattamalaipalayam, Coimbatore',
      category: 'Coimbatore Colleges',
      prize: 'â‚¹1,00,000',
      daysLeft: '20 Days Left',
      badge: 'Coimbatore Campus',
      tag: 'IoT & Clean Energy',
      link: 'https://srec.ac.in'
    },
    {
      id: 'gct-techvista',
      name: 'GCT TechVista Codeathon 2026',
      org: 'Government College of Technology (GCT)',
      location: 'GCT Campus, Thadagam Road, Coimbatore',
      category: 'Coimbatore Colleges',
      prize: 'â‚¹1,20,000',
      daysLeft: '10 Days Left',
      badge: 'Coimbatore Campus',
      tag: 'DSA & Open Source',
      link: 'https://gct.ac.in'
    },
    // Global & National
    {
      id: 'google-solution-challenge',
      name: 'Google Solution Challenge 2026',
      org: 'Google Developers',
      location: 'Global (Virtual)',
      category: 'Global AI',
      prize: '$12,000 USD',
      daysLeft: '14 Days Left',
      badge: 'Global Flagship',
      tag: 'UN Sustainable Goals',
      link: 'https://developers.google.com'
    },
    {
      id: 'sih-2026',
      name: 'Smart India Hackathon (SIH 2026)',
      org: 'Govt. of India & Ministry of Education',
      location: 'India (National Nodal Centers)',
      category: 'National & SIH',
      prize: 'â‚¹1,00,000',
      daysLeft: '22 Days Left',
      badge: 'Govt of India',
      tag: 'National Problem Statements',
      link: 'https://sih.gov.in'
    },
    {
      id: 'microsoft-imagine-cup',
      name: 'Microsoft Imagine Cup 2026',
      org: 'Microsoft Azure',
      location: 'Global (Virtual)',
      category: 'Global AI',
      prize: '$100,000 USD + Azure Credits',
      daysLeft: '30 Days Left',
      badge: 'Global Flagship',
      tag: 'AI Startup & Cloud',
      link: 'https://imaginecup.microsoft.com'
    }
  ];

  const handleRegisterSuccess = (hackathonId) => {
    setRegisteredIds(prev => {
      const next = [...new Set([...prev, hackathonId])];
      try { localStorage.setItem('registeredHackathons', JSON.stringify(next)); } catch (_) {}
      return next;
    });
  };

  const filteredList = HACKATHONS.filter(h => {
    if (selectedFilter === 'Coimbatore Colleges') return h.category === 'Coimbatore Colleges';
    if (selectedFilter === 'National & SIH') return h.category === 'National & SIH';
    if (selectedFilter === 'Global AI') return h.category === 'Global AI';
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 6 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0 }}>ðŸ… Hackathon & Coding Contest Hub</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>Coimbatore college hackathons, SIH, Google Solution Challenge & Microsoft Imagine Cup</p>
        </div>
        {registeredIds.length > 0 && (
          <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13 }}>ðŸŽ‰</span>
            <span style={{ color: '#6ee7b7', fontSize: 12, fontWeight: 700 }}>{registeredIds.length} Team Registration{registeredIds.length > 1 ? 's' : ''} Confirmed</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, margin: '20px 0', flexWrap: 'wrap' }}>
        {[
          { id: 'All', label: 'All Contests' },
          { id: 'Coimbatore Colleges', label: 'Coimbatore Colleges ðŸ«' },
          { id: 'National & SIH', label: 'National & SIH ðŸ‡®ðŸ‡³' },
          { id: 'Global AI', label: 'Global AI & Tech ðŸŒ' }
        ].map(f => {
          const active = selectedFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              style={{
                padding: '8px 18px',
                background: active ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${active ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 20,
                color: active ? '#fff' : '#64748b',
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
                boxShadow: active ? '0 0 14px rgba(99,102,241,0.25)' : 'none'
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {filteredList.map((h) => {
          const isRegistered = registeredIds.includes(h.id);
          return (
            <div
              key={h.id}
              style={{
                background: isRegistered ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isRegistered ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontWeight: 600 }}>
                    ðŸ”¥ {h.daysLeft}
                  </span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontWeight: 600 }}>
                    {h.badge}
                  </span>
                </div>

                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>{h.name}</h3>
                
                <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8, lineHeight: 1.5 }}>
                  Host: <strong style={{ color: '#fff' }}>{h.org}</strong>
                  <br />
                  Venue: <span style={{ color: '#cbd5e1' }}>{h.location}</span>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Prize Pool:</span>
                  <strong style={{ color: '#10b981', fontSize: 14 }}>{h.prize}</strong>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                    {h.tag}
                  </span>
                </div>
              </div>

              {isRegistered ? (
                <span style={{
                  display: 'inline-block',
                  textAlign: 'center',
                  padding: '9px 18px',
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.35)',
                  borderRadius: 10,
                  color: '#6ee7b7',
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  âœ“ Team Registered
                </span>
              ) : (
                <button
                  onClick={() => {
                    setSelectedHackathon(h);
                    setShowModal(true);
                  }}
                  style={{
                    padding: '9px 18px',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    border: 'none',
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
                  }}
                >
                  Register Now â†’
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <HackathonRegisterModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        hackathon={selectedHackathon}
        user={user}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </motion.div>
  );
};



// --- FEATURE 23 & 24: Daily Challenge & Tech News ---
export const DailyChallengeAndNewsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>ðŸ”¥ AI Daily Challenge & Tech News</h1>
    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Everyday coding challenge, quiz, resume task & real-time tech news feed</p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Daily Challenge */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
        <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>TODAY'S DAILY CHALLENGE</span>
        <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginTop: 4, marginBottom: 8 }}>Two Sum â€” Hash Map Optimization</h3>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
          Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.
        </p>
        <button style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
          Solve Challenge â†’
        </button>
      </div>

      {/* Tech News */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
        <span style={{ fontSize: 11, color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>ðŸŒ LATEST TECH & AI NEWS</span>
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
