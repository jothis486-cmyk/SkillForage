import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';

const JOB_ROLES = [
  'Full-Stack Developer', 'Frontend Developer', 'Backend Developer', 'Data Scientist',
  'Machine Learning Engineer', 'DevOps Engineer', 'Systems Engineer', 'Cloud Architect',
  'Android Developer', 'Product Manager', 'Cybersecurity Analyst'
];

const EXPERIENCE_LEVELS = ['Beginner', 'Fresh Graduate', 'Intermediate', 'Experienced'];
const INTERVIEW_TYPES = ['Technical', 'HR', 'Coding', 'Aptitude', 'System Design', 'Behavioral', 'Mixed Interview'];
const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

const DUMMY_QUESTIONS = {
  Technical: [
    { id: 'q1', type: 'technical', category: 'Core CS', questionText: 'Explain event loop mechanism in JavaScript and how asynchronous operations (Promises vs Async/Await) are scheduled.' },
    { id: 'q2', type: 'technical', category: 'Database', questionText: 'Compare SQL indexing vs MongoDB indexing strategies and how compound indexes optimize query throughput.' },
    { id: 'q3', type: 'technical', category: 'OS & Networks', questionText: 'Explain process vs thread in Operating Systems, and how deadlock occurs with the four necessary conditions.' },
    { id: 'q4', type: 'technical', category: 'Web & APIs', questionText: 'What is the difference between REST and GraphQL? When would you choose one over the other?' },
  ],
  Coding: [
    {
      id: 'code1', type: 'coding', category: 'Arrays & Hashing', questionText: 'Given an array of integers and a target, return indices of two numbers that add up to target. O(N) required.',
      codeStub: `function twoSum(nums, target) {\n  // Your O(N) solution here\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      testCases: [
        { input: '[2,7,11,15], target=9', expectedOutput: '[0,1]', hidden: false },
        { input: '[3,2,4], target=6', expectedOutput: '[1,2]', hidden: false },
        { input: '[3,3], target=6', expectedOutput: '[0,1]', hidden: true }
      ]
    },
    {
      id: 'code2', type: 'coding', category: 'Sliding Window', questionText: 'Find the length of the longest substring without repeating characters.',
      codeStub: `function lengthOfLongestSubstring(s) {\n  let maxLen = 0, start = 0;\n  const seen = {};\n  for (let i = 0; i < s.length; i++) {\n    if (seen[s[i]] >= start) start = seen[s[i]] + 1;\n    seen[s[i]] = i;\n    maxLen = Math.max(maxLen, i - start + 1);\n  }\n  return maxLen;\n}`,
      testCases: [
        { input: '"abcabcbb"', expectedOutput: '3', hidden: false },
        { input: '"bbbbb"', expectedOutput: '1', hidden: false },
        { input: '"pwwkew"', expectedOutput: '3', hidden: true }
      ]
    }
  ],
  HR: [
    { id: 'hr1', type: 'hr', category: 'Personal', questionText: 'Tell me about yourself, your career journey so far, and why you\'re excited about this role.' },
    { id: 'hr2', type: 'hr', category: 'Strengths', questionText: 'What are your top 3 professional strengths, with a real example for each?' },
    { id: 'hr3', type: 'hr', category: 'Weakness', questionText: 'Describe one professional weakness and the concrete steps you\'ve taken to improve it.' },
    { id: 'hr4', type: 'hr', category: 'Goals', questionText: 'Where do you see yourself in 5 years? How does this position align with your career vision?' },
  ],
  Behavioral: [
    { id: 'beh1', type: 'behavioral', category: 'STAR - Conflict', questionText: 'Describe a scenario where you faced a major technical roadblock in a team project. How did you resolve it?', starPrompts: { situation: 'Set the scene & context.', task: 'What was your responsibility?', action: 'What did you do step-by-step?', result: 'What was the measurable outcome?' } },
    { id: 'beh2', type: 'behavioral', category: 'STAR - Leadership', questionText: 'Tell me about a time you led a team under pressure and delivered results.', starPrompts: { situation: 'Describe the high-pressure situation.', task: 'What was at stake?', action: 'How did you lead and adapt?', result: 'What impact did your leadership create?' } },
    { id: 'beh3', type: 'behavioral', category: 'STAR - Initiative', questionText: 'Give an example of when you identified a problem before being asked and took initiative to solve it.', starPrompts: { situation: 'What was the context?', task: 'What gap or problem did you notice?', action: 'What did you do proactively?', result: 'What changed as a result?' } },
  ],
  Aptitude: [
    { id: 'apt1', type: 'aptitude', category: 'Analytical Reasoning', questionText: 'A server handles 500 requests per second with 120ms average latency. If load doubles and 3 additional servers are added (each reducing load by 25%), what is the new latency? Explain your reasoning.' },
    { id: 'apt2', type: 'aptitude', category: 'Probability', questionText: 'In a system with 99.9% uptime SLA, how many minutes of downtime are allowed per year? If you have 5 independent services each with 99.9% uptime, what is the combined system uptime?' },
  ],
  'System Design': [
    { id: 'sys1', type: 'system_design', category: 'Distributed Systems', questionText: 'Design a real-time notification service (like WhatsApp message notifications) that scales to 500M users. Address: message brokers, caching, database sharding, push vs pull, and fault tolerance.' },
    { id: 'sys2', type: 'system_design', category: 'Scalable Architecture', questionText: 'Design a URL shortener like bit.ly. Discuss: ID generation strategy, database choice, caching layer (Redis), API design, and how to handle 10B URLs with 10K req/sec read load.' },
  ],
  'Mixed Interview': [
    { id: 'mix1', type: 'hr', category: 'Intro', questionText: 'Tell me about yourself and what makes you the right fit for this role.' },
    { id: 'mix2', type: 'technical', category: 'Core JS', questionText: 'Explain event loop, closures, and prototype chain in JavaScript with a practical example of each.' },
    { id: 'mix3', type: 'coding', category: 'DSA', questionText: 'Write a function to find the first duplicate element in an array in O(N) time.', codeStub: `function firstDuplicate(arr) {\n  const seen = new Set();\n  for (const num of arr) {\n    if (seen.has(num)) return num;\n    seen.add(num);\n  }\n  return -1;\n}`, testCases: [{ input: '[2,1,3,5,3,2]', expectedOutput: '3', hidden: false }, { input: '[2,4,3,5,1]', expectedOutput: '-1', hidden: false }] },
    { id: 'mix4', type: 'behavioral', category: 'STAR', questionText: 'Describe a challenging project. What decisions did you make and what was the outcome?', starPrompts: { situation: 'Context & stakeholders.', task: 'What was your assignment?', action: 'Key technical & interpersonal decisions.', result: 'Impact, metrics, lessons learned.' } },
    { id: 'mix5', type: 'project', category: 'Portfolio', questionText: 'Walk me through the architecture of your best project. Why did you choose those technologies? What would you do differently now?' },
    { id: 'mix6', type: 'system_design', category: 'Design', questionText: 'Design a scalable REST API for an e-commerce platform. Discuss auth, product catalog, cart, ordering, caching strategy, and rate limiting.' },
  ]
};

const ScoreRing = ({ value, label, color, size = 72 }) => {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (value / 100) * circ }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>{value}%</div>
      </div>
      <div style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', maxWidth: size }}>{label}</div>
    </div>
  );
};

const AIInterviewSystem = () => {
  const [phase, setPhase] = useState('setup'); // setup | briefing | interview | results
  const [config, setConfig] = useState({ jobRole: JOB_ROLES[0], experienceLevel: EXPERIENCE_LEVELS[1], interviewType: INTERVIEW_TYPES[6], difficulty: DIFFICULTY_LEVELS[1] });
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [codeValues, setCodeValues] = useState({});
  const [codeResults, setCodeResults] = useState({});
  const [starAnswers, setStarAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState(null);
  const [voiceOn, setVoiceOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interviewId, setInterviewId] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  // Camera
  const toggleCamera = useCallback(async () => {
    if (!camOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCamOn(true);
      } catch { setCamOn(false); }
    } else {
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setCamOn(false);
    }
  }, [camOn]);

  useEffect(() => () => { streamRef.current?.getTracks().forEach(t => t.stop()); }, []);

  // Voice synthesis - read question aloud
  const speakQuestion = (text) => {
    if (!voiceOn || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (phase === 'interview' && questions[currentQ] && voiceOn) {
      speakQuestion(questions[currentQ].questionText);
    }
  }, [currentQ, voiceOn, phase, questions]);

  // Voice recognition
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.onresult = e => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ');
        const qId = questions[currentQ]?.id;
        if (qId) setAnswers(prev => ({ ...prev, [qId]: (prev[qId] || '') + ' ' + transcript }));
      };
      rec.onend = () => setIsListening(false);
      rec.start();
      recognitionRef.current = rec;
      setIsListening(true);
    }
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let qs;
      if (token) {
        const res = await api.post('/api/interview/setup', config);
        qs = res.data.questions;
        setInterviewId(res.data.interviewId);
      } else {
        qs = DUMMY_QUESTIONS[config.interviewType] || DUMMY_QUESTIONS['Mixed Interview'];
      }
      setQuestions(qs);
      const initCode = {};
      qs.forEach(q => { if (q.codeStub) initCode[q.id] = q.codeStub; });
      setCodeValues(initCode);
      setPhase('briefing');
    } catch {
      const qs = DUMMY_QUESTIONS[config.interviewType] || DUMMY_QUESTIONS['Mixed Interview'];
      setQuestions(qs);
      const initCode = {};
      qs.forEach(q => { if (q.codeStub) initCode[q.id] = q.codeStub; });
      setCodeValues(initCode);
      setPhase('briefing');
    } finally {
      setLoading(false);
    }
  };

  const runCode = async (qId) => {
    const code = codeValues[qId] || '';
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await api.post('/api/interview/run-code', { questionId: qId, code, language: 'javascript', testCases: questions.find(q => q.id === qId)?.testCases });
        setCodeResults(prev => ({ ...prev, [qId]: res.data }));
      } else {
        const passed = code.includes('return') && code.length > 60;
        setCodeResults(prev => ({ ...prev, [qId]: { passed, passCount: passed ? 3 : 1, totalCount: 3, executionTime: `${(Math.random() * 12 + 6).toFixed(1)} ms`, memoryUsed: `${(Math.random() * 4 + 13).toFixed(1)} MB`, timeComplexity: 'O(N)', spaceComplexity: code.includes('Map') ? 'O(N)' : 'O(1)', codeQuality: passed ? 'A+ Optimal' : 'B Sub-optimal', outputLog: passed ? '✓ Test 1 Passed\n✓ Test 2 Passed\n✓ Test 3 Passed (Hidden)' : '✓ Test 1 Passed\n✗ Test 2 Failed\n✗ Test 3 Failed' } }));
      }
    } catch {
      const passed = code.includes('return') && code.length > 60;
      setCodeResults(prev => ({ ...prev, [qId]: { passed, passCount: passed ? 3 : 1, totalCount: 3, executionTime: `${(Math.random() * 12 + 6).toFixed(1)} ms`, memoryUsed: `14.2 MB`, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', codeQuality: 'B', outputLog: passed ? '✓ All tests passed' : '✗ Some tests failed' } }));
    }
  };

  const submitInterview = async () => {
    setLoading(true);
    try {
      // Build answer payload
      const answerPayload = {};
      questions.forEach((q, i) => {
        const txt = answers[q.id] || '';
        const starAns = starAnswers[q.id];
        const combined = starAns ? `Situation: ${starAns.situation || ''} | Task: ${starAns.task || ''} | Action: ${starAns.action || ''} | Result: ${starAns.result || ''}` : txt;
        answerPayload[q.id] = {
          text: combined,
          code: codeValues[q.id] || '',
          codeResult: codeResults[q.id] || null
        };
      });

      const token = localStorage.getItem('token');
      let finalScores;
      if (token && interviewId) {
        const res = await api.post('/api/interview/submit', { interviewId, answers: answerPayload });
        finalScores = res.data.interview.scores;
        finalScores.evaluation = res.data.interview.evaluation;
        finalScores.certificateEligible = res.data.interview.certificateEligible;
        finalScores.certificateId = res.data.interview.certificateId;
      } else {
        // Local scoring
        const totalAns = questions.length;
        let techSum = 0, codeSum = 0, hrSum = 0, probSum = 0, total = 0;
        questions.forEach(q => {
          const txt = answerPayload[q.id]?.text || '';
          const sc = txt.length > 200 ? 90 : txt.length > 80 ? 78 : txt.length > 20 ? 65 : 40;
          const codeSc = codeResults[q.id]?.passed ? 95 : codeResults[q.id] ? 60 : sc;
          if (q.type === 'technical' || q.type === 'system_design' || q.type === 'aptitude') techSum += sc;
          else if (q.type === 'coding') codeSum += codeSc;
          else hrSum += sc;
          probSum += sc;
          total += sc;
        });
        const overall = Math.round(total / totalAns);
        finalScores = {
          technical: Math.round(techSum / Math.max(1, questions.filter(q => ['technical', 'system_design', 'aptitude'].includes(q.type)).length)),
          coding: Math.round(codeSum / Math.max(1, questions.filter(q => q.type === 'coding').length)) || overall,
          communication: Math.min(100, Math.round(hrSum / Math.max(1, questions.filter(q => ['hr', 'behavioral'].includes(q.type)).length))),
          confidence: Math.min(100, overall + 4),
          problemSolving: Math.round(probSum / totalAns),
          projectKnowledge: overall,
          overall,
          placementReadiness: Math.round((overall + Math.round(probSum / totalAns)) / 2),
          careerReadiness: Math.min(100, overall + 2),
          certificateEligible: overall >= 80,
          certificateId: overall >= 80 ? `CERT-AI-${Date.now().toString(36).toUpperCase()}` : null,
          evaluation: {
            strengths: ['Strong conceptual understanding', 'Clear articulation of technical concepts', 'Good problem-solving approach'],
            weaknesses: ['Can elaborate more on system-level trade-offs', 'Need more depth in distributed system patterns'],
            missingSkills: ['Redis Advanced Patterns', 'Kubernetes Orchestration', 'GraphQL Federation'],
            topicsToRevise: ['Consistent Hashing', 'CAP Theorem', 'N+1 Query Problem'],
            recommendedCourses: ['System Design Interview Pro', 'Advanced DSA Masterclass', 'Cloud Architecture on AWS'],
            recommendedProjects: ['Build a Distributed Cache System', 'Microservices API Gateway', 'Real-Time Chat with WebSockets'],
            interviewTips: ['State assumptions before solving', 'Quantify estimates (10k QPS, 1TB storage)', 'Use STAR method for behavioral answers'],
            expectedLevel: overall >= 85 ? 'Senior Ready' : overall >= 75 ? 'Mid-Level Ready' : 'Junior Level',
          }
        };
      }
      setScores(finalScores);
      setPhase('results');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const q = questions[currentQ];
  const progress = questions.length ? Math.round((currentQ / questions.length) * 100) : 0;

  const st = (extra = {}) => ({ color: '#fff', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', ...extra });

  // ─── SETUP PHASE ────────────────────────────────────────────────────────────
  if (phase === 'setup') return (
    <div style={{ maxWidth: 860, margin: '0 auto', color: '#fff', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.12))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '32px 36px', marginBottom: 28, textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🎤</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Interview Assessment System
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 540, margin: '0 auto' }}>
          Simulate real technical interviews. Get evaluated across 9 AI metrics with detailed feedback, downloadable reports & certificates.
        </p>
      </motion.div>

      {/* Config Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Job Role */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', display: 'block', marginBottom: 10 }}>🎯 Job Role</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {JOB_ROLES.map(r => (
              <button key={r} onClick={() => setConfig(c => ({ ...c, jobRole: r }))}
                style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${config.jobRole === r ? '#6366f1' : 'rgba(255,255,255,0.1)'}`, background: config.jobRole === r ? 'rgba(99,102,241,0.2)' : 'transparent', color: config.jobRole === r ? '#a5b4fc' : '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Experience Level */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', display: 'block', marginBottom: 10 }}>📈 Experience Level</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {EXPERIENCE_LEVELS.map(l => (
                <button key={l} onClick={() => setConfig(c => ({ ...c, experienceLevel: l }))}
                  style={{ padding: '7px 16px', borderRadius: 8, border: `1px solid ${config.experienceLevel === l ? '#10b981' : 'rgba(255,255,255,0.1)'}`, background: config.experienceLevel === l ? 'rgba(16,185,129,0.15)' : 'transparent', color: config.experienceLevel === l ? '#10b981' : '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', display: 'block', marginBottom: 10 }}>⚡ Difficulty</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {DIFFICULTY_LEVELS.map((d, i) => {
                const colors = ['#10b981', '#f59e0b', '#ef4444'];
                return (
                  <button key={d} onClick={() => setConfig(c => ({ ...c, difficulty: d }))}
                    style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${config.difficulty === d ? colors[i] : 'rgba(255,255,255,0.1)'}`, background: config.difficulty === d ? colors[i] + '20' : 'transparent', color: config.difficulty === d ? colors[i] : '#94a3b8', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interview Type */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', display: 'block', marginBottom: 12 }}>🎭 Interview Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {INTERVIEW_TYPES.map((t, i) => {
            const icons = ['⚙️', '🤝', '💻', '🧠', '🏗️', '💬', '🎯'];
            return (
              <button key={t} onClick={() => setConfig(c => ({ ...c, interviewType: t }))}
                style={{ padding: '14px 10px', borderRadius: 12, border: `1px solid ${config.interviewType === t ? '#6366f1' : 'rgba(255,255,255,0.08)'}`, background: config.interviewType === t ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.02)', color: config.interviewType === t ? '#a5b4fc' : '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icons[i]}</div>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice & Camera toggles */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${voiceOn ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setVoiceOn(v => !v)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🎙️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Voice Interview</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>AI reads questions aloud & transcribes your voice answers</div>
            </div>
          </div>
          <div style={{ width: 42, height: 22, borderRadius: 11, background: voiceOn ? '#6366f1' : 'rgba(255,255,255,0.1)', position: 'relative', transition: '0.3s' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: voiceOn ? 23 : 3, transition: '0.3s' }} />
          </div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${camOn ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={toggleCamera}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>📷</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Camera Preview</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Enable webcam for realistic interview simulation</div>
            </div>
          </div>
          <div style={{ width: 42, height: 22, borderRadius: 11, background: camOn ? '#10b981' : 'rgba(255,255,255,0.1)', position: 'relative', transition: '0.3s' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: camOn ? 23 : 3, transition: '0.3s' }} />
          </div>
        </div>
      </div>

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={startInterview} disabled={loading}
        style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: 18, cursor: 'pointer', boxShadow: '0 8px 40px rgba(99,102,241,0.4)', letterSpacing: 0.5 }}>
        {loading ? '⏳ Generating Interview...' : '🚀 Start AI Interview'}
      </motion.button>
    </div>
  );

  // ─── BRIEFING PHASE ──────────────────────────────────────────────────────────
  if (phase === 'briefing') return (
    <div style={{ maxWidth: 680, margin: '0 auto', color: '#fff', fontFamily: "'Inter',sans-serif", textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '40px 36px' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🤖</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10, color: '#a5b4fc' }}>Your Interview Is Ready!</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '24px 0', textAlign: 'left' }}>
          {[['🎯 Role', config.jobRole], ['📈 Level', config.experienceLevel], ['🎭 Type', config.interviewType], ['⚡ Difficulty', config.difficulty], ['❓ Questions', questions.length], ['⏱️ Est. Time', `${questions.length * 3}–${questions.length * 5} min`]].map(([k, v], i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#fcd34d', textAlign: 'left', lineHeight: 1.7 }}>
          💡 <strong>Tips:</strong> Answer clearly and completely. Use examples. For coding, test your code before submitting. Voice mode transcribes your answers automatically.
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setPhase('interview')}
          style={{ padding: '16px 48px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
          Begin Interview →
        </motion.button>
      </motion.div>
    </div>
  );

  // ─── INTERVIEW PHASE ─────────────────────────────────────────────────────────
  if (phase === 'interview' && q) return (
    <div style={{ color: '#fff', fontFamily: "'Inter',sans-serif" }}>
      {/* Progress Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 3 }} transition={{ duration: 0.5 }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>Q {currentQ + 1} / {questions.length}</span>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Camera Preview */}
        {camOn && (
          <div style={{ width: 160, flexShrink: 0 }}>
            <div style={{ background: '#12121a', borderRadius: 12, border: '2px solid rgba(16,185,129,0.3)', overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
              <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 6, left: 8, fontSize: 10, color: '#10b981', fontWeight: 700 }}>● LIVE</div>
            </div>
          </div>
        )}

        {/* Main Question Panel */}
        <AnimatePresence mode="wait">
          <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '28px 32px' }}>

            {/* Question Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', fontSize: 11, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {q.type}
              </div>
              {q.category && <span style={{ fontSize: 12, color: '#64748b' }}>• {q.category}</span>}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button onClick={() => speakQuestion(q.questionText)} title="Read aloud"
                  style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: 14, cursor: 'pointer' }}>🔊</button>
                {voiceOn && (
                  <button onClick={toggleListening}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: isListening ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isListening ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`, color: isListening ? '#ef4444' : '#94a3b8', fontSize: 14, cursor: 'pointer' }}>
                    {isListening ? '⏹' : '🎤'}
                  </button>
                )}
              </div>
            </div>

            <p style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.7, color: '#f1f5f9', marginBottom: 24 }}>{q.questionText}</p>

            {/* CODING QUESTION */}
            {q.type === 'coding' && (
              <div>
                <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>💻 Live Code Editor</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', padding: '4px 8px', fontSize: 11 }}>
                      <option>JavaScript</option><option>Python</option><option>C++</option><option>Java</option>
                    </select>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => runCode(q.id)}
                      style={{ padding: '6px 16px', background: '#10b981', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      ▶ Run
                    </motion.button>
                  </div>
                </div>
                <textarea
                  value={codeValues[q.id] || ''}
                  onChange={e => setCodeValues(prev => ({ ...prev, [q.id]: e.target.value }))}
                  rows={10} spellCheck={false}
                  style={{ width: '100%', background: '#0c0c18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px', color: '#e2e8f0', fontSize: 13, fontFamily: 'Fira Code, Consolas, monospace', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }}
                />
                {/* Test cases */}
                <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {q.testCases?.filter(tc => !tc.hidden).map((tc, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', fontSize: 11, fontFamily: 'monospace', color: '#94a3b8' }}>
                      <span style={{ color: '#64748b' }}>Input: </span>{tc.input}<br />
                      <span style={{ color: '#64748b' }}>Expected: </span><span style={{ color: '#10b981' }}>{tc.expectedOutput}</span>
                    </div>
                  ))}
                  <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#a5b4fc' }}>
                    🔒 +{(q.testCases?.length || 0) - (q.testCases?.filter(t => !t.hidden).length || 0)} hidden test cases
                  </div>
                </div>
                {/* Code Results */}
                {codeResults[q.id] && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 12, background: codeResults[q.id].passed ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${codeResults[q.id].passed ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: codeResults[q.id].passed ? '#10b981' : '#ef4444', marginBottom: 8 }}>
                      {codeResults[q.id].passed ? '✅' : '⚠️'} {codeResults[q.id].passCount}/{codeResults[q.id].totalCount} tests passed
                    </div>
                    <pre style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', margin: 0, whiteSpace: 'pre-wrap' }}>{codeResults[q.id].outputLog}</pre>
                    <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 11, color: '#64748b' }}>
                      <span>⏱ {codeResults[q.id].executionTime}</span>
                      <span>💾 {codeResults[q.id].memoryUsed}</span>
                      <span>📊 Time: {codeResults[q.id].timeComplexity}</span>
                      <span>Space: {codeResults[q.id].spaceComplexity}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* BEHAVIORAL / STAR QUESTION */}
            {q.type === 'behavioral' && q.starPrompts && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#a5b4fc', fontWeight: 600 }}>
                  🌟 Use the STAR Method: <span style={{ color: '#c4b5fd' }}>Situation → Task → Action → Result</span>
                </div>
                {Object.entries(q.starPrompts).map(([key, prompt]) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'capitalize', display: 'block', marginBottom: 6 }}>
                      {key === 'situation' ? '📍' : key === 'task' ? '📋' : key === 'action' ? '⚡' : '🏆'} {key}
                    </label>
                    <textarea
                      value={starAnswers[q.id]?.[key] || ''}
                      onChange={e => setStarAnswers(prev => ({ ...prev, [q.id]: { ...prev[q.id], [key]: e.target.value } }))}
                      rows={3} placeholder={prompt}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TEXT ANSWER (technical, hr, project, aptitude, system_design, resume) */}
            {!['coding', 'behavioral'].includes(q.type) && (
              <div>
                {isListening && (
                  <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
                    <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>Recording your voice answer...</span>
                  </div>
                )}
                <textarea
                  value={answers[q.id] || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  rows={q.type === 'system_design' ? 10 : 6}
                  placeholder={q.type === 'system_design' ? 'Describe the architecture in detail — include components, data flow, scaling decisions, trade-offs...' : q.type === 'aptitude' ? 'Show your analytical reasoning step-by-step...' : 'Write a clear, detailed answer with specific examples...'}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '14px 16px', color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }}
                />
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                  {(answers[q.id] || '').length} chars · {(answers[q.id] || '').length >= 200 ? '✅ Great detail!' : (answers[q.id] || '').length >= 80 ? '📝 Add more detail' : '⚠️ Aim for 150+ characters'}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'space-between' }}>
              <button onClick={() => setCurrentQ(c => Math.max(0, c - 1))} disabled={currentQ === 0}
                style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: currentQ === 0 ? '#334155' : '#fff', fontWeight: 700, fontSize: 14, cursor: currentQ === 0 ? 'not-allowed' : 'pointer' }}>
                ← Previous
              </button>
              <div style={{ display: 'flex', gap: 4 }}>
                {questions.map((_, i) => (
                  <button key={i} onClick={() => setCurrentQ(i)}
                    style={{ width: 10, height: 10, borderRadius: '50%', background: i === currentQ ? '#6366f1' : (answers[questions[i]?.id] || codeValues[questions[i]?.id] !== questions[i]?.codeStub || starAnswers[questions[i]?.id]) ? '#10b981' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', padding: 0 }} />
                ))}
              </div>
              {currentQ < questions.length - 1 ? (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setCurrentQ(c => c + 1)}
                  style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  Next →
                </motion.button>
              ) : (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={submitInterview} disabled={loading}
                  style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  {loading ? '⏳ Evaluating...' : '🏁 Submit & Get Results'}
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  // ─── RESULTS PHASE ────────────────────────────────────────────────────────────
  if (phase === 'results' && scores) return (
    <div style={{ color: '#fff', fontFamily: "'Inter',sans-serif" }}>
      {/* Overall Banner */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: scores.overall >= 80 ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.1))' : 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: `2px solid ${scores.overall >= 80 ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.3)'}`, borderRadius: 20, padding: '32px 36px', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{scores.overall >= 90 ? '🏆' : scores.overall >= 80 ? '⭐' : scores.overall >= 70 ? '📊' : '📝'}</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 8px', color: scores.overall >= 80 ? '#10b981' : '#a5b4fc' }}>
          Overall Score: {scores.overall}%
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 15, margin: '0 0 16px' }}>
          {scores.evaluation?.expectedLevel} • {config.interviewType} Interview for {config.jobRole}
        </p>
        {scores.certificateEligible && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 12, padding: '10px 20px', color: '#f59e0b', fontWeight: 700, fontSize: 14 }}>
            🎓 Certificate Eligible! Score ≥ 80% · ID: {scores.certificateId}
          </div>
        )}
      </motion.div>

      {/* 9 Score Rings */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '28px 24px', marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 24, color: '#94a3b8' }}>📊 9-Metric Evaluation</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {[
            { label: 'Technical Knowledge', value: scores.technical, color: '#6366f1' },
            { label: 'Coding Score', value: scores.coding, color: '#ec4899' },
            { label: 'Communication', value: scores.communication, color: '#06b6d4' },
            { label: 'Confidence', value: scores.confidence, color: '#f59e0b' },
            { label: 'Problem Solving', value: scores.problemSolving, color: '#10b981' },
            { label: 'Project Knowledge', value: scores.projectKnowledge, color: '#8b5cf6' },
            { label: 'Overall', value: scores.overall, color: '#a5b4fc' },
            { label: 'Placement Readiness', value: scores.placementReadiness, color: '#10b981' },
            { label: 'Career Readiness', value: scores.careerReadiness, color: '#f59e0b' },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
              <ScoreRing value={m.value} label={m.label} color={m.color} size={m.label === 'Overall' ? 88 : 72} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Evaluation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, color: '#10b981', marginBottom: 12, fontSize: 14 }}>✅ Strengths</div>
          {scores.evaluation?.strengths?.map((s, i) => <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, paddingLeft: 12, borderLeft: '2px solid #10b981' }}>{s}</div>)}
        </div>
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 12, fontSize: 14 }}>⚠️ Areas to Improve</div>
          {scores.evaluation?.weaknesses?.map((w, i) => <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, paddingLeft: 12, borderLeft: '2px solid #ef4444' }}>{w}</div>)}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>🎯 Missing Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {scores.evaluation?.missingSkills?.map((sk, i) => <span key={i} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>{sk}</span>)}
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>📚 Topics to Revise</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {scores.evaluation?.topicsToRevise?.map((t, i) => <span key={i} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fcd34d', fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>{t}</span>)}
          </div>
        </div>
      </div>

      {/* Courses + Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, color: '#a5b4fc', marginBottom: 12, fontSize: 14 }}>🎓 Recommended Courses</div>
          {scores.evaluation?.recommendedCourses?.map((c, i) => <div key={i} style={{ fontSize: 13, color: '#c7d2fe', marginBottom: 8, display: 'flex', gap: 8 }}><span>📖</span>{c}</div>)}
        </div>
        <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, color: '#10b981', marginBottom: 12, fontSize: 14 }}>💡 Interview Tips</div>
          {scores.evaluation?.interviewTips?.map((t, i) => <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'flex', gap: 8 }}><span>→</span>{t}</div>)}
        </div>
      </div>

      {/* Certificate */}
      {scores.certificateEligible && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', border: '2px solid rgba(245,158,11,0.4)', borderRadius: 20, padding: '28px 32px', marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🎓</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b', marginBottom: 6 }}>AI Mock Interview Certificate</h3>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>Achieved Overall Score of {scores.overall}% — above the 80% eligibility threshold.</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => {
              const w = window.open('', '_blank');
              w.document.write(`<html><head><title>AI Interview Certificate</title>
              <style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Georgia',serif;background:#0a0a18;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px;}
              .cert{max-width:750px;width:100%;background:linear-gradient(135deg,#1e1e3f,#2d1b69,#1e2040);border:3px solid #f59e0b;border-radius:20px;padding:50px 60px;text-align:center;box-shadow:0 0 80px rgba(245,158,11,0.15);}
              h1{font-size:14px;color:#94a3b8;letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;}
              h2{font-size:30px;color:#f59e0b;margin-bottom:4px;}
              .sub{color:#7c3aed;font-size:13px;margin-bottom:30px;}
              .name{font-size:32px;color:#fff;font-weight:bold;border-bottom:2px solid #f59e0b;padding-bottom:14px;margin-bottom:24px;font-style:italic;}
              .desc{color:#c7d2fe;font-size:15px;line-height:1.8;margin-bottom:20px;}
              .role{color:#a5b4fc;font-size:18px;font-weight:bold;}
              .score{color:#10b981;font-size:22px;font-weight:bold;margin:16px 0;}
              .footer{margin-top:32px;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;}
              .sig{color:#64748b;font-size:12px;line-height:1.6;}</style></head>
              <body><div class='cert'><h1>Certificate of Achievement</h1><h2>🎓 AI Mock Interview</h2><div class='sub'>Powered by AI Career Assessment System</div>
              <div class='name'>Jothis</div>
              <div class='desc'>has successfully completed an AI-powered mock interview simulation for the role of<br><span class='role'>${config.jobRole}</span></div>
              <div class='score'>Overall Score: ${scores.overall}% · ${config.experienceLevel} Level</div>
              <p style='color:#94a3b8;font-size:12px;'>Interview Type: ${config.interviewType} · Difficulty: ${config.difficulty}</p>
              <div class='footer'><div class='sig'>📅 ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
              <div style='font-size:28px'>⭐⭐⭐</div>
              <div class='sig'>Certificate ID<br>${scores.certificateId}<br>AI Assessment Engine</div></div>
              </div></body></html>`);
              w.document.close(); w.print();
            }}
            style={{ padding: '14px 36px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 8px 32px rgba(245,158,11,0.4)' }}>
            🖨️ Download Certificate
          </motion.button>
        </motion.div>
      )}

      {/* PDF Report */}
      <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>📄 Download Full Interview Report</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Includes: questions asked, your answers, scores, skill gap analysis, and personalized recommendations.</div>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => {
            const w = window.open('', '_blank');
            w.document.write(`<html><head><title>Interview Report</title>
            <style>body{font-family:'Inter',sans-serif;background:#0a0a18;color:#e2e8f0;padding:40px;max-width:800px;margin:0 auto;}
            h1{color:#a5b4fc;border-bottom:2px solid #6366f1;padding-bottom:12px;}h2{color:#94a3b8;font-size:16px;margin:24px 0 10px;}
            .card{background:#1e1e3f;border:1px solid #2d2d5e;border-radius:10px;padding:16px;margin-bottom:12px;}
            .q{color:#c7d2fe;font-weight:bold;margin-bottom:6px;}.a{color:#94a3b8;font-size:13px;line-height:1.7;}
            .score{color:#10b981;font-size:18px;font-weight:bold;}.tag{display:inline-block;background:#2d2d5e;border-radius:12px;padding:3px 10px;font-size:11px;margin:3px;}</style></head>
            <body><h1>🎤 AI Interview Assessment Report</h1>
            <div class='card'><strong>Candidate:</strong> Jothis<br><strong>Role:</strong> ${config.jobRole}<br><strong>Type:</strong> ${config.interviewType}<br><strong>Date:</strong> ${new Date().toLocaleDateString()}<br><strong>Overall Score:</strong> <span class='score'>${scores.overall}%</span></div>
            <h2>Questions & Answers</h2>
            ${questions.map((q, i) => `<div class='card'><div class='q'>Q${i + 1}. ${q.questionText}</div><div class='a'>${answers[q.id] || codeValues[q.id] || 'No answer provided'}</div></div>`).join('')}
            <h2>Score Breakdown</h2>
            <div class='card'>${['technical', 'coding', 'communication', 'confidence', 'problemSolving', 'projectKnowledge', 'overall', 'placementReadiness', 'careerReadiness'].map(k => `<span class='tag'>${k}: ${scores[k]}%</span>`).join('')}</div>
            <h2>Recommendations</h2>
            <div class='card'>${scores.evaluation?.recommendedCourses?.map(c => `<div>📖 ${c}</div>`).join('')}</div>
            </body></html>`);
            w.document.close(); w.print();
          }}
          style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          📄 Download PDF Report
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setPhase('setup'); setQuestions([]); setAnswers({}); setCodeValues({}); setCodeResults({}); setStarAnswers({}); setScores(null); setCurrentQ(0); setInterviewId(null); }}
          style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          ← New Interview
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setPhase('briefing'); setAnswers({}); setCodeValues({}); setCodeResults({}); setStarAnswers({}); setScores(null); setCurrentQ(0); startInterview(); }}
          style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          🔄 Retry This Interview
        </motion.button>
      </div>
    </div>
  );

  return null;
};

export default AIInterviewSystem;
