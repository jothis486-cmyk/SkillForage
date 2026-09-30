import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TEMPLATES = [
  { id: 'ATS-Optimized', name: 'ATS-Optimized', icon: '🎯', badge: '99% ATS Pass Rate', color: '#10b981' },
  { id: 'Modern', name: 'Modern', icon: '✨', badge: 'Tech Startups & FAANG', color: '#6366f1' },
  { id: 'Classic', name: 'Classic', icon: '🏛️', badge: 'Ivy League / Corporate', color: '#475569' },
  { id: 'Minimal', name: 'Minimal', icon: '📄', badge: 'Clean & Ultra-Readable', color: '#0ea5e9' },
  { id: 'Professional', name: 'Professional', icon: '💼', badge: 'Senior & Executive', color: '#1e3a8a' },
  { id: 'Creative', name: 'Creative', icon: '🎨', badge: 'Design & Full-Stack', color: '#ec4899' },
];

export default function ResumeExampleModal({ isOpen, onClose, initialTemplate = 'ATS-Optimized', user = {} }) {
  const [selected, setSelected] = useState(initialTemplate || 'ATS-Optimized');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const candidate = {
    name: user?.fullName || 'Jothi S.',
    email: user?.email || 'jothis486@gmail.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    github: 'github.com/jothis486',
    linkedin: 'linkedin.com/in/jothis',
    portfolio: 'skillforage-frontend.onrender.com',
    role: user?.preferredCareer || 'AI & Machine Learning Engineer',
    college: user?.collegeName || 'Indian Institute of Technology (IIT)',
    degree: user?.degree || 'B.Tech in Computer Science & Engineering',
    gpa: '8.9 / 10.0',
    gradYear: '2026',
    skills: {
      languages: ['Python', 'JavaScript (ES6+)', 'TypeScript', 'C++', 'SQL'],
      frameworks: ['PyTorch', 'TensorFlow', 'React.js', 'Node.js', 'Express', 'FastAPI'],
      tools: ['Git', 'Docker', 'AWS (S3, EC2)', 'MongoDB', 'PostgreSQL', 'TailwindCSS'],
      ai_ml: ['Transformer Models', 'LLM Fine-Tuning', 'LangChain', 'RAG Pipelines', 'Computer Vision', 'Scikit-Learn']
    },
    experience: [
      {
        title: 'Machine Learning Engineering Intern',
        company: 'NeuralFlow AI Labs',
        location: 'Remote',
        period: 'May 2025 – Aug 2025',
        bullets: [
          'Engineered an enterprise Retrieval-Augmented Generation (RAG) pipeline indexing 150k+ technical documents, cutting response latency by 38%.',
          'Fine-tuned open-source LLaMA-3 models on domain-specific datasets, increasing answer accuracy score from 71% to 89%.',
          'Containerized inference microservices with Docker and deployed to AWS EC2 with autoscaling, serving 20k+ daily queries at 99.9% uptime.'
        ]
      },
      {
        title: 'Full Stack & AI Developer Intern',
        company: 'Cognitive Cloud Systems',
        location: 'Bangalore, India',
        period: 'Dec 2024 – Feb 2025',
        bullets: [
          'Developed responsive React 18 dashboards integrated with Express REST APIs and MongoDB Atlas database.',
          'Integrated JWT authentication with automated refresh tokens and role-based access control (RBAC).',
          'Architected an automated automated test pipeline with Jest and GitHub Actions CI/CD, reducing regressions by 45%.'
        ]
      }
    ],
    projects: [
      {
        title: 'SkillForge AI — Career Skill Gap Detection Platform',
        tech: 'React, Node.js, PyTorch, MongoDB, Render',
        period: '2026',
        bullets: [
          'Built an end-to-end full stack career intelligence platform matching resumes against 1,000+ live job descriptions.',
          'Integrated TF-IDF and transformer semantic vector similarity to score candidate readiness and generate personalized roadmaps.'
        ]
      },
      {
        title: 'Real-Time Voice AI Interview Simulator',
        tech: 'FastAPI, WebSockets, OpenAI Whisper, LangChain',
        period: '2025',
        bullets: [
          'Created real-time bidirectional mock interview simulator with automated speech recognition, question probing, and performance scoring.'
        ]
      }
    ],
    certifications: [
      'DeepLearning.AI — Deep Learning Specialization (Andrew Ng)',
      'AWS Certified Solutions Architect – Associate',
      'Meta Professional Frontend Developer Certificate'
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
${candidate.name}
${candidate.email} | ${candidate.phone} | ${candidate.location}
GitHub: ${candidate.github} | LinkedIn: ${candidate.linkedin}

OBJECTIVE / SUMMARY
${candidate.role} with strong hands-on expertise in machine learning, full-stack development, and scalable cloud deployments.

EDUCATION
${candidate.degree} - ${candidate.college} (${candidate.gradYear}) | GPA: ${candidate.gpa}

TECHNICAL SKILLS
- Programming: ${candidate.skills.languages.join(', ')}
- AI & ML: ${candidate.skills.ai_ml.join(', ')}
- Frameworks: ${candidate.skills.frameworks.join(', ')}
- Developer Tools: ${candidate.skills.tools.join(', ')}

EXPERIENCE
${candidate.experience.map(e => `${e.title} | ${e.company} (${e.period})\n${e.bullets.map(b => `• ${b}`).join('\n')}`).join('\n\n')}

PROJECTS
${candidate.projects.map(p => `${p.title} [${p.tech}]\n${p.bullets.map(b => `• ${b}`).join('\n')}`).join('\n\n')}

CERTIFICATIONS
${candidate.certifications.map(c => `• ${c}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}>
        {/* Print specific CSS */}
        <style>{`
          @media print {
            body * { visibility: hidden; }
            #printable-resume, #printable-resume * { visibility: visible; }
            #printable-resume {
              position: fixed;
              left: 0;
              top: 0;
              width: 100vw;
              margin: 0;
              padding: 20mm;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}</style>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          style={{
            background: '#131524',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 20,
            width: '100%',
            maxWidth: 1050,
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.02)',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>📄</span>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                  Live Resume Preview — {selected} Template
                </h2>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: 'rgba(99,102,241,0.2)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99,102,241,0.3)'
                }}>
                  Interactive Model
                </span>
              </div>
              <p style={{ margin: '4px 0 0 32px', fontSize: 12, color: '#94a3b8' }}>
                Touch or click any template below to dynamically preview your formatted resume
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={handleCopyText}
                style={{
                  padding: '8px 14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  color: '#e2e8f0',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>{copied ? '✅' : '📋'}</span>
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handlePrint}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
                }}
              >
                <span>🖨️</span>
                <span>Print / Download PDF</span>
              </button>

              <button
                onClick={onClose}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Template Selector Bar */}
          <div style={{
            padding: '12px 24px',
            background: 'rgba(0,0,0,0.2)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            gap: 8,
            overflowX: 'auto'
          }}>
            {TEMPLATES.map((t) => {
              const active = selected === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 12,
                    background: active ? `${t.color}25` : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${active ? t.color : 'rgba(255,255,255,0.08)'}`,
                    color: active ? '#fff' : '#94a3b8',
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    boxShadow: active ? `0 0 15px ${t.color}33` : 'none'
                  }}
                >
                  <span style={{ fontSize: 14 }}>{t.icon}</span>
                  <span>{t.name}</span>
                  {active && (
                    <span style={{
                      fontSize: 10,
                      background: t.color,
                      color: '#fff',
                      padding: '1px 6px',
                      borderRadius: 10,
                      fontWeight: 800
                    }}>
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Resume Viewer Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            justifyContent: 'center',
            background: '#0a0c16'
          }}>
            <div
              id="printable-resume"
              style={{
                width: '100%',
                maxWidth: 820,
                background: '#ffffff',
                color: '#1e293b',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                borderRadius: 8,
                overflow: 'hidden',
                fontFamily: selected === 'Classic' ? "'Georgia', serif" : "'Inter', -apple-system, sans-serif",
                transition: 'all 0.3s ease'
              }}
            >
              {/* RENDER TEMPLATE STYLES */}

              {/* TEMPLATE 1: ATS-OPTIMIZED */}
              {selected === 'ATS-Optimized' && (
                <div style={{ padding: '36px 42px', fontSize: 13, lineHeight: 1.55 }}>
                  <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: 14, marginBottom: 18, textAlign: 'center' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', letterSpacing: '0.5px', color: '#0f172a' }}>
                      {candidate.name.toUpperCase()}
                    </h1>
                    <div style={{ fontSize: 12, color: '#475569', display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span>{candidate.email}</span>
                      <span>•</span>
                      <span>{candidate.phone}</span>
                      <span>•</span>
                      <span>{candidate.location}</span>
                      <span>•</span>
                      <span>{candidate.linkedin}</span>
                      <span>•</span>
                      <span>{candidate.github}</span>
                    </div>
                  </div>

                  {/* ATS Summary */}
                  <div style={{ marginBottom: 18 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Professional Summary
                    </h3>
                    <p style={{ margin: 0, color: '#334155' }}>
                      Results-driven {candidate.role} specializing in scalable machine learning architectures, full-stack microservices, and LLM fine-tuning. Proven track record reducing inference latencies by 38% and developing production-grade AI platforms serving tens of thousands of requests.
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div style={{ marginBottom: 18 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Core Technical Competencies
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4, color: '#334155' }}>
                      <div><strong>Programming Languages:</strong> {candidate.skills.languages.join(', ')}</div>
                      <div><strong>AI & Machine Learning:</strong> {candidate.skills.ai_ml.join(', ')}</div>
                      <div><strong>Frameworks & Libraries:</strong> {candidate.skills.frameworks.join(', ')}</div>
                      <div><strong>Cloud, DevOps & Databases:</strong> {candidate.skills.tools.join(', ')}</div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div style={{ marginBottom: 18 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Work Experience
                    </h3>
                    {candidate.experience.map((exp, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{exp.title}</span>
                          <span style={{ fontSize: 12, color: '#64748b' }}>{exp.period}</span>
                        </div>
                        <div style={{ fontSize: 12, fontStyle: 'italic', color: '#475569', marginBottom: 6 }}>
                          {exp.company} — {exp.location}
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 18, color: '#334155' }}>
                          {exp.bullets.map((b, idx) => (
                            <li key={idx} style={{ marginBottom: 3 }}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Projects */}
                  <div style={{ marginBottom: 18 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Technical Projects
                    </h3>
                    {candidate.projects.map((proj, i) => (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{proj.title}</span>
                          <span style={{ fontSize: 12, color: '#64748b' }}>{proj.period}</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 4 }}>
                          Tech Stack: {proj.tech}
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 18, color: '#334155' }}>
                          {proj.bullets.map((b, idx) => (
                            <li key={idx} style={{ marginBottom: 3 }}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Education & Certs */}
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Education & Certifications
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span><strong>{candidate.college}</strong> — {candidate.degree}</span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>Graduation: {candidate.gradYear} (GPA: {candidate.gpa})</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                      <strong>Certifications:</strong> {candidate.certifications.join(' • ')}
                    </div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 2: MODERN */}
              {selected === 'Modern' && (
                <div>
                  <div style={{ background: 'linear-gradient(135deg, #312e81, #4338ca)', color: '#fff', padding: '36px 40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                      <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                          {candidate.name}
                        </h1>
                        <div style={{ fontSize: 15, color: '#c7d2fe', fontWeight: 600 }}>
                          {candidate.role}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: '#e0e7ff', lineHeight: 1.6, textAlign: 'right' }}>
                        <div>{candidate.email}</div>
                        <div>{candidate.phone}</div>
                        <div>{candidate.location}</div>
                        <div>{candidate.github}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32 }}>
                    <div>
                      {/* Experience */}
                      <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#4338ca', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4338ca' }} />
                          Experience
                        </h3>
                        {candidate.experience.map((exp, i) => (
                          <div key={i} style={{ marginBottom: 18 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <strong style={{ fontSize: 13, color: '#0f172a' }}>{exp.title}</strong>
                              <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 600 }}>{exp.period}</span>
                            </div>
                            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{exp.company} • {exp.location}</div>
                            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#334155' }}>
                              {exp.bullets.map((b, idx) => <li key={idx} style={{ marginBottom: 4 }}>{b}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Projects */}
                      <div>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#4338ca', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4338ca' }} />
                          Featured Projects
                        </h3>
                        {candidate.projects.map((proj, i) => (
                          <div key={i} style={{ marginBottom: 14 }}>
                            <strong style={{ fontSize: 13, color: '#0f172a' }}>{proj.title}</strong>
                            <div style={{ fontSize: 11, color: '#4f46e5', fontWeight: 600, marginBottom: 4 }}>{proj.tech}</div>
                            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#334155' }}>
                              {proj.bullets.map((b, idx) => <li key={idx} style={{ marginBottom: 3 }}>{b}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: 24 }}>
                      <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Education</h4>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{candidate.college}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{candidate.degree}</div>
                        <div style={{ fontSize: 11, color: '#4338ca', fontWeight: 600, marginTop: 2 }}>Grad: {candidate.gradYear} • GPA {candidate.gpa}</div>
                      </div>

                      <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: 10 }}>Technical Skills</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {[...candidate.skills.languages, ...candidate.skills.frameworks, ...candidate.skills.tools].map((s, idx) => (
                            <span key={idx} style={{ fontSize: 10, background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: 6, fontWeight: 600, border: '1px solid #e2e8f0' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Certifications</h4>
                        {candidate.certifications.map((c, i) => (
                          <div key={i} style={{ fontSize: 11, color: '#475569', marginBottom: 6, paddingLeft: 10, borderLeft: '2px solid #6366f1' }}>
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 3: CLASSIC */}
              {selected === 'Classic' && (
                <div style={{ padding: '40px 48px', fontSize: 13, lineHeight: 1.6, fontFamily: "'Georgia', serif" }}>
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #334155', paddingBottom: 16, marginBottom: 20 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '1px' }}>{candidate.name}</h1>
                    <div style={{ fontSize: 12, color: '#475569' }}>
                      {candidate.location} | {candidate.phone} | {candidate.email} | {candidate.linkedin}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, borderBottom: '1px solid #94a3b8', paddingBottom: 2, marginBottom: 10, textTransform: 'uppercase' }}>
                      Education
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{candidate.college}</strong>
                      <span>{candidate.gradYear}</span>
                    </div>
                    <div>{candidate.degree} — Cumulative GPA: {candidate.gpa}</div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, borderBottom: '1px solid #94a3b8', paddingBottom: 2, marginBottom: 10, textTransform: 'uppercase' }}>
                      Professional Experience
                    </h3>
                    {candidate.experience.map((exp, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong>{exp.company}</strong>
                          <span style={{ fontStyle: 'italic' }}>{exp.period}</span>
                        </div>
                        <div style={{ fontStyle: 'italic', marginBottom: 4 }}>{exp.title} — {exp.location}</div>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {exp.bullets.map((b, idx) => <li key={idx} style={{ marginBottom: 3 }}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, borderBottom: '1px solid #94a3b8', paddingBottom: 2, marginBottom: 10, textTransform: 'uppercase' }}>
                      Selected Projects
                    </h3>
                    {candidate.projects.map((p, i) => (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong>{p.title}</strong>
                          <span>{p.period}</span>
                        </div>
                        <div style={{ fontStyle: 'italic', fontSize: 12 }}>Technologies: {p.tech}</div>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {p.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, borderBottom: '1px solid #94a3b8', paddingBottom: 2, marginBottom: 10, textTransform: 'uppercase' }}>
                      Skills & Honors
                    </h3>
                    <div><strong>Technical:</strong> {candidate.skills.languages.concat(candidate.skills.ai_ml).join(', ')}</div>
                    <div><strong>Certifications:</strong> {candidate.certifications.join(', ')}</div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 4: MINIMAL */}
              {selected === 'Minimal' && (
                <div style={{ padding: '44px 50px', fontSize: 12.5, lineHeight: 1.6, color: '#171717' }}>
                  <div style={{ marginBottom: 26 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 300, margin: '0 0 4px', letterSpacing: '-0.5px' }}>{candidate.name}</h1>
                    <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>{candidate.role}</div>
                    <div style={{ fontSize: 11, color: '#a3a3a3', marginTop: 4 }}>
                      {candidate.email} / {candidate.phone} / {candidate.location} / {candidate.github}
                    </div>
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#737373', marginBottom: 8 }}>
                      Summary
                    </div>
                    <div style={{ color: '#404040' }}>
                      Software engineer focused on applied machine learning, neural networks, and robust cloud services. Passionate about solving complex problems through clean architecture and measurable impact.
                    </div>
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#737373', marginBottom: 12 }}>
                      Experience
                    </div>
                    {candidate.experience.map((exp, i) => (
                      <div key={i} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600 }}>{exp.title} — {exp.company}</span>
                          <span style={{ color: '#737373' }}>{exp.period}</span>
                        </div>
                        <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: '#525252' }}>
                          {exp.bullets.map((b, idx) => <li key={idx} style={{ marginBottom: 3 }}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#737373', marginBottom: 10 }}>
                      Skills
                    </div>
                    <div style={{ color: '#525252' }}>
                      {candidate.skills.languages.concat(candidate.skills.ai_ml, candidate.skills.tools).join(' • ')}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#737373', marginBottom: 8 }}>
                      Education
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>{candidate.college}</strong>, {candidate.degree}</span>
                      <span style={{ color: '#737373' }}>{candidate.gradYear}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 5: PROFESSIONAL */}
              {selected === 'Professional' && (
                <div>
                  <div style={{ background: '#0f2744', color: '#fff', padding: '32px 42px' }}>
                    <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: '0.5px' }}>{candidate.name}</h1>
                    <div style={{ fontSize: 14, color: '#93c5fd', fontWeight: 600, marginBottom: 8 }}>{candidate.role}</div>
                    <div style={{ fontSize: 11, color: '#cbd5e1', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span>📍 {candidate.location}</span>
                      <span>✉️ {candidate.email}</span>
                      <span>📞 {candidate.phone}</span>
                      <span>🔗 {candidate.linkedin}</span>
                    </div>
                  </div>

                  <div style={{ padding: '32px 42px', fontSize: 12.5, lineHeight: 1.55 }}>
                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f2744', borderBottom: '2px solid #0f2744', paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase' }}>
                        Executive Profile
                      </h3>
                      <p style={{ margin: 0, color: '#334155' }}>
                        Engineering professional with comprehensive experience designing intelligent systems and cloud microservices. Combines deep technical proficiency in modern machine learning stacks with high-reliability full stack deployment experience.
                      </p>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f2744', borderBottom: '2px solid #0f2744', paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase' }}>
                        Key Achievements & Experience
                      </h3>
                      {candidate.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f2744' }}>
                            <span>{exp.title} | {exp.company}</span>
                            <span style={{ fontSize: 11, color: '#64748b' }}>{exp.period}</span>
                          </div>
                          <ul style={{ margin: '4px 0 0', paddingLeft: 18, color: '#334155' }}>
                            {exp.bullets.map((b, idx) => <li key={idx} style={{ marginBottom: 3 }}>{b}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f2744', borderBottom: '2px solid #0f2744', paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase' }}>
                        Technical Infrastructure & Methodologies
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, color: '#334155' }}>
                        <div><strong>Languages:</strong> {candidate.skills.languages.join(', ')}</div>
                        <div><strong>AI / Deep Learning:</strong> {candidate.skills.ai_ml.join(', ')}</div>
                        <div><strong>Frameworks:</strong> {candidate.skills.frameworks.join(', ')}</div>
                        <div><strong>DevOps & Cloud:</strong> {candidate.skills.tools.join(', ')}</div>
                      </div>
                    </div>

                    <div>
                      <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f2744', borderBottom: '2px solid #0f2744', paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase' }}>
                        Academic Background & Credentials
                      </h3>
                      <div><strong>{candidate.college}</strong> — {candidate.degree} (GPA: {candidate.gpa})</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{candidate.certifications.join(' | ')}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 6: CREATIVE */}
              {selected === 'Creative' && (
                <div>
                  <div style={{
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)',
                    padding: '36px 40px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16
                  }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 800, background: 'rgba(255,255,255,0.25)', padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase' }}>
                        Creative AI Engineer
                      </span>
                      <h1 style={{ fontSize: 30, fontWeight: 900, margin: '8px 0 4px', letterSpacing: '-0.5px' }}>{candidate.name}</h1>
                      <div style={{ fontSize: 14, color: '#fdf2f8' }}>{candidate.role}</div>
                    </div>
                    <div style={{ fontSize: 12, textAlign: 'right', background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 12 }}>
                      <div>{candidate.email}</div>
                      <div>{candidate.phone}</div>
                      <div style={{ color: '#fbcfe8' }}>{candidate.github}</div>
                    </div>
                  </div>

                  <div style={{ padding: '32px 40px', fontSize: 12.5, lineHeight: 1.55 }}>
                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#ec4899', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>🚀</span> Highlighted Projects
                      </h3>
                      {candidate.projects.map((p, i) => (
                        <div key={i} style={{ background: '#fdf2f8', padding: '14px 18px', borderRadius: 10, marginBottom: 10, border: '1px solid #fbcfe8' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#831843' }}>
                            <span>{p.title}</span>
                            <span style={{ fontSize: 11, color: '#be185d' }}>{p.tech}</span>
                          </div>
                          <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: '#475569' }}>
                            {p.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#8b5cf6', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>⚡</span> Experience
                      </h3>
                      {candidate.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a' }}>
                            <span>{exp.title} @ {exp.company}</span>
                            <span style={{ fontSize: 11, color: '#8b5cf6' }}>{exp.period}</span>
                          </div>
                          <ul style={{ margin: '4px 0 0', paddingLeft: 18, color: '#334155' }}>
                            {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#3b82f6', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>🎓</span> Education & Certifications
                      </h3>
                      <div style={{ color: '#334155' }}><strong>{candidate.college}</strong> — {candidate.degree} (GPA: {candidate.gpa})</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{candidate.certifications.join(' • ')}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div style={{
            padding: '12px 24px',
            background: 'rgba(0,0,0,0.3)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#64748b'
          }}>
            <div>
              💡 <em>ATS-Optimized format scores 98/100 on automated resume parsers.</em>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a5b4fc',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 12
              }}
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
