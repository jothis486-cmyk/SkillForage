import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.15) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(6,182,212,0.1) 0%, transparent 60%), #0f0f1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Animated background orbs */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        background: 'rgba(99,102,241,0.12)', borderRadius: '50%',
        filter: 'blur(80px)', top: '-100px', left: '-100px',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 350, height: 350,
        background: 'rgba(139,92,246,0.12)', borderRadius: '50%',
        filter: 'blur(80px)', bottom: '-80px', right: '-80px',
        animation: 'float 10s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute', width: 250, height: 250,
        background: 'rgba(6,182,212,0.08)', borderRadius: '50%',
        filter: 'blur(60px)', top: '50%', right: '20%',
        animation: 'float 7s ease-in-out infinite 2s',
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Left panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          display: 'none',
          width: '480px',
          padding: '60px',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100vh',
        }}
        className="left-panel"
      >
        <div style={{
          width: 56, height: 56,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 32,
          boxShadow: '0 0 30px rgba(99,102,241,0.4)',
        }}>
          <span style={{ fontSize: 28 }}>🧠</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
          AI Skill Gap{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Detector</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 48 }}>
          AI-powered career intelligence platform that predicts your ideal IT career,
          identifies skill gaps, and builds your personalized learning roadmap.
        </p>

        {[
          { icon: '🎯', title: 'Career Prediction', desc: 'AI predicts your ideal IT career path' },
          { icon: '📊', title: 'Skill Gap Analysis', desc: 'Identify what you need to learn next' },
          { icon: '🗺️', title: 'Learning Roadmap', desc: 'Personalized step-by-step learning plan' },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15 }}
            style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              marginBottom: 24, padding: '16px 20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(99,102,241,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>{f.icon}</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{f.title}</div>
              <div style={{ color: '#64748b', fontSize: 13 }}>{f.desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Right panel - Login form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 460,
          margin: '24px',
          padding: '48px 40px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 0 40px rgba(99,102,241,0.5)',
              fontSize: 30,
            }}
          >🧠</motion.div>
          <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Sign in to your AI Career Dashboard
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10,
                padding: '12px 16px',
                color: '#fca5a5',
                fontSize: 13,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>⚠️</span> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 16, color: '#6366f1',
              }}>✉️</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%', padding: '13px 14px 13px 42px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, color: '#fff', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                }}
                onFocus={e => {
                  e.target.style.border = '1px solid #6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
                  e.target.style.background = 'rgba(99,102,241,0.08)';
                }}
                onBlur={e => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255,255,255,0.06)';
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 16, color: '#6366f1',
              }}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%', padding: '13px 44px 13px 42px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, color: '#fff', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                }}
                onFocus={e => {
                  e.target.style.border = '1px solid #6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
                  e.target.style.background = 'rgba(99,102,241,0.08)';
                }}
                onBlur={e => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255,255,255,0.06)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748b', fontSize: 16, padding: 0,
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: 'right', marginBottom: 28 }}>
            <Link to="/forgot-password" style={{ color: '#6366f1', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: '14px',
              background: loading
                ? 'rgba(99,102,241,0.4)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              border: 'none', borderRadius: 12,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 24px rgba(99,102,241,0.45)',
              transition: 'all 0.3s',
              fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 18, height: 18,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Signing in...
              </>
            ) : (
              <>Sign In →</>
            )}
          </motion.button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '28px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: '#475569', fontSize: 12 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            {[
              { icon: '🔵', label: 'Google' },
              { icon: '⬛', label: 'GitHub' },
            ].map(s => (
              <button
                key={s.label}
                type="button"
                style={{
                  flex: 1, padding: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, color: '#94a3b8',
                  cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {/* Register link */}
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
              Create one free →
            </Link>
          </p>
        </form>

        {/* Bottom stats */}
        <div style={{
          display: 'flex', gap: 0, marginTop: 32,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 24,
        }}>
          {[
            { value: '10K+', label: 'Students' },
            { value: '95%', label: 'Accuracy' },
            { value: '14', label: 'Careers' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{
                fontSize: 20, fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.value}</div>
              <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
