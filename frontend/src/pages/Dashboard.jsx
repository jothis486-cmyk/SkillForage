import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement
} from 'chart.js';
import { Radar, Bar, Doughnut } from 'react-chartjs-2';

import ProjectBuilder from '../components/ProjectBuilder';
import ProjectDebugger from '../components/ProjectDebugger';
import GitHubAnalyzer from '../components/GitHubAnalyzer';
import JobMatcher from '../components/JobMatcher';
import PlacementPrep from '../components/PlacementPrep';
import LiveClassAssessment from '../components/LiveClassAssessment';
import AIInterviewSystem from '../components/AIInterviewSystem';
import EditableProfileView from '../components/EditableProfileView';
import ResumeExampleModal from '../components/ResumeExampleModal';
import CodingWorkspaceModal from '../components/CodingWorkspaceModal';
import JobApplicationModal from '../components/JobApplicationModal';
import {
  IndustrySkillTrackerView,
  AIMentorView,
  FreelancingReadinessView,
  InterviewExperienceHubView,
  CertificateVerificationView,
  CompanyInterviewPatternView,
  SalaryPredictorView,
  TeamCollaborationView,
  HackathonHubView,
  OpenSourceGuideView,
  CareerSuccessPredictorView,
  DailyChallengeAndNewsView
} from '../components/FeatureHubs';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement);

const SIDEBAR_ITEMS = [
  { icon: '🏠', label: 'Dashboard', id: 'dashboard' },
  { icon: '🧠', label: 'AI Career Prediction', id: 'career' },
  { icon: '📄', label: 'Resume Analyzer', id: 'resume' },
  { icon: '🎯', label: 'Skill Gap Analysis', id: 'skillgap' },
  { icon: '📚', label: 'Learning Hub', id: 'courses' },
  { icon: '🎥', label: 'Live Classes', id: 'live-class-assessment', live: true },
  { icon: '💻', label: 'Coding Practice', id: 'coding' },
  { icon: '🛠', label: 'Project Builder', id: 'project-builder' },
  { icon: '🎤', label: 'AI Mock Interview', id: 'ai-interview' },
  { icon: '💼', label: 'Job Recommendations', id: 'jobs' },
  { icon: '🏆', label: 'Certificates', id: 'certifications' },
  { icon: '👥', label: 'Community', id: 'team-collaboration' },
  { icon: '🤖', label: 'AI Mentor', id: 'ai-mentor' },
  { icon: '📊', label: 'Industry Skill Tracker', id: 'skill-tracker' },
  { icon: '📅', label: 'Placement Planner', id: 'placement-planner' },
  { icon: '💰', label: 'Salary Predictor', id: 'salary-predictor' },
  { icon: '🏅', label: 'Hackathons & Contests', id: 'hackathons' },
  { icon: '🌍', label: 'Open Source Guide', id: 'open-source' },
  { icon: '🔥', label: 'Daily Challenge & News', id: 'daily-challenge' },
  { icon: '📂', label: 'GitHub Analyzer', id: 'github-analyzer' },
  { icon: '📄', label: 'Resume vs Job Match', id: 'job-match' },
  { icon: '🤖', label: 'AI Success Predictor', id: 'career-success' },
  { icon: '👨‍💻', label: 'Debug & Fix Code', id: 'project-debugger' },
  { icon: '🧩', label: 'Company Patterns', id: 'company-patterns' },
  { icon: '👤', label: 'Profile', id: 'profile' },
  { icon: '⚙', label: 'Settings', id: 'profile' },
];

const CircularProgress = ({ pct, size = 72, stroke = 6, color = '#6366f1', children }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: '#fff', fontSize: size < 60 ? 11 : 14, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>
        {children}
      </text>
    </svg>
  );
};


