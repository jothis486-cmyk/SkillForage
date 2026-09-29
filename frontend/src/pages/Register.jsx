import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    collegeName: '', degree: '', preferredCareer: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const careers = [
    'Software Engineer', 'Data Scientist', 'AI Engineer', 'Full Stack Developer',
    'Cloud Engineer', 'DevOps Engineer', 'Cybersecurity Analyst', 'Mobile App Developer',
    'ML Engineer', 'UI/UX Designer', 'Business Analyst', 'QA Engineer'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.collegeName,
        formData.degree,
        formData.preferredCareer
      );
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '13px 14px 13px 42px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: '#fff', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
  };

  const focusStyle = (e) => {
    e.target.style.border = '1px solid #6366f1';
    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
    e.target.style.background = 'rgba(99,102,241,0.08)';
  };
  const blurStyle = (e) => {
    e.target.style.border = '1px solid rgba(255,255,255,0.1)';
    e.target.style.boxShadow = 'none';
    e.target.style.background = 'rgba(255,255,255,0.06)';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.15) 0%, transparent 60%), #0f0f1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: '24px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div style={{ position: 'absolute', width: 400, height: 400, background: 'rgba(99,102,241,0.1)', borderRadius: '50%', filter: 'blur(100px)', top: '-100px', right: '-100px', animation: 'float 8s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: 300, height: 300, background: 'rgba(6,182,212,0.08)', borderRadius: '50%', filter: 'blur(80px)', bottom: '50px', left: '-50px', animation: 'float 10s ease-in-out infinite reverse' }} />
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #475569 !important; }
        select option { background: #1e1e2e; color: #fff; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          width: '100%', maxWidth: 480,
          padding: '44px 40px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            style={{
              width: 60, height: 60,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: 16, display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px',
              boxShadow: '0 0 40px rgba(99,102,241,0.4)', fontSize: 28,
            }}
          >🚀</motion.div>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            Create Your Account
          </h2>
          <p style={{ color: '#64748b', fontSize: 13 }}>
            Join 10,000+ students building their dream career
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: step >= s
                ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                : 'rgba(255,255,255,0.08)',
              transition: 'all 0.4s',
            }} />
          ))}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0 }}
              style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10, padding: '11px 14px', color: '#fca5a5',
                fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span>⚠️</span> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              onSubmit={handleStep1}
            >
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#6366f1' }}>👤</span>
                  <input name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="Your full name" required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#6366f1' }}>✉️</span>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#6366f1' }}>🔒</span>
                  <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Min 6 characters" required style={{ ...inputStyle, paddingRight: 44 }} onFocus={focusStyle} onBlur={blurStyle} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, padding: 0 }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#6366f1' }}>✅</span>
                  <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>

              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 24px rgba(99,102,241,0.4)', fontFamily: 'Inter, sans-serif' }}>
                Next: Career Info →
              </motion.button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              onSubmit={handleSubmit}
            >
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>College / University</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#6366f1' }}>🏫</span>
                  <input name="collegeName" type="text" value={formData.collegeName} onChange={handleChange} placeholder="Your college name" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Degree</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#6366f1' }}>🎓</span>
                  <input name="degree" type="text" value={formData.degree} onChange={handleChange} placeholder="e.g. B.Tech Computer Science" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Preferred Career Path</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#6366f1', zIndex: 1 }}>🎯</span>
                  <select name="preferredCareer" value={formData.preferredCareer} onChange={handleChange}
                    style={{ ...inputStyle, paddingLeft: 42, appearance: 'none', cursor: 'pointer' }}
                    onFocus={focusStyle} onBlur={blurStyle}>
                    <option value="">Select your dream career</option>
                    {careers.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 0 }}>
                <button type="button" onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#94a3b8', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500 }}>
                  ← Back
                </button>
                <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ flex: 2, padding: '13px', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 24px rgba(99,102,241,0.4)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {loading ? (
                    <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Creating...</>
                  ) : '🚀 Create Account'}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
            Sign in →
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
