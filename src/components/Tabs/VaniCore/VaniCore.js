// src/components/Tabs/VaniCore/VaniCore.js
import React, { useState, useEffect, useCallback } from 'react';
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
  LS_AUTH,
} from './VaniCoreConfig';
import LoginModal from './LoginModal';
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
      <span className="vc-topbar-name">VaniCore Pilot Portal</span>
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

const Hero = ({ pilotCount, totalDownloads }) => (
  <section className="vc-hero">
    <div className="vc-hero-badge">Pilot Program — Open Now</div>
    <h1 className="vc-hero-title">VANI — Voice &amp; Non-verbal Intelligence</h1>
    <p className="vc-hero-sub">
      A communication bridge designed for individuals who cannot speak or move — restoring
      independence, dignity, and identity for patients with ALS/MND, Locked-in Syndrome,
      and similar conditions. VANI detects eye movements, blinks, and facial gestures with
      near clinical-grade reliability.
    </p>
    <div className="vc-hero-principles">
      <span className="vc-principle">Reliability First</span>
      <span className="vc-principle">Patient-Adaptive</span>
      <span className="vc-principle">Affordability by Design</span>
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
        <span className="vc-hero-stat-num">3</span>
        <span className="vc-hero-stat-label">Platforms</span>
      </div>
    </div>
  </section>
);

const DownloadCard = ({ build, extraCount, onDownload, auth, onLogin }) => {
  const total = build.baseDownloads + (extraCount || 0);
  const isPlaceholder = build.url === '#';
  const isLocked = !auth;

  return (
    <div className="vc-dl-card">
      <div className="vc-dl-icon">{build.icon}</div>
      <h3 className="vc-dl-platform">{build.platform}</h3>
      <p className="vc-dl-desc">{build.description}</p>
      <div className="vc-dl-meta">
        <span className="vc-dl-meta-item">v{build.version}</span>
        <span className="vc-dl-meta-dot">·</span>
        <span className="vc-dl-meta-item">{build.size}</span>
        <span className="vc-dl-meta-dot">·</span>
        <span className="vc-dl-meta-item">{build.releaseDate}</span>
      </div>
      <div className="vc-dl-count">{total} downloads</div>

      {isLocked ? (
        <>
          <button className="vc-btn-primary vc-dl-btn" onClick={onLogin}>
            🔐 Sign In to Download
          </button>
          <p className="vc-dl-placeholder-note">Admin or Patient / Caregiver login required</p>
        </>
      ) : isPlaceholder ? (
        <>
          <button className="vc-btn-primary vc-dl-btn vc-btn-disabled" disabled>
            Coming Soon
          </button>
          <p className="vc-dl-placeholder-note">Build not yet available for this platform</p>
        </>
      ) : (
        <a
          href={build.url}
          className="vc-btn-primary vc-dl-btn"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onDownload(build.id)}
          title={"Download " + build.filename}
        >
          ⬇️ Download {build.ext}
        </a>
      )}
    </div>
  );
};

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

