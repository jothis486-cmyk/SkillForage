import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GitHubAnalyzer = () => {
  const [username, setUsername] = useState('alex-developer');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    username: 'alex-developer',
    qualityScore: 86,
    starsCount: 48,
    reposCount: 22,
    contributionsThisYear: 384,
    languages: [
      { name: 'JavaScript', percent: 45, color: '#f7df1e' },
      { name: 'Python', percent: 30, color: '#3572A5' },
      { name: 'TypeScript', percent: 15, color: '#2b7489' },
      { name: 'HTML/CSS', percent: 10, color: '#e34c26' }
    ],
    topRepos: [
      { name: 'ai-career-platform', stars: 24, quality: 'A+', issues: 2, badge: 'Full Stack' },
      { name: 'ml-price-predictor', stars: 14, quality: 'A', issues: 0, badge: 'Machine Learning' },
      { name: 'react-custom-hooks', stars: 10, quality: 'B+', issues: 4, badge: 'Library' }
    ],
    missingProjects: [
      "Microservices Architecture Capstone Project",
      "Real-Time Collaborative Canvas or Chat Application",
      "DevOps CI/CD Docker & Kubernetes Deployment Setup"
    ],
    aiSuggestions: [
      "Include high-resolution architecture diagrams in your top 3 repository READMEs.",
      "Add live demo badges and Vercel/Render deployment links in repo headers.",
      "Fix 4 open issues in react-custom-hooks to improve repository maintenance score."
    ]
  });

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        username,
        qualityScore: Math.min(98, Math.max(70, Math.floor(Math.random() * 25) + 75)),
        contributionsThisYear: Math.floor(Math.random() * 200) + 250
      }));
      setLoading(false);
    }, 600);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>📂 GitHub Portfolio Analyzer</h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Evaluate repository quality, coding activity graphs, language distributions & missing portfolio projects</p>
      </div>

      {/* Connection Header */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
        <span style={{ fontSize: 32 }}>🐙</span>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>GitHub Username</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter GitHub handle (e.g. octocat)"
            style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none' }}
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 16 }}
        >
          {loading ? 'Analyzing...' : '⚡ Analyze Portfolio'}
        </button>
      </div>

      {/* Score Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 700 }}>REPOSITORY QUALITY SCORE</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginTop: 4 }}>{data.qualityScore}<span style={{ fontSize: 18, color: '#a5b4fc' }}>/100</span></div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>Top 15% among peers</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>CONTRIBUTIONS (YEAR)</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981', marginTop: 4 }}>{data.contributionsThisYear}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>🔥 Active contributor</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>PUBLIC REPOSITORIES</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#06b6d4', marginTop: 4 }}>{data.reposCount}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>⭐ {data.starsCount} total stars</div>
        </div>
      </div>

      {/* Languages & Activity Graph */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Language Breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📊 Languages Breakdown</h3>
          <div style={{ height: 10, borderRadius: 5, display: 'flex', overflow: 'hidden', marginBottom: 16 }}>
            {data.languages.map((l, i) => (
              <div key={i} style={{ width: `${l.percent}%`, background: l.color }} title={`${l.name}: ${l.percent}%`} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {data.languages.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: 12, color: '#cbd5e1' }}>{l.name}</span>
                <span style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto', fontWeight: 600 }}>{l.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contribution Graph Simulated Heatmap */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🟩 Coding Activity Heatmap</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: 4 }}>
            {Array.from({ length: 96 }).map((_, i) => {
              const intensity = [0, 1, 2, 3, 4][(i * 7 + 3) % 5];
              const colors = ['rgba(255,255,255,0.05)', '#0e4429', '#006d32', '#26a641', '#39d353'];
              return (
                <div
                  key={i}
                  style={{ width: '100%', aspectRatio: '1', borderRadius: 3, background: colors[intensity] }}
                  title={`Day ${i + 1}: ${intensity * 3} commits`}
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 11, color: '#64748b' }}>
            <span>Less</span>
            <span style={{ color: '#39d353', fontWeight: 600 }}>More Commits</span>
          </div>
        </div>
      </div>

      {/* Missing Portfolio Projects & AI Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: 20 }}>
          <h3 style={{ color: '#ef4444', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>⚠️ Missing Portfolio Projects</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {data.missingProjects.map((p, i) => (
              <div key={i} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: 12, color: '#fca5a5', fontSize: 12, fontWeight: 500 }}>
                • {p}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: 20 }}>
          <h3 style={{ color: '#a5b4fc', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>💡 AI Improvement Suggestions</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {data.aiSuggestions.map((s, i) => (
              <div key={i} style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 10, padding: 12, color: '#cbd5e1', fontSize: 12, lineHeight: 1.5 }}>
                ✅ {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubAnalyzer;
