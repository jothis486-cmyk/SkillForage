import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Utility: generate AI questions based on topic ───────────────────────────
const QUESTION_BANK = {
  mcq: [
    { id: 'mcq1', text: 'Which HTTP method is idempotent and used to retrieve data without side effects?', options: ['POST', 'GET', 'DELETE', 'PATCH'], answer: 1, explanation: 'GET is idempotent and read-only. POST creates resources, DELETE removes them, PATCH partially updates.' },
    { id: 'mcq2', text: 'Which data structure implements LIFO (Last In, First Out) ordering?', options: ['Queue', 'Stack', 'Heap', 'Linked List'], answer: 1, explanation: 'A Stack follows LIFO — the last item pushed is the first popped. Queues use FIFO.' },
    { id: 'mcq3', text: 'In React, which hook replaces componentDidMount and componentDidUpdate lifecycle methods?', options: ['useState', 'useRef', 'useEffect', 'useMemo'], answer: 2, explanation: 'useEffect with an empty dependency array replaces componentDidMount; with deps it replaces componentDidUpdate.' },
    { id: 'mcq4', text: 'What is the time complexity of binary search on a sorted array?', options: ['O(N)', 'O(N log N)', 'O(log N)', 'O(1)'], answer: 2, explanation: 'Binary search divides the search space by half each iteration, giving O(log N) time complexity.' },
    { id: 'mcq5', text: 'Which MongoDB method returns all documents matching a filter?', options: ['.findOne()', '.find()', '.aggregate()', '.get()'], answer: 1, explanation: '.find() returns a cursor of all matching documents. .findOne() returns only the first match.' },
  ],
  truefalse: [
    { id: 'tf1', text: 'In JavaScript, null === undefined evaluates to true.', answer: false, explanation: 'null === undefined is false because === checks type AND value. null and undefined are different types.' },
    { id: 'tf2', text: 'REST APIs are stateless by definition.', answer: true, explanation: 'REST is stateless — each request must contain all necessary information; the server stores no session state.' },
    { id: 'tf3', text: 'A primary key in SQL can contain NULL values.', answer: false, explanation: 'Primary keys cannot be NULL. They uniquely identify rows and must always have a value.' },
    { id: 'tf4', text: 'Docker containers share the host OS kernel.', answer: true, explanation: 'Unlike VMs, Docker containers share the host OS kernel, making them lightweight and fast to start.' },
  ],
  fill: [
    { id: 'fill1', text: 'The process of converting an object to a byte stream is called _____.', answer: 'serialization', explanation: 'Serialization converts objects to bytes for storage/transmission. Deserialization is the reverse.' },
    { id: 'fill2', text: 'In CSS, the _____ property creates space inside an element\'s border.', answer: 'padding', explanation: 'Padding is inner spacing. Margin is outer spacing between elements.' },
    { id: 'fill3', text: 'The SQL clause used to filter results after grouping is _____.', answer: 'HAVING', explanation: 'HAVING filters after GROUP BY. WHERE filters before grouping.' },
  ],
  short: [
    { id: 'sh1', text: 'Explain the difference between authentication and authorization in 2-3 sentences.', modelAnswer: 'Authentication verifies who you are (identity), while authorization determines what you are allowed to do (permissions). Authentication happens first (login), then authorization checks if the authenticated user has access rights to a specific resource.' },
    { id: 'sh2', text: 'What is a closure in JavaScript and why is it useful?', modelAnswer: 'A closure is a function that retains access to its outer (enclosing) scope even after that outer function has finished executing. Closures are useful for data encapsulation, memoization, factory functions, and callbacks.' },
    { id: 'sh3', text: 'Briefly explain the CAP theorem and how it affects distributed systems.', modelAnswer: 'The CAP theorem states that in a distributed system you can only guarantee 2 of 3: Consistency, Availability, and Partition tolerance. Since network partitions are inevitable, systems must choose between strong consistency or high availability during failures.' },
  ],
  coding: [
    {
      id: 'code1',
      text: 'Write a function that reverses a string without using the built-in reverse() method.',
      stub: `function reverseString(str) {
  // Your solution here
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}`,
      testCases: [
        { input: '"hello"', expected: '"olleh"' },
        { input: '"JavaScript"', expected: '"tpircSavaJ"' },
        { input: '""', expected: '""' },
      ]
    },
    {
      id: 'code2',
      text: 'Find the maximum sum subarray using Kadane\'s algorithm.',
      stub: `function maxSubArray(nums) {
  // Implement Kadane's Algorithm
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      testCases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
        { input: '[1]', expected: '1' },
        { input: '[5,4,-1,7,8]', expected: '23' },
      ]
    },
  ],
  scenario: [
    { id: 'sc1', text: 'Your application\'s database query is taking 8 seconds to return results with 1 million records. Walk through your systematic approach to diagnose and optimize this performance issue.' },
    { id: 'sc2', text: 'A senior developer pushes broken code to the main branch 30 minutes before a product demo. You are the lead on call. Describe your incident response process step-by-step.' },
  ],
  debugging: [
    {
      id: 'dbg1',
      text: 'Find and fix the bug in this JavaScript function:',
      code: `function calculateAverage(arr) {
  let sum = 0;
  for (let i = 0; i <= arr.length; i++) {  // Bug here
    sum += arr[i];
  }
  return sum / arr.length;
}`,
      hint: 'Check the loop boundary condition carefully.',
      fix: 'Change i <= arr.length to i < arr.length to avoid accessing arr[arr.length] which is undefined.'
    },
  ],
  project: [
    { id: 'proj1', text: 'Explain the complete architecture of a project you\'ve built: What was the tech stack, database design, API structure, and what was the most challenging technical decision you made?' },
    { id: 'proj2', text: 'If you had to scale your current project to handle 100x more users, what architectural changes would you make and why?' },
  ],
};

const INTERVIEW_QUESTIONS = [
  { id: 'int1', text: 'Explain today\'s topic in your own words as if teaching it to a junior developer.' },
  { id: 'int2', text: 'What are the 3 most important concepts you learned today and how would you apply each in a real project?' },
  { id: 'int3', text: 'What challenges might arise when implementing this in production, and how would you mitigate them?' },
  { id: 'int4', text: 'Which algorithm or technology discussed today would you choose for a high-traffic web service and why?' },
  { id: 'int5', text: 'How can the approach taught today be improved or made more efficient?' },
];

const BADGE_DEFS = [
  { id: 'quick_thinker', icon: '⚡', label: 'Quick Thinker', desc: 'Answered in under 30 seconds', color: '#f59e0b', xp: 50 },
  { id: 'code_wizard', icon: '🧙', label: 'Code Wizard', desc: 'Perfect coding challenge score', color: '#8b5cf6', xp: 100 },
  { id: 'star_student', icon: '⭐', label: 'Star Student', desc: 'Overall score > 90%', color: '#10b981', xp: 150 },
  { id: 'perfect_attendance', icon: '📅', label: 'Perfect Attendance', desc: 'Attended 5 classes in a row', color: '#06b6d4', xp: 75 },
  { id: 'top_performer', icon: '🏆', label: 'Top Performer', desc: 'Class rank #1', color: '#ef4444', xp: 200 },
  { id: 'communicator', icon: '🗣️', label: 'Great Communicator', desc: 'Communication score > 85%', color: '#6366f1', xp: 80 },
];

const CLASS_SESSIONS = [
  { id: 1, title: 'System Design: Distributed Caching & Redis', date: 'Today 7:00 PM', instructor: 'Dr. Sarah Chen', topic: 'System Design', duration: '2 hrs', enrolled: 142, status: 'live' },
  { id: 2, title: 'Advanced React: Hooks, Context & Performance', date: 'Mon 6:00 PM', instructor: 'Prof. Raj Kumar', topic: 'React', duration: '90 min', enrolled: 89, status: 'upcoming' },
  { id: 3, title: 'Python ML: Neural Networks & Backpropagation', date: 'Wed 5:00 PM', instructor: 'Dr. Lisa Park', topic: 'Machine Learning', duration: '2.5 hrs', enrolled: 67, status: 'upcoming' },
  { id: 4, title: 'DSA: Dynamic Programming Patterns', date: 'Yesterday', instructor: 'Prof. Raj Kumar', topic: 'DSA', duration: '2 hrs', enrolled: 118, status: 'completed', score: 84 },
];

const PARTICIPANTS = [
  { id: 1, name: 'Dr. Sarah Chen', role: 'instructor', avatar: '👩‍🏫', handRaised: false, score: null, online: true },
  { id: 2, name: 'You', role: 'self', avatar: '😊', handRaised: false, score: null, online: true },
  { id: 3, name: 'Rahul Verma', role: 'student', avatar: '👨‍💻', handRaised: false, score: 92, online: true },
  { id: 4, name: 'Priya Sharma', role: 'student', avatar: '👩‍💻', handRaised: true, score: 78, online: true },
  { id: 5, name: 'Alex Johnson', role: 'student', avatar: '🧑', handRaised: false, score: 65, online: false },
  { id: 6, name: 'Meera Patel', role: 'student', avatar: '👩', handRaised: false, score: 88, online: true },
  { id: 7, name: 'Dev Singh', role: 'student', avatar: '👨', handRaised: true, score: 71, online: true },
];

const CHAT_SEED = [
  { id: 1, sender: 'Dr. Sarah Chen', role: 'instructor', text: '📡 Class starting now! Today we cover Redis-based distributed caching patterns.', time: '7:00 PM' },
  { id: 2, sender: 'Rahul Verma', role: 'student', text: 'Excited for this session! Struggled with cache invalidation last week.', time: '7:01 PM' },
  { id: 3, sender: 'Dr. Sarah Chen', role: 'instructor', text: 'Perfect — that is exactly what we\'ll tackle today with practical examples. 💡', time: '7:02 PM' },
  { id: 4, sender: 'Priya Sharma', role: 'student', text: 'Is the session being recorded?', time: '7:03 PM' },
  { id: 5, sender: 'System', role: 'system', text: '🤖 AI Question scheduled in 8 minutes. Stay engaged!', time: '7:04 PM' },
];

// ─── Sub-components ────────────────────────────────────────────────────────

const ScoreBadge = ({ score, size = 'md' }) => {
  const color = score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';
  const fs = size === 'lg' ? 22 : size === 'sm' ? 10 : 14;
  const pd = size === 'lg' ? '8px 16px' : size === 'sm' ? '2px 6px' : '4px 10px';
  return (
    <span style={{ background: color + '22', color, border: `1px solid ${color}44`, padding: pd, borderRadius: 20, fontSize: fs, fontWeight: 700 }}>
      {score}%
    </span>
  );
};

const XPBar = ({ xp, level }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700, minWidth: 60 }}>Lv.{level} ⚡{xp} XP</span>
    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(xp % 500) / 5}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: 3 }}
      />
    </div>
    <span style={{ fontSize: 10, color: '#64748b' }}>{500 - (xp % 500)} XP to next</span>
  </div>
);

const ProgressRing = ({ value, size = 80, stroke = 7, color = '#6366f1', label }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: -size / 2 - 12, left: '50%', transform: 'translateX(-50%)', fontSize: 15, fontWeight: 800, color: '#fff' }}>{value}%</div>
      </div>
      {label && <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: size / 2 - 10 }}>{label}</div>}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const LiveClassAssessment = () => {
  const [view, setView] = useState('lobby'); // lobby | live | post-interview | results | history
  const [activeSession, setActiveSession] = useState(null);
  const [liveTab, setLiveTab] = useState('chat'); // chat | participants | quiz | whiteboard
  const [chatMessages, setChatMessages] = useState(CHAT_SEED);
  const [chatInput, setChatInput] = useState('');
  const [participants, setParticipants] = useState(PARTICIPANTS);
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questionPhase, setQuestionPhase] = useState('idle'); // idle | countdown | active | feedback
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [fillAnswer, setFillAnswer] = useState('');
  const [shortAnswer, setShortAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState('');
  const [codeRunResult, setCodeRunResult] = useState(null);
  const [questionTimer, setQuestionTimer] = useState(60);
  const [isCorrect, setIsCorrect] = useState(null);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [pollActive, setPollActive] = useState(false);
  const [pollVotes, setPollVotes] = useState([42, 31, 18, 9]);
  const [pollVoted, setPollVoted] = useState(false);

  // Post-class interview
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewStep, setInterviewStep] = useState(0);
  const [interviewAnswers, setInterviewAnswers] = useState([]);
  const [interviewInput, setInterviewInput] = useState('');

  // Results & scores
  const [scores, setScores] = useState(null);
  const [sessionHistory] = useState([
    { id: 101, title: 'DSA: Dynamic Programming', date: '2 days ago', overall: 84, knowledge: 88, coding: 79, comm: 82 },
    { id: 102, title: 'React: Hooks Deep Dive', date: '5 days ago', overall: 91, knowledge: 94, coding: 90, comm: 87 },
    { id: 103, title: 'System Design: Load Balancing', date: '1 week ago', overall: 76, knowledge: 80, coding: 72, comm: 74 },
  ]);

  const [xp, setXp] = useState(1240);
  const [level, setLevel] = useState(6);
  const [badges, setBadges] = useState([BADGE_DEFS[3], BADGE_DEFS[1]]);

  const chatEndRef = useRef(null);
  const timerRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Question timer countdown
  useEffect(() => {
    if (questionPhase === 'active' && questionTimer > 0) {
      timerRef.current = setTimeout(() => setQuestionTimer(t => t - 1), 1000);
    } else if (questionPhase === 'active' && questionTimer === 0) {
      handleSubmitAnswer();
    }
    return () => clearTimeout(timerRef.current);
  }, [questionPhase, questionTimer]);

  const launchRandomQuestion = useCallback(() => {
    const types = Object.keys(QUESTION_BANK);
    const type = types[Math.floor(Math.random() * types.length)];
    const pool = QUESTION_BANK[type];
    const q = { ...pool[Math.floor(Math.random() * pool.length)], qType: type };
    setActiveQuestion(q);
    setSelectedAnswer(null);
    setFillAnswer('');
    setShortAnswer('');
    setCodeAnswer(q.stub || '');
    setCodeRunResult(null);
    setIsCorrect(null);
    setQuestionTimer(type === 'coding' ? 120 : type === 'short' ? 90 : 60);
    setQuestionPhase('countdown');
    setTimeout(() => setQuestionPhase('active'), 3000);
    // Add system message to chat
    setChatMessages(prev => [...prev, {
      id: Date.now(), sender: 'AI System', role: 'system',
      text: `🤖 AI Question popped! Type: ${type.toUpperCase()} — Answer in the Quiz tab!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setLiveTab('quiz');
  }, []);

  const handleSubmitAnswer = useCallback(() => {
    if (!activeQuestion) return;
    clearTimeout(timerRef.current);

    let correct = false;
    const type = activeQuestion.qType;

    if (type === 'mcq') correct = selectedAnswer === activeQuestion.answer;
    else if (type === 'truefalse') correct = selectedAnswer === (activeQuestion.answer ? 0 : 1);
    else if (type === 'fill') correct = fillAnswer.toLowerCase().trim() === activeQuestion.answer.toLowerCase();
    else if (type === 'short' || type === 'scenario' || type === 'project') correct = shortAnswer.length > 50;
    else if (type === 'coding') correct = codeRunResult?.passed || codeAnswer.length > 60;
    else if (type === 'debugging') correct = shortAnswer.length > 30;

    const gained = correct ? (questionTimer > 30 ? 75 : 50) : 20;
    setIsCorrect(correct);
    setEarnedXP(gained);
    setXp(prev => prev + gained);
    setQuestionPhase('feedback');

    // Possibly earn a badge
    if (correct && questionTimer > 45 && !badges.find(b => b.id === 'quick_thinker')) {
      const badge = BADGE_DEFS[0];
      setBadges(prev => [...prev, badge]);
      setEarnedBadges(prev => [...prev, badge]);
    }
  }, [activeQuestion, selectedAnswer, fillAnswer, shortAnswer, codeAnswer, codeRunResult, questionTimer, badges]);

  const handleRunCode = () => {
    const hasReturn = codeAnswer.includes('return');
    const hasLoop = codeAnswer.includes('for') || codeAnswer.includes('while');
    const passed = hasReturn && (codeAnswer.length > 60);
    setCodeRunResult({
      passed,
      passCount: passed ? 3 : 1,
      totalCount: 3,
      executionTime: `${(Math.random() * 15 + 5).toFixed(1)} ms`,
      memoryUsed: `${(Math.random() * 5 + 12).toFixed(1)} MB`,
      logs: passed
        ? ['✓ Test 1 Passed: "hello" → "olleh"', '✓ Test 2 Passed: "JavaScript" → "tpircSavaJ"', '✓ Test 3 Passed: "" → ""']
        : ['✓ Test 1 Passed: "hello" → "olleh"', '✗ Test 2 Failed: incorrect output', '✗ Test 3 Failed: edge case error'],
    });
  };

  const sendChat = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now(), sender: 'You', role: 'self',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatInput('');
  };

  const handleRaiseHand = () => {
    const next = !handRaised;
    setHandRaised(next);
    if (next) {
      setChatMessages(prev => [...prev, {
        id: Date.now(), sender: 'System', role: 'system',
        text: '✋ You raised your hand.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const submitInterviewAnswer = () => {
    if (!interviewInput.trim()) return;
    const updated = [...interviewAnswers, { q: INTERVIEW_QUESTIONS[interviewStep].text, a: interviewInput }];
    setInterviewAnswers(updated);
    setInterviewInput('');
    if (interviewStep + 1 < INTERVIEW_QUESTIONS.length) {
      setInterviewStep(s => s + 1);
    } else {
      // Calculate final scores
      const avgLen = updated.reduce((s, i) => s + i.a.length, 0) / updated.length;
      const knowledge = Math.min(100, Math.round(72 + (avgLen > 200 ? 20 : avgLen > 80 ? 12 : 4)));
      const comm = Math.min(100, Math.round(75 + (avgLen > 150 ? 15 : 8)));
      const overall = Math.round((knowledge + comm + 78 + 81) / 4);
      const certEligible = overall >= 75;

      setScores({
        knowledge,
        technical: 78,
        coding: 81,
        communication: comm,
        problemSolving: 76,
        confidence: 79,
        participation: 85,
        attendance: 95,
        practical: 77,
        overall,
        certEligible,
        earnedBadges: overall >= 90 ? [...badges, BADGE_DEFS[2]] : badges,
        xpGained: overall >= 90 ? 350 : 200,
        strengths: ['Strong conceptual explanation', 'Practical application thinking', 'Clear structured answers'],
        weaknesses: ['Could elaborate more on edge cases', 'System design depth needs work'],
        missingSkills: ['Distributed Caching Invalidation', 'Redis Cluster Config', 'CAP Theorem trade-offs'],
        topicsToRevise: ['Consistent Hashing', 'Write-Through vs Write-Behind Cache', 'LRU Cache Implementation'],
        courses: ['Redis & Caching Mastery', 'Distributed Systems Design Patterns', 'System Design Interview Pro'],
        tips: ['Always state assumptions before answering system design questions', 'Use diagrams to explain architecture', 'Quantify your answers with estimates (100k QPS, 1TB storage)'],
        rankInClass: 3,
      });
      if (certEligible) setEarnedBadges(prev => [...prev, BADGE_DEFS[2]]);
      setView('results');
    }
  };

  const s = { color: '#fff', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' };

  // ─── VIEWS ──────────────────────────────────────────────────────────────────

  // LOBBY
  if (view === 'lobby') return (
    <div style={{ color: '#fff', fontFamily: "'Inter', 'Segoe UI', sans-serif", minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.10))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>🎓</span>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Live Class Assessment Hub
              </h1>
            </div>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>AI-powered live learning with real-time knowledge evaluation, coding challenges, and instant feedback</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
            <XPBar xp={xp} level={level} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {badges.map(b => (
                <motion.span key={b.id} title={b.desc} whileHover={{ scale: 1.2 }}
                  style={{ fontSize: 18, cursor: 'default', filter: 'drop-shadow(0 0 6px ' + b.color + ')' }}>
                  {b.icon}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { icon: '📅', label: 'Attendance', value: '95%', color: '#10b981' },
          { icon: '📊', label: 'Avg Score', value: '84%', color: '#6366f1' },
          { icon: '🏆', label: 'Class Rank', value: '#3', color: '#f59e0b' },
          { icon: '⭐', label: 'Badges', value: badges.length, color: '#ec4899' },
          { icon: '⚡', label: 'Total XP', value: xp.toLocaleString(), color: '#f59e0b' },
        ].map((st, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${st.color}22`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{st.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: st.color }}>{st.value}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{st.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Live & Upcoming Sessions */}
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: '#e2e8f0' }}>🟢 Live & Upcoming Sessions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {CLASS_SESSIONS.map((cs, i) => (
          <motion.div key={cs.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            style={{
              background: cs.status === 'live' ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${cs.status === 'live' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 14, padding: '18px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap'
            }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: cs.status === 'live' ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                {cs.status === 'live' ? '🔴' : cs.status === 'upcoming' ? '📅' : '✅'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{cs.title}</span>
                  {cs.status === 'live' && (
                    <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, letterSpacing: 0.5 }}>LIVE</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  👩‍🏫 {cs.instructor} • 🕐 {cs.date} • ⏱ {cs.duration} • 👥 {cs.enrolled} enrolled
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {cs.score && <ScoreBadge score={cs.score} />}
              {cs.status !== 'completed' && (
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setActiveSession(cs); setView('live'); }}
                  style={{
                    padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
                    background: cs.status === 'live' ? '#ef4444' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff'
                  }}>
                  {cs.status === 'live' ? '🔴 Join Live' : '📋 Register'}
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* History */}
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: '#e2e8f0' }}>📚 Past Session Performance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
        {sessionHistory.map((sh, i) => (
          <motion.div key={sh.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 }}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: '#fff' }}>{sh.title}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>📅 {sh.date}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Knowledge', value: sh.knowledge },
                { label: 'Coding', value: sh.coding },
                { label: 'Communication', value: sh.comm },
                { label: 'Overall', value: sh.overall },
              ].map((m, j) => (
                <div key={j} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: m.value >= 85 ? '#10b981' : m.value >= 70 ? '#f59e0b' : '#ef4444' }}>{m.value}%</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // LIVE CLASS VIEW
  if (view === 'live') return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', background: '#09090b', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Bar */}
        <div style={{ height: 56, background: '#12121a', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', letterSpacing: 1 }}>LIVE</span>
            </div>
            <span style={{ color: '#64748b', fontSize: 12 }}>|</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{activeSession?.title || 'System Design: Distributed Caching'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>👥 {participants.length} participants</span>
            <ScoreBadge score={xp > 1300 ? 88 : 76} size="sm" />
            <XPBar xp={xp} level={level} />
          </div>
        </div>

        {/* Video + Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, gap: 12, overflow: 'hidden', minHeight: 0 }}>

          {/* Main Screen */}
          <div style={{ flex: 1, background: '#181825', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', minHeight: 0 }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: 'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1920&auto=format")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>👩‍🏫</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Dr. Sarah Chen's Screen</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>📊 Distributed Caching Architecture with Redis</div>
            </div>

            {/* AI Question Banner */}
            <AnimatePresence>
              {questionPhase === 'countdown' && (
                <motion.div
                  initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
                  style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '12px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15, boxShadow: '0 8px 32px rgba(99,102,241,0.5)', whiteSpace: 'nowrap' }}>
                  🤖 AI Question in 3... switch to Quiz tab!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Poll overlay */}
            {pollActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 14, padding: 20, width: 260, backdropFilter: 'blur(12px)' }}>
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>📊 Quick Poll: Which cache invalidation strategy is most practical?</div>
                {['Write-Through', 'Write-Behind', 'Cache-Aside', 'Read-Through'].map((opt, i) => (
                  <div key={i} onClick={() => !pollVoted && (setPollVotes(v => { const c = [...v]; c[i] += 1; return c; }), setPollVoted(true))}
                    style={{ marginBottom: 8, cursor: pollVoted ? 'default' : 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                      <span style={{ color: pollVoted ? '#a5b4fc' : '#94a3b8' }}>{opt}</span>
                      {pollVoted && <span style={{ color: '#f59e0b', fontWeight: 700 }}>{Math.round(pollVotes[i] / pollVotes.reduce((a, b) => a + b, 0) * 100)}%</span>}
                    </div>
                    {pollVoted && (
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round(pollVotes[i] / pollVotes.reduce((a, b) => a + b, 0) * 100)}%` }}
                          style={{ height: '100%', background: i === 0 ? '#6366f1' : i === 1 ? '#10b981' : i === 2 ? '#f59e0b' : '#ec4899', borderRadius: 3 }} />
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Participant Strip */}
          <div style={{ height: 90, display: 'flex', gap: 10, overflowX: 'auto', flexShrink: 0 }}>
            {participants.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                style={{ width: 140, flexShrink: 0, background: '#181825', borderRadius: 10, border: p.role === 'self' ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.07)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 26 }}>{p.avatar}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{p.name.split(' ')[0]}</div>
                {p.handRaised && <div style={{ position: 'absolute', top: 4, right: 6, fontSize: 14 }}>✋</div>}
                {!p.online && <div style={{ position: 'absolute', top: 4, left: 6, width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />}
                {p.score && <ScoreBadge score={p.score} size="sm" />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ height: 72, background: '#12121a', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { icon: micOn ? '🎤' : '🔇', label: micOn ? 'Mute' : 'Unmute', action: () => setMicOn(m => !m), active: micOn, danger: !micOn },
              { icon: videoOn ? '📷' : '📵', label: videoOn ? 'Stop Video' : 'Start Video', action: () => setVideoOn(v => !v), active: videoOn, danger: !videoOn },
              { icon: '🖥️', label: 'Share Screen', action: () => {}, active: false },
              { icon: handRaised ? '✋' : '🖐️', label: handRaised ? 'Lower Hand' : 'Raise Hand', action: handleRaiseHand, active: handRaised },
            ].map((btn, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <button onClick={btn.action} style={{ width: 42, height: 42, borderRadius: '50%', background: btn.danger ? 'rgba(239,68,68,0.15)' : btn.active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${btn.danger ? 'rgba(239,68,68,0.3)' : btn.active ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`, fontSize: 16, cursor: 'pointer' }}>
                  {btn.icon}
                </button>
                <span style={{ fontSize: 9, color: '#64748b' }}>{btn.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <motion.button whileHover={{ scale: 1.05 }} onClick={launchRandomQuestion}
              style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              🤖 AI Question
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setPollActive(p => !p)}
              style={{ padding: '10px 18px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10b981', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              📊 Poll
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setView('post-interview')}
              style={{ padding: '10px 18px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              📋 End & Assess
            </motion.button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div style={{ width: 320, background: '#12121a', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          {[
            { id: 'chat', icon: '💬', label: 'Chat' },
            { id: 'participants', icon: '👥', label: 'People' },
            { id: 'quiz', icon: '🤖', label: 'Quiz' },
            { id: 'whiteboard', icon: '🖊️', label: 'Board' },
          ].map(t => (
            <button key={t.id} onClick={() => setLiveTab(t.id)}
              style={{ flex: 1, padding: '12px 4px', background: 'transparent', border: 'none', borderBottom: `2px solid ${liveTab === t.id ? '#6366f1' : 'transparent'}`, color: liveTab === t.id ? '#fff' : '#64748b', fontSize: 10, fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>

          {/* CHAT TAB */}
          {liveTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
                {chatMessages.map((m) => (
                  <div key={m.id} style={{ alignSelf: m.role === 'self' ? 'flex-end' : m.role === 'system' ? 'center' : 'flex-start', maxWidth: '90%' }}>
                    {m.role === 'system' ? (
                      <div style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '6px 12px', fontSize: 11, color: '#a5b4fc', textAlign: 'center' }}>{m.text}</div>
                    ) : (
                      <>
                        <div style={{ fontSize: 10, color: m.role === 'instructor' ? '#10b981' : '#94a3b8', marginBottom: 3, textAlign: m.role === 'self' ? 'right' : 'left' }}>
                          {m.sender} • {m.time}
                        </div>
                        <div style={{ background: m.role === 'self' ? '#6366f1' : 'rgba(255,255,255,0.06)', padding: '9px 13px', borderRadius: 10, fontSize: 13, lineHeight: 1.5, color: '#fff' }}>
                          {m.text}
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#181825', flexShrink: 0 }}>
                <form onSubmit={sendChat} style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '6px 6px 6px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Send a message..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 13, outline: 'none' }} />
                  <button type="submit" style={{ width: 30, height: 30, borderRadius: 6, background: '#6366f1', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer' }}>➤</button>
                </form>
              </div>
            </div>
          )}

          {/* PARTICIPANTS TAB */}
          {liveTab === 'participants' && (
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {participants.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: p.role === 'self' ? 'rgba(99,102,241,0.1)' : 'transparent', border: p.role === 'self' ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: p.role === 'instructor' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, position: 'relative' }}>
                      {p.avatar}
                      {!p.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#64748b', border: '1.5px solid #12121a' }} />}
                      {p.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#10b981', border: '1.5px solid #12121a' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: p.role === 'instructor' ? '#10b981' : '#fff' }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>{p.role === 'instructor' ? 'Instructor' : p.role === 'self' ? 'You' : 'Student'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.handRaised && <span style={{ fontSize: 14 }}>✋</span>}
                    {p.score && <ScoreBadge score={p.score} size="sm" />}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* QUIZ TAB */}
          {liveTab === 'quiz' && (
            <div style={{ padding: 16 }}>
              {questionPhase === 'idle' && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>AI Quiz Ready</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Click "AI Question" below or wait for the instructor to trigger a question.</div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={launchRandomQuestion}
                    style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    🎲 Launch Random Question
                  </motion.button>
                </div>
              )}

              {questionPhase === 'countdown' && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  style={{ textAlign: 'center', padding: '30px 0' }}>
                  <div style={{ fontSize: 52 }}>🤖</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#a5b4fc', marginTop: 12 }}>Question incoming!</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>Get ready to answer...</div>
                </motion.div>
              )}

              {(questionPhase === 'active' || questionPhase === 'feedback') && activeQuestion && (
                <div>
                  {/* Timer & Type */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase' }}>
                      {activeQuestion.qType}
                    </span>
                    {questionPhase === 'active' && (
                      <span style={{ fontSize: 14, fontWeight: 800, color: questionTimer < 15 ? '#ef4444' : '#f59e0b' }}>
                        ⏱ {questionTimer}s
                      </span>
                    )}
                    {questionPhase === 'feedback' && (
                      <span style={{ fontSize: 13, fontWeight: 700, color: isCorrect ? '#10b981' : '#ef4444' }}>
                        {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                      </span>
                    )}
                  </div>

                  {/* Timer bar */}
                  {questionPhase === 'active' && (
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
                      <motion.div style={{ height: '100%', background: questionTimer < 15 ? '#ef4444' : '#6366f1', borderRadius: 2, width: `${(questionTimer / 60) * 100}%` }} transition={{ duration: 0.9 }} />
                    </div>
                  )}

                  {/* Question Text */}
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.6, marginBottom: 16 }}>{activeQuestion.text}</div>

                  {/* MCQ Options */}
                  {activeQuestion.qType === 'mcq' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {activeQuestion.options.map((opt, idx) => {
                        let bg = 'rgba(255,255,255,0.04)';
                        let border = 'rgba(255,255,255,0.08)';
                        if (questionPhase === 'feedback') {
                          if (idx === activeQuestion.answer) { bg = 'rgba(16,185,129,0.12)'; border = '#10b981'; }
                          else if (idx === selectedAnswer) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; }
                        } else if (selectedAnswer === idx) {
                          bg = 'rgba(99,102,241,0.15)'; border = '#6366f1';
                        }
                        return (
                          <button key={idx} onClick={() => questionPhase === 'active' && setSelectedAnswer(idx)}
                            style={{ ...s, background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '10px 14px', textAlign: 'left', color: '#fff', fontSize: 13, cursor: questionPhase === 'feedback' ? 'default' : 'pointer', transition: '0.2s' }}>
                            <span style={{ color: '#a5b4fc', fontWeight: 700, marginRight: 8 }}>{String.fromCharCode(65 + idx)}.</span> {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* True/False */}
                  {activeQuestion.qType === 'truefalse' && (
                    <div style={{ display: 'flex', gap: 12 }}>
                      {['True', 'False'].map((opt, idx) => (
                        <button key={idx} onClick={() => questionPhase === 'active' && setSelectedAnswer(idx)}
                          style={{ ...s, flex: 1, padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700, border: `2px solid ${selectedAnswer === idx ? (idx === 0 ? '#10b981' : '#ef4444') : 'rgba(255,255,255,0.1)'}`, background: selectedAnswer === idx ? (idx === 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)') : 'rgba(255,255,255,0.04)', color: idx === 0 ? '#10b981' : '#ef4444' }}>
                          {idx === 0 ? '✅ True' : '❌ False'}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Fill in blank */}
                  {activeQuestion.qType === 'fill' && (
                    <input value={fillAnswer} onChange={e => setFillAnswer(e.target.value)} disabled={questionPhase === 'feedback'}
                      placeholder="Type your answer..." style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  )}

                  {/* Short Answer */}
                  {(activeQuestion.qType === 'short' || activeQuestion.qType === 'scenario' || activeQuestion.qType === 'project') && (
                    <textarea value={shortAnswer} onChange={e => setShortAnswer(e.target.value)} disabled={questionPhase === 'feedback'}
                      rows={5} placeholder="Write your answer in 2-4 sentences..."
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }} />
                  )}

                  {/* Debugging */}
                  {activeQuestion.qType === 'debugging' && (
                    <div>
                      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12, marginBottom: 10, fontFamily: 'monospace', fontSize: 12, color: '#e2e8f0', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{activeQuestion.code}</div>
                      <textarea value={shortAnswer} onChange={e => setShortAnswer(e.target.value)} disabled={questionPhase === 'feedback'}
                        rows={3} placeholder="Describe the bug and your fix..."
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                    </div>
                  )}

                  {/* Coding */}
                  {activeQuestion.qType === 'coding' && (
                    <div>
                      <textarea value={codeAnswer} onChange={e => setCodeAnswer(e.target.value)} disabled={questionPhase === 'feedback'}
                        rows={8} spellCheck={false}
                        style={{ width: '100%', background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '12px 14px', color: '#e2e8f0', fontSize: 12, fontFamily: 'Fira Code, monospace', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }} />
                      {questionPhase === 'active' && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <select style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', padding: '6px 10px', fontSize: 12 }}>
                            <option value="js">JavaScript</option>
                            <option value="py">Python</option>
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                          </select>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRunCode}
                            style={{ padding: '6px 16px', background: '#10b981', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                            ▶ Run
                          </motion.button>
                        </div>
                      )}
                      {codeRunResult && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          style={{ marginTop: 10, background: codeRunResult.passed ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${codeRunResult.passed ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 8, padding: 12 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: codeRunResult.passed ? '#10b981' : '#ef4444', marginBottom: 6 }}>
                            {codeRunResult.passed ? '✅' : '⚠️'} {codeRunResult.passCount}/{codeRunResult.totalCount} tests passed
                          </div>
                          {codeRunResult.logs.map((l, i) => (
                            <div key={i} style={{ fontSize: 11, color: l.startsWith('✓') ? '#10b981' : '#ef4444', fontFamily: 'monospace', lineHeight: 1.6 }}>{l}</div>
                          ))}
                          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>⏱ {codeRunResult.executionTime}</span>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>💾 {codeRunResult.memoryUsed}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Feedback panel */}
                  {questionPhase === 'feedback' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: 14, background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: 10, padding: 14 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: isCorrect ? '#10b981' : '#ef4444' }}>
                        {isCorrect ? '🎉 Excellent! +' + earnedXP + ' XP' : '📖 Learning Moment! +' + earnedXP + ' XP for trying'}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 10 }}>
                        {activeQuestion.explanation || activeQuestion.modelAnswer || activeQuestion.fix || 'Great attempt! Review the concept and try the next question.'}
                      </div>
                      {activeQuestion.qType === 'fill' && <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>✅ Answer: {activeQuestion.answer}</div>}
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(99,102,241,0.1)', borderRadius: 6, fontSize: 11, color: '#a5b4fc' }}>
                        💡 Recommended: Deep-dive into related concepts in your course materials and practice 2-3 similar questions today.
                      </div>
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => { setQuestionPhase('idle'); setActiveQuestion(null); }}
                        style={{ marginTop: 12, width: '100%', padding: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                        Next Question →
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Submit button */}
                  {questionPhase === 'active' && activeQuestion.qType !== 'coding' && (
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleSubmitAnswer}
                      style={{ marginTop: 14, width: '100%', padding: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                      Submit Answer ✓
                    </motion.button>
                  )}
                  {questionPhase === 'active' && activeQuestion.qType === 'coding' && (
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleSubmitAnswer}
                      style={{ marginTop: 8, width: '100%', padding: '12px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 8, color: '#a5b4fc', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                      Submit Solution ✓
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* WHITEBOARD TAB */}
          {liveTab === 'whiteboard' && (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>🖊️ Class Notes & Whiteboard</div>
              <textarea placeholder="Type class notes, diagram ideas, or key takeaways here..." rows={12}
                style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 14, color: '#fff', fontSize: 13, outline: 'none', resize: 'none', lineHeight: 1.7 }} />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['📌 Redis is in-memory', '⚡ O(1) lookup time', '🔁 LRU eviction policy', '🌐 Distributed across nodes'].map((note, i) => (
                  <span key={i} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: 11, padding: '4px 10px', borderRadius: 20, cursor: 'pointer' }}>{note}</span>
                ))}
              </div>
              <button style={{ padding: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10b981', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                💾 Save Notes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // POST-CLASS AI INTERVIEW
  if (view === 'post-interview') return (
    <div style={{ maxWidth: 720, margin: '0 auto', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '28px 32px', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎤</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: '#a5b4fc' }}>Post-Class AI Interview</h2>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>The class is over! Answer {INTERVIEW_QUESTIONS.length} short AI questions to complete your assessment and receive your score report.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          {INTERVIEW_QUESTIONS.map((_, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < interviewStep ? '#10b981' : i === interviewStep ? '#6366f1' : 'rgba(255,255,255,0.1)', transition: '0.3s' }} />
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={interviewStep} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Question {interviewStep + 1} of {INTERVIEW_QUESTIONS.length}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.5, marginTop: 2 }}>{INTERVIEW_QUESTIONS[interviewStep].text}</div>
            </div>
          </div>
          <textarea
            value={interviewInput}
            onChange={e => setInterviewInput(e.target.value)}
            rows={6}
            placeholder="Type your detailed answer here... (aim for 3-5 sentences with specific examples)"
            style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 16px', color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>{interviewInput.length} chars • Aim for 150+ for full marks</span>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} onClick={submitInterviewAnswer}
              style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              {interviewStep + 1 < INTERVIEW_QUESTIONS.length ? 'Next Question →' : '🏁 Submit & View Results'}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // RESULTS VIEW
  if (view === 'results' && scores) return (
    <div style={{ color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* Score Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: scores.overall >= 80 ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.1))' : 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: `1px solid ${scores.overall >= 80 ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.2)'}`, borderRadius: 20, padding: '28px 32px', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 52 }}>{scores.overall >= 90 ? '🏆' : scores.overall >= 80 ? '⭐' : '📊'}</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, margin: '10px 0 6px', color: scores.overall >= 80 ? '#10b981' : '#a5b4fc' }}>
          Overall Score: {scores.overall}%
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>{scores.overall >= 85 ? 'Outstanding performance! You demonstrate strong mastery.' : scores.overall >= 75 ? 'Good performance! Keep building on these fundamentals.' : 'Good effort! Focus on the recommended areas below.'}</p>
        {scores.certEligible && (
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.15))', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>
            🎓 Certificate Eligible! Score ≥ 75% achieved
          </div>
        )}
      </motion.div>

      {/* 10-Metric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Knowledge', value: scores.knowledge, color: '#6366f1', icon: '🧠' },
          { label: 'Technical', value: scores.technical, color: '#8b5cf6', icon: '⚙️' },
          { label: 'Coding', value: scores.coding, color: '#ec4899', icon: '💻' },
          { label: 'Communication', value: scores.communication, color: '#06b6d4', icon: '🗣️' },
          { label: 'Problem Solving', value: scores.problemSolving, color: '#10b981', icon: '🧩' },
          { label: 'Confidence', value: scores.confidence, color: '#f59e0b', icon: '💪' },
          { label: 'Participation', value: scores.participation, color: '#ef4444', icon: '🤝' },
          { label: 'Attendance', value: scores.attendance, color: '#10b981', icon: '📅' },
          { label: 'Practical', value: scores.practical, color: '#6366f1', icon: '🛠️' },
          { label: 'Overall', value: scores.overall, color: '#a5b4fc', icon: '🏅', bold: true },
        ].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${m.color}22`, borderRadius: 12, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontSize: m.bold ? 24 : 20, fontWeight: 800, color: m.value >= 85 ? '#10b981' : m.value >= 70 ? '#f59e0b' : '#ef4444' }}>{m.value}%</div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{m.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Strengths */}
        <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#10b981', marginBottom: 12 }}>✅ Strengths</div>
          {scores.strengths.map((s, i) => (
            <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'flex', gap: 8 }}>
              <span style={{ color: '#10b981' }}>•</span> {s}
            </div>
          ))}
        </div>

        {/* Weaknesses */}
        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#ef4444', marginBottom: 12 }}>⚠️ Areas to Improve</div>
          {scores.weaknesses.map((w, i) => (
            <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'flex', gap: 8 }}>
              <span style={{ color: '#ef4444' }}>•</span> {w}
            </div>
          ))}
        </div>
      </div>

      {/* Missing Skills + Topics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🎯 Missing Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {scores.missingSkills.map((sk, i) => (
              <span key={i} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>{sk}</span>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>📚 Topics to Revise</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {scores.topicsToRevise.map((t, i) => (
              <span key={i} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fcd34d', fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#a5b4fc', marginBottom: 12 }}>🎓 Recommended Courses</div>
        {scores.courses.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📖</div>
            <span style={{ fontSize: 13, color: '#c7d2fe' }}>{c}</span>
          </div>
        ))}
      </div>

      {/* XP & Badges Earned */}
      <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#f59e0b', marginBottom: 14 }}>⚡ Rewards Earned This Session</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '10px 20px' }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b' }}>+{scores.xpGained} XP</span>
          </div>
          {earnedBadges.map((b, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: b.color + '15', border: `1px solid ${b.color}35`, borderRadius: 10, padding: '10px 16px' }}>
              <span style={{ fontSize: 22 }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{b.label}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{b.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificate */}
      {scores.certEligible && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', border: '2px solid rgba(245,158,11,0.4)', borderRadius: 20, padding: '28px 32px', marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🎓</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b', marginBottom: 6 }}>Course Completion Certificate</h3>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>You met the requirements: 80%+ attendance & 75%+ assessment score.</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => {
              const cert = window.open('', '_blank');
              cert.document.write(`
                <html><head><title>Certificate of Completion</title>
                <style>body{font-family:'Georgia',serif;background:linear-gradient(135deg,#0a0a1a 0%,#1a1a2e 100%);display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box;}
                .cert{background:linear-gradient(135deg,#1e1e3f,#2d1b69);border:3px solid #f59e0b;border-radius:20px;padding:50px 60px;max-width:700px;width:100%;text-align:center;box-shadow:0 0 60px rgba(245,158,11,0.2);}
                h1{color:#f59e0b;font-size:32px;margin-bottom:4px;}
                .sub{color:#94a3b8;font-size:14px;margin-bottom:30px;}
                .name{color:#fff;font-size:28px;font-weight:bold;border-bottom:2px solid #f59e0b;padding-bottom:12px;margin-bottom:24px;}
                .desc{color:#c7d2fe;font-size:16px;line-height:1.8;}
                .score{color:#10b981;font-size:22px;font-weight:bold;margin:20px 0;}
                .footer{margin-top:30px;display:flex;justify-content:space-between;align-items:flex-end;}
                .sig{color:#94a3b8;font-size:12px;}</style></head>
                <body><div class='cert'>
                <h1>🎓 Certificate of Completion</h1><div class='sub'>AI-Powered Live Class Assessment System</div>
                <div class='name'>Jothis</div>
                <div class='desc'>has successfully completed the live class session on<br><strong style='color:#a5b4fc'>System Design: Distributed Caching & Redis</strong></div>
                <div class='score'>Overall Score: ${scores.overall}% | Attendance: ${scores.attendance}%</div>
                <div class='footer'><div class='sig'>📅 ${new Date().toLocaleDateString()}</div><div style='color:#f59e0b;font-size:20px'>⭐⭐⭐</div><div class='sig'>Dr. Sarah Chen<br>Instructor</div></div>
                </div></body></html>`);
              cert.document.close();
              cert.print();
            }}
            style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 32px rgba(245,158,11,0.4)' }}>
            🖨️ Download Certificate
          </motion.button>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setView('lobby'); setInterviewStep(0); setInterviewAnswers([]); setInterviewInput(''); setScores(null); }}
          style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          ← Back to Lobby
        </motion.button>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setView('live'); setInterviewStep(0); setInterviewAnswers([]); setInterviewInput(''); setScores(null); setActiveSession(CLASS_SESSIONS[0]); }}
          style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          🔴 Rejoin Live Class
        </motion.button>
      </div>
    </div>
  );

  return null;
};

export default LiveClassAssessment;
