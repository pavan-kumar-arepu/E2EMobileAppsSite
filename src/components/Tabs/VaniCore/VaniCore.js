// src/components/Tabs/VaniCore/VaniCore.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './VaniCore.css';
import VaniJourney from '../VaniJourney/VaniJourney';
import {
  BUILDS,
  CHANGELOG,
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
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import AdminDashboard from './AdminDashboard';
import PatientDashboard from './PatientDashboard';
import CaregiverDashboard from './CaregiverDashboard';

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
  { id: 'home',      icon: '🏠', label: 'Home',       locked: false, hidden: false, desc: '' },
  { id: 'setup',     icon: '📖', label: 'Setup',      locked: true,  hidden: false, desc: 'Step-by-step setup in under 10 min' },
  { id: 'journey',   icon: '✦',  label: 'Journey',    locked: false, hidden: false, desc: 'The story behind VANI' },
  { id: 'pilot',     icon: '📋', label: 'Join Pilot', locked: true,  hidden: true,  desc: 'Register as a pilot participant' },
  { id: 'dashboard', icon: '📊', label: 'Dashboard',  locked: false, hidden: false, wip: true, desc: 'Your patient dashboard' },
  { id: 'feedback',  icon: '💬', label: 'Feedback',   locked: false, hidden: false, wip: true, desc: 'Read & share community feedback' },
];