const StatCard = ({ icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, padding: '20px 24px', cursor: 'default', transition: 'all 0.3s',
    }}
    whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.3)', borderColor: color + '44' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
      <span style={{ fontSize: 10, color: '#10b981', background: 'rgba(16,185,129,0.12)', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>↑ LIVE</span>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: color, marginTop: 4, fontWeight: 500 }}>{sub}</div>}
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: "Hi! I'm your AI Career Assistant 🤖 Ask me anything about your career path, skills, or interview prep!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedResumeTemplate, setSelectedResumeTemplate] = useState('ATS-Optimized');
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState('two-sum');
  const [showCodingModal, setShowCodingModal] = useState(false);
  const [selectedJobForApp, setSelectedJobForApp] = useState(null);
  const [showJobAppModal, setShowJobAppModal] = useState(false);
  const [jobFilter, setJobFilter] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('appliedJobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleApplySuccess = (jobId) => {
    setAppliedJobs(prev => {
      const next = [...new Set([...prev, jobId])];
      try { localStorage.setItem('appliedJobs', JSON.stringify(next)); } catch (_) {}
      return next;
    });
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    setTimeout(() => {
      let reply = "Great question! Based on your profile, I recommend focusing on building real-world projects to strengthen your portfolio. 💡";
      if (msg.toLowerCase().includes('roadmap')) reply = "Your personalized roadmap: Start with Python basics → Data Structures → Machine Learning fundamentals → Build 3 projects → Apply for internships! 🗺️";
      if (msg.toLowerCase().includes('interview')) reply = "For interviews, practice: Arrays, Linked Lists, Trees on LeetCode. Focus on STAR method for HR rounds. Mock interviews weekly! 🎤";
      if (msg.toLowerCase().includes('skill')) reply = "Your top missing skills are: Docker, System Design, and Cloud (AWS). These will boost your salary by 30%! 📈";
      setChatMessages(prev => [...prev, { role: 'ai', text: reply }]);
    }, 800);
  };

  const radarData = {
    labels: ['Python', 'React', 'Node.js', 'SQL', 'ML', 'AWS'],
    datasets: [
      { label: 'Your Skills', data: [80, 90, 75, 70, 55, 40], backgroundColor: 'rgba(99,102,241,0.2)', borderColor: '#6366f1', borderWidth: 2, pointBackgroundColor: '#6366f1' },
      { label: 'Required', data: [90, 75, 80, 80, 80, 70], backgroundColor: 'rgba(6,182,212,0.15)', borderColor: '#06b6d4', borderWidth: 2, pointBackgroundColor: '#06b6d4' },
    ],
  };

  const barData = {
    labels: ['Software Eng.', 'Full Stack', 'Data Scientist', 'AI Engineer', 'Cloud Eng.', 'DevOps'],
    datasets: [{
      label: 'Match %',
      data: [85, 72, 61, 54, 45, 38],
      backgroundColor: ['rgba(99,102,241,0.8)', 'rgba(139,92,246,0.8)', 'rgba(6,182,212,0.8)', 'rgba(16,185,129,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)'],
      borderRadius: 8,
    }]
  };

  const doughnutData = {
    labels: ['Completed', 'In Progress', 'Remaining'],
    datasets: [{
      data: [35, 25, 40],
      backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(99,102,241,0.8)', 'rgba(255,255,255,0.08)'],
      borderColor: ['#10b981', '#6366f1', 'rgba(255,255,255,0.05)'],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } },
    scales: { r: { grid: { color: 'rgba(255,255,255,0.06)' }, pointLabels: { color: '#94a3b8', font: { size: 11 } }, ticks: { display: false } } }
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 } }, max: 100 }
    }
  };

  const missingSkills = ['Docker', 'Kubernetes', 'AWS', 'System Design', 'GraphQL', 'Redis'];
  const existingSkills = ['Python', 'React', 'Node.js', 'SQL', 'Git', 'REST APIs', 'MongoDB'];

  const roadmap = [
    { phase: 'Phase 1', title: 'Core Foundations', duration: '4 weeks', status: 'done', skills: ['Python Advanced', 'Data Structures', 'Algorithms'] },
    { phase: 'Phase 2', title: 'Backend Mastery', duration: '6 weeks', status: 'active', skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'] },
    { phase: 'Phase 3', title: 'Cloud & DevOps', duration: '8 weeks', status: 'upcoming', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'] },
    { phase: 'Phase 4', title: 'ML & AI Integration', duration: '8 weeks', status: 'upcoming', skills: ['Scikit-learn', 'TensorFlow', 'FastAPI', 'NLP'] },
  ];

  const interviewQuestions = [
    { type: '💻 Technical', q: 'Explain the difference between SQL and NoSQL databases.' },
    { type: '🧩 DSA', q: 'Given an array, find the two elements that sum to a target value.' },
    { type: '🤝 HR', q: 'Tell me about a time you overcame a difficult technical challenge.' },
    { type: '🧠 System Design', q: 'Design a URL shortening service like bit.ly.' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'project-builder': return <ProjectBuilder />;
      case 'project-debugger': return <ProjectDebugger />;
      case 'github-analyzer': return <GitHubAnalyzer />;
      case 'job-match': return <JobMatcher />;
      case 'career-success': return <CareerSuccessPredictorView />;
      case 'skill-tracker': return <IndustrySkillTrackerView />;
      case 'placement-planner': return <PlacementPrep />;
      case 'ai-mentor': return <AIMentorView />;
      case 'freelancing': return <FreelancingReadinessView />;
      case 'interview-experiences': return <InterviewExperienceHubView />;
      case 'certifications': return <CertificateVerificationView />;
      case 'company-patterns': return <CompanyInterviewPatternView />;
      case 'salary-predictor': return <SalaryPredictorView />;
      case 'team-collaboration': return <TeamCollaborationView />;
      case 'hackathons': return <HackathonHubView />;
      case 'open-source': return <OpenSourceGuideView />;
      case 'daily-challenge': return <DailyChallengeAndNewsView />;
      case 'ai-interview': return <AIInterviewSystem />;
      case 'live-class-assessment': return <LiveClassAssessment />;

      case 'dashboard': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <style>{`
            @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.15)} }
            @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
            .sf-hero { background: linear-gradient(135deg,rgba(99,102,241,0.18) 0%,rgba(139,92,246,0.12) 40%,rgba(6,182,212,0.1) 100%); }
            .sf-card:hover { transform:translateY(-3px); box-shadow:0 16px 48px rgba(0,0,0,0.4); }
            .sf-card { transition: all 0.25s ease; }
            .sf-btn { transition: all 0.2s ease; }
            .sf-btn:hover { transform:translateY(-1px); filter:brightness(1.1); }
            .sf-course:hover { transform:translateY(-4px); border-color:rgba(99,102,241,0.5) !important; }
            .sf-course { transition: all 0.25s ease; }
          `}</style>

          {/* ── WELCOME HERO CARD ── */}
          <div className="sf-card" style={{
            borderRadius: 20, border: '1px solid rgba(99,102,241,0.25)', marginBottom: 24, overflow: 'hidden', position: 'relative',
            background: 'linear-gradient(135deg,rgba(99,102,241,0.15) 0%,rgba(139,92,246,0.1) 50%,rgba(6,182,212,0.08) 100%)',
          }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -40, left: '40%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(6,182,212,0.07)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <div style={{ padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>⚡ SkillForge AI Dashboard</div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 6, lineHeight: 1.2 }}>
                  {(() => { const h = new Date().getHours(); return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'; })()}, {user?.fullName?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>Keep learning, keep building, keep growing!</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[{ icon: '⭐', label: 'XP Points', val: '2,450' }, { icon: '🏆', label: 'Certificates', val: '6' }, { icon: '🛠', label: 'Projects', val: '4' }, { icon: '📚', label: 'Courses', val: '8' }].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 18px', textAlign: 'center', minWidth: 90 }}>
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 100, lineHeight: 1, opacity: 0.85, flexShrink: 0 }}>🧑‍💻</div>
            </div>
          </div>

          {/* ── CAREER READINESS CARDS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Resume Score', val: 91, sub: 'Excellent', color: '#10b981' },
              { label: 'Skill Match', val: 78, sub: 'Good Match', color: '#6366f1' },
              { label: 'Interview Score', val: 75, sub: 'Good', color: '#f59e0b' },
              { label: 'Learning Progress', val: 68, sub: 'In Progress', color: '#06b6d4' },
              { label: 'Coding Score', val: 82, sub: 'Very Good', color: '#8b5cf6' },
            ].map((c, i) => (
              <motion.div key={i} className="sf-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 14px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <CircularProgress pct={c.val} size={72} stroke={6} color={c.color}>{c.val}%</CircularProgress>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: c.color, fontWeight: 600 }}>{c.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* ── MAIN 3-COLUMN ROW ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: 16, marginBottom: 24 }}>

            {/* Continue Learning */}
            <div className="sf-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ padding: '16px 18px 0' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>▶ Continue Learning</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14, lineHeight: 1.4 }}>Python for Beginners – Functions, Modules & More</h3>
              </div>
              <div style={{ position: 'relative', background: 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(6,182,212,0.15))', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => navigate('/course/python-masterclass')}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.3)' }}>
                  <span style={{ fontSize: 22, marginLeft: 4 }}>▶</span>
                </div>
                <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}><span>14:32</span><span>45:00</span></div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg,#6366f1,#06b6d4)', borderRadius: 2 }} />
                  </div>
                </div>
                <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', gap: 8 }}>
                  {['🔊','⚙️','⛶'].map((ic,i) => <span key={i} style={{ fontSize: 14, cursor: 'pointer', opacity: 0.7 }}>{ic}</span>)}
                </div>
              </div>
              <div style={{ padding: '14px 18px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>62% Completed</div>
                  <div style={{ height: 5, width: 120, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 3 }} />
                  </div>
                </div>
                <button className="sf-btn" onClick={() => navigate('/course/python-masterclass')}
                  style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                  ▶ Resume Learning
                </button>
              </div>
            </div>

            {/* Live Class Now */}
            <div className="sf-card" style={{ background: 'linear-gradient(135deg,rgba(239,68,68,0.1),rgba(99,102,241,0.12))', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 18, padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'livePulse 1.5s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', letterSpacing: 1.5, textTransform: 'uppercase' }}>LIVE NOW</span>
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Data Structures in Python</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>R</div>
                  <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}>Rahul Sharma</span>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#94a3b8' }}>
                  <span>👥 126 Students Online</span>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>+120 XP</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>Session Progress</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{ width: '58%', height: '100%', background: 'linear-gradient(90deg,#ef4444,#f97316)', borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>58 min remaining</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="sf-btn" onClick={() => setActiveTab('live-class-assessment')}
                  style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                  🔴 Join Live Class
                </button>
                <button className="sf-btn" onClick={() => setActiveTab('live-class-assessment')}
                  style={{ padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>
                  📅 Schedule
                </button>
              </div>
            </div>

            {/* Upcoming Live Classes */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '18px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Upcoming Live Classes</h3>
                <button onClick={() => setActiveTab('live-class-assessment')} style={{ fontSize: 11, background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>View All →</button>
              </div>
              {[
                { icon: '⚛️', title: 'Web Dev with React', time: 'Today, 7:00 PM', live: true },
                { icon: '🧠', title: 'Machine Learning Basics', time: 'Tomorrow, 6:00 PM', live: false },
                { icon: '🏗️', title: 'System Design Principles', time: '25 Aug, 7:00 PM', live: false },
                { icon: '🍃', title: 'MongoDB Masterclass', time: '26 Aug, 6:00 PM', live: false },
              ].map((cls, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{cls.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cls.title}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{cls.time}</div>
                  </div>
                  {cls.live
                    ? <span style={{ fontSize: 9, background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: 4, fontWeight: 700, letterSpacing: 0.5, flexShrink: 0, animation: 'livePulse 1.5s infinite' }}>LIVE</span>
                    : <button className="sf-btn" style={{ fontSize: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, flexShrink: 0 }}>Join</button>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* ── LOWER 3-COLUMN ROW ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>

            {/* AI Mentor */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 18, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>AI Mentor</div>
                  <div style={{ fontSize: 10, color: '#10b981', fontWeight: 600 }}>● Online</div>
                </div>
              </div>
              <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: '10px 12px', fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
                Hi {user?.fullName?.split(' ')[0] || 'there'}! 👋<br />I'm your AI Mentor. How can I help you today?
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {['💡 Suggest a Project', '📄 Improve Resume', '🎤 Interview Prep', '📖 Explain a Topic'].map((q, i) => (
                  <button key={i} className="sf-btn" onClick={() => setActiveTab('ai-mentor')}
                    style={{ padding: '7px 6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#94a3b8', fontSize: 10, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 500, textAlign: 'left' }}>
                    {q}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input placeholder="Ask me anything..." onKeyDown={e => e.key==='Enter' && setActiveTab('ai-mentor')}
                  style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none', fontFamily: 'Inter,sans-serif' }} />
                <button className="sf-btn" onClick={() => setActiveTab('ai-mentor')}
                  style={{ padding: '8px 12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, cursor: 'pointer' }}>➤</button>
              </div>
            </div>

            {/* Achievements */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '18px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>🏅 Recent Achievements</h3>
                <button style={{ fontSize: 11, background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>View All</button>
              </div>
              {[
                { icon: '🏅', title: 'Python Basics Certificate', sub: 'Earned on 20 May 2024', color: '#f59e0b' },
                { icon: '🔥', title: '30 Day Learning Streak', sub: 'Keep it up!', color: '#ef4444' },
                { icon: '💻', title: 'Solved 50 Coding Problems', sub: 'Great job!', color: '#10b981' },
                { icon: '🚀', title: 'Project Published', sub: 'Portfolio updated', color: '#6366f1' },
              ].map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                  style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{a.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{a.title}</div>
                    <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{a.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Leaderboard */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '18px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>🏆 Leaderboard</h3>
                <span style={{ fontSize: 10, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>This Week</span>
              </div>
              {[
                { rank: 1, name: 'Rahul Verma', xp: 2450, you: false },
                { rank: 2, name: user?.fullName?.split(' ')[0] ? `${user.fullName.split(' ')[0]} (You)` : 'You', xp: 2150, you: true },
                { rank: 3, name: 'Anjali Mehta', xp: 1980, you: false },
                { rank: 4, name: 'Rohan Gupta', xp: 1750, you: false },
                { rank: 5, name: 'Priya Singh', xp: 1450, you: false },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, marginBottom: 4,
                  background: p.you ? 'rgba(99,102,241,0.12)' : 'transparent', border: p.you ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: i < 3 ? ['linear-gradient(135deg,#f59e0b,#d97706)','linear-gradient(135deg,#94a3b8,#64748b)','linear-gradient(135deg,#b45309,#92400e)'][i] : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {p.rank}
                  </div>
                  <div style={{ flex: 1, fontSize: 12, fontWeight: p.you ? 700 : 500, color: p.you ? '#a5b4fc' : '#cbd5e1' }}>{p.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>⭐ {p.xp.toLocaleString()}</div>
                </div>
              ))}
              <button className="sf-btn" style={{ width: '100%', marginTop: 10, padding: '9px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 10, color: '#a5b4fc', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>
                View Full Leaderboard →
              </button>
            </div>
          </div>

          {/* ── RECOMMENDED COURSES ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>⚡ Recommended for You</h3>
              <button onClick={() => setActiveTab('courses')} style={{ fontSize: 12, background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>View All →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
              {[
                { icon: '🐍', title: 'Data Science with Python', instructor: 'Prof. Anil Sharma', rating: 4.8, students: '12K', level: 'Beg → Adv', color: '#10b981' },
                { icon: '⚛️', title: 'Full Stack Web Development', instructor: 'James Rodriguez', rating: 4.7, students: '9.5K', level: 'HTML, CSS, JS, React', color: '#6366f1' },
                { icon: '🧠', title: 'Machine Learning A-Z', instructor: 'Dr. Sarah Chen', rating: 4.9, students: '18K', level: 'Python, ML, NLP', color: '#8b5cf6' },
                { icon: '🗄️', title: 'SQL for Data Analysis', instructor: 'Raj Patel', rating: 4.6, students: '7K', level: 'Beg → Adv', color: '#06b6d4' },
              ].map((c, i) => (
                <motion.div key={i} className="sf-course" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 * i }}
                  onClick={() => navigate('/course/python-masterclass')}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ height: 100, background: `linear-gradient(135deg,${c.color}28,${c.color}0a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>{c.icon}</div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.3 }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>👨‍🏫 {c.instructor}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>⭐ {c.rating}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>👥 {c.students} students</div>
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 10, background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 6, display: 'inline-block' }}>{c.level}</div>
                    <button className="sf-btn" style={{ width: '100%', padding: '8px', background: `${c.color}22`, border: `1px solid ${c.color}44`, borderRadius: 8, color: c.color, fontSize: 11, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>
                      Start Learning →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── CAREER READINESS + CHARTS ROW ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr', gap: 16, marginBottom: 24 }}>
            {/* Career Readiness Score */}
            <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 18, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', textAlign: 'center' }}>Career Readiness Score</div>
              <CircularProgress pct={82} size={100} stroke={8} color="#6366f1">82%</CircularProgress>
              <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>Keep going! 🚀</div>
              <button className="sf-btn" onClick={() => setActiveTab('career')}
                style={{ width: '100%', padding: '9px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 10, color: '#a5b4fc', fontSize: 11, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>
                View Full Report →
              </button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🕸️ Skill Radar</h3>
              <Radar data={radarData} options={{ ...chartOptions, maintainAspectRatio: true }} />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📊 Career Match %</h3>
              <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: true }} />
            </div>
          </div>

          {/* ── BOTTOM QUICK ACTION BAR ── */}
          <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(6,182,212,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 700, marginBottom: 8 }}>⚡ Get Job Ready with SkillForge AI</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { label: '🛠 Build Projects', tab: 'project-builder' },
                  { label: '💻 Practice Coding', tab: 'coding' },
                  { label: '📄 Improve Resume', tab: 'resume' },
                  { label: '🎤 Mock Interviews', tab: 'ai-interview' },
                  { label: '🏆 Get Certified', tab: 'certifications' },
                ].map((a, i) => (
                  <button key={i} className="sf-btn" onClick={() => setActiveTab(a.tab)}
                    style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, color: '#94a3b8', fontSize: 11, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <button className="sf-btn" onClick={() => setActiveTab('jobs')}
              style={{ padding: '12px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
              💼 Explore Job Opportunities →
            </button>
          </div>
        </motion.div>
      );

      case 'career': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🎯 Career Prediction</h1>
          <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>AI-powered career recommendation based on your profile</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: 28, gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 70, height: 70, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>💼</div>
                <div>
                  <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>🤖 AI Prediction</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Software Engineer</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>85% Match</span>
                    <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>High Demand ↑</span>
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>Expected Salary</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>₹8–22 LPA</div>
                  <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>Growth: +25% by 2027</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { role: 'Software Engineer', match: 85, salary: '₹8–22 LPA', demand: 'Very High', color: '#6366f1' },
              { role: 'Full Stack Developer', match: 72, salary: '₹7–18 LPA', demand: 'High', color: '#8b5cf6' },
              { role: 'Data Scientist', match: 61, salary: '₹10–25 LPA', demand: 'High', color: '#06b6d4' },
              { role: 'AI/ML Engineer', match: 54, salary: '₹12–30 LPA', demand: 'Very High', color: '#10b981' },
              { role: 'Cloud Engineer', match: 45, salary: '₹9–20 LPA', demand: 'High', color: '#f59e0b' },
              { role: 'DevOps Engineer', match: 38, salary: '₹8–18 LPA', demand: 'Medium', color: '#ef4444' },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3, borderColor: c.color + '55' }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{c.role}</div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{c.match}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, marginBottom: 14, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: c.match + '%' }} transition={{ delay: 0.3 + i * 0.07, duration: 0.8 }} style={{ height: '100%', background: `linear-gradient(90deg, ${c.color}, ${c.color}88)`, borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>{c.salary}</span>
                  <span style={{ color: '#64748b' }}>Demand: {c.demand}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

      case 'skillgap': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>📊 Skill Gap Analysis</h1>
          <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>Compare your skills with industry requirements</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <h3 style={{ color: '#10b981', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>✅ Your Existing Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {existingSkills.map(s => <span key={s} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{s}</span>)}
                </div>
              </div>
              <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: 20 }}>
                <h3 style={{ color: '#ef4444', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>❌ Missing Skills (Priority)</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {missingSkills.map(s => <span key={s} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{s}</span>)}
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🕸️ Skill Comparison Radar</h3>
              <Radar data={radarData} options={{ ...chartOptions, maintainAspectRatio: true }} />
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}>
                <div style={{ color: '#a5b4fc', fontSize: 13, fontWeight: 600 }}>📌 Skill Match Score: <span style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>62%</span></div>
                <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>Learn Docker & AWS to reach 80%+ readiness</div>
              </div>
            </div>
          </div>
        </motion.div>
      );

      case 'roadmap': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🗺️ Learning Roadmap</h1>
          <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>Your personalized AI-generated learning path to Software Engineer</p>
          <div style={{ position: 'relative', paddingLeft: 30 }}>
            <div style={{ position: 'absolute', left: 14, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #6366f1, #06b6d4)', borderRadius: 2 }} />
            {roadmap.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                style={{ position: 'relative', marginBottom: 20, paddingLeft: 30 }}>
                <div style={{
                  position: 'absolute', left: -20, top: 20, width: 14, height: 14, borderRadius: '50%',
                  background: r.status === 'done' ? '#10b981' : r.status === 'active' ? '#6366f1' : '#374151',
                  border: `3px solid ${r.status === 'active' ? '#a5b4fc' : 'transparent'}`,
                  boxShadow: r.status === 'active' ? '0 0 12px rgba(99,102,241,0.6)' : 'none',
                }} />
                <div style={{
                  background: r.status === 'active' ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${r.status === 'active' ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14, padding: '18px 20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{r.phase} · {r.duration}</span>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 2 }}>{r.title}</div>
                    </div>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                      background: r.status === 'done' ? 'rgba(16,185,129,0.15)' : r.status === 'active' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)',
                      color: r.status === 'done' ? '#6ee7b7' : r.status === 'active' ? '#a5b4fc' : '#475569',
                    }}>
                      {r.status === 'done' ? '✓ Complete' : r.status === 'active' ? '⚡ In Progress' : '🔒 Upcoming'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {r.skills.map(s => <span key={s} style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '3px 10px', borderRadius: 8, fontSize: 12 }}>{s}</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

      case 'chatbot': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🤖 AI Career Chatbot</h1>
          <p style={{ color: '#64748b', marginBottom: 20, fontSize: 14 }}>Ask anything about careers, skills, roadmaps, or interviews</p>
          <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {chatMessages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}>
                {m.role === 'ai' && <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>}
                <div style={{
                  background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                  border: m.role === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '10px 14px', maxWidth: '75%', fontSize: 13, color: '#fff', lineHeight: 1.6,
                }}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8, flex: 1 }}>
              {['Ask for roadmap', 'Interview tips', 'Missing skills'].map(q => (
                <button key={q} onClick={() => { setChatInput(q); }}
                  style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, color: '#94a3b8', fontSize: 11, cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="Ask me anything about your career..."
              style={{ flex: 1, padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
            <motion.button onClick={sendChat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ padding: '13px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Send ↗
            </motion.button>
          </div>
        </motion.div>
      );

      case 'interview': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🎤 Mock Interview</h1>
          <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>Practice with AI-generated interview questions</p>
          <div style={{ display: 'grid', gap: 12 }}>
            {interviewQuestions.map((q, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{q.type}</span>
                <span style={{ color: '#cbd5e1', fontSize: 14, flex: 1, lineHeight: 1.6 }}>{q.q}</span>
                <button style={{ padding: '6px 14px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#a5b4fc', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>Practice →</button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

      case 'resume': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>📄 AI Resume Builder</h1>
          <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>Create ATS-friendly resumes with AI-powered optimization</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'ATS Score', value: '78/100', icon: '📊', color: '#6366f1', sub: '+12 from last version' },
              { label: 'Keywords Match', value: '85%', icon: '🔑', color: '#10b981', sub: '17 of 20 matched' },
              { label: 'Resume Versions', value: '3', icon: '📑', color: '#06b6d4', sub: 'Latest: Software Eng.' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <span style={{ color: '#64748b', fontSize: 13 }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>🎨 Resume Templates</h3>
                <span style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 600 }}>Touch to view example model</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { name: 'Modern', icon: '✨', color: '#6366f1', desc: 'Tech & FAANG' },
                  { name: 'Classic', icon: '🏛️', color: '#94a3b8', desc: 'Ivy League' },
                  { name: 'Minimal', icon: '📄', color: '#0ea5e9', desc: 'Ultra-Clean' },
                  { name: 'Professional', icon: '💼', color: '#3b82f6', desc: 'Corporate' },
                  { name: 'Creative', icon: '🎨', desc: 'Full-Stack', color: '#ec4899' },
                  { name: 'ATS-Optimized', icon: '🎯', desc: '99% Pass Rate', color: '#10b981' }
                ].map((item, i) => {
                  const isSelected = selectedResumeTemplate === item.name;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedResumeTemplate(item.name);
                        setShowResumeModal(true);
                      }}
                      style={{
                        background: isSelected ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                        border: `1.5px solid ${isSelected ? item.color : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 12,
                        padding: '14px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        position: 'relative',
                        boxShadow: isSelected ? `0 0 16px ${item.color}33` : 'none'
                      }}
                    >
                      <div style={{
                        width: '100%',
                        height: 70,
                        background: isSelected ? `${item.color}18` : 'rgba(255,255,255,0.04)',
                        borderRadius: 8,
                        marginBottom: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4
                      }}>
                        <span style={{ fontSize: 24 }}>{item.icon}</span>
                        <span style={{ fontSize: 9, color: item.color, fontWeight: 700 }}>PREVIEW</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#fff' : '#cbd5e1' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                        {item.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>💡 AI Suggestions</h3>
              {[
                { icon: '✅', text: 'Add 3 more quantified achievements to your Experience section', priority: 'High' },
                { icon: '⚠️', text: 'Include "Docker" and "AWS" keywords — top ATS requirements', priority: 'Medium' },
                { icon: '💡', text: 'Add a "Technical Summary" section for better first impression', priority: 'Medium' },
                { icon: '🔧', text: 'Restructure projects with STAR format (Situation, Task, Action, Result)', priority: 'High' },
                { icon: '📝', text: 'Fix 2 grammar issues found in your cover letter', priority: 'Low' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{s.text}</div>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, marginTop: 4, display: 'inline-block', fontWeight: 600,
                      background: s.priority === 'High' ? 'rgba(239,68,68,0.15)' : s.priority === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                      color: s.priority === 'High' ? '#fca5a5' : s.priority === 'Medium' ? '#fcd34d' : '#6ee7b7',
                    }}>{s.priority}</span>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setShowResumeModal(true)}
                style={{ width: '100%', padding: '12px', marginTop: 16, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
              >
                ⬇️ Download Resume PDF / View Model
              </button>
            </div>
          </div>
        </motion.div>
      );

      case 'courses': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>📚 Courses & Learning</h1>
          <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>HD video courses, live classes, assignments, and certifications</p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {['All', 'In Progress', 'Free', 'Premium', 'Live Classes', 'Beginner', 'Advanced'].map(f => (
              <button key={f} style={{ padding: '7px 16px', background: f === 'All' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${f === 'All' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, color: f === 'All' ? '#a5b4fc' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>{f}</button>
            ))}
          </div>

          <div 
            onClick={() => navigate('/live/system-design')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 24, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16, cursor: 'pointer', marginBottom: 24 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 15px rgba(239,68,68,0.5)' }}>
                <span style={{ fontSize: 24 }}>🔴</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Live Now: Advanced System Design</h3>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>Join</span>
                </div>
                <div style={{ fontSize: 13, color: '#cbd5e1' }}>Instructor: Dr. Sarah Chen • 45 Students • Ends in 40 mins</div>
              </div>
            </div>
            <button style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Join Live Class</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { id: 'python-masterclass', title: 'Python Masterclass 2026', instructor: 'Dr. Sarah Chen', progress: 65, lessons: 42, duration: '24h', level: 'Beginner', tag: 'Free', color: '#10b981' },
              { id: 'fullstack-react', title: 'Full Stack Web Development', instructor: 'James Rodriguez', progress: 30, lessons: 68, duration: '48h', level: 'Intermediate', tag: 'Premium', color: '#6366f1' },
              { id: 'machine-learning', title: 'Machine Learning A-Z', instructor: 'Prof. Anil Sharma', progress: 0, lessons: 55, duration: '36h', level: 'Advanced', tag: 'Premium', color: '#8b5cf6' },
              { id: 'fullstack-react', title: 'React.js Complete Guide', instructor: 'Emily Watson', progress: 88, lessons: 35, duration: '20h', level: 'Intermediate', tag: 'Free', color: '#06b6d4' },
              { id: 'sql-mastery', title: 'SQL for Data Analysis', instructor: 'Raj Patel', progress: 12, lessons: 80, duration: '60h', level: 'Intermediate', tag: 'Premium', color: '#f59e0b' },
              { id: 'python-masterclass', title: 'AWS Cloud Practitioner', instructor: 'Mike Johnson', progress: 0, lessons: 28, duration: '16h', level: 'Beginner', tag: 'Free', color: '#ec4899' },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -3, borderColor: c.color + '55' }}
                onClick={() => navigate(`/course/${c.id}`)}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ height: 120, background: `linear-gradient(135deg, ${c.color}22, ${c.color}08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📹</div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: c.tag === 'Free' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', color: c.tag === 'Free' ? '#6ee7b7' : '#a5b4fc' }}>{c.tag}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>{c.level}</span>
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{c.title}</h4>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>👨‍🏫 {c.instructor} · {c.lessons} lessons · {c.duration}</div>
                  {c.progress > 0 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                        <span>Progress</span><span style={{ color: c.color, fontWeight: 600 }}>{c.progress}%</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: c.progress + '%', height: '100%', background: `linear-gradient(90deg, ${c.color}, ${c.color}88)`, borderRadius: 2 }} />
                      </div>
                    </div>
                  )}
                  {c.progress === 0 && <button style={{ width: '100%', padding: '8px', background: c.color + '22', border: `1px solid ${c.color}44`, borderRadius: 8, color: c.color, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Enroll Now →</button>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

      case 'videos': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>📹 Video Library</h1>
          <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>HD tutorials, playlists, bookmarks, and continue watching</p>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: '#a5b4fc', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>▶️ Continue Watching</h3>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
              {['React Hooks Deep Dive — 14:32', 'Python OOP — 22:15', 'MongoDB Queries — 18:40'].map((v, i) => (
                <div key={i} onClick={() => navigate('/course/python-masterclass')} style={{ minWidth: 240, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}>
                  <div style={{ height: 100, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>▶️</div>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{v.split(' — ')[0]}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>⏱️ {v.split(' — ')[1]} remaining</div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${40 + i * 20}%`, height: '100%', background: '#6366f1', borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📋 All Playlists</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { name: 'Python Basics', count: 24, icon: '🐍' },
              { name: 'JavaScript ES6+', count: 18, icon: '⚡' },
              { name: 'React Complete', count: 35, icon: '⚛️' },
              { name: 'Node.js Backend', count: 22, icon: '🟢' },
              { name: 'SQL Mastery', count: 15, icon: '🗄️' },
              { name: 'System Design', count: 12, icon: '🏗️' },
            ].map((p, i) => (
              <div key={i} onClick={() => navigate('/course/python-masterclass')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 28 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{p.count} videos</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      );

      case 'certifications': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🏅 Certifications</h1>
          <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>Earn verified certificates and share to LinkedIn</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {[
              { title: 'Python Programming Certificate', issueDate: 'Jun 2026', status: 'earned', id: 'CERT-PY-2026-1842' },
              { title: 'Full Stack Web Development', issueDate: 'Jul 2026', status: 'earned', id: 'CERT-FS-2026-3291' },
              { title: 'Machine Learning Foundations', issueDate: null, status: 'in-progress', progress: 72 },
              { title: 'Cloud Computing (AWS)', issueDate: null, status: 'locked', progress: 0 },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                style={{ background: c.status === 'earned' ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.04)', border: `1px solid ${c.status === 'earned' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 34 }}>{c.status === 'earned' ? '🏆' : c.status === 'in-progress' ? '📖' : '🔒'}</span>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                    background: c.status === 'earned' ? 'rgba(16,185,129,0.15)' : c.status === 'in-progress' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)',
                    color: c.status === 'earned' ? '#6ee7b7' : c.status === 'in-progress' ? '#a5b4fc' : '#475569',
                  }}>{c.status === 'earned' ? '✓ Verified' : c.status === 'in-progress' ? '⏳ In Progress' : '🔒 Locked'}</span>
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{c.title}</h4>
                {c.issueDate && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Issued: {c.issueDate} · ID: {c.id}</div>}
                {c.status === 'in-progress' && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Progress: {c.progress}%</div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: c.progress + '%', height: '100%', background: '#6366f1', borderRadius: 2 }} />
                    </div>
                  </div>
                )}
                {c.status === 'earned' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button style={{ flex: 1, padding: '8px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#6ee7b7', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>⬇️ Download</button>
                    <button style={{ flex: 1, padding: '8px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#a5b4fc', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>🔗 Share</button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

      case 'projects': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🔧 Project Learning Hub</h1>
          <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>Build real-world projects with step-by-step AI guidance</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {[
              { title: 'E-Commerce Full Stack App', level: 'Advanced', tech: ['React', 'Node.js', 'MongoDB', 'Stripe'], time: '4 weeks', steps: 10, icon: '🛒', color: '#6366f1' },
              { title: 'ML Career Predictor', level: 'Advanced', tech: ['Python', 'Scikit-learn', 'FastAPI', 'React'], time: '3 weeks', steps: 8, icon: '🧠', color: '#8b5cf6' },
              { title: 'Chat Application', level: 'Intermediate', tech: ['React', 'Socket.io', 'Express'], time: '2 weeks', steps: 7, icon: '💬', color: '#06b6d4' },
              { title: 'Portfolio Website', level: 'Beginner', tech: ['HTML', 'CSS', 'JavaScript'], time: '1 week', steps: 5, icon: '🌐', color: '#10b981' },
              { title: 'Weather Dashboard', level: 'Beginner', tech: ['React', 'API', 'Chart.js'], time: '1 week', steps: 6, icon: '🌤️', color: '#f59e0b' },
              { title: 'Blog Platform with CMS', level: 'Intermediate', tech: ['Next.js', 'MongoDB', 'Auth'], time: '2 weeks', steps: 8, icon: '📝', color: '#ec4899' },
            ].map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3, borderColor: p.color + '55' }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: p.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{p.icon}</div>
                  <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                    background: p.level === 'Beginner' ? 'rgba(16,185,129,0.15)' : p.level === 'Intermediate' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                    color: p.level === 'Beginner' ? '#6ee7b7' : p.level === 'Intermediate' ? '#fcd34d' : '#fca5a5',
                  }}>{p.level}</span>
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{p.title}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {p.tech.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '2px 8px', borderRadius: 6, fontSize: 11 }}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                  <span>⏱️ {p.time}</span>
                  <span>📋 {p.steps} steps</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

      case 'coding': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>💻 Coding Practice</h1>
          <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>Daily challenges, DSA problems, and competitive coding</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Problems Solved', value: '127', icon: '✅', color: '#10b981' },
              { label: 'Current Streak', value: '7 🔥', icon: '📅', color: '#f59e0b' },
              { label: 'Global Rank', value: '#842', icon: '🏆', color: '#6366f1' },
              { label: 'XP Earned', value: '3,450', icon: '⭐', color: '#8b5cf6' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 700 }}>🎯 TODAY'S DAILY CHALLENGE</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 4 }}>Two Sum — Find pair with target sum</h3>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }}>Easy</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>Array</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>Hash Map</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedProblemId('two-sum');
                  setShowCodingModal(true);
                }}
                style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}
              >
                Solve Now →
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { id: 'reverse-linked-list', title: 'Reverse Linked List', diff: 'Easy', topic: 'Linked List', solved: true },
              { id: 'binary-tree-level-order', title: 'Binary Tree Level Order', diff: 'Medium', topic: 'Trees', solved: true },
              { id: 'merge-k-sorted-lists', title: 'Merge K Sorted Lists', diff: 'Hard', topic: 'Heap', solved: false },
              { id: 'longest-substring', title: 'Longest Substring', diff: 'Medium', topic: 'Sliding Window', solved: false },
              { id: 'valid-parentheses', title: 'Valid Parentheses', diff: 'Easy', topic: 'Stack', solved: true },
            ].map((p, i) => (
              <div 
                key={i} 
                onClick={() => {
                  setSelectedProblemId(p.id);
                  setShowCodingModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <span style={{ fontSize: 16 }}>{p.solved ? '✅' : '⬜'}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#fff' }}>{p.title}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>{p.topic}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                  background: p.diff === 'Easy' ? 'rgba(16,185,129,0.15)' : p.diff === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                  color: p.diff === 'Easy' ? '#6ee7b7' : p.diff === 'Medium' ? '#fcd34d' : '#fca5a5',
                }}>{p.diff}</span>
                <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, paddingLeft: 8 }}>Solve →</span>
              </div>
            ))}
          </div>
        </motion.div>
      );

      case 'jobs': {
        const ALL_JOBS = [
          { id: 'google-swe', company: 'Google', role: 'Software Engineer', salary: '₹18–30 LPA', location: 'Bangalore', type: 'Full-time', match: 92, logo: '🔵', posted: '2d ago' },
          { id: 'microsoft-fsd', company: 'Microsoft', role: 'Full Stack Developer', salary: '₹15–25 LPA', location: 'Hyderabad', type: 'Full-time', match: 85, logo: '🟦', posted: '3d ago' },
          { id: 'amazon-sde-intern', company: 'Amazon', role: 'SDE Intern', salary: '₹60K/month', location: 'Remote', type: 'Internship', match: 88, logo: '🟠', posted: '1d ago' },
          { id: 'adobe-ai-intern', company: 'Adobe', role: 'AI / ML Research Intern', salary: '₹85K/month', location: 'Remote', type: 'Internship', match: 95, logo: '🟣', posted: 'Just now' },
          { id: 'flipkart-backend', company: 'Flipkart', role: 'Backend Developer', salary: '₹12–20 LPA', location: 'Bangalore', type: 'Full-time', match: 78, logo: '🟡', posted: '5d ago' },
          { id: 'razorpay-react', company: 'Razorpay', role: 'React Developer', salary: '₹10–18 LPA', location: 'Remote', type: 'Full-time', match: 82, logo: '🔷', posted: '1d ago' },
          { id: 'swiggy-ds-intern', company: 'Swiggy', role: 'Data Science Intern', salary: '₹50K/month', location: 'Bangalore', type: 'Internship', match: 80, logo: '🟢', posted: '4d ago' },
          { id: 'cred-mobile-intern', company: 'CRED', role: 'Frontend & Mobile Intern', salary: '₹70K/month', location: 'Remote', type: 'Internship', match: 87, logo: '🔴', posted: '2d ago' },
          { id: 'oracle-cloud', company: 'Oracle', role: 'Cloud Infrastructure Engineer', salary: '₹16–22 LPA', location: 'Hyderabad', type: 'Full-time', match: 83, logo: '🔶', posted: '3d ago' },
        ];

        const filteredJobs = ALL_JOBS.filter(j => {
          if (jobFilter === 'Jobs') return j.type === 'Full-time';
          if (jobFilter === 'Internships') return j.type === 'Internship';
          if (jobFilter === 'Remote') return j.location.toLowerCase().includes('remote');
          if (jobFilter === 'On-site') return !j.location.toLowerCase().includes('remote');
          return true;
        });

        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 6 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>💼 Jobs & Internships for Students</h1>
                <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 14 }}>AI-matched campus hiring, internships, and entry-level positions</p>
              </div>
              {appliedJobs.length > 0 && (
                <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13 }}>🎉</span>
                  <span style={{ color: '#6ee7b7', fontSize: 12, fontWeight: 700 }}>{appliedJobs.length} Application{appliedJobs.length > 1 ? 's' : ''} Submitted</span>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: 8, margin: '20px 0', flexWrap: 'wrap' }}>
              {['All', 'Jobs', 'Internships', 'Remote', 'On-site'].map(f => {
                const active = jobFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setJobFilter(f)}
                    style={{
                      padding: '7px 18px',
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
                    {f === 'Jobs' ? 'Full-time Jobs' : f === 'Internships' ? 'Student Internships' : f}
                  </button>
                );
              })}
            </div>

            {/* Jobs List */}
            <div style={{ display: 'grid', gap: 12 }}>
              {filteredJobs.map((j, i) => {
                const isApplied = appliedJobs.includes(j.id);
                return (
                  <motion.div
                    key={j.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      background: isApplied ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isApplied ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 14,
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = isApplied ? '#10b981' : 'rgba(99,102,241,0.4)';
                      e.currentTarget.style.background = isApplied ? 'rgba(16,185,129,0.08)' : 'rgba(99,102,241,0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = isApplied ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = isApplied ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.04)';
                    }}
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      flexShrink: 0
                    }}>
                      {j.logo}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{j.role}</h4>
                        <span style={{
                          fontSize: 10,
                          padding: '2px 8px',
                          borderRadius: 20,
                          fontWeight: 700,
                          background: j.type === 'Internship' ? 'rgba(6,182,212,0.18)' : 'rgba(16,185,129,0.18)',
                          color: j.type === 'Internship' ? '#67e8f9' : '#6ee7b7'
                        }}>
                          {j.type}
                        </span>
                        {j.location.toLowerCase().includes('remote') && (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>
                            Remote
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                        {j.company} · {j.location} · <strong style={{ color: '#cbd5e1' }}>{j.salary}</strong> · Posted {j.posted}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#6366f1' }}>{j.match}%</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>AI Match</div>
                    </div>

                    {isApplied ? (
                      <span style={{
                        padding: '8px 18px',
                        background: 'rgba(16,185,129,0.15)',
                        border: '1px solid rgba(16,185,129,0.35)',
                        borderRadius: 10,
                        color: '#6ee7b7',
                        fontWeight: 700,
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        <span>✓</span> Applied
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJobForApp(j);
                          setShowJobAppModal(true);
                        }}
                        style={{
                          padding: '8px 20px',
                          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                          border: 'none',
                          borderRadius: 10,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          flexShrink: 0,
                          boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                          transition: 'all 0.2s'
                        }}
                      >
                        Apply →
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      }

      case 'analytics': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>📈 Analytics Dashboard</h1>
          <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>Track your complete career development journey</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🕸️ Skill Radar</h3>
              <Radar data={radarData} options={{ ...chartOptions, maintainAspectRatio: true }} />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📊 Career Matches</h3>
              <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: true }} />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🎓 Course Progress</h3>
              <Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } }, maintainAspectRatio: true }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📅 Weekly Activity</h3>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => {
                const hours = [3, 4.5, 2, 5, 3.5, 6, 4][i];
                return (
                  <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ width: 30, fontSize: 12, color: '#64748b' }}>{d}</span>
                    <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${(hours / 6) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: 4, transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#94a3b8', width: 35, textAlign: 'right' }}>{hours}h</span>
                  </div>
                );
              })}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🏅 Performance Summary</h3>
              {[
                { label: 'Placement Readiness', value: 72, color: '#10b981' },
                { label: 'Resume ATS Score', value: 78, color: '#6366f1' },
                { label: 'Interview Score', value: 65, color: '#f59e0b' },
                { label: 'Coding Proficiency', value: 58, color: '#06b6d4' },
                { label: 'Course Completion', value: 35, color: '#8b5cf6' },
              ].map((m, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#94a3b8' }}>{m.label}</span>
                    <span style={{ color: m.color, fontWeight: 700 }}>{m.value}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: m.value + '%' }} transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }} style={{ height: '100%', background: `linear-gradient(90deg, ${m.color}, ${m.color}88)`, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      );

      case 'profile': return <EditableProfileView />;

      case 'admin': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🛡️ Admin Panel</h1>
          <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>Manage platform content, users, and overall analytics</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Students', value: '1,245', icon: '👥', color: '#10b981' },
              { label: 'Active Instructors', value: '42', icon: '👨‍🏫', color: '#6366f1' },
              { label: 'Courses Available', value: '128', icon: '📚', color: '#8b5cf6' },
              { label: 'Jobs Posted', value: '350', icon: '💼', color: '#f59e0b' },
              { label: 'Certificates Issued', value: '4,892', icon: '🏅', color: '#06b6d4' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <span style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Management Modules</h3>
                <button style={{ fontSize: 11, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '4px 8px', borderRadius: 6, border: 'none' }}>View All</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { name: 'Users & Roles', icon: '👥' },
                  { name: 'Courses & LMS', icon: '📚' },
                  { name: 'Live Classes', icon: '🎥' },
                  { name: 'Certifications', icon: '🏅' },
                  { name: 'Jobs & Internships', icon: '💼' },
                  { name: 'Companies', icon: '🏢' },
                  { name: 'Platform Analytics', icon: '📈' },
                  { name: 'Notifications', icon: '🔔' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <span style={{ fontSize: 18 }}>{m.icon}</span>
                    <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>{m.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Recent System Activities</h3>
              {[
                { action: 'New course added: Advanced Python', time: '10 mins ago', type: 'course', color: '#8b5cf6' },
                { action: '15 new jobs posted by Amazon', time: '1 hour ago', type: 'job', color: '#10b981' },
                { action: 'System backup completed successfully', time: '3 hours ago', type: 'system', color: '#06b6d4' },
                { action: 'Reported issue: Video playback error', time: '5 hours ago', type: 'alert', color: '#ef4444' },
                { action: '150 new students registered today', time: '1 day ago', type: 'user', color: '#6366f1' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color }}></div>
                  <div style={{ flex: 1, fontSize: 13, color: '#cbd5e1' }}>{a.action}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      );

      default: return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 60 }}>🚧</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Coming Soon</div>
          <div style={{ color: '#64748b' }}>This feature is under development</div>
        </div>
      );
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f1a', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>

      {/* ── SIDEBAR ── */}
      <motion.div
        animate={{ width: sidebarOpen ? 248 : 64 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          background: 'rgba(9,9,18,0.98)', backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255,255,255,0.06)', overflowX: 'hidden',
          display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10,
        }}
      >
        {/* Brand */}
        <div style={{ padding: sidebarOpen ? '18px 16px' : '18px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>⚡</div>
          {sidebarOpen && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', background: 'linear-gradient(90deg,#a5b4fc,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillForge AI</div>
              <div style={{ fontSize: 9, color: '#475569', whiteSpace: 'nowrap', fontWeight: 500 }}>Build Skills. Build Future.</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 6px', overflowY: 'auto', overflowX: 'hidden' }}>
          {SIDEBAR_ITEMS.map((item, idx) => (
            <div key={`${item.id}-${idx}`}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9, padding: sidebarOpen ? '9px 10px' : '9px 0',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                borderRadius: 10, cursor: 'pointer', marginBottom: 2, transition: 'all 0.2s',
                background: activeTab === item.id ? 'linear-gradient(90deg,rgba(99,102,241,0.22),rgba(99,102,241,0.08))' : 'transparent',
                color: activeTab === item.id ? '#fff' : '#64748b',
                borderLeft: activeTab === item.id ? '3px solid #6366f1' : '3px solid transparent',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span style={{ fontSize: 12, fontWeight: activeTab === item.id ? 700 : 500, whiteSpace: 'nowrap', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                  {item.live && <span style={{ fontSize: 8, background: '#ef4444', color: '#fff', padding: '2px 5px', borderRadius: 4, fontWeight: 800, letterSpacing: 0.5, animation: 'livePulse 1.5s infinite', flexShrink: 0 }}>LIVE</span>}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px', borderRadius: 10, cursor: 'pointer', transition: 'background 0.2s' }}
            onClick={logout}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, fontWeight: 800, color: '#fff', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}>
              {user?.fullName?.[0]?.toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName || 'User'}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>Sign out</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top header */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(9,9,18,0.85)', backdropFilter: 'blur(16px)', flexShrink: 0 }}>
          {/* Search */}
          <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#475569' }}>🔍</span>
            <input placeholder="Search for courses, skills, videos, projects..."
              style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 12, outline: 'none', fontFamily: 'Inter,sans-serif', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor='rgba(99,102,241,0.5)'; e.target.style.background='rgba(99,102,241,0.08)'; }}
              onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.background='rgba(255,255,255,0.06)'; }} />
          </div>
          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 'auto' }}>
            <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>🔥 7-Day Streak</div>
            <div style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#fcd34d', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>⭐ 2,450 XP</div>
            <div style={{ position: 'relative', cursor: 'pointer', fontSize: 18 }}>
              🔔
              <div style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>4</div>
            </div>
            <div style={{ cursor: 'pointer', fontSize: 18 }}>💬</div>
            <div style={{ cursor: 'pointer', fontSize: 16 }}>🌙</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 10px 4px 4px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{user?.fullName?.[0]?.toUpperCase() || 'U'}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{user?.fullName || 'Student'}</div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Student</div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {renderContent()}
        </div>
      </div>

      {/* Interactive Resume Example Modal */}
      <ResumeExampleModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        initialTemplate={selectedResumeTemplate}
        user={user}
      />

      {/* Interactive Coding Workspace / IDE Modal */}
      <CodingWorkspaceModal
        isOpen={showCodingModal}
        onClose={() => setShowCodingModal(false)}
        initialProblemId={selectedProblemId}
      />

      {/* Interactive Student Job & Internship Application Modal */}
      <JobApplicationModal
        isOpen={showJobAppModal}
        onClose={() => setShowJobAppModal(false)}
        job={selectedJobForApp}
        user={user}
        onApplicationSuccess={handleApplySuccess}
      />
    </div>
  );
};

export default Dashboard;
