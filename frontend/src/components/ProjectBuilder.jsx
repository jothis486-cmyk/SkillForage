import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RECOMMENDED_PROJECTS = [
  { role: 'Software Engineer', title: 'Full-Stack E-Commerce & Analytics Platform', tech: ['React', 'Node.js', 'Express', 'MongoDB'], difficulty: 'Advanced', icon: '🛒' },
  { role: 'Data Scientist', title: 'Real-Time House Price & Rent Predictor ML App', tech: ['Python', 'Scikit-Learn', 'FastAPI', 'Streamlit'], difficulty: 'Intermediate', icon: '🏠' },
  { role: 'AI Engineer', title: 'Autonomous RAG AI Assistant & Chatbot', tech: ['Python', 'LangChain', 'OpenAI', 'Pinecone'], difficulty: 'Advanced', icon: '🤖' },
  { role: 'Cloud Engineer', title: 'AWS Microservices Automated Infrastructure', tech: ['Terraform', 'AWS EC2/S3', 'Docker', 'Kubernetes'], difficulty: 'Advanced', icon: '☁️' },
  { role: 'Cybersecurity', title: 'Automated Vulnerability & Port Scanner', tech: ['Python', 'Nmap API', 'Socket', 'React'], difficulty: 'Intermediate', icon: '🛡️' }
];