const SetupGuide = ({ auth }) => (
  <section className="vc-section" id="setup-guide">
    <h2 className="vc-section-title">
      <span className="vc-title-icon">📖</span> Setup Guide
    </h2>
    <p className="vc-section-sub">
      Follow this sequence exactly — start with Android first, then Windows.
      Total setup time: less than 10 minutes.
    </p>

    {/* Video walkthrough — login required */}
    {auth ? (
      <div className="vc-video-embed-wrap">
        <div className="vc-video-embed-label">📹 Setup Walkthrough Video</div>
        <div className="vc-video-embed-frame">
          <iframe
            src="https://drive.google.com/file/d/1f_AcOHNckHwcC9j9uidSceTLcC13zAoL/preview"
            title="VANI Setup Walkthrough"
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
          <div className="vc-flow-item">
            <div className="vc-flow-node" style={{ borderColor: step.color, background: step.bg }}>
              <div className="vc-flow-step-num" style={{ background: step.color }}>{i + 1}</div>
              <div className="vc-flow-icon">{step.icon}</div>
              <div className="vc-flow-label">{step.label}</div>
              <div className="vc-flow-sub">{step.sub}</div>
              <span className={`vc-flow-badge ${APP_BADGE[step.app].cls}`}>
                {APP_BADGE[step.app].label}
              </span>
            </div>
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
    <h3 className="vc-setup-detail-heading">📋 Detailed Instructions</h3>
    <div className="vc-setup-grid">
      <div className="vc-setup-card vc-setup-android">
        <h3 className="vc-setup-platform">🤖 Android — VaniCare</h3>
        <ol className="vc-setup-steps">
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">⚙️</span>
            <div><strong>Enable Unknown Sources</strong>
              <p>Settings → About Phone → tap Build Number 7 times (enables Developer Mode) → Developer Options → toggle "Install from Unknown Sources" ON.</p>
            </div>
          </li>
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">📲</span>
            <div><strong>Install VaniCare APK</strong>
              <p>Open Files / Downloads → tap VaniCare.apk → tap Install → wait 1–2 min → tap Open.</p>
            </div>
          </li>
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">✅</span>
            <div><strong>Grant Permissions</strong>
              <p>Allow Camera (QR scanning), Microphone, and Notifications when prompted. All required.</p>
            </div>
          </li>
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">⏳</span>
            <div><strong>Wait at QR Scanner Screen</strong>
              <p>Leave VaniCare open on the QR scan screen — keep screen brightness up. You'll scan after Windows is ready.</p>
            </div>
          </li>
        </ol>
      </div>

      <div className="vc-setup-card vc-setup-win">
        <h3 className="vc-setup-platform">🪟 Windows — VaniCore</h3>
        <ol className="vc-setup-steps">
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">📦</span>
            <div><strong>Extract the ZIP</strong>
              <p>Right-click VaniCore.zip → Extract All → choose Desktop → click Extract.</p>
            </div>
          </li>
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">▶️</span>
            <div><strong>Launch VaniCore.exe</strong>
              <p>Double-click VaniCore.exe. If Windows shows a security warning, click "More info" → "Run anyway".</p>
            </div>
          </li>
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">🙋</span>
            <div><strong>Enter Your Name</strong>
              <p>Type your name in the landing page text field and press Enter. A patient profile is created automatically.</p>
            </div>
          </li>
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">📷</span>
            <div><strong>QR Code Appears</strong>
              <p>A QR code will display on screen — keep it visible. Your Android phone will scan it to connect.</p>
            </div>
          </li>
        </ol>
      </div>

      <div className="vc-setup-card vc-setup-calib">
        <h3 className="vc-setup-platform">🔗 Sync &amp; Calibration</h3>
        <ol className="vc-setup-steps">
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">📡</span>
            <div><strong>Scan QR Code from Android</strong>
              <p>Open VaniCare on your phone → point camera at the QR code on Windows → hold steady 2–3 seconds → connection takes 10–30 seconds.</p>
            </div>
          </li>
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">💡</span>
            <div><strong>Prepare for Calibration</strong>
              <p>Ensure your face is well-lit. Sit 12–18 inches from the webcam. Avoid backlighting or shadows.</p>
            </div>
          </li>
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">👁️</span>
            <div><strong>Perform Gestures</strong>
              <p>Follow on-screen prompts: blink, wink, look left / right / up / down, raise eyebrows. Perform naturally.</p>
            </div>
          </li>
          <li className="vc-setup-step">
            <span className="vc-setup-step-icon">🎉</span>
            <div><strong>Go Live!</strong>
              <p>"Calibration Complete!" appears on Windows. VaniCare on your Android now receives real-time gesture notifications!</p>
            </div>
          </li>
        </ol>
      </div>
    </div>

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
      <p className="vc-section-sub">
        No personal identifying information is required. Your alias, condition profile, and motor function details help us calibrate VANI specifically for you.
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
  const [auth, setAuth] = useState(() => {
    try {
      const stored = sessionStorage.getItem(LS_AUTH);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [showLogin, setShowLogin] = useState(false);
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

  const handleLogin = useCallback((authData) => {
    setAuth(authData);
    try { sessionStorage.setItem(LS_AUTH, JSON.stringify(authData)); } catch { /* noop */ }
    setShowLogin(false);
  }, []);

  const handleLogout = useCallback(() => {
    setAuth(null);
    sessionStorage.removeItem(LS_AUTH);
  }, []);

  const handleDownload = useCallback((buildId) => {
    setDownloads((d) => ({ ...d, [buildId]: (d[buildId] || 0) + 1 }));
  }, []);

  const handlePilotSubmit = useCallback((data) => {
    setPilots((prev) => [...prev, data]);
    setFormSubmitted(true);
  }, []);

  const handleFeedbackSubmit = useCallback((data) => {
    setFeedback((prev) => [...prev, data]);
  }, []);

  const handleApproveFeedback = useCallback((id) => {
    setFeedback((prev) => prev.map((f) => f.id === id ? { ...f, approved: true } : f));
  }, []);

  const handleDismissFeedback = useCallback((id) => {
    setFeedback((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const totalDownloads =
    BUILDS.reduce((sum, b) => sum + b.baseDownloads, 0) +
    BUILDS.reduce((sum, b) => sum + (downloads[b.id] || 0), 0);

  const myRegistration = auth && auth.role === 'patient'
    ? pilots.find((p) => p.alias === auth.alias)
    : null;

  return (
    <div className="vc-page">
      <TopBar auth={auth} onLogin={() => setShowLogin(true)} onLogout={handleLogout} />
      <Hero pilotCount={pilots.length} totalDownloads={totalDownloads} />

      <section className="vc-section" id="downloads">
        <h2 className="vc-section-title">
          <span className="vc-title-icon">⬇️</span> Download VaniCore
        </h2>
        <p className="vc-section-sub">
          Available on Windows, macOS, and Android. <strong>Sign in</strong> (Admin or Patient / Caregiver) to access download links.
        </p>
        {!auth && (
          <div className="vc-signin-nudge">
            🔐 Downloads are restricted to registered participants. Please{' '}
            <button className="vc-inline-link" onClick={() => setShowLogin(true)}>Sign In</button>
            {' '}to download.
          </div>
        )}
        <div className="vc-dl-grid">
          {BUILDS.map((b) => (
            <DownloadCard
              key={b.id}
              build={b}
              extraCount={downloads[b.id] || 0}
              onDownload={handleDownload}
              auth={auth}
              onLogin={() => setShowLogin(true)}
            />
          ))}
        </div>
      </section>

      <SetupGuide auth={auth} />

      {auth && auth.role === 'admin' && (
        <AdminDashboard
          pilots={pilots}
          feedback={feedback}
          downloads={downloads}
          onApproveFeedback={handleApproveFeedback}
          onDismissFeedback={handleDismissFeedback}
        />
      )}

      {auth && auth.role === 'patient' && (
        <PatientDashboard auth={auth} myRegistration={myRegistration} />
      )}

      {!auth && (
        <>
          <PilotForm onSubmit={handlePilotSubmit} submitted={formSubmitted} />
          <PilotCount pilots={pilots} />
        </>
      )}

      <FeedbackSection feedback={feedback} onSubmit={handleFeedbackSubmit} />

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLogin} />
      )}
    </div>
  );
};

export default VaniCore;