const TabNav = ({ active, onChange, auth, onLoginRequest }) => {
  const visible = TABS.filter((t) => !t.hidden && (t.id !== 'dashboard' || auth));
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
            {t.wip && (t.id === 'feedback' || (auth && (auth.role === 'admin' || auth.role === 'caregiver'))) && (
              <span className="vc-tab-wip">In Progress</span>
            )}
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

const Hero = ({ pilotCount, totalDownloads, gestureCount }) => (
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
        <span className="vc-hero-stat-num">{gestureCount}</span>
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

// ── Build Info Modal ────────────────────────────────────────────────────────────
const BuildInfoModal = ({ platformId, builds, onClose, onDownload, auth, onLogin }) => {
  const build = builds.find(b => b.id === platformId);
  const category = platformId === 'android' ? 'android' : 'windows_mac';
  const history = CHANGELOG
    .map(release => ({ ...release, entry: release.entries.find(e => e.platformId === category) }))
    .filter(r => r.entry)
    .slice(0, 10);

  const getUrl = (entry) => {
    if (platformId === 'android') return entry.url;
    if (platformId === 'windows') return entry.urlWindows;
    return entry.urlMac;
  };

  if (!build) return null;

  return (
    <div className="vc-modal-overlay" onClick={onClose}>
      <div className="vc-bim-card vc-modal-card" onClick={e => e.stopPropagation()}>
        <button className="vc-modal-close" onClick={onClose}>✕</button>
        <div className="vc-bim-header">
          <span className="vc-bim-platform-icon">{build.icon}</span>
          <div>
            <h3 className="vc-bim-title">{build.platform} — Release History</h3>
            <p className="vc-bim-subtitle">Current version: <strong>{build.version}</strong> · Released {build.releaseDate}</p>
          </div>
        </div>
        <div className="vc-bim-releases">
          {history.map((release, i) => (
            <div key={release.version} className={`vc-bim-release${i === 0 ? ' vc-bim-release-latest' : ''}`}>
              <div className="vc-bim-release-header">
                <span className="vc-bim-version">{release.version}</span>
                {i === 0 && <span className="vc-bim-badge">Latest</span>}
                <span className="vc-bim-date">📅 {release.date} · ⏰ {release.time}</span>
              </div>
              <div className="vc-bim-section">
                <div className="vc-bim-label">🆕 What's New</div>
                <p className="vc-bim-text">{release.entry.notes}</p>
              </div>
              <div className="vc-bim-section">
                <div className="vc-bim-label">🧪 What to Test</div>
                <p className="vc-bim-text">{release.entry.whatToTest}</p>
              </div>
              <div className="vc-bim-actions">
                {auth ? (
                  <a
                    href={getUrl(release.entry)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={i === 0 ? 'vc-btn-primary vc-bim-dl-btn' : 'vc-btn-outline vc-bim-dl-btn-prev'}
                    onClick={() => i === 0 && onDownload && onDownload(platformId)}
                  >
                    ⬇️ {i === 0 ? `Download ${build.platform} ${release.version}` : `Download ${release.version}`}
                  </a>
                ) : (
                  <button
                    className="vc-btn-outline vc-bim-dl-btn-locked"
                    onClick={() => { onClose(); onLogin(); }}
                  >
                    🔐 Sign in to Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Setup Guide ─────────────────────────────────────────────────────────────────
const FLOW_STEPS = [
  { id: 'dl-android',      icon: '📲', app: 'android', label: 'Download VaniCare',             sub: 'Android APK — tap “Build Info & Download” below',    color: '#3ddc84', bg: '#f0fff6' },
  { id: 'install-android', icon: '⚙️', app: 'android', label: 'Install & Open VaniCare',        sub: 'Enable “Install from Unknown Sources” first',        color: '#3ddc84', bg: '#f0fff6' },
  { id: 'perms',           icon: '🔐', app: 'android', label: 'Accept Permissions',              sub: 'Camera · Microphone · Notifications',                 color: '#3ddc84', bg: '#f0fff6' },
  { id: 'wait-qr',         icon: '⏳', app: 'android', label: 'Wait for QR Screen',              sub: 'Keep screen on — VaniCare is ready to scan',          color: '#3ddc84', bg: '#f0fff6' },
  { id: 'dl-win',          icon: '📦', app: 'windows', label: 'Install VaniCore',                sub: 'Download · Extract ZIP · Run VaniCore.exe / .dmg',    color: '#0078d4', bg: '#f0f6ff' },
  { id: 'enter-name',      icon: '🙋', app: 'windows', label: 'Enter Your Name',                 sub: 'Type your name on the landing screen → press Enter', color: '#0078d4', bg: '#f0f6ff' },
  { id: 'qr-win',          icon: '📷', app: 'windows', label: 'QR Code Appears on Screen',       sub: 'Keep VaniCore window visible with the QR code',       color: '#0078d4', bg: '#f0f6ff' },
  { id: 'scan',            icon: '🔗', app: 'sync',    label: 'Scan QR from Android',            sub: 'Point VaniCare camera at the QR code on screen',      color: '#6a11cb', bg: '#f5f0ff' },
  { id: 'calib',           icon: '👁️', app: 'windows', label: 'Start Calibration',               sub: 'Follow on-screen gesture prompts on the desktop',     color: '#6a11cb', bg: '#f5f0ff' },
  { id: 'live',            icon: '🎉', app: 'sync',    label: 'Go Live!',                        sub: 'Android alerts the caregiver when gestures are detected', color: '#10b981', bg: '#f0fff8' },
];

const SETUP_VIDEOS = [
  { id: '1j6Eptr5sHER7xJCwZscH0iajaUfpJrR7', label: '📱 Android Setup', steps: 'Steps 1 – 4' },
  { id: '1ZDYpctill3FgoMBNf7sosGjFV1oAjQPN', label: '💻 Desktop Setup',  steps: 'Steps 5 – 8' },
  { id: '1qse5ihDnzfiX6M5pzFrtqhflyVUlxPoS', label: '🔗 Connect & Go Live', steps: 'Steps 8 – 10' },
];

const SETUP_PHASES = [
  { id: 'android', num: '01', title: 'VaniCare — Android', subtitle: 'Install on the caregiver’s phone first',   accentColor: '#3ddc84', badgeCls: 'vc-flow-badge-android', badgeLabel: '🤖 VaniCare (Android)', stepIds: ['dl-android','install-android','perms','wait-qr'] },
  { id: 'desktop', num: '02', title: 'VaniCore — Desktop',  subtitle: 'Install on the patient’s computer',       accentColor: '#0078d4', badgeCls: 'vc-flow-badge-win',     badgeLabel: '🪟 VaniCore (Windows / macOS)', stepIds: ['dl-win','enter-name','qr-win'] },
  { id: 'sync',    num: '03', title: 'Connect & Go Live',   subtitle: 'Pair both devices and start detecting',    accentColor: '#6a11cb', badgeCls: 'vc-flow-badge-sync',    badgeLabel: '🔗 Both Devices in Sync', stepIds: ['scan','calib','live'] },
];

const SetupGuide = ({ auth, builds, onDownload, onLogin, onBuildInfo }) => (
  <section className="vc-section vc-sg" id="setup-guide">
    <h2 className="vc-section-title">
      <span className="vc-title-icon">📖</span> Setup Guide
    </h2>
    <p className="vc-section-sub">
      Follow the three phases in order — total setup time is under 10&nbsp;minutes.
    </p>

    {/* System intro cards */}
    <div className="vc-system-intro">
      <h3 className="vc-system-intro-title">🔗 VANI is a two-part system</h3>
      <p className="vc-system-intro-desc">
        Install <strong>both apps</strong> — one on the patient’s computer and one on the caregiver’s
        Android phone. They sync wirelessly via Firebase.
      </p>
      <div className="vc-system-parts">
        <div className="vc-system-part vc-system-part-core">
          <div className="vc-system-part-icon">🪟</div>
          <div className="vc-system-part-name">VaniCore</div>
          <div className="vc-system-part-platform">Windows · macOS</div>
          <p className="vc-system-part-desc">On the <strong>patient’s computer</strong>. Detects eye &amp; facial gestures via webcam — no keypress needed.</p>
        </div>
        <div className="vc-system-plus">＋</div>
        <div className="vc-system-part vc-system-part-care">
          <div className="vc-system-part-icon">🤖</div>
          <div className="vc-system-part-name">VaniCare</div>
          <div className="vc-system-part-platform">Android</div>
          <p className="vc-system-part-desc">On the <strong>caregiver’s phone</strong>. Gets instant alerts — “Yes”, “No”, “Help” — the moment a gesture is detected.</p>
        </div>
      </div>
    </div>

    {/* Video walkthroughs — 3 equal cards */}
    <div className="vc-sg-videos">
      <div className="vc-sg-videos-title">📹 Video Walkthroughs</div>
      <div className="vc-sg-video-grid">
        {SETUP_VIDEOS.map((v) => (
          <div key={v.id} className="vc-sg-video-card">
            <div className="vc-sg-video-meta">
              <span className="vc-sg-video-label">{v.label}</span>
              <span className="vc-sg-video-steps">{v.steps}</span>
            </div>
            {auth ? (
              <div className="vc-sg-video-frame">
                <iframe
                  src={`https://drive.google.com/file/d/${v.id}/preview`}
                  title={v.label}
                  allow="autoplay"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="vc-sg-video-locked" onClick={onLogin}>
                <div className="vc-sg-video-play">▶</div>
                <p>🔐 Sign in to watch</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Phases */}
    {SETUP_PHASES.map((phase) => {
      const steps = phase.stepIds.map((sid) => FLOW_STEPS.find((s) => s.id === sid)).filter(Boolean);
      return (
        <div key={phase.id} className="vc-sg-phase">
          <div className="vc-sg-phase-header" style={{ borderLeftColor: phase.accentColor }}>
            <span className="vc-sg-phase-num" style={{ background: phase.accentColor }}>{phase.num}</span>
            <div className="vc-sg-phase-text">
              <div className="vc-sg-phase-title">{phase.title}</div>
              <div className="vc-sg-phase-sub">{phase.subtitle}</div>
            </div>
            <span className={`vc-flow-badge ${phase.badgeCls}`}>{phase.badgeLabel}</span>
          </div>

          <div className="vc-sg-steps-grid">
            {steps.map((step) => {
              const globalIdx = FLOW_STEPS.findIndex((s) => s.id === step.id);
              return (
                <div key={step.id} className="vc-sg-step-card" style={{ '--step-color': phase.accentColor }}>
                  <div className="vc-sg-step-num" style={{ background: phase.accentColor }}>
                    {globalIdx + 1}
                  </div>
                  <div className="vc-sg-step-icon">{step.icon}</div>
                  <div className="vc-sg-step-label">{step.label}</div>
                  <div className="vc-sg-step-sub">{step.sub}</div>
                  {/* Android download button */}
                  {step.id === 'dl-android' && builds && builds.find(x => x.id === 'android') && (
                    <button className="vc-sg-dl-btn vc-sg-dl-btn-android" onClick={() => onBuildInfo && onBuildInfo('android')}>
                      📋 Build Info &amp; Download
                    </button>
                  )}
                  {/* Desktop download buttons */}
                  {step.id === 'dl-win' && builds && (
                    <div className="vc-sg-dl-group">
                      {builds.filter(x => x.id === 'windows' || x.id === 'mac').map(b => (
                        <button key={b.id} className="vc-sg-dl-btn vc-sg-dl-btn-desktop" onClick={() => onBuildInfo && onBuildInfo(b.id)}>
                          {b.icon} {b.platform}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
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

// ── Star Picker ───────────────────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => (
  <div className="vc-star-picker" aria-label="Rating">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        className={`vc-star-btn${n <= value ? ' active' : ''}`}
        onClick={() => onChange(n)}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
      >★</button>
    ))}
  </div>
);

// ── Feedback Card ─────────────────────────────────────────────────────────────
const FeedbackCard = ({ f, isAdmin, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ message: f.message, rating: f.rating });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!draft.message.trim()) return;
    setSaving(true);
    await onEdit(f, draft);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className={`vc-fb-card${f.approved ? '' : ' vc-fb-card-pending'}`}>
      {!f.approved && <span className="vc-fb-pending-badge">⏳ Pending Review</span>}
      {editing ? (
        <div className="vc-fb-edit-area">
          <StarPicker value={draft.rating} onChange={(r) => setDraft((d) => ({ ...d, rating: r }))} />
          <div className="vc-field">
            <textarea
              value={draft.message}
              onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
              rows={3}
              placeholder="Edit feedback…"
            />
          </div>
          <div className="vc-fb-edit-actions">
            <button className="vc-btn-primary vc-btn-sm" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button className="vc-btn-outline vc-btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="vc-fb-card-top">
            <span className="vc-pilot-chip-avatar">{(f.alias || 'A')[0].toUpperCase()}</span>
            <div className="vc-fb-card-main">
              <div className="vc-fb-stars">{'★'.repeat(f.rating || 0)}{'☆'.repeat(5 - (f.rating || 0))}</div>
              <p className="vc-fb-msg">"{f.message}"</p>
              <div className="vc-fb-meta">
                <span className="vc-fb-alias">{f.alias || 'Anonymous'}</span>
                <span className="vc-fb-date">{f.date}</span>
              </div>
            </div>
          </div>
          {isAdmin && (
            <div className="vc-fb-admin-bar">
              <button className="vc-btn-sm vc-btn-outline" onClick={() => { setDraft({ message: f.message, rating: f.rating }); setEditing(true); }}>✏️ Edit</button>
              <button className="vc-btn-sm vc-btn-red" onClick={() => onDelete(f)}>🗑️ Delete</button>
              {!f.approved && (
                <button className="vc-btn-sm vc-btn-green" onClick={() => onEdit(f, { approved: true })}>✅ Approve</button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── Feedback Section ──────────────────────────────────────────────────────────
const FeedbackSection = ({ feedback, auth, onSubmit, onEdit, onDelete }) => {
  const [form, setForm] = useState({ alias: '', message: '', rating: 5 });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const isAdmin = auth?.role === 'admin';

  // Admins see all; public sees only approved
  const visible = isAdmin ? feedback : feedback.filter((f) => f.approved);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.message.trim()) { setErr('Please share your experience.'); return; }
    onSubmit({ ...form, id: uid(), date: today(), approved: false });
    setForm({ alias: '', message: '', rating: 5 });
    setDone(true);
  };

  return (
    <section className="vc-fb-section" id="feedback">
      <div className="vc-fb-inner">
      <h2 className="vc-section-title">
        <span className="vc-title-icon">💬</span> Community Feedback
      </h2>
      <p className="vc-section-sub">
        Real experiences from caregivers and patients. Every voice helps shape the next release.
      </p>
      {isAdmin && (
        <div className="vc-fb-admin-notice">
          ⚙️ Admin view — pending and approved entries visible. Edit or delete syncs to Firebase instantly.
        </div>
      )}

      {visible.length > 0 ? (
        <div className="vc-fb-grid">
          {visible.map((f) => (
            <FeedbackCard
              key={f._fsId || f.id}
              f={f}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="vc-feedback-empty">
          <span className="vc-feedback-empty-icon">🌱</span>
          <p>{isAdmin ? 'No feedback submitted yet.' : 'No published feedback yet — be the first!'}</p>
        </div>
      )}

      <h3 className="vc-sub-heading" style={{ marginTop: 8 }}>Share Your Experience</h3>
      {done ? (
        <div className="vc-success-inline">
          ✅ Thank you — your feedback has been received and will be reviewed shortly.
          <div style={{ marginTop: 12 }}>
            <button className="vc-btn-outline" onClick={() => setDone(false)}>Submit another</button>
          </div>
        </div>
      ) : (
        <form className="vc-form" style={{ maxWidth: 560 }} onSubmit={handleSubmit} noValidate>
          <div className="vc-form-row">
            <div className="vc-field">
              <label htmlFor="fb-alias">Your Name / Alias <span className="vc-label-hint">(optional)</span></label>
              <input
                id="fb-alias"
                type="text"
                value={form.alias}
                onChange={(e) => setForm((f) => ({ ...f, alias: e.target.value }))}
                placeholder="e.g. Caregiver in Chennai"
                maxLength={40}
              />
            </div>
            <div className="vc-field">
              <label>How would you rate VANI?</label>
              <StarPicker value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
            </div>
          </div>
          <div className="vc-field">
            <label htmlFor="fb-msg">Your Experience <span className="vc-required">*</span></label>
            <textarea
              id="fb-msg"
              value={form.message}
              onChange={(e) => { setErr(''); setForm((f) => ({ ...f, message: e.target.value })); }}
              placeholder="How has VANI helped? What would make it better?"
              rows={4}
              maxLength={600}
            />
            <div className="vc-fb-char-count">{form.message.length}/600</div>
            {err && <span className="vc-field-error">{err}</span>}
          </div>
          <button type="submit" className="vc-btn-primary vc-submit-btn">Submit Feedback</button>
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
  const [buildModal, setBuildModal] = useState(null); // null | 'android' | 'windows' | 'mac'
  const [patients, setPatients] = useState([]);

  useEffect(() => { writeLS(LS_PILOTS, pilots); }, [pilots]);
  useEffect(() => { writeLS(LS_FEEDBACK, feedback); }, [feedback]);
  useEffect(() => { writeLS(LS_DOWNLOADS, downloads); }, [downloads]);

  // ── Real-time Firestore listeners ──────────────────────────────────────────
  useEffect(() => {
    // Feedback — live updates
    const unsub = onSnapshot(
      query(collection(db, 'feedback'), orderBy('date', 'desc')),
      (snap) => {
        const fsData = snap.docs.map(d => ({ ...d.data(), _fsId: d.id }));
        setFeedback(fsData);
        writeLS(LS_FEEDBACK, fsData);
      },
      () => { /* Firestore unavailable — keep localStorage */ }
    );
    return () => unsub();
  }, []);

  // Load pilots + patients from Firestore on mount
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
      // Feedback is handled by real-time onSnapshot listener above
      // Load live patients
      try {
        const patSnap = await getDocs(collection(db, 'patients'));
        if (!patSnap.empty) {
          const patData = await Promise.all(patSnap.docs.map(async (d) => {
            const base = { ...d.data(), _fsId: d.id };
            // Fetch recent gesture events
            try {
              const evtSnap = await getDocs(query(collection(db, 'gestures', d.id, 'events'), orderBy('timestamp', 'desc')));
              base._recentGestures = evtSnap.docs.slice(0, 5).map(e => e.data());
              base._gestureCount = evtSnap.size;
            } catch { base._recentGestures = []; base._gestureCount = 0; }
            // Fetch pending notifications
            try {
              const notifSnap = await getDocs(collection(db, 'notifications', d.id, 'pending'));
              base._pendingNotifs = notifSnap.docs.map(e => e.data());
            } catch { base._pendingNotifs = []; }
            return base;
          }));
          setPatients(patData);
        }
      } catch { /* patients unavailable */ }
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
    const entry = feedback.find(f => (f._fsId || f.id) === id);
    setFeedback((prev) => prev.filter((f) => (f._fsId || f.id) !== id));
    try {
      if (entry?._fsId) await deleteDoc(doc(db, 'feedback', entry._fsId));
    } catch { /* sync best-effort */ }
  }, [feedback]);


  const handleEditFeedback = useCallback(async (entry, changes) => {
    const key = entry._fsId || entry.id;
    setFeedback((prev) => prev.map((f) =>
      (f._fsId || f.id) === key ? { ...f, ...changes } : f
    ));
    try {
      if (entry._fsId) await updateDoc(doc(db, 'feedback', entry._fsId), { ...changes });
    } catch { /* sync best-effort */ }
  }, []);

  const totalDownloads = Object.values(downloads).reduce((s, v) => s + v, 0);
  const totalGestures = patients.reduce((s, p) => s + (p._gestureCount || 0), 0);

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
            <Hero pilotCount={patients.length} totalDownloads={totalDownloads} gestureCount={totalGestures} />
          </>
        )}

        {/* ── Journey ── */}
        {activeTab === 'journey' && <VaniJourney />}

        {/* ── Setup ── keep mounted so the video iframe never resets */}
        <div style={{ display: activeTab === 'setup' ? 'block' : 'none' }}>
          <SetupGuide auth={auth} builds={BUILDS} downloads={downloads} onDownload={handleDownload} onLogin={() => setShowLogin(true)} onBuildInfo={(pid) => setBuildModal(pid)} />
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
          <FeedbackSection
            feedback={feedback}
            auth={auth}
            onSubmit={handleFeedbackSubmit}
            onEdit={handleEditFeedback}
            onDelete={handleDismissFeedback}
          />
        )}

        {/* ── Dashboard ── */}
        {activeTab === 'dashboard' && auth && auth.role === 'admin' && (
          <AdminDashboard
            feedback={feedback}
            downloads={downloads}
            patients={patients}
            onApproveFeedback={handleApproveFeedback}
            onDismissFeedback={handleDismissFeedback}
          />
        )}
        {activeTab === 'dashboard' && auth && (auth.role === 'caregiver' || auth.role === 'patient') && (
          auth.role === 'caregiver'
            ? <CaregiverDashboard auth={auth} />
            : <PatientDashboard auth={auth} myRegistration={myRegistration} />
        )}

      </div>

      <Footer />

      {buildModal && (
        <BuildInfoModal
          platformId={buildModal}
          builds={BUILDS}
          onClose={() => setBuildModal(null)}
          onDownload={handleDownload}
          auth={auth}
          onLogin={() => { setBuildModal(null); setShowLogin(true); }}
        />
      )}

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
