import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobApplicationModal({ isOpen, onClose, job, user, onApplicationSuccess }) {
  const [fullName, setFullName] = useState(user?.fullName || 'Jothi');
  const [email, setEmail] = useState(user?.email || 'jothis486@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [college, setCollege] = useState(user?.collegeName || 'Indian Institute of Technology (IIT)');
  const [degree, setDegree] = useState(user?.degree || 'B.Tech in Computer Science');
  const [gradYear, setGradYear] = useState('2026');
  const [availability, setAvailability] = useState(
    job?.type === 'Internship' ? 'Summer Internship (May – July 2026)' : 'Immediate (Within 15 days)'
  );
  const [selectedResume, setSelectedResume] = useState('ats-optimized');
  const [portfolioLink, setPortfolioLink] = useState('https://github.com/jothis486');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appId, setAppId] = useState('');

  if (!isOpen || !job) return null;

  const handleGenerateCoverLetter = () => {
    setIsGeneratingCover(true);
    setTimeout(() => {
      const generated = `Dear Hiring Team at ${job.company},

I am writing to express my strong enthusiasm for the ${job.role} (${job.type}) position in ${job.location}. As a ${degree} student at ${college} (graduating ${gradYear}), I have built a solid foundation in software engineering, distributed systems, and modern AI algorithms.

Through my hands-on coursework and technical projects—including developing full-stack applications with React, Node.js, and machine learning pipelines—I have developed a proven track record of writing clean, high-performance code. My SkillForge career readiness score is 88%, with a ${job.match}% profile match for this specific role.

I am particularly excited about ${job.company}'s engineering culture and would welcome the opportunity to contribute to your team. Thank you for your time and consideration.

Warm regards,
${fullName}`;
      setCoverLetter(generated);
      setIsGeneratingCover(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `SF-${Math.floor(10000 + Math.random() * 90000)}`;
      setAppId(generatedId);
      setIsSubmitted(true);
      if (onApplicationSuccess) {
        onApplicationSuccess(job.id || job.role);
      }
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 15, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          style={{
            background: '#111526',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 20,
            width: '100%',
            maxWidth: 720,
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(99, 102, 241, 0.15)'
          }}
        >
          {/* Top Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26
              }}>
                {job.logo}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: 0 }}>
                    {job.role}
                  </h3>
                  <span style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontWeight: 700,
                    background: job.type === 'Internship' ? 'rgba(6,182,212,0.18)' : 'rgba(16,185,129,0.18)',
                    color: job.type === 'Internship' ? '#67e8f9' : '#6ee7b7',
                    border: `1px solid ${job.type === 'Internship' ? 'rgba(6,182,212,0.3)' : 'rgba(16,185,129,0.3)'}`
                  }}>
                    {job.type}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                  {job.company} • {job.location} • <strong style={{ color: '#cbd5e1' }}>{job.salary}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#6366f1' }}>{job.match}%</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>AI Match</div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
            {isSubmitted ? (
              /* Success Celebration State */
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  border: '2px solid #10b981',
                  color: '#10b981',
                  fontSize: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 0 30px rgba(16,185,129,0.3)'
                }}>
                  ✓
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                  Application Submitted Successfully! 🎉
                </h3>
                <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
                  Your application for <strong style={{ color: '#fff' }}>{job.role}</strong> at <strong style={{ color: '#fff' }}>{job.company}</strong> has been routed to the hiring team.
                </p>

                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  maxWidth: 420,
                  margin: '0 auto 24px',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                    <span style={{ color: '#64748b' }}>Application ID:</span>
                    <strong style={{ color: '#a5b4fc', fontFamily: 'monospace' }}>{appId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                    <span style={{ color: '#64748b' }}>Current Status:</span>
                    <span style={{ color: '#fcd34d', fontWeight: 700, background: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>
                      🟡 Under Review
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#64748b' }}>Estimated Response:</span>
                    <span style={{ color: '#cbd5e1' }}>3–5 business days via email</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  style={{
                    padding: '12px 32px',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    border: 'none',
                    borderRadius: 12,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(99,102,241,0.35)'
                  }}
                >
                  Done & Back to Opportunities
                </button>
              </div>
            ) : (
              /* Application Form */
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    1. Student Candidate Details
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Phone Number</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>College / University</label>
                      <input
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Degree / Specialization</label>
                      <input
                        type="text"
                        required
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Graduation Year</label>
                      <select
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="2025">2025</option>
                        <option value="2026">2026 (Upcoming Batch)</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    2. Resume & Portfolio
                  </span>
                  <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div
                      onClick={() => setSelectedResume('ats-optimized')}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: selectedResume === 'ats-optimized' ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
                        border: `1.5px solid ${selectedResume === 'ats-optimized' ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                      }}
                    >
                      <span style={{ fontSize: 20 }}>📄</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>SkillForge ATS Resume</div>
                        <div style={{ fontSize: 10, color: '#10b981', fontWeight: 600 }}>98% ATS Score Verified</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setSelectedResume('modern')}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: selectedResume === 'modern' ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
                        border: `1.5px solid ${selectedResume === 'modern' ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                      }}
                    >
                      <span style={{ fontSize: 20 }}>✨</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Modern Tech Resume</div>
                        <div style={{ fontSize: 10, color: '#a5b4fc', fontWeight: 600 }}>Includes Live Projects</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>GitHub / Portfolio URL</label>
                    <input
                      type="url"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      placeholder="https://github.com/your-username"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      3. Student Statement & Cover Letter (Optional)
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerateCoverLetter}
                      disabled={isGeneratingCover}
                      style={{
                        background: 'rgba(99,102,241,0.15)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        color: '#a5b4fc',
                        borderRadius: 8,
                        padding: '4px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <span>{isGeneratingCover ? '⏳' : '✨'}</span>
                      <span>{isGeneratingCover ? 'Drafting...' : 'AI Auto-Draft Letter'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly state why you are excited for this opportunity or click ✨ AI Auto-Draft Letter above..."
                    style={{
                      ...inputStyle,
                      height: 'auto',
                      resize: 'vertical',
                      lineHeight: 1.5
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      color: '#94a3b8',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: '10px 26px',
                      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      border: 'none',
                      borderRadius: 10,
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
                    }}
                  >
                    <span>{isSubmitting ? '⚙️' : '🚀'}</span>
                    <span>{isSubmitting ? 'Submitting to Recruiter...' : `Submit Application for ${job.company}`}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  color: '#fff',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif'
};
