// src/components/Tabs/VaniCore/VaniCore.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './VaniCore.css';
import {
  BUILDS,
  CONDITIONS,
  MOTOR_PARTS,
  GESTURE_CAPABILITIES,
  WILLINGNESS_OPTIONS,
  SEED_FEEDBACK,
  LS_PILOTS,
  LS_FEEDBACK,
  LS_DOWNLOADS,
} from './VaniCoreConfig';
import { auth as fbAuth, db } from '../../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import AdminDashboard from './AdminDashboard';
import PatientDashboard from './PatientDashboard';

// ── Helpers ────────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().split('T')[0];

const readLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const writeLS = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* quota */ }
};

// ── Initial form state ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
  alias: '',
  ageGroup: '',
  condition: '',
  symptoms: '',
  impactedParts: [],
  gestureCapabilities: [],
  willingness: '',
  platforms: [],
  caregiverNote: '',
};

const validateForm = (f) => {
  const e = {};
  if (!f.alias.trim()) e.alias = 'An alias or nickname is required.';
  if (!f.ageGroup) e.ageGroup = 'Please select your age group.';
  if (!f.condition) e.condition = 'Please select a condition.';
  if (!f.symptoms.trim()) e.symptoms = 'Please briefly describe current symptoms.';
  if (f.impactedParts.length === 0) e.impactedParts = 'Select at least one affected body part.';
  if (!f.willingness) e.willingness = 'Please indicate your willingness to join the pilot.';
  if (f.platforms.length === 0) e.platforms = 'Select at least one platform.';
  return e;
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const TopBar = ({ auth, onLogin, onLogout }) => (
  <div className="vc-topbar">
    <div className="vc-topbar-brand">
      <span className="vc-topbar-icon">🧠</span>
      <span className="vc-topbar-name">VANI Pilot Portal</span>
    </div>
    <div className="vc-topbar-right">
      {auth ? (
        <>
          <span className="vc-topbar-user">
            {auth.role === 'admin' ? '⚙️ ' : '👤 '}{auth.username}
          </span>
          <button className="vc-btn-outline vc-btn-sm" onClick={onLogout}>Sign Out</button>
        </>
      ) : (
        <button className="vc-btn-primary vc-btn-sm" onClick={onLogin}>Sign In</button>
      )}
    </div>
  </div>
);

// ── Tab Nav ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'home',      icon: '🏠', label: 'Home',       locked: false, desc: '' },
  { id: 'setup',     icon: '📖', label: 'Setup',      locked: true,  desc: 'Step-by-step setup in under 10 min' },
  { id: 'pilot',     icon: '📋', label: 'Join Pilot', locked: true,  desc: 'Register as a pilot participant' },
  { id: 'feedback',  icon: '💬', label: 'Feedback',   locked: false, desc: 'Read & share community feedback' },
  { id: 'dashboard', icon: '📊', label: 'Dashboard',  locked: false, desc: 'Your patient dashboard' },
];

