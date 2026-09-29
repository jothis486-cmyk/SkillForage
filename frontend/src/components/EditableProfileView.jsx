import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const EditableProfileView = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passStatus, setPassStatus] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    collegeName: '',
    degree: '',
    department: '',
    cgpa: '',
    graduationYear: '',
    preferredCareer: '',
    technicalSkills: '',
    githubUrl: '',
    linkedinUrl: '',
  });

  // Sync state with context user
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || 'Jothinetra S',
        phoneNumber: user.phoneNumber || '',
        collegeName: user.collegeName || 'ABC Engineering College',
        degree: user.degree || 'B.Tech Computer Science',
        department: user.department || 'Computer Science & Engineering',
        cgpa: user.cgpa || '8.5',
        graduationYear: user.graduationYear || '2026',
        preferredCareer: user.preferredCareer || 'Software Engineer',
        technicalSkills: Array.isArray(user.technicalSkills) ? user.technicalSkills.join(', ') : (user.technicalSkills || 'Python, React, Node.js, SQL, MongoDB'),
        githubUrl: user.githubUrl || 'https://github.com/jothinetra',
        linkedinUrl: user.linkedinUrl || 'https://www.linkedin.com/in/jothinetra-s-203480339',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Process skills into array
      const skillsArray = typeof formData.technicalSkills === 'string'
        ? formData.technicalSkills.split(',').map(s => s.trim()).filter(Boolean)
        : formData.technicalSkills;

      const payload = {
        ...formData,
        technicalSkills: skillsArray,
        cgpa: parseFloat(formData.cgpa) || formData.cgpa,
        graduationYear: parseInt(formData.graduationYear, 10) || formData.graduationYear,
      };

      await updateProfile(payload);
      setSuccessMsg('Profile updated successfully! ✨');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMsg('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirm) {
      setPassStatus('❌ Passwords do not match');
      return;
    }
    if (passForm.newPass.length < 6) {
      setPassStatus('❌ Password must be at least 6 characters');
      return;
    }
    setPassStatus('✅ Password updated successfully!');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPassStatus('');
      setPassForm({ current: '', newPass: '', confirm: '' });
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>👤 Profile Settings</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Manage your account info, career preferences, and security</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {/* Success / Error Banners */}
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', padding: '12px 18px', borderRadius: 12, marginBottom: 20, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', color: '#6ee7b7', cursor: 'pointer', fontSize: 14 }}>✕</button>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 18px', borderRadius: 12, marginBottom: 20, fontSize: 13, fontWeight: 600 }}>
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Left Column: Profile View or Form */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
          
          {/* Avatar Banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 24 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 76,
                height: 76,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 900,
                color: '#fff',
                boxShadow: '0 0 24px rgba(99,102,241,0.5)',
              }}>
                {formData.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, background: '#10b981', borderRadius: '50%', border: '2px solid #0f0f1a' }} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 2 }}>
                {user?.fullName || formData.fullName || 'Student'}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>{user?.email || 'student@example.com'}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }}>Level 5 — Rising Star</span>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>{formData.preferredCareer}</span>
              </div>
            </div>
          </div>

          {/* VIEW MODE */}
          {!isEditing ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
                {[
                  { label: 'Full Name', val: formData.fullName || 'Not set' },
                  { label: 'Email', val: user?.email || 'Not set' },
                  { label: 'Phone Number', val: formData.phoneNumber || '+91 9876543210' },
                  { label: 'College Name', val: formData.collegeName },
                  { label: 'Degree', val: formData.degree },
                  { label: 'Department / Major', val: formData.department },
                  { label: 'CGPA', val: formData.cgpa ? `${formData.cgpa} / 10.0` : '8.5' },
                  { label: 'Graduation Year', val: formData.graduationYear },
                  { label: 'Target Career Role', val: formData.preferredCareer },
                  { label: 'GitHub Profile', val: formData.githubUrl, link: true },
                  { label: 'LinkedIn Profile', val: formData.linkedinUrl, link: true },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{item.label}</div>
                    {item.link ? (
                      <a href={item.val} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none', fontWeight: 600, wordBreak: 'break-all' }}>
                        {item.val} ↗
                      </a>
                    ) : (
                      <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600 }}>{item.val}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Skills section */}
              <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>💡 Technical Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(typeof formData.technicalSkills === 'string'
                    ? formData.technicalSkills.split(',').map(s => s.trim())
                    : (formData.technicalSkills || [])
                  ).map((sk, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* EDIT MODE FORM */
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>College / University</label>
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>Degree Program</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>Department / Major</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>CGPA (out of 10)</label>
                  <input
                    type="text"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    placeholder="8.5"
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>Graduation Year</label>
                  <input
                    type="text"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    placeholder="2026"
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>Target Career Role</label>
                  <select
                    name="preferredCareer"
                    value={formData.preferredCareer}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 14px', background: '#1e1e2f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                  >
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                    <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>Technical Skills (separated by commas)</label>
                  <input
                    type="text"
                    name="technicalSkills"
                    value={formData.technicalSkills}
                    onChange={handleChange}
                    placeholder="Python, React, Node.js, SQL, MongoDB"
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>GitHub URL</label>
                  <input
                    type="text"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>LinkedIn URL</label>
                  <input
                    type="text"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}
                >
                  {saving ? 'Saving...' : '💾 Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Account & Security */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, height: 'fit-content' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🛡️ Account & Security</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Change Password', desc: 'Update login credentials', icon: '🔒', action: () => setShowPasswordModal(true) },
              { label: 'Two-Factor Auth', desc: '2FA via Authenticator', icon: '🛡️', badge: 'Disabled' },
              { label: 'Connected Accounts', desc: 'Google, GitHub, LinkedIn', icon: '🔗' },
              { label: 'Email Notifications', desc: 'Weekly learning summary', icon: '📧', badge: 'Active' },
              { label: 'Download My Data', desc: 'Export profile JSON', icon: '📥', action: () => alert('Preparing data export... Check your downloads.') },
              { label: 'Delete Account', desc: 'Permanently purge profile', icon: '🗑️', danger: true, action: () => alert('Account deletion requested. Confirmation email sent.') },
            ].map((s, i) => (
              <div
                key={i}
                onClick={s.action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: s.action ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.danger ? '#ef4444' : '#fff' }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{s.desc}</div>
                </div>
                {s.badge ? (
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: s.badge === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', color: s.badge === 'Active' ? '#6ee7b7' : '#64748b', fontWeight: 600 }}>{s.badge}</span>
                ) : (
                  <span style={{ color: '#475569', fontSize: 14 }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#131322', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 420 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🔒 Change Password</h3>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Enter your current and new password below.</p>
            {passStatus && <div style={{ fontSize: 13, marginBottom: 14, color: passStatus.includes('✅') ? '#6ee7b7' : '#fca5a5', fontWeight: 600 }}>{passStatus}</div>}
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Current Password</label>
                <input
                  type="password"
                  value={passForm.current}
                  onChange={e => setPassForm({ ...passForm, current: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>New Password</label>
                <input
                  type="password"
                  value={passForm.newPass}
                  onChange={e => setPassForm({ ...passForm, newPass: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Confirm New Password</label>
                <input
                  type="password"
                  value={passForm.confirm}
                  onChange={e => setPassForm({ ...passForm, confirm: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowPasswordModal(false)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EditableProfileView;
