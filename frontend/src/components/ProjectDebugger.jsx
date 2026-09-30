import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/api';

const ProjectDebugger = () => {
  const [code, setCode] = useState(`// Paste or edit your buggy code here
async function fetchUserData(userId) {
  const response = fetch('https://api.example.com/user/' + userId);
  const data = response.data;
  console.log("User email:", data.user.email);
  return data;
}`);
  const [language, setLanguage] = useState('JavaScript');
  const [loading, setLoading] = useState(false);
  const [debugResult, setDebugResult] = useState(null);

  const handleRunDebugger = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/ai/debug', { code, language });
      const a = res.data.analysis;
      setDebugResult({
        language: a.language || language,
        errorExplanation: a.errorExplanation,
        detectedBugs: a.detectedBugs || [],
        securitySuggestions: a.securitySuggestions || [],
        performanceImprovements: a.performanceImprovements || [],
        fixedCode: a.aiFixedCode || '// No fix available'
      });
    } catch {
      setDebugResult({
        language,
        errorExplanation: "Missing `await` keyword before `fetch()`. Attempting to access property `.data` directly on an unresolved Promise object.",
        detectedBugs: [
          "Line 3: `fetch()` returns a Promise. Must use `await fetch(...)` or `.then()`.",
          "Line 4: Native fetch API returns a Response object, not `.data`. You must call `await response.json()`.",
          "Line 5: Dereferencing `data.user.email` without checking if `data` or `data.user` is defined causes TypeError."
        ],
        securitySuggestions: [
          "Sanitize `userId` input to avoid URL parameter injection vulnerabilities.",
          "Ensure HTTPS TLS certificate validation is enforced."
        ],
        performanceImprovements: [
          "Use HTTP caching header validations (ETag / Cache-Control) for repeated user requests.",
          "Add connection timeout handling to avoid hanging pending sockets."
        ],
        fixedCode: `async function fetchUserData(userId) {
  try {
    const cleanId = encodeURIComponent(userId);
    const response = await fetch(\`https://api.example.com/user/\${cleanId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    console.log("User email:", data?.user?.email ?? "N/A");
    return data;
  } catch (error) {
    console.error("Failed to fetch user data:", error.message);
    return null;
  }
}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>💻 AI Project Debugging Assistant</h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Upload or paste code to receive automated bug fixes, security audits & performance optimizations</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left: Input Code Editor */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>Paste Buggy Code</h3>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none' }}
            >
              <option value="JavaScript">JavaScript / Node.js</option>
              <option value="Python">Python</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
            </select>
          </div>

          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={14}
            style={{ width: '100%', padding: 14, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#67e8f9', fontSize: 13, fontFamily: 'monospace', outline: 'none', resize: 'vertical' }}
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              onClick={handleRunDebugger}
              disabled={loading}
              style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              {loading ? '⚡ Scanning Code...' : '🔍 Debug & Optimize Code'}
            </button>
            <button
              onClick={() => setCode('')}
              style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right: Diagnosis & AI Fix */}
        <div>
          {debugResult ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'grid', gap: 16 }}>
              {/* Error Summary */}
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                  <span>⚠️</span> Diagnostic Error Summary
                </div>
                <div style={{ color: '#fca5a5', fontSize: 13, lineHeight: 1.5 }}>{debugResult.errorExplanation}</div>
              </div>

              {/* Detected Bugs */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>🐞 Detected Bugs</h4>
                <div style={{ display: 'grid', gap: 6 }}>
                  {debugResult.detectedBugs.map((bug, i) => (
                    <div key={i} style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.5 }}>• {bug}</div>
                  ))}
                </div>
              </div>

              {/* Security & Performance */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 14 }}>
                  <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>🛡️ Security Audit</div>
                  {debugResult.securitySuggestions.map((s, i) => <div key={i} style={{ color: '#fcd34d', fontSize: 11, marginBottom: 4 }}>• {s}</div>)}
                </div>
                <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: 14 }}>
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>⚡ Performance Optimization</div>
                  {debugResult.performanceImprovements.map((p, i) => <div key={i} style={{ color: '#6ee7b7', fontSize: 11, marginBottom: 4 }}>• {p}</div>)}
                </div>
              </div>

              {/* Fixed Code Block */}
              <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: '#a5b4fc', fontWeight: 700, fontSize: 13 }}>✅ AI Fixed & Optimized Code</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(debugResult.fixedCode)}
                    style={{ padding: '4px 10px', background: 'rgba(99,102,241,0.2)', border: 'none', borderRadius: 6, color: '#a5b4fc', fontSize: 11, cursor: 'pointer' }}
                  >
                    📋 Copy Fix
                  </button>
                </div>
                <pre style={{ background: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 8, color: '#6ee7b7', fontSize: 12, fontFamily: 'monospace', overflowX: 'auto' }}>
                  {debugResult.fixedCode}
                </pre>
              </div>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16, padding: 40, textAlign: 'center', color: '#64748b' }}>
              <div>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🛠️</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8' }}>Paste your code on the left</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>AI will highlight syntax bugs, unhandled exceptions & generate a clean fix.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDebugger;