const TabNav = ({ active, onChange, auth, onLoginRequest }) => {
  const visible = TABS.filter((t) => t.id !== 'dashboard' || auth);
  return (
    <nav className="vc-tab-nav" role="tablist">
      {visible.map((t) => {
        const isLocked = t.locked && !auth;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            className={`vc-tab-btn ${active === t.id ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
            onClick={() => isLocked ? onLoginRequest(t.id) : onChange(t.id)}
          >
            <span className="vc-tab-icon">{t.icon}</span>
            <span className="vc-tab-label">{t.label}</span>
            {isLocked && <span className="vc-tab-lock">🔒</span>}
            {t.desc && <span className="vc-tab-tooltip">{isLocked ? '🔒 Sign in — ' : ''}{t.desc}</span>}
          </button>
        );
      })}
    </nav>
  );
};

// ── Footer ─────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="vc-footer">
    <div className="vc-footer-inner">
      <div className="vc-footer-brand">
        <span className="vc-footer-logo">🧠</span>
      </div>
      <div className="vc-footer-contact">
        <a href="tel:+918121040308" className="vc-footer-link">📞 +91 81210 40308</a>
        <span className="vc-footer-sep">·</span>
        <a href="mailto:vaaninnovations@gmail.com" className="vc-footer-link">✉️ vaaninnovations@gmail.com</a>
      </div>
      <p className="vc-footer-copy">
        © {new Date().getFullYear()} Pavan Kumar Arepu · VANI Innovations
      </p>
    </div>
  </footer>
);

// ── Hero Carousel ───────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    icon: '🧠',
    title: 'What is ALS / MND?',
    content: (
      <p>
        Amyotrophic Lateral Sclerosis (ALS) and Motor Neuron Disease (MND) progressively destroy
        the nerve cells controlling voluntary movement. Over 2 million people worldwide are affected.
        In late stages, eye movement is often the <strong>only remaining voluntary function</strong>.
      </p>
    ),
  },
  {
    icon: '💔',
    title: 'Why This Pilot Matters',
    content: (
      <p>
        Existing assistive devices are expensive, reactive, and require user initiation.
        VANI is different — it continuously watches, learns, and acts.
        This pilot is a first step toward giving patients back their independence,
        dignity, and identity — without surgery, implants, or specialist hardware.
      </p>
    ),
  },
  {
    icon: '🔧',
    title: 'What Problems Does VANI Solve?',
    content: (
      <div className="vc-gesture-table">
        <div className="vc-gesture-group-label">✅ Pilot — Signals VaniCore Captures Now</div>
        <div className="vc-gesture-rows vc-gesture-rows-2col">
          <div className="vc-gesture-row"><span className="vc-gesture-name">� Blink</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">YES / Confirm</span></div>
          <div className="vc-gesture-row"><span className="vc-gesture-name">😤 Double Blink</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">URGENT — call nurse now!</span></div>
          <div className="vc-gesture-row"><span className="vc-gesture-name">😉 Wink Left</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">NO / Decline</span></div>
          <div className="vc-gesture-row"><span className="vc-gesture-name">😉 Wink Right</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">Feeling GOOD / Thank you</span></div>
          <div className="vc-gesture-row"><span className="vc-gesture-name">👁️ Gaze Left</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">Attention needed — LEFT side</span></div>
          <div className="vc-gesture-row"><span className="vc-gesture-name">👁️ Gaze Right</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">Attention needed — RIGHT side</span></div>
          <div className="vc-gesture-row"><span className="vc-gesture-name">👄 Mouth Open</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">Needs WATER or FOOD</span></div>
          <div className="vc-gesture-row"><span className="vc-gesture-name">↩️ Head Left</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">Head turned LEFT — check left</span></div>
          <div className="vc-gesture-row"><span className="vc-gesture-name">↪️ Head Right</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">Head turned RIGHT — check right</span></div>
        </div>
        <div className="vc-gesture-group-label vc-gesture-v2">🔄 Coming in v2</div>
        <div className="vc-gesture-rows vc-gesture-rows-2col">
          <div className="vc-gesture-row"><span className="vc-gesture-name">💡 IoT Control</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">Fan · Light · TV</span></div>
          <div className="vc-gesture-row"><span className="vc-gesture-name">📲 Voice SMS</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">Emergency Calling</span></div>
          <div className="vc-gesture-row"><span className="vc-gesture-name">🗣️ LLM Chat</span><span className="vc-gesture-arrow">→</span><span className="vc-gesture-value">Full Sentences</span></div>
        </div>
      </div>
    ),
  },
  {
    icon: '💻',
    title: 'Technology Behind VANI',
    content: (
      <p>
        Built on <strong>Computer Vision + Edge AI</strong> running locally on Windows / macOS,
        synced to an Android companion app (VaniCare) over <strong>WiFi via Firebase</strong>.
        Core stack: <strong>Python · Deep Learning · LSTM · Temporal Differencing ·
        Noise Reduction · Speech Processing · DNN · LLM-assisted interaction</strong>.
        Future cloud expansion planned on AWS.
      </p>
    ),
  },
];

const HeroCarousel = () => {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const total = HERO_SLIDES.length;

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % total), 10000);
  }, [total]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const goTo = useCallback((next) => {
    setIdx(((next % total) + total) % total);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % total), 10000);
  }, [total]);

  return (
    <div
      className="vc-carousel"
      onMouseEnter={() => clearInterval(timerRef.current)}
      onMouseLeave={startTimer}
    >
      <div className="vc-carousel-track-wrap">
        <div
          className="vc-carousel-track"
          style={{ transform: `translateX(calc(14% - ${idx} * (72% + 16px)))` }}
        >
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`vc-hero-card vc-carousel-item${i === idx ? ' active' : ''}`}
              onClick={() => i !== idx && goTo(i)}
            >
              <div className="vc-hero-card-icon">{slide.icon}</div>
              <h3>{slide.title}</h3>
              {slide.content}
            </div>
          ))}
        </div>
      </div>
      <div className="vc-carousel-controls">
        <button className="vc-carousel-arrow" onClick={() => goTo(idx - 1)} aria-label="Previous">‹</button>
        <div className="vc-carousel-dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`vc-carousel-dot${i === idx ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="vc-carousel-arrow" onClick={() => goTo(idx + 1)} aria-label="Next">›</button>
      </div>
    </div>
  );
};

const Hero = ({ pilotCount, totalDownloads }) => (
  <section className="vc-hero">
    <div className="vc-hero-badge">Pilot Program — Open Now</div>
    <h1 className="vc-hero-title">VANI — A Voice of Unheard</h1>
    <p className="vc-hero-sub">
      For millions living with ALS, Locked-in Syndrome, or severe motor impairment,
      even blinking can be the last remaining way to communicate. VANI exists to make sure that blink is heard.
    </p>

    <HeroCarousel />

    <div className="vc-hero-principles">
      <span className="vc-principle">Reliability First</span>
      <span className="vc-principle">Patient-Adaptive</span>
      <span className="vc-principle">Affordability by Design</span>
      <span className="vc-principle">No Implants. No Surgery.</span>
      <span className="vc-principle">WiFi Sync via Firebase</span>
    </div>
    <div className="vc-hero-stats">
      <div className="vc-hero-stat">
        <span className="vc-hero-stat-num">{pilotCount}</span>
        <span className="vc-hero-stat-label">Pilots Registered</span>
      </div>
      <div className="vc-hero-stat-divider" />
      <div className="vc-hero-stat">
        <span className="vc-hero-stat-num">{totalDownloads}</span>
        <span className="vc-hero-stat-label">App Downloads</span>
      </div>
      <div className="vc-hero-stat-divider" />
      <div className="vc-hero-stat">
        <span className="vc-hero-stat-num">10+</span>
        <span className="vc-hero-stat-label">Gestures Captured</span>
      </div>
      <div className="vc-hero-stat-divider" />
      <div className="vc-hero-stat">
        <span className="vc-hero-stat-num">3</span>
        <span className="vc-hero-stat-label">Platforms</span>
      </div>
    </div>
  </section>
);

const CheckboxGroup = ({ options, selected, onChange }) => {
  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };
  return (
    <div className="vc-checkbox-grid">
      {options.map((opt) => {
        const id = opt.id || opt;
        const label = opt.label || opt;
        return (
          <label key={id} className={"vc-checkbox-item" + (selected.includes(id) ? ' checked' : '')}>
            <input
              type="checkbox"
              checked={selected.includes(id)}
              onChange={() => toggle(id)}
            />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
};

// ── Setup Guide ─────────────────────────────────────────────────────────────────
const FLOW_STEPS = [
  {
    id: 'dl-android',
    icon: '📲',
    app: 'android',
    label: 'Download VaniCare',
    sub: 'Android APK from Google Drive',
    color: '#3ddc84',
    bg: '#f0fff6',
    videoId: '1j6Eptr5sHER7xJCwZscH0iajaUfpJrR7',
    videoLabel: '📱 Android Setup (Steps 1–4)',
  },
  {
    id: 'install-android',
    icon: '⚙️',
    app: 'android',
    label: 'Install & Open VaniCare',
    sub: 'Enable "Install from Unknown Sources" first',
    color: '#3ddc84',
    bg: '#f0fff6',
  },
  {
    id: 'perms',
    icon: '🔐',
    app: 'android',
    label: 'Accept Permissions',
    sub: 'Camera · Microphone · Notifications',
    color: '#3ddc84',
    bg: '#f0fff6',
  },
  {
    id: 'wait-qr',
    icon: '⏳',
    app: 'android',
    label: 'Wait for QR Screen',
    sub: 'VaniCare is ready to scan — keep screen on',
    color: '#3ddc84',
    bg: '#f0fff6',
    videoId: '1ZDYpctill3FgoMBNf7sosGjFV1oAjQPN',
    videoLabel: '💻 Computer Setup (Steps 4–8)',
  },
  {
    id: 'dl-win',
    icon: '📦',
    app: 'windows',
    label: 'Install VaniCore',
    sub: 'Download ZIP · Extract · Run VaniCore.exe',
    color: '#0078d4',
    bg: '#f0f6ff',
  },
  {
    id: 'enter-name',
    icon: '🙋',
    app: 'windows',
    label: 'Enter Your Name',
    sub: 'Type your name on the landing screen → Enter',
    color: '#0078d4',
    bg: '#f0f6ff',
  },
  {
    id: 'qr-win',
    icon: '📷',
    app: 'windows',
    label: 'QR Code Appears',
    sub: 'Keep the QR code visible on your Windows screen',
    color: '#0078d4',
    bg: '#f0f6ff',
  },
  {
    id: 'scan',
    icon: '🔗',
    app: 'sync',
    label: 'Scan QR from Android',
    sub: 'Point VaniCare camera at the Windows QR code',
    color: '#6a11cb',
    bg: '#f5f0ff',
    videoId: '1qse5ihDnzfiX6M5pzFrtqhflyVUlxPoS',
    videoLabel: '🔗 Final Setup (Steps 8–10)',
  },
  {
    id: 'calib',
    icon: '👁️',
    app: 'windows',
    label: 'Start Calibration',
    sub: 'Follow on-screen gesture prompts on Windows',
    color: '#0078d4',
    bg: '#f0f6ff',
  },
  {
    id: 'live',
    icon: '🎉',
    app: 'sync',
    label: 'Go Live!',
    sub: 'Android receives notifications when gestures detected',
    color: '#10b981',
    bg: '#f0fff8',
  },
];

const APP_BADGE = {
  android: { label: '🤖 VaniCare (Android)', cls: 'vc-flow-badge-android' },
  windows: { label: '🪟 VaniCore (Windows)', cls: 'vc-flow-badge-win' },
  sync:    { label: '🔗 Both in Sync', cls: 'vc-flow-badge-sync' },
};

const SetupGuide = ({ auth, builds, downloads, onDownload, onLogin }) => (
  <section className="vc-section" id="setup-guide">
    <h2 className="vc-section-title">
      <span className="vc-title-icon">📖</span> Setup Guide
    </h2>
    <p className="vc-section-sub">
      Follow this sequence exactly — start with Android first, then Windows.
      Total setup time: less than 10&nbsp;minutes.
    </p>

    {/* Two-part system explanation */}
    <div className="vc-system-intro">
      <h3 className="vc-system-intro-title">🔗 VANI is a two-part system</h3>
      <p className="vc-system-intro-desc">
        To fully set up VANI, you need to install <strong>two apps</strong> — one on the patient's
        computer and one on the caregiver's Android phone. They work together as one connected system.
        Complete <em>both</em> setups to go live.
      </p>
      <div className="vc-system-parts">
        <div className="vc-system-part vc-system-part-core">
          <div className="vc-system-part-icon">🪟</div>
          <div className="vc-system-part-name">VaniCore</div>
          <div className="vc-system-part-platform">Windows · macOS — Desktop App</div>
          <p className="vc-system-part-desc">
            Installed on the <strong>patient's computer</strong>. Uses the webcam to continuously
            detect eye and facial gestures — no keypress required.
          </p>
        </div>
        <div className="vc-system-plus">＋</div>
        <div className="vc-system-part vc-system-part-care">
          <div className="vc-system-part-icon">🤖</div>
          <div className="vc-system-part-name">VaniCare</div>
          <div className="vc-system-part-platform">Android — Mobile App</div>
          <p className="vc-system-part-desc">
            Installed on the <strong>caregiver's Android phone</strong>. Receives instant alerts
            when the patient performs a gesture — "Yes", "No", "Help", and more.
          </p>
        </div>
      </div>
    </div>

    {/* Video walkthrough — login required */}
    {auth ? (
      <div className="vc-video-embed-wrap">
        <div className="vc-video-embed-label">📹 Setup Walkthrough Video</div>
        <div className="vc-video-embed-frame">
          <iframe
            src="https://drive.google.com/file/d/1mLXhPnQoD8gux39TNxUW1PineyfHPUWN/preview"
            title="VANI Setup Intro"
            allow="autoplay"
            allowFullScreen
          />
        </div>
      </div>
    ) : (
      <div className="vc-video-placeholder">
        <div className="vc-video-inner">
          <div className="vc-video-play-icon">▶</div>
          <div className="vc-video-text">
            <strong>📹 Setup Walkthrough Video</strong>
            <p>🔐 Sign in (Admin or Patient / Caregiver) to watch the full video walkthrough.</p>
          </div>
        </div>
      </div>
    )}

    {/* Legend */}
    <div className="vc-flow-legend">
      <span className="vc-flow-badge vc-flow-badge-android">🤖 VaniCare (Android)</span>
      <span className="vc-flow-badge vc-flow-badge-win">🪟 VaniCore (Windows)</span>
      <span className="vc-flow-badge vc-flow-badge-sync">🔗 Both Devices in Sync</span>
    </div>

    {/* Flowchart */}
    <div className="vc-flow-chart">
      {FLOW_STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className={`vc-flow-item${step.videoId ? ' vc-flow-item-with-video' : ''}`}>
            <div className="vc-flow-node" style={{ borderColor: step.color, background: step.bg }}>
              <div className="vc-flow-step-num" style={{ background: step.color }}>
                <span className="vc-step-word">Step</span>
                <span className="vc-step-n">{i + 1}</span>
              </div>
              <div className="vc-flow-icon">{step.icon}</div>
              <div className="vc-flow-label">{step.label}</div>
              <div className="vc-flow-sub">{step.sub}</div>
              <span className={`vc-flow-badge ${APP_BADGE[step.app].cls}`}>
                {APP_BADGE[step.app].label}
              </span>
              {/* Inline download — VaniCare (step dl-android) */}
              {step.id === 'dl-android' && builds && (() => {
                const b = builds.find(x => x.id === 'android');
                if (!b) return null;
                return auth ? (
                  <a href={b.url} className="vc-step-dl-btn vc-step-dl-btn-care" target="_blank" rel="noopener noreferrer" onClick={() => onDownload && onDownload(b.id)}>
                    ⬇️ Download VaniCare APK
                  </a>
                ) : (
                  <button className="vc-step-dl-btn vc-step-dl-btn-locked" onClick={onLogin}>🔐 Sign in to Download</button>
                );
              })()}
              {/* Inline download — VaniCore Win + Mac (step dl-win) */}
              {step.id === 'dl-win' && builds && (
                <div className="vc-step-dl-group">
                  {builds.filter(x => x.id === 'windows' || x.id === 'mac').map(b =>
                    auth ? (
                      <a key={b.id} href={b.url} className="vc-step-dl-btn vc-step-dl-btn-core" target="_blank" rel="noopener noreferrer" onClick={() => onDownload && onDownload(b.id)}>
                        {b.icon} {b.platform}
                      </a>
                    ) : (
                      <button key={b.id} className="vc-step-dl-btn vc-step-dl-btn-locked" onClick={onLogin}>🔐 Sign in to Download</button>
                    )
                  )}
                </div>
              )}
            </div>
            {step.videoId && (
              <div className="vc-step-video-tile">
                <div className="vc-step-video-label">{step.videoLabel}</div>
                <iframe
                  src={`https://drive.google.com/file/d/${step.videoId}/preview`}
                  title={step.videoLabel}
                  allow="autoplay"
                  allowFullScreen
                  className="vc-step-video-iframe"
                />
              </div>
            )}
          </div>
          {i < FLOW_STEPS.length - 1 && (
            <div className="vc-flow-arrow">
              <svg viewBox="0 0 24 40" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="0" x2="12" y2="28" stroke="#c4b9f0" strokeWidth="2" strokeDasharray="4 3"/>
                <polygon points="6,28 18,28 12,38" fill="#6a11cb" opacity="0.7"/>
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>

    {/* Two-column detailed cards */}

  </section>
);

const PilotForm = ({ onSubmit, submitted }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);

    try {
      const body = new URLSearchParams({
        'form-name': 'vanicore-pilot-v2',
        alias: form.alias,
        ageGroup: form.ageGroup,
        condition: form.condition,
        symptoms: form.symptoms,
        impactedParts: form.impactedParts.join(', '),
        gestureCapabilities: form.gestureCapabilities.join(', '),
        willingness: form.willingness,
        platforms: form.platforms.join(', '),
        caregiverNote: form.caregiverNote,
      });
      await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    } catch {
      /* network failure — still save locally */
    }

    onSubmit({ ...form, id: uid(), date: today() });
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <section className="vc-section" id="pilot-form">
        <div className="vc-success-box">
          <div className="vc-success-icon">🎉</div>
          <h3>You're on the VANI Pilot List!</h3>
          <p>
            Your registration has been saved. The VANI team will review your profile and
            reach out via your caregiver or coordinator to onboard you.
          </p>
          <p className="vc-success-mission">
            <em>"Does this make the patient's life easier, safer, and more reliable?"</em>
            <br />— The VANI guiding question
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="vc-section" id="pilot-form">
      <h2 className="vc-section-title">
        <span className="vc-title-icon">📋</span> Join the Pilot Programme
      </h2>
      <div className="vc-pilot-proud">
        <div className="vc-pilot-proud-icon">🌟</div>
        <div>
          <strong>You are making history.</strong>
          <p>
            Every person who joins this pilot helps refine VANI for the millions of ALS, MND, and
            Locked-in patients who cannot yet speak for themselves. Your participation — however small
            it feels — directly shapes a technology that could give someone their voice back.
            We are honoured to have you here.
          </p>
        </div>
      </div>
      <p className="vc-section-sub">
        No personal identifying information is required. Your alias, condition profile,
        and motor function details help us calibrate VANI specifically for you.
      </p>

      {/* Hidden Netlify form for pre-registration */}
      <form name="vanicore-pilot-v2" data-netlify="true" data-netlify-honeypot="bot-field" style={{ display: 'none' }}>
        <input type="hidden" name="alias" />
        <input type="hidden" name="ageGroup" />
        <input type="hidden" name="condition" />
        <input type="hidden" name="symptoms" />
        <input type="hidden" name="impactedParts" />
        <input type="hidden" name="gestureCapabilities" />
        <input type="hidden" name="willingness" />
        <input type="hidden" name="platforms" />
        <input type="hidden" name="caregiverNote" />
      </form>

      <form className="vc-form" onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="bot-field" />

        <div className="vc-form-row">
          <div className="vc-field">
            <label htmlFor="f-alias">Alias / Nickname <span className="vc-required">*</span></label>
            <input
              id="f-alias"
              type="text"
              value={form.alias}
              onChange={(e) => set('alias', e.target.value)}
              placeholder="e.g. Sunflower, Pilot-04, Dev's Dad"
            />
            {errors.alias && <span className="vc-field-error">{errors.alias}</span>}
          </div>
          <div className="vc-field">
            <label htmlFor="f-age">Age Group <span className="vc-required">*</span></label>
            <select id="f-age" value={form.ageGroup} onChange={(e) => set('ageGroup', e.target.value)}>
              <option value="">— Select —</option>
              <option>Under 18</option>
              <option>18 – 30</option>
              <option>31 – 50</option>
              <option>51 – 70</option>
              <option>Over 70</option>
            </select>
            {errors.ageGroup && <span className="vc-field-error">{errors.ageGroup}</span>}
          </div>
        </div>

        <div className="vc-field">
          <label htmlFor="f-condition">Primary Condition <span className="vc-required">*</span></label>
          <select id="f-condition" value={form.condition} onChange={(e) => set('condition', e.target.value)}>
            <option value="">— Select condition —</option>
            {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
          {errors.condition && <span className="vc-field-error">{errors.condition}</span>}
        </div>

        <div className="vc-field">
          <label htmlFor="f-symptoms">Current Symptoms / Communication Challenges <span className="vc-required">*</span></label>
          <textarea
            id="f-symptoms"
            value={form.symptoms}
            onChange={(e) => set('symptoms', e.target.value)}
            placeholder="Briefly describe how the condition affects daily communication and movement..."
            rows={3}
          />
          {errors.symptoms && <span className="vc-field-error">{errors.symptoms}</span>}
        </div>

        <div className="vc-field">
          <label>
            Affected Motor Parts <span className="vc-required">*</span>
            <span className="vc-label-hint"> — tick what is impacted; everything unchecked is assumed working</span>
          </label>
          <CheckboxGroup
            options={MOTOR_PARTS}
            selected={form.impactedParts}
            onChange={(v) => set('impactedParts', v)}
          />
          {errors.impactedParts && <span className="vc-field-error">{errors.impactedParts}</span>}
        </div>

        <div className="vc-field">
          <label>Current Gesture Capabilities <span className="vc-label-hint">(select all that apply)</span></label>
          <CheckboxGroup
            options={GESTURE_CAPABILITIES}
            selected={form.gestureCapabilities}
            onChange={(v) => set('gestureCapabilities', v)}
          />
        </div>

        <div className="vc-field">
          <label>Pilot Willingness <span className="vc-required">*</span></label>
          <div className="vc-radio-group">
            {WILLINGNESS_OPTIONS.map((w) => (
              <label
                key={w.value}
                className={"vc-radio-item" + (form.willingness === w.value ? ' checked' : '')}
              >
                <input
                  type="radio"
                  name="willingness"
                  value={w.value}
                  checked={form.willingness === w.value}
                  onChange={() => set('willingness', w.value)}
                />
                <span>{w.label}</span>
              </label>
            ))}
          </div>
          {errors.willingness && <span className="vc-field-error">{errors.willingness}</span>}
        </div>

        <div className="vc-field">
          <label htmlFor="f-note">
            Note to the VANI Team <span className="vc-label-hint">(optional)</span>
          </label>
          <textarea
            id="f-note"
            value={form.caregiverNote}
            onChange={(e) => set('caregiverNote', e.target.value)}
            placeholder="Any additional context — caregiver setup, device availability, scheduling preferences..."
            rows={2}
          />
        </div>

        <button type="submit" className="vc-btn-primary vc-submit-btn" disabled={submitting}>
          {submitting ? 'Registering…' : 'Register for Pilot'}
        </button>
      </form>
    </section>
  );
};

const PilotCount = ({ pilots }) => {
  if (pilots.length === 0) return null;
  return (
    <section className="vc-section vc-pilot-count-section">
      <h2 className="vc-section-title">
        <span className="vc-title-icon">👥</span> People Who've Joined
      </h2>
      <p className="vc-section-sub">Aliases only — no personal data shown publicly.</p>
      <div className="vc-pilot-chips">
        {pilots.map((p) => (
          <div key={p.id} className="vc-pilot-chip">
            <span className="vc-pilot-chip-avatar">{(p.alias || 'P')[0].toUpperCase()}</span>
            <div className="vc-pilot-chip-info">
              <span className="vc-pilot-chip-alias">{p.alias}</span>
              <span className="vc-pilot-chip-cond">{p.condition}</span>
            </div>
            <span className={"vc-badge " + (p.willingness === 'eager' ? 'badge-green' : p.willingness === 'willing' ? 'badge-blue' : 'badge-gray')}>
              {p.willingness}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const FeedbackSection = ({ feedback, onSubmit }) => {
  const [form, setForm] = useState({ alias: '', message: '', rating: 5 });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const approved = feedback.filter((f) => f.approved);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.message.trim()) { setErr('Please write a message.'); return; }
    onSubmit({ ...form, id: uid(), date: today(), approved: false });
    setDone(true);
  };

  return (
    <section className="vc-section" id="feedback">
      <h2 className="vc-section-title">
        <span className="vc-title-icon">💬</span> Feedback from the Community
      </h2>
      <p className="vc-section-sub">
        Hear from caregivers and patients already using VANI. Your feedback shapes every release.
      </p>

      {approved.length > 0 ? (
        <div className="vc-feedback-list">
          {approved.map((f) => (
            <div key={f.id} className="vc-feedback-card">
              <div className="vc-feedback-stars">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
              <p className="vc-feedback-msg">"{f.message}"</p>
              <div className="vc-feedback-meta">
                <strong>{f.alias || 'Anonymous'}</strong>
                <span>{f.date}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="vc-feedback-empty">
          <span className="vc-feedback-empty-icon">🌱</span>
          <p>No feedback yet — be the first to share your experience with VANI!</p>
        </div>
      )}

      <div className="vc-feedback-submit-wrap">
        <h3 className="vc-sub-heading">Share Your Experience</h3>
        {done ? (
          <div className="vc-success-inline">
            ✅ Thank you! Your feedback will be reviewed and published shortly.
          </div>
        ) : (
          <form className="vc-feedback-form" onSubmit={handleSubmit} noValidate>
            <div className="vc-form-row">
              <div className="vc-field">
                <label htmlFor="fb-alias">Your Alias <span className="vc-label-hint">(optional)</span></label>
                <input
                  id="fb-alias"
                  type="text"
                  value={form.alias}
                  onChange={(e) => setForm((f) => ({ ...f, alias: e.target.value }))}
                  placeholder="Anonymous"
                />
              </div>
              <div className="vc-field">
                <label htmlFor="fb-rating">Rating</label>
                <select
                  id="fb-rating"
                  value={form.rating}
                  onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{'★'.repeat(n)} ({n}/5)</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="vc-field">
              <label htmlFor="fb-msg">Your Feedback <span className="vc-required">*</span></label>
              <textarea
                id="fb-msg"
                value={form.message}
                onChange={(e) => { setErr(''); setForm((f) => ({ ...f, message: e.target.value })); }}
                placeholder="How has VANI helped? What would you like to see improved?"
                rows={3}
              />
              {err && <span className="vc-field-error">{err}</span>}
            </div>
            <button type="submit" className="vc-btn-secondary">Submit Feedback</button>
          </form>
        )}
      </div>
    </section>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const VaniCore = () => {
  const [auth, setAuth]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin]     = useState(false);
  const [showSignup, setShowSignup]   = useState(false);
  const [loginContext, setLoginContext] = useState('default');
  const [activeTab, setActiveTab]     = useState('home');
  const [pilots, setPilots] = useState(() => readLS(LS_PILOTS, []));
  const [feedback, setFeedback] = useState(() => {
    const stored = readLS(LS_FEEDBACK, null);
    return stored || SEED_FEEDBACK;
  });
  const [downloads, setDownloads] = useState(() => readLS(LS_DOWNLOADS, {}));
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => { writeLS(LS_PILOTS, pilots); }, [pilots]);
  useEffect(() => { writeLS(LS_FEEDBACK, feedback); }, [feedback]);
  useEffect(() => { writeLS(LS_DOWNLOADS, downloads); }, [downloads]);

  // Load pilots + feedback from Firestore on mount
  useEffect(() => {
    (async () => {
      try {
        const pilotsSnap = await getDocs(query(collection(db, 'pilots'), orderBy('date', 'desc')));
        if (!pilotsSnap.empty) {
          const fsData = pilotsSnap.docs.map(d => ({ ...d.data(), _fsId: d.id }));
          setPilots(fsData);
          writeLS(LS_PILOTS, fsData);
        }
      } catch { /* Firestore unavailable — use localStorage */ }
      try {
        const fbSnap = await getDocs(query(collection(db, 'feedback'), orderBy('date', 'desc')));
        if (!fbSnap.empty) {
          const fsData = fbSnap.docs.map(d => ({ ...d.data(), _fsId: d.id }));
          setFeedback(fsData);
          writeLS(LS_FEEDBACK, fsData);
        }
      } catch { /* Firestore unavailable — use localStorage */ }
    })();
  }, []);

  // Firebase auth state — persists across page refreshes
  useEffect(() => {
    const unsub = onAuthStateChanged(fbAuth, async (user) => {
      if (user) {
        // Infer role from email as fallback (works even if Firestore write was blocked)
        const inferredRole = user.email === 'admin@vanicore.app' ? 'admin' : 'caregiver';
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            const d = snap.data();
            setAuth({ uid: user.uid, email: user.email, role: d.role, username: d.name || d.email });
          } else {
            // Firestore doc missing (rules may have blocked write) — create it now and still log in
            try {
              await setDoc(doc(db, 'users', user.uid), {
                name: user.displayName || user.email,
                email: user.email,
                role: inferredRole,
                createdAt: serverTimestamp(),
              });
            } catch { /* rules still blocking — proceed anyway */ }
            setAuth({ uid: user.uid, email: user.email, role: inferredRole, username: user.email });
          }
        } catch {
          // Firestore completely unavailable — set minimal auth so UI still works
          setAuth({ uid: user.uid, email: user.email, role: inferredRole, username: user.email });
        }
      } else {
        setAuth(null);
      }
      setAuthLoading(false);
      setShowLogin(false);
      setShowSignup(false);
      if (user) setActiveTab('dashboard');
    });
    return () => unsub();
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut(fbAuth);
    setActiveTab('home'); // always return to Home on sign-out
  }, []);

  const handleDownload = useCallback((buildId) => {
    setDownloads((d) => ({ ...d, [buildId]: (d[buildId] || 0) + 1 }));
  }, []);

  const handlePilotSubmit = useCallback(async (data) => {
    // Write to Firestore first, fall back to localStorage-only on error
    try {
      const ref = await addDoc(collection(db, 'pilots'), {
        ...data,
        submittedAt: serverTimestamp(),
      });
      const withId = { ...data, _fsId: ref.id };
      setPilots((prev) => [withId, ...prev]);
    } catch {
      setPilots((prev) => [data, ...prev]);
    }
    setFormSubmitted(true);
  }, []);

  const handleFeedbackSubmit = useCallback(async (data) => {
    try {
      const ref = await addDoc(collection(db, 'feedback'), {
        ...data,
        submittedAt: serverTimestamp(),
      });
      setFeedback((prev) => [{ ...data, _fsId: ref.id }, ...prev]);
    } catch {
      setFeedback((prev) => [data, ...prev]);
    }
  }, []);

  const handleApproveFeedback = useCallback(async (id) => {
    setFeedback((prev) => prev.map((f) => f.id === id ? { ...f, approved: true } : f));
    try {
      const entry = feedback.find(f => f.id === id);
      if (entry?._fsId) await updateDoc(doc(db, 'feedback', entry._fsId), { approved: true });
    } catch { /* sync best-effort */ }
  }, [feedback]);

  const handleDismissFeedback = useCallback(async (id) => {
    const entry = feedback.find(f => f.id === id);
    setFeedback((prev) => prev.filter((f) => f.id !== id));
    try {
      if (entry?._fsId) await deleteDoc(doc(db, 'feedback', entry._fsId));
    } catch { /* sync best-effort */ }
  }, [feedback]);

  const totalDownloads =
    BUILDS.reduce((sum, b) => sum + b.baseDownloads, 0) +
    BUILDS.reduce((sum, b) => sum + (downloads[b.id] || 0), 0);

  const myRegistration = auth && (auth.role === 'caregiver' || auth.role === 'patient')
    ? pilots.find((p) => p.alias === (auth.alias || auth.username))
    : null;

  return (
    <div className="vc-page">
      <TopBar auth={auth} onLogin={() => setShowLogin(true)} onLogout={handleLogout} />
      <TabNav active={activeTab} onChange={setActiveTab} auth={auth} onLoginRequest={(tabId) => { setLoginContext(tabId || 'default'); setShowLogin(true); }} />

      <div className="vc-tab-content">

        {/* ── Home ── */}
        {activeTab === 'home' && (
          <>
            <Hero pilotCount={pilots.length} totalDownloads={totalDownloads} />
          </>
        )}

        {/* ── Setup ── keep mounted so the video iframe never resets */}
        <div style={{ display: activeTab === 'setup' ? 'block' : 'none' }}>
          <SetupGuide auth={auth} builds={BUILDS} downloads={downloads} onDownload={handleDownload} onLogin={() => setShowLogin(true)} />
        </div>

        {/* ── Join Pilot ── */}
        {activeTab === 'pilot' && (
          <>
            <PilotForm onSubmit={handlePilotSubmit} submitted={formSubmitted} />
            <PilotCount pilots={pilots} />
          </>
        )}

        {/* ── Feedback ── */}
        {activeTab === 'feedback' && (
          <FeedbackSection feedback={feedback} onSubmit={handleFeedbackSubmit} />
        )}

        {/* ── Dashboard ── */}
        {activeTab === 'dashboard' && auth && auth.role === 'admin' && (
          <AdminDashboard
            pilots={pilots}
            feedback={feedback}
            downloads={downloads}
            onApproveFeedback={handleApproveFeedback}
            onDismissFeedback={handleDismissFeedback}
          />
        )}
        {activeTab === 'dashboard' && auth && (auth.role === 'caregiver' || auth.role === 'patient') && (
          <PatientDashboard auth={auth} myRegistration={myRegistration} />
        )}

      </div>

      <Footer />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSignup={() => setShowSignup(true)}
          context={loginContext}
        />
      )}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
        />
      )}
      {authLoading && (
        <div className="vc-auth-loading">Loading…</div>
      )}
    </div>
  );
};

export default VaniCore;