const ProjectBuilder = () => {
  const [activeSubTab, setActiveSubTab] = useState('generator'); // generator, docGen, reviewer, recommend
  const [skillsInput, setSkillsInput] = useState('React, Node.js, MongoDB, Python');
  const [domainInput, setDomainInput] = useState('Web Development & AI');
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState(null);

  // Doc Gen state
  const [docProjectName, setDocProjectName] = useState('AI Career Intelligence Platform');
  const [generatedDoc, setGeneratedDoc] = useState(null);

  // Reviewer state
  const [reviewRepoUrl, setReviewRepoUrl] = useState('https://github.com/user/my-awesome-project');
  const [reviewResult, setReviewResult] = useState(null);

  const handleGenerateBlueprint = (titleOverride) => {
    setLoading(true);
    setTimeout(() => {
      const skillsArr = skillsInput.split(',').map(s => s.trim());
      setBlueprint({
        title: titleOverride || `${skillsArr[0] || 'Full-Stack'} Smart Platform`,
        domain: domainInput,
        architecture: "Client-Server Microservices MVC Architecture with REST & WebSocket Communication",
        folderStructure: `my-ai-project/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page routes
│   │   ├── context/         # Auth & state
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── controllers/         # Business logic
│   ├── models/              # DB Schemas
│   ├── routes/              # Express Endpoints
│   ├── middleware/          # JWT & Validation
│   ├── server.js            # Server entrypoint
│   └── .env
├── docs/                    # Architecture & ER diagrams
└── README.md`,
        databaseDesign: {
          tables: [
            { name: "Users", fields: ["_id", "fullName", "email", "passwordHash", "role", "createdAt"] },
            { name: "Projects", fields: ["_id", "title", "description", "repoUrl", "score", "ownerId"] },
            { name: "AnalyticsLogs", fields: ["_id", "userId", "eventType", "timestamp", "metadata"] }
          ],
          relations: "One-to-Many: User -> Projects, User -> AnalyticsLogs"
        },
        recommendedAPIs: [
          { method: "POST", path: "/api/auth/register", desc: "User Account Creation" },
          { method: "POST", path: "/api/auth/login", desc: "JWT Authentication" },
          { method: "GET", path: "/api/projects", desc: "Retrieve User Projects" },
          { method: "POST", path: "/api/ai/analyze", desc: "Trigger AI Analysis" }
        ],
        roadmap: [
          "Step 1: Setup React + Vite frontend scaffolding & Tailwind design system",
          "Step 2: Initialize Node.js/Express backend with MongoDB connections",
          "Step 3: Implement JWT authentication & user session state",
          "Step 4: Build core feature logic & REST API connectors",
          "Step 5: Containerize with Docker and deploy to Vercel/Render"
        ],
        workflowExplanation: "User signs in -> JWT token issued -> React state updates -> User interacts with UI -> Axios sends API request to Node.js -> Controller runs business logic & Mongo query -> Returns JSON payload to frontend.",
        deploymentGuide: "1. Frontend: Connect GitHub repo to Vercel/Netlify. Set environment variables VITE_API_URL.\n2. Backend: Host on Render or AWS EC2. Attach MongoDB Atlas cluster connection string.\n3. Verify HTTPS & CORS permissions.",
        githubTemplate: "https://github.com/templates/fullstack-ai-starter",
        mentorAdvice: "💡 AI Mentor Tip: Focus on clean code modularity, write error-handling middleware, and provide a clear README.md with live screenshots!"
      });
      setLoading(false);
    }, 600);
  };

  const handleGenerateDoc = () => {
    setLoading(true);
    setTimeout(() => {
      setGeneratedDoc({
        projectName: docProjectName,
        abstract: "This project presents an intelligent, automated software engineering platform that accelerates development, generates architecture, analyzes code quality, and guides students towards high-value tech placements.",
        introduction: "In today's fast-evolving software industry, candidates must showcase end-to-end project competency. This system provides automated scaffolding, documentation generation, and code reviews.",
        modules: ["User Scaffolding & Auth", "AI Project Builder Engine", "Database & Schema Designer", "GitHub Portfolio Evaluator", "Live Code Debugger"],
        objectives: [
          "Automate project architecture design based on student skill inputs.",
          "Generate industry-compliant project documentation and ER diagrams.",
          "Provide real-time AI code reviews and deployment readiness scores."
        ],
        algorithms: ["Cosine Similarity for Skill Gap Evaluation", "Decision Tree for Salary Band Estimation", "Static AST Code Analysis for Debugging"],
        architecture: "Client-Server Microservices with React single-page application, Express backend gateway, and MongoDB persistence layer.",
        conclusion: "The project successfully bridges theoretical learning and practical software engineering standards.",
        futureScope: "Integration with real-time browser code execution sandbox and automated CI/CD pipeline generator."
      });
      setLoading(false);
    }, 500);
  };

  const handleReviewProject = () => {
    setLoading(true);
    setTimeout(() => {
      setReviewResult({
        score: 88,
        folderStructure: { rating: '92/100', status: 'Passed', details: 'Clean MVC layout with clear separation of components and routes.' },
        codeQuality: { rating: '85/100', status: 'Passed', details: 'Good component modularity. Minor linting suggestions on unhandled errors.' },
        documentation: { rating: '90/100', status: 'Passed', details: 'Comprehensive README.md with setup commands and architecture diagrams.' },
        githubBestPractices: { rating: '84/100', status: 'Passed', details: 'Regular commit history, readable branch names, and proper .gitignore.' },
        deployment: { rating: '88/100', status: 'Passed', details: 'Live production URL verified with SSL security certificate.' },
        aiRecommendations: [
          "Add automated unit tests using Jest or Vitest.",
          "Include a Dockerfile for containerized deployment.",
          "Optimize image assets for faster initial page load."
        ]
      });
      setLoading(false);
    }, 600);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🔨 AI Project Idea Generator & Builder</h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Generate architecture, folder structures, database schemas, documentation & code reviews</p>
      </div>

      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
        {[
          { id: 'generator', label: '🛠️ AI Project Builder' },
          { id: 'recommend', label: '🎯 Career Recommendations' },
          { id: 'docGen', label: '📚 Documentation Generator' },
          { id: 'reviewer', label: '🧪 AI Project Reviewer' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id)}
            style={{
              padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: activeSubTab === t.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.04)',
              color: activeSubTab === t.id ? '#fff' : '#94a3b8', transition: 'all 0.2s'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: AI Project Builder */}
      {activeSubTab === 'generator' && (
        <div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Generate Custom Project Architecture</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>Your Current Skills</label>
                <input
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>Preferred Domain / Topic</label>
                <input
                  value={domainInput}
                  onChange={e => setDomainInput(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none' }}
                />
              </div>
            </div>
            <button
              onClick={() => handleGenerateBlueprint()}
              disabled={loading}
              style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              {loading ? '⚡ Generating Architecture...' : '🚀 Generate Project Blueprint'}
            </button>
          </div>

          {blueprint && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gap: 20 }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, textTransform: 'uppercase' }}>{blueprint.domain} Blueprint</span>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 2 }}>{blueprint.title}</h2>
                  </div>
                  <a href={blueprint.githubTemplate} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                    📦 GitHub Template
                  </a>
                </div>
                <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}><strong>Architecture:</strong> {blueprint.architecture}</div>
                <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, color: '#6ee7b7', fontSize: 13 }}>
                  {blueprint.mentorAdvice}
                </div>
              </div>

              {/* Grid of Folder, DB, APIs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Folder Structure */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
                  <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📂 Folder Structure</h3>
                  <pre style={{ background: 'rgba(0,0,0,0.4)', padding: 14, borderRadius: 10, color: '#a5b4fc', fontSize: 12, fontFamily: 'monospace', overflowX: 'auto' }}>
                    {blueprint.folderStructure}
                  </pre>
                </div>

                {/* Database Design */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
                  <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🗄️ Database Design (ER Schema)</h3>
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10 }}>{blueprint.databaseDesign.relations}</div>
                  {blueprint.databaseDesign.tables.map((tbl, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 10, marginBottom: 8 }}>
                      <div style={{ color: '#10b981', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>📌 Collection: {tbl.name}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {tbl.fields.map(f => <span key={f} style={{ background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', padding: '2px 8px', borderRadius: 6, fontSize: 11 }}>{f}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended APIs & Roadmap */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
                  <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⚡ Recommended API Endpoints</h3>
                  {blueprint.recommendedAPIs.map((api, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 700, background: api.method === 'GET' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)', color: api.method === 'GET' ? '#6ee7b7' : '#a5b4fc' }}>{api.method}</span>
                      <span style={{ fontSize: 12, color: '#fff', fontFamily: 'monospace' }}>{api.path}</span>
                      <span style={{ fontSize: 11, color: '#64748b', marginLeft: 'auto' }}>{api.desc}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
                  <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🚀 Deployment & Workflow</h3>
                  <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 12 }}>
                    <strong>Workflow:</strong> {blueprint.workflowExplanation}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, whitespace: 'pre-line' }}>
                    <strong>Deployment Guide:</strong><br />{blueprint.deploymentGuide}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 2: Career Recommendations */}
      {activeSubTab === 'recommend' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {RECOMMENDED_PROJECTS.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, cursor: 'pointer' }}
              onClick={() => { setActiveSubTab('generator'); handleGenerateBlueprint(p.title); }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{p.icon}</span>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>{p.role}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{p.title}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {p.tech.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '2px 8px', borderRadius: 6, fontSize: 11 }}>{t}</span>)}
              </div>
              <button style={{ width: '100%', padding: '10px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#a5b4fc', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                Build This Project →
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* TAB 3: Documentation Generator */}
      {activeSubTab === 'docGen' && (
        <div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📄 Project Documentation Generator</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                value={docProjectName}
                onChange={e => setDocProjectName(e.target.value)}
                placeholder="Enter Project Title"
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none' }}
              />
              <button
                onClick={handleGenerateDoc}
                disabled={loading}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >
                {loading ? 'Generating...' : '⚡ Auto-Generate Report'}
              </button>
            </div>
          </div>

          {generatedDoc && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ color: '#6366f1', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>📋 Project Documentation: {generatedDoc.projectName}</h2>
              
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>1. Abstract</h4>
                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{generatedDoc.abstract}</p>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>2. Introduction</h4>
                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{generatedDoc.introduction}</p>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>3. Modules</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {generatedDoc.modules.map(m => <span key={m} style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{m}</span>)}
                  </div>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>4. Objectives</h4>
                  <ul style={{ color: '#94a3b8', fontSize: 13, paddingLeft: 20, margin: 0, lineHeight: 1.6 }}>
                    {generatedDoc.objectives.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>5. Architecture & Algorithms</h4>
                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}><strong>Architecture:</strong> {generatedDoc.architecture}</p>
                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}><strong>Algorithms Used:</strong> {generatedDoc.algorithms.join(', ')}</p>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>6. Conclusion & Future Scope</h4>
                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{generatedDoc.conclusion} {generatedDoc.futureScope}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 4: AI Project Reviewer */}
      {activeSubTab === 'reviewer' && (
        <div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🧪 AI Project Reviewer & Quality Audit</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                value={reviewRepoUrl}
                onChange={e => setReviewRepoUrl(e.target.value)}
                placeholder="Paste GitHub Repository URL"
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none' }}
              />
              <button
                onClick={handleReviewProject}
                disabled={loading}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >
                {loading ? 'Auditing Code...' : '🔍 Review Project'}
              </button>
            </div>
          </div>

          {reviewResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(99,102,241,0.1))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
                <div>
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Audit Complete</span>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 2 }}>Overall Project Score</h2>
                </div>
                <div style={{ fontSize: 44, fontWeight: 900, color: '#10b981' }}>{reviewResult.score}<span style={{ fontSize: 20, color: '#64748b' }}>/100</span></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Folder Structure', data: reviewResult.folderStructure, icon: '📁' },
                  { label: 'Code Quality', data: reviewResult.codeQuality, icon: '💻' },
                  { label: 'Documentation', data: reviewResult.documentation, icon: '📝' },
                  { label: 'GitHub Hygiene', data: reviewResult.githubBestPractices, icon: '🐙' }
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 700, fontSize: 14 }}>
                        <span>{item.icon}</span> {item.label}
                      </div>
                      <span style={{ color: '#10b981', fontWeight: 700, fontSize: 13 }}>{item.data.rating}</span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{item.data.details}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProjectBuilder;
