import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize,
  Settings, MessageSquare, FileText, CheckCircle, Circle, BookOpen,
  Download, Brain, Search, Clock, Save, ArrowLeft, MoreVertical
} from 'lucide-react';

const COURSES_DATA = {
  'python-masterclass': {
    id: 'python-masterclass',
    title: 'Complete Python Pro Masterclass 2026',
    instructor: 'Dr. Angela Yu & Mosh',
    progress: 45,
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Python Basics & Environment Setup',
        duration: '45m',
        lessons: [
          { id: 'l1', title: 'What is Python & Why Learn It?', duration: '12:20', url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', type: 'video', completed: true },
          { id: 'l2', title: 'Python & VS Code Installation', duration: '10:15', url: 'https://www.youtube.com/watch?v=b093aqAZiPU', type: 'video', completed: true },
          { id: 'l3', title: 'Variables & Primitive Data Types', duration: '15:30', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', type: 'video', completed: false },
          { id: 'l4', title: 'Module 1 Quiz', duration: '10 Qs', type: 'quiz', completed: false },
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Control Flow, Functions & OOP',
        duration: '1h 30m',
        lessons: [
          { id: 'l5', title: 'If / Else Statements & Conditionals', duration: '18:40', url: 'https://www.youtube.com/watch?v=PqFKRqpHrjw', type: 'video', completed: false },
          { id: 'l6', title: 'Loops & Iterations (For & While)', duration: '22:10', url: 'https://www.youtube.com/watch?v=6iF8Xb7Z3wQ', type: 'video', completed: false },
          { id: 'l7', title: 'Object-Oriented Programming (OOP) in Python', duration: '35:00', url: 'https://www.youtube.com/watch?v=JeznW_7DlB0', type: 'video', completed: false },
          { id: 'l8', title: 'Build a Calculator App', duration: '25:00', type: 'project', completed: false },
        ]
      }
    ],
    resources: [
      { name: 'Python Cheat Sheet.pdf', size: '2.4 MB' },
      { name: 'Day 1 Source Code.zip', size: '15 KB' }
    ]
  },
  'fullstack-react': {
    id: 'fullstack-react',
    title: 'Full Stack Web Development (React + Node.js)',
    instructor: 'James Rodriguez',
    progress: 30,
    modules: [
      {
        id: 'm1',
        title: 'Module 1: HTML5, CSS3 & Modern JavaScript',
        duration: '1h 10m',
        lessons: [
          { id: 'fl1', title: 'HTML5 & CSS3 Crash Course', duration: '45:00', url: 'https://www.youtube.com/watch?v=DPnqb74Smut', type: 'video', completed: true },
          { id: 'fl2', title: 'JavaScript ES6+ Concepts You Must Know', duration: '35:12', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', type: 'video', completed: false },
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: React.js & State Management',
        duration: '2h 00m',
        lessons: [
          { id: 'fl3', title: 'React 18 Full Tutorial for Beginners', duration: '1h 20m', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', type: 'video', completed: false },
          { id: 'fl4', title: 'Node.js & Express REST API Backend', duration: '50:00', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', type: 'video', completed: false },
        ]
      }
    ],
    resources: [
      { name: 'React Component Guide.pdf', size: '3.1 MB' },
      { name: 'Fullstack Starter Repo.zip', size: '120 KB' }
    ]
  },
  'machine-learning': {
    id: 'machine-learning',
    title: 'Machine Learning & AI Engineering A-Z',
    instructor: 'Prof. Anil Sharma',
    progress: 20,
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Machine Learning Foundations',
        duration: '1h 45m',
        lessons: [
          { id: 'ml1', title: 'Machine Learning Course for Beginners', duration: '1h 10m', url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg', type: 'video', completed: true },
          { id: 'ml2', title: 'Supervised vs Unsupervised Learning', duration: '35:00', url: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI', type: 'video', completed: false },
        ]
      }
    ],
    resources: [
      { name: 'ML Formulas & Cheatsheet.pdf', size: '4.5 MB' }
    ]
  },
  'sql-mastery': {
    id: 'sql-mastery',
    title: 'SQL & Database Design Masterclass',
    instructor: 'Raj Patel',
    progress: 50,
    modules: [
      {
        id: 'm1',
        title: 'Module 1: SQL Basics & Queries',
        duration: '1h 00m',
        lessons: [
          { id: 'sq1', title: 'SQL Tutorial - Full Database Course', duration: '1h 00m', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', type: 'video', completed: true },
          { id: 'sq2', title: 'SQL Joins & Complex Queries', duration: '40:00', url: 'https://www.youtube.com/watch?v=9Pzj7Aj231g', type: 'video', completed: false },
        ]
      }
    ],
    resources: [
      { name: 'SQL Query Guide.pdf', size: '1.8 MB' }
    ]
  }
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return 'https://www.youtube.com/embed/kqtD5dpn9C8?autoplay=1&rel=0';
  let videoId = 'kqtD5dpn9C8';
  if (url.includes('v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('embed/')) {
    videoId = url.split('embed/')[1]?.split('?')[0];
  }
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
};

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  
  const course = COURSES_DATA[id] || COURSES_DATA['python-masterclass'];
  const [activeLesson, setActiveLesson] = useState(course.modules[0].lessons[0]);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');
  const [expandedModules, setExpandedModules] = useState(['m1']);
  const [isSaved, setIsSaved] = useState(false);

  const toggleModule = (modId) => {
    setExpandedModules(prev => 
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    setIsSaved(false);
    // Mock auto-save
    setTimeout(() => setIsSaved(true), 1500);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f1a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ─── LEFT PANE: VIDEO & TABS ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* TOP BAR */}
        <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 24px', background: '#1e1e2e', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 16 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{course.title}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{activeLesson.title}</div>
          </div>
        </div>

        {/* VIDEO PLAYER AREA */}
        <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
          {activeLesson.type === 'video' ? (
            <iframe
              key={activeLesson.id}
              src={getYouTubeEmbedUrl(activeLesson.url)}
              title={activeLesson.title}
              width="100%"
              height="100%"
              style={{ border: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'linear-gradient(135deg, #1e1e2e, #181825)' }}>
              <Brain size={64} color="#6366f1" style={{ marginBottom: 16 }} />
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{activeLesson.title}</h2>
              <button style={{ padding: '12px 32px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Start Assessment
              </button>
            </div>
          )}
        </div>

        {/* TABS MENU */}
        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#1e1e2e' }}>
          {['Overview', 'Transcript', 'Notes', 'Resources', 'AI Summary'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
              style={{
                padding: '16px 20px', background: 'transparent', border: 'none', 
                color: activeTab === tab.toLowerCase() ? '#fff' : '#94a3b8', 
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                borderBottom: `2px solid ${activeTab === tab.toLowerCase() ? '#6366f1' : 'transparent'}`,
                transition: 'all 0.2s'
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div style={{ padding: '32px 24px', flex: 1, background: '#0f0f1a' }}>
          {activeTab === 'overview' && (
            <div style={{ maxWidth: 800 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{activeLesson.title}</h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: 24 }}>
                In this lesson, we will cover the fundamentals of {activeLesson.title}. By the end of this video, you will understand the core concepts and be able to implement them in your own projects.
              </p>
              <div style={{ display: 'flex', gap: 24, padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Instructor</div>
                  <div style={{ fontWeight: 600 }}>👨‍🏫 {course.instructor}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Duration</div>
                  <div style={{ fontWeight: 600 }}>⏱️ {activeLesson.duration}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>XP Points</div>
                  <div style={{ fontWeight: 600, color: '#f59e0b' }}>⭐ +50 XP</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transcript' && (
            <div style={{ maxWidth: 800 }}>
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <Search size={16} style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
                <input type="text" placeholder="Search transcript..." style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                {[
                  { time: '0:00', text: 'Hello everyone and welcome back to the course. Today we are looking at Python basics.' },
                  { time: '1:15', text: 'If you remember from the last lesson, we discussed how important syntax is.' },
                  { time: '2:30', text: 'Let\'s open up our IDE and write our very first print statement.' },
                  { time: '4:05', text: 'Notice how the output appears immediately in the console below.' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, cursor: 'pointer', padding: 8, borderRadius: 8, _hover: { background: 'rgba(255,255,255,0.05)' } }}>
                    <span style={{ color: '#6366f1', fontWeight: 600, fontSize: 14, width: 40 }}>{t.time}</span>
                    <span style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div style={{ maxWidth: 800, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>My Notes for {activeLesson.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isSaved ? <><CheckCircle size={14} color="#10b981" /> Saved to cloud</> : <><Save size={14} /> Saving...</>}
                </div>
              </div>
              <textarea 
                value={notes}
                onChange={handleNotesChange}
                placeholder="Type your notes here... They will be automatically saved."
                style={{ width: '100%', flex: 1, minHeight: 400, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 20, color: '#e2e8f0', fontSize: 15, lineHeight: 1.6, outline: 'none', resize: 'none' }}
              />
            </div>
          )}

          {activeTab === 'resources' && (
            <div style={{ maxWidth: 800 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Downloadable Materials</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {course.resources.map((res, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FileText color="#a5b4fc" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{res.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{res.size}</div>
                      </div>
                    </div>
                    <button style={{ padding: '8px', background: 'rgba(99,102,241,0.1)', borderRadius: 8, color: '#a5b4fc', border: 'none', cursor: 'pointer' }}>
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai summary' && (
            <div style={{ maxWidth: 800 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, background: 'linear-gradient(90deg, rgba(99,102,241,0.1), transparent)', padding: 16, borderRadius: 12 }}>
                <Brain color="#6366f1" size={24} />
                <div style={{ fontSize: 14, fontWeight: 600, color: '#a5b4fc' }}>AI Generated Key Takeaways</div>
              </div>
              <ul style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: 14, paddingLeft: 20 }}>
                <li style={{ marginBottom: 12 }}>Python is an interpreted, high-level, general-purpose programming language.</li>
                <li style={{ marginBottom: 12 }}>It uses indentation to define code blocks, which makes it highly readable.</li>
                <li style={{ marginBottom: 12 }}>The print() function is the most basic way to output data to the console.</li>
                <li>Variables in Python do not need explicit declaration to reserve memory space.</li>
              </ul>
              <div style={{ marginTop: 32, padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 12, textAlign: 'center' }}>
                <h4 style={{ fontSize: 14, marginBottom: 8 }}>Ready to test your knowledge?</h4>
                <button style={{ padding: '8px 20px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Generate AI Flashcards</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT PANE: COURSE CONTENT SIDEBAR ─── */}
      <div style={{ width: 360, background: '#181825', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Course Content</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 8 }}>
            <span>{course.progress}% Completed</span>
            <span>12/84 Lessons</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${course.progress}%`, background: '#6366f1' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {course.modules.map(mod => (
            <div key={mod.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div 
                onClick={() => toggleModule(mod.id)}
                style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: expandedModules.includes(mod.id) ? 'rgba(255,255,255,0.02)' : 'transparent' }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: expandedModules.includes(mod.id) ? '#fff' : '#cbd5e1', marginBottom: 4 }}>{mod.title}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{mod.lessons.length} lessons • {mod.duration}</div>
                </div>
                <span style={{ fontSize: 12, color: '#64748b', transform: expandedModules.includes(mod.id) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
              </div>
              
              <AnimatePresence>
                {expandedModules.includes(mod.id) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    {mod.lessons.map(lesson => (
                      <div 
                        key={lesson.id} 
                        onClick={() => setActiveLesson(lesson)}
                        style={{ 
                          padding: '12px 24px 12px 48px', 
                          display: 'flex', alignItems: 'center', gap: 12, 
                          cursor: 'pointer',
                          background: activeLesson.id === lesson.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                          borderLeft: `3px solid ${activeLesson.id === lesson.id ? '#6366f1' : 'transparent'}`,
                          transition: 'all 0.2s'
                        }}
                      >
                        {lesson.completed ? (
                          <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0 }} />
                        ) : (
                          <Circle size={16} color="#64748b" style={{ flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, color: activeLesson.id === lesson.id ? '#fff' : '#cbd5e1', fontWeight: activeLesson.id === lesson.id ? 600 : 400 }}>{lesson.title}</div>
                          <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                            {lesson.type === 'video' ? <Play size={10} /> : lesson.type === 'quiz' ? <BookOpen size={10} /> : <FileText size={10} />}
                            {lesson.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
