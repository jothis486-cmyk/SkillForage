import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HackathonRegisterModal({ isOpen, onClose, hackathon, user, onRegisterSuccess }) {
  const [teamName, setTeamName] = useState(`${user?.fullName || 'Jothi'}'s Team`);
  const [track, setTrack] = useState('AI & Machine Learning');
  const [teamSize, setTeamSize] = useState('4 Members (Team)');
  const [leaderName, setLeaderName] = useState(user?.fullName || 'Jothi');
  const [leaderEmail, setLeaderEmail] = useState(user?.email || 'jothis486@gmail.com');
  const [college, setCollege] = useState(user?.collegeName || 'PSG College of Technology (PSG Tech, Coimbatore)');
  const [projectIdea, setProjectIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen || !hackathon) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedTicket = `HK-CBE-${Math.floor(10000 + Math.random() * 90000)}`;
      setTicketId(generatedTicket);
      setIsRegistered(true);
      if (onRegisterSuccess) {
        onRegisterSuccess(hackathon.id || hackathon.name);
      }
    }, 1100);
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
            maxWidth: 680,
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(99, 102, 241, 0.15)'
          }}
        >
          {/* Header */}
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
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>
                🏆
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: 0 }}>
                  {hackathon.name}
                </h3>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                  Host: <strong style={{ color: '#a5b4fc' }}>{hackathon.org}</strong> • Location: <strong style={{ color: '#cbd5e1' }}>{hackathon.location || 'Coimbatore'}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 20,
                background: 'rgba(16,185,129,0.15)',
                color: '#6ee7b7',
                border: '1px solid rgba(16,185,129,0.3)'
              }}>
                Prize: {hackathon.prize}
              </span>
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

          {/* Form Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
            {isRegistered ? (
              /* Success Confirmation Ticket */
              <div style={{ textAlign: 'center', padding: '24px 10px' }}>
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
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
                  Registration Confirmed! 🎉
                </h3>
                <p style={{ color: '#94a3b8', fontSize: 13, maxWidth: 460, margin: '0 auto 20px', lineHeight: 1.6 }}>
                  Team <strong style={{ color: '#a5b4fc' }}>{teamName}</strong> is registered for <strong style={{ color: '#fff' }}>{hackathon.name}</strong> at {hackathon.org}.
                </p>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 16,
                  padding: '20px',
                  maxWidth: 420,
                  margin: '0 auto 24px',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Registration Pass ID:</span>
                    <strong style={{ color: '#6ee7b7', fontFamily: 'monospace', fontSize: 14 }}>{ticketId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Team Leader:</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{leaderName} ({leaderEmail})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Selected Track:</span>
                    <span style={{ color: '#fcd34d', fontWeight: 600 }}>{track}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Venue:</span>
                    <span style={{ color: '#cbd5e1' }}>{hackathon.location || 'Coimbatore Campus'}</span>
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
                  Close & View Registrations
                </button>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    1. Team Details
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Team Name</label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. AI Innovators PSG"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Hackathon Domain / Track</label>
                      <select
                        value={track}
                        onChange={(e) => setTrack(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Smart Cities & IoT">Smart Cities & IoT (Coimbatore Initiative)</option>
                        <option value="Healthcare & MedTech">Healthcare & MedTech</option>
                        <option value="FinTech & Blockchain">FinTech & Blockchain</option>
                        <option value="Sustainable Green Tech">Sustainable Green Tech</option>
                        <option value="Open Innovation">Open Innovation</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Team Size</label>
                      <select
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="Solo (1 Member)">Solo (1 Member)</option>
                        <option value="Pair (2 Members)">Pair (2 Members)</option>
                        <option value="Trio (3 Members)">Trio (3 Members)</option>
                        <option value="4 Members (Team)">4 Members (Standard Team)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>College / Institution</label>
                      <input
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    2. Team Leader Contact
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Leader Name</label>
                      <input
                        type="text"
                        required
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Leader Email</label>
                      <input
                        type="email"
                        required
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    3. Project Pitch / Idea Summary (Optional)
                  </span>
                  <textarea
                    rows={3}
                    value={projectIdea}
                    onChange={(e) => setProjectIdea(e.target.value)}
                    placeholder="Briefly describe what solution your team plans to build..."
                    style={{
                      ...inputStyle,
                      height: 'auto',
                      marginTop: 8,
                      resize: 'vertical'
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
                    <span>{isSubmitting ? 'Registering Team...' : `Confirm Registration for ${hackathon.org}`}</span>
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
