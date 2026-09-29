import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PLAN_DATA = {
  30: [
    { title: 'Week 1: DSA Foundations & Resume Audit', tasks: ['Solve 15 Easy LeetCode Array/String problems', 'Complete ATS Resume Builder checklist', 'Review Big-O Space & Time complexity'] },
    { title: 'Week 2: Backend REST APIs & Capstone Start', tasks: ['Build Node.js/Express CRUD REST API', 'Integrate MongoDB database models', 'Solve 10 Medium Linked List & Stack problems'] },
    { title: 'Week 3: System Design Basics & Mock Interview', tasks: ['Study System Design Caching & Load Balancers', 'Complete 1 Live AI Mock Technical Interview', 'Solve 10 Tree & Graph coding problems'] },
    { title: 'Week 4: Portfolio Deployment & Placement Applications', tasks: ['Deploy Capstone app to Vercel/Render with Docker', 'Apply to 15 Tier-1 & Startup jobs', 'Conduct 1 HR Behavioral Interview prep session'] }
  ],
  60: [
    { title: 'Month 1: Advanced Data Structures & Algorithms', tasks: ['Master Arrays, Hash Maps, Two Pointers, Dynamic Programming', 'Solve 50 LeetCode Medium problems', 'Attend 2 Live Expert Coding Sessions'] },
    { title: 'Month 2: Full-Stack Microservices & Mock Interviews', tasks: ['Build & Deploy Full Stack E-Commerce Capstone', 'Pass 3 Mock Technical Interviews with 85%+ score', 'Publish 2 Open-Source Pull Requests'] }
  ],
  90: [
    { title: 'Phase 1 (Days 1-30): Core CS & Problem Solving', tasks: ['DSA Mastery: 75 LeetCode problems', 'DBMS, Operating Systems, Networking Fundamentals', 'Resume ATS optimization to 90%+ score'] },
    { title: 'Phase 2 (Days 31-60): Advanced Web/AI Development', tasks: ['Build 2 Production-grade Capstone Projects', 'Implement Cloud CI/CD Pipelines & Docker', 'System Design: Distributed Caching & Rate Limiting'] },
    { title: 'Phase 3 (Days 61-90): Placement Sprint & Offers', tasks: ['Daily Coding Contest challenges', '5 Comprehensive Mock Interviews', 'Submit 40 targeted job applications & referral pushes'] }
  ]
};

const PlacementPrep = () => {
  const [selectedPlan, setSelectedPlan] = useState(30);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>📅 Placement Preparation Planner</h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Automated 30-day, 60-day & 90-day structured roadmaps combining courses, DSA, projects, and interviews</p>
      </div>

      {/* Plan Selectors */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        {[30, 60, 90].map(days => (
          <button
            key={days}
            onClick={() => setSelectedPlan(days)}
            style={{
              flex: 1, padding: '16px', borderRadius: 14, cursor: 'pointer', border: '1px solid',
              background: selectedPlan === days ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))' : 'rgba(255,255,255,0.04)',
              borderColor: selectedPlan === days ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)',
              color: selectedPlan === days ? '#fff' : '#94a3b8', transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, color: selectedPlan === days ? '#a5b4fc' : '#64748b' }}>{days}-Day Sprint</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>{days === 30 ? 'Fast Track Prep' : days === 60 ? 'Comprehensive Growth' : 'Complete Job Readiness'}</div>
          </button>
        ))}
      </div>

      {/* Timeline View */}
      <div style={{ display: 'grid', gap: 16 }}>
        {PLAN_DATA[selectedPlan].map((phase, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{phase.title}</h3>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', fontWeight: 600 }}>Active Phase</span>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {phase.tasks.map((task, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
                  <input type="checkbox" style={{ accentColor: '#6366f1', width: 16, height: 16, cursor: 'pointer' }} />
                  <span style={{ color: '#cbd5e1', fontSize: 13 }}>{task}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PlacementPrep;
