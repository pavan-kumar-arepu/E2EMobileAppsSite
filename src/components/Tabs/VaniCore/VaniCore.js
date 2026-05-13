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
const SETUP_STEPS = [
  {
    platform: '🪟 Windows Setup',
    color: 'vc-setup-win',
    steps: [
      { icon: '📦', title: 'Extract the ZIP', body: 'Right-click VaniCore.zip → Extract All → choose Desktop → click Extract.' },
      { icon: '▶️', title: 'Launch VaniCore.exe', body: 'Double-click VaniCore.exe inside the extracted folder. If Windows shows a security warning, click "More info" → "Run anyway".' },
      { icon: '🙋', title: 'Enter Your Name', body: 'Type your name in the landing page text field and press Enter. A patient profile is created automatically.' },
      { icon: '📷', title: 'QR Code Appears', body: 'A QR code will display on screen — keep this visible. Your Android phone will scan it to connect.' },
    ],
  },
  {
    platform: '🤖 Android Setup',
    color: 'vc-setup-android',
    steps: [
      { icon: '⚙️', title: 'Enable Unknown Sources', body: 'Settings → About Phone → tap Build Number 7 times (enables Developer Mode) → Developer Options → toggle "Install from Unknown Sources" ON.' },
      { icon: '📲', title: 'Install the APK', body: 'Open Files / Downloads → tap VaniCore.apk → tap Install → wait 1–2 minutes → tap Open.' },
      { icon: '✅', title: 'Grant Permissions', body: 'Allow Camera (QR scanning), Microphone (audio), and Location when prompted. All are required.' },
      { icon: '📡', title: 'Scan & Connect', body: 'Open VaniCore on your phone → point camera at the QR code on your Windows screen → hold steady 2–3 seconds → connection takes 10–30 seconds.' },
    ],
  },
  {
    platform: '🧠 Calibration',
    color: 'vc-setup-calib',
    steps: [
      { icon: '💡', title: 'Good Lighting First', body: 'Ensure your face is well-lit — use a desk lamp if needed. Avoid backlighting or shadows.' },
      { icon: '📹', title: 'Face in Frame', body: 'Sit 12–18 inches from the webcam. Keep your face centred and visible throughout calibration.' },
      { icon: '👁️', title: 'Perform Gestures', body: 'Follow on-screen prompts: blink, wink (each eye), look left / right / up / down, raise eyebrows. Perform naturally — no need to exaggerate.' },
      { icon: '🎉', title: 'Ready to Use!', body: 'Screen shows "Calibration Complete!" and the Android app launches automatically — your system is ready.' },
    ],
  },
];

const SetupGuide = () => (
  <section className="vc-section" id="setup-guide">
    <h2 className="vc-section-title">
      <span className="vc-title-icon">📖</span> Setup Guide
    </h2>
    <p className="vc-section-sub">
      Start Windows first, then scan the QR code from your Android phone.
      Expected total setup time: ~10 minutes.
    </p>
    <div className="vc-setup-grid">
      {SETUP_STEPS.map((platform) => (
        <div key={platform.platform} className={`vc-setup-card ${platform.color}`}>
          <h3 className="vc-setup-platform">{platform.platform}</h3>
          <ol className="vc-setup-steps">
            {platform.steps.map((s, i) => (
              <li key={i} className="vc-setup-step">
                <span className="vc-setup-step-icon">{s.icon}</span>
                <div>
                  <strong>{s.title}</strong>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
    <div className="vc-setup-requirements">
      <h4>⚙️ Minimum Requirements</h4>
      <div className="vc-setup-req-grid">
        <div>
          <strong>🪟 Windows</strong>
          <ul>
            <li>Windows 10 or 11</li>
            <li>Webcam (built-in or USB)</li>
            <li>2 GB free disk space</li>
            <li>Intel i5 / AMD Ryzen 5 or better</li>
            <li>Internet connection (WiFi or Ethernet)</li>
          </ul>
        </div>
        <div>
          <strong>🤖 Android</strong>
          <ul>
            <li>Android 8.0 or higher</li>
            <li>100 MB free storage</li>
            <li>Camera (for QR scanning)</li>
            <li>Internet connection</li>
          </ul>
        </div>
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
        No personal identifying information is required. Your alias, condition profile, and motor
        function details help us calibrate VANI specifically for you.
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

      {approved.length > 0 && (
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
          Available on Windows and Android. <strong>Sign in</strong> (Admin or Patient / Caregiver) to access download links.
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

      <SetupGuide />

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
        <>
          <PatientDashboard auth={auth} myRegistration={myRegistration} />
          <FeedbackSection feedback={feedback} onSubmit={handleFeedbackSubmit} />
        </>
      )}

      {!auth && (
        <>
          <PilotForm onSubmit={handlePilotSubmit} submitted={formSubmitted} />
          <PilotCount pilots={pilots} />
          <FeedbackSection feedback={feedback} onSubmit={handleFeedbackSubmit} />
        </>
      )}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLogin} />
      )}
    </div>
  );
};

export default VaniCore;
