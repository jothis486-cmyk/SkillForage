import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare, Users, 
  Hand, PhoneOff, Settings, Send, MoreHorizontal
} from 'lucide-react';

const MOCK_PARTICIPANTS = [
  { id: 1, name: 'Dr. Sarah Chen (Host)', role: 'instructor', micOn: true, videoOn: true },
  { id: 3, name: 'Rahul Verma', role: 'student', micOn: false, videoOn: true },
  { id: 4, name: 'Priya Sharma', role: 'student', micOn: true, videoOn: false },
  { id: 5, name: 'Alex Johnson', role: 'student', micOn: false, videoOn: false },
];

const MOCK_CHAT = [
  { sender: 'Dr. Sarah Chen', time: '10:05 AM', text: 'Welcome everyone! We will start in 5 minutes.', type: 'host' },
  { sender: 'Rahul Verma', time: '10:06 AM', text: 'Good morning ma\'am.', type: 'student' },
  { sender: 'Priya Sharma', time: '10:08 AM', text: 'Will this session be recorded?', type: 'student' },
  { sender: 'Dr. Sarah Chen', time: '10:09 AM', text: 'Yes, all live sessions are recorded and available in your dashboard afterwards.', type: 'host' },
];

const LiveClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // chat, participants
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState(MOCK_CHAT);
  const [stream, setStream] = useState(null);
  const [videoError, setVideoError] = useState('');
  const videoRef = useRef(null);

  const startWebcam = async () => {
    try {
      setVideoError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setVideoOn(true);
      mediaStream.getAudioTracks().forEach(t => { t.enabled = micOn; });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setVideoError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setVideoError('No camera found on this device.');
      } else {
        setVideoError('Could not access camera: ' + err.message);
      }
    }
  };

  const stopWebcam = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStream(null);
    setVideoOn(false);
  };

  const toggleVideo = () => videoOn ? stopWebcam() : startWebcam();

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(t => { t.enabled = !micOn; });
    }
    setMicOn(prev => !prev);
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setMessages([...messages, {
      sender: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: chatMessage,
      type: 'student'
    }]);
    setChatMessage('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#09090b', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ─── MAIN VIDEO AREA ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Top Info Bar */}
        <div style={{ position: 'absolute', top: 20, left: 24, zIndex: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }}></div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>LIVE</span>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>•</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Advanced System Design</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={14} /> 45
          </div>
        </div>

        {/* Video Grid Feed */}
        <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Main Speaker / Screen Share */}
          <div style={{ flex: 1, background: '#181825', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <div style={{ fontSize: 72, marginBottom: 16 }}>👩‍🏫</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Dr. Sarah Chen's Screen</h2>
              <div style={{ fontSize: 14, color: '#cbd5e1', marginTop: 8 }}>Presenting: Microservices Architecture</div>
            </div>

            <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Dr. Sarah Chen</div>
          </div>

          {/* Participant Strip */}
          <div style={{ height: 140, display: 'flex', gap: 16, overflowX: 'auto' }}>

            {/* YOUR tile — real webcam */}
            <div style={{ width: 220, background: '#181825', borderRadius: 12, border: `1px solid ${videoOn ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)'}`, position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {videoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>Y</div>
                  {videoError && <div style={{ fontSize: 9, color: '#f87171', textAlign: 'center', padding: '0 8px' }}>{videoError}</div>}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: 4, fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
                {micOn ? <Mic size={10} color="#10b981" /> : <MicOff size={10} color="#ef4444" />}
                You (Me)
              </div>
            </div>

            {/* Other participants */}
            {MOCK_PARTICIPANTS.slice(1).map((p, i) => (
              <div key={i} style={{ width: 220, background: '#181825', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {p.videoOn ? (
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
                    {p.name[0]}
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: 4, fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {p.micOn ? <Mic size={10} color="#10b981" /> : <MicOff size={10} color="#ef4444" />}
                  {p.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CONTROLS BAR */}
        <div style={{ height: 80, background: '#181825', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '0 24px' }}>
          
          <div style={{ display: 'flex', gap: 12, position: 'absolute', left: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button 
                onClick={toggleMic}
                style={{ width: 48, height: 48, borderRadius: '50%', background: micOn ? 'rgba(255,255,255,0.1)' : '#ef4444', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}>
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{micOn ? 'Mute' : 'Unmute'}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button 
                onClick={toggleVideo}
                style={{ width: 48, height: 48, borderRadius: '50%', background: videoOn ? 'rgba(255,255,255,0.1)' : '#ef4444', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}>
                {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{videoOn ? 'Stop Video' : 'Start Video'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { icon: <MonitorUp size={20} />, label: 'Share Screen', action: () => {}, active: false },
              { icon: <Hand size={20} color={handRaised ? '#f59e0b' : '#fff'} />, label: handRaised ? 'Lower Hand' : 'Raise Hand', action: () => setHandRaised(!handRaised), active: handRaised },
              { icon: <Settings size={20} />, label: 'Settings', action: () => {}, active: false },
            ].map((btn, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <button 
                  onClick={btn.action}
                  style={{ width: 48, height: 48, borderRadius: '50%', background: btn.active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${btn.active ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}>
                  {btn.icon}
                </button>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{btn.label}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            style={{ position: 'absolute', right: 24, padding: '12px 24px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <PhoneOff size={16} /> Leave Class
          </button>
        </div>
      </div>

      {/* ─── RIGHT SIDEBAR (CHAT & PARTICIPANTS) ─── */}
      <div style={{ width: 340, background: '#12121a', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 16px 0 16px' }}>
          {[
            { id: 'chat', icon: <MessageSquare size={16} />, label: 'Meeting Chat' },
            { id: 'participants', icon: <Users size={16} />, label: `Participants (${MOCK_PARTICIPANTS.length})` }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === t.id ? '#6366f1' : 'transparent'}`, color: activeTab === t.id ? '#fff' : '#64748b', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.2s' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {activeTab === 'chat' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, justifyContent: m.sender === 'You' ? 'flex-end' : 'flex-start' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: m.sender === 'You' ? '#a5b4fc' : m.type === 'host' ? '#10b981' : '#cbd5e1' }}>{m.sender}</span>
                    <span style={{ fontSize: 9, color: '#64748b' }}>{m.time}</span>
                  </div>
                  <div style={{ background: m.sender === 'You' ? '#6366f1' : 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: 12, borderTopLeftRadius: m.sender === 'You' ? 12 : 2, borderTopRightRadius: m.sender === 'You' ? 2 : 12, fontSize: 13, lineHeight: 1.5, color: '#fff' }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {MOCK_PARTICIPANTS.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, _hover: { background: 'rgba(255,255,255,0.03)' } }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: p.role === 'host' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                      {p.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{p.role === 'host' ? 'Host' : 'Student'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748b' }}>
                    {p.micOn ? <Mic size={14} color="#10b981" /> : <MicOff size={14} />}
                    {p.videoOn ? <Video size={14} color="#3b82f6" /> : <VideoOff size={14} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Input */}
        {activeTab === 'chat' && (
          <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.08)', background: '#181825' }}>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '4px 4px 4px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type message here..." 
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 13, outline: 'none' }} 
              />
              <button type="submit" style={{ width: 32, height: 32, borderRadius: 6, background: '#6366f1', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClass;
