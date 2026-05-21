// src/components/Tabs/VaniJourney/VaniJourney.js
import React, { useEffect, useRef, useState } from 'react';
import './VaniJourney.css';

/* ─────────────────────────────────────────────
   MILESTONES — curated highlights only
   Each entry has: date, label, title, body, icon, tag
───────────────────────────────────────────── */
const MILESTONES = [
  {
    id: 1,
    date: 'April 2025',
    label: '2025',
    title: 'It Started with a Bell',
    icon: '🔔',
    tag: 'The Origin',
    tagColor: 'amber',
    body: 'Before any system existed, there was a simple question: what if a patient who cannot speak or move could still call for help? The first answer was a bell — triggered by a double blink. That one gesture, that one sound, was proof that the idea was real. It worked. And that changed everything.',
  },
  {
    id: 2,
    date: 'May 2025',
    label: '2025',
    title: 'Two Eyes, Three Choices',
    icon: '👁️',
    tag: 'First Expansion',
    tagColor: 'teal',
    body: 'The bell was just the beginning. The thinking evolved: if a blink could mean "help", what could a glance mean? Left and right gaze were added — giving the patient the ability to say yes, say no, and call for help. Three choices. Three gestures. A small vocabulary that carried enormous meaning for someone who had lost their voice.',
  },
  {
    id: 3,
    date: 'April 1, 2026',
    label: 'April 2026',
    title: 'A New Year, A Real System',
    icon: '✦',
    tag: 'Foundation',
    tagColor: 'teal',
    body: 'The idea that had been quietly growing through 2025 became a full system. The question shifted from "can this work?" to "how do we make this work for everyone?" Eight gestures were defined — not the most, but the most reliable. The guiding principle: fewer actions with absolute certainty is worth more than many actions with doubt.',
  },
  {
    id: 4,
    date: 'April 2–3, 2026',
    label: 'April 2026',
    title: 'No Two Patients Are the Same',
    icon: '◎',
    tag: 'Personalization',
    tagColor: 'amber',
    body: 'Here was the hard truth: a gesture that is effortless for one person may be the limit of what another can do. ALS takes away motor ability at different rates and in different patterns. The system had to learn each patient individually — measuring their actual range, not assuming a universal standard. This was the moment the design became genuinely human.',
  },
  {
    id: 5,
    date: 'April 5, 2026',
    label: 'April 2026',
    title: 'The First Notification',
    icon: '⬡',
    tag: 'Connected',
    tagColor: 'purple',
    body: 'A patient blinks twice. A caregiver\'s phone lights up: "Patient needs HELP." Seeing that notification arrive — in real time, from a gesture, across the room — was the moment the whole idea stopped being theoretical. The bridge between a patient\'s intention and a caregiver\'s awareness was real and working.',
  },
  {
    id: 6,
    date: 'April 11–12, 2026',
    label: 'April 2026',
    title: 'It Works on Every Machine',
    icon: '◈',
    tag: 'Reach',
    tagColor: 'blue',
    body: 'Hospitals use what they have — different computers, different setups. The system could not be limited to one environment. It was rebuilt to run anywhere: a Mac at a clinic, a Windows PC in a ward, a small edge device at a bedside. A one-click installer for each. No technical setup. No barriers to adoption.',
  },
  {
    id: 7,
    date: 'April 13–14, 2026',
    label: 'April 2026',
    title: 'A Patient Has a Name',
    icon: '✺',
    tag: 'Patient First',
    tagColor: 'green',
    body: 'The system became personal. A patient is created, calibrated once, and given a QR code. Any caregiver — family, nurse, night staff — scans that code and is instantly connected. The patient\'s profile travels with them. Their gestures, their preferences, their identity in the system — all persistent, all theirs.',
  },
  {
    id: 8,
    date: 'April 17–18, 2026',
    label: 'April 2026',
    title: 'Ready to Ship',
    icon: '⬢',
    tag: 'Distribution',
    tagColor: 'amber',
    body: 'An idea only matters if it reaches people. The focus turned to delivery: how does a hospital IT team install this without a developer in the room? The answer was professional one-click installers for every platform, built automatically whenever the code is ready, available for download without any technical knowledge required.',
  },
  {
    id: 9,
    date: 'May 5, 2026',
    label: 'May 2026',
    title: 'Silence Has a Cause. Fix It.',
    icon: '◉',
    tag: 'Resilience',
    tagColor: 'red',
    body: 'The system was working in testing but silent in the real world. Something was wrong. The investigation was patient and methodical — and found three separate failures all hiding at once. Each one was fixed. This was not a setback. This was the system proving it could be debugged, hardened, and trusted.',
  },
  {
    id: 10,
    date: 'May 11, 2026',
    label: 'May 2026',
    title: 'Different Machine, Same Mission',
    icon: '◇',
    tag: 'Testing',
    tagColor: 'blue',
    body: 'Testing moved to a different computer entirely — one that reflects a real-world hospital setting. The system started cleanly, communicated correctly, and a new display issue was discovered and logged. Each obstacle found in testing is one fewer obstacle a patient will ever encounter.',
  },
  {
    id: 11,
    date: 'May 19–20, 2026',
    label: 'May 2026',
    title: 'In Someone\'s Hands',
    icon: '★',
    tag: 'First Delivery',
    tagColor: 'teal',
    body: 'The first build was shared with a real client. Not a demo, not a prototype — a named, versioned installer that someone could open, install, and use. From the first bell that rang in 2025 to an application sitting in someone\'s Applications folder in 2026. This is what the journey looks like when you refuse to stop.',
  },
];

/* ─────────────────────────────────────────────
   STATS
───────────────────────────────────────────── */
const STATS = [
  { value: '2',  label: 'Years in the Making', suffix: '' },
  { value: '8',  label: 'Gestures — Every One Counts', suffix: '' },
  { value: '11', label: 'Milestones So Far', suffix: '+' },
  { value: '3',  label: 'Platforms — Mac · Win · Edge', suffix: '' },
];

/* ─────────────────────────────────────────────
   ANIMATED MILESTONE CARD
───────────────────────────────────────────── */
function MilestoneCard({ m, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.18 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const side = index % 2 === 0 ? 'left' : 'right';

  return (
    <div
      ref={ref}
      className={`vj-milestone vj-side-${side} ${visible ? 'vj-visible' : ''}`}
      style={{ '--delay': `${index * 0.08}s` }}
    >
      {/* connector dot */}
      <div className="vj-dot">
        <span className="vj-dot-icon">{m.icon}</span>
        <span className="vj-dot-pulse" />
      </div>

      {/* card */}
      <div className="vj-card">
        <div className="vj-card-header">
          <span className={`vj-tag vj-tag-${m.tagColor}`}>{m.tag}</span>
          <span className="vj-date">{m.date}</span>
        </div>
        <div className="vj-label">{m.label}</div>
        <h3 className="vj-card-title">{m.title}</h3>
        <p className="vj-card-body">{m.body}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAT COUNTER
───────────────────────────────────────────── */
function StatItem({ value, label, suffix }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const target = parseInt(value, 10);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <div ref={ref} className="vj-stat">
      <span className="vj-stat-value">{count}{suffix}</span>
      <span className="vj-stat-label">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function VaniJourney() {
  return (
    <div className="vj-page">

      {/* ── HERO ──────────────────────────────── */}
      <section className="vj-hero">
        <div className="vj-hero-glow" />
        <div className="vj-hero-inner">
          <div className="vj-hero-badge">Open · No Login Required</div>
          <h1 className="vj-hero-title">
            The Vani Journey
          </h1>
          <p className="vj-hero-subtitle">
            A real‑time assistive communication system for people living with ALS, paralysis,
            and locked‑in syndrome — built to give every patient a voice through facial gestures alone.
          </p>
          <div className="vj-hero-divider" />
          <p className="vj-hero-origin">
            Built for every patient who has lost their voice — and built because of one person above all.
            My mother, <strong>Arepu Vijaya Vani</strong>. I watched her closely.
            She is the reason this exists.
          </p>
        </div>
        <div className="vj-hero-scroll-hint">
          <span className="vj-scroll-arrow">↓</span>
          <span>Follow the journey</span>
        </div>
      </section>

      {/* ── WHY SECTION ───────────────────────── */}
      <section className="vj-why">
        <div className="vj-why-inner">
          <blockquote className="vj-quote">
            "When someone can no longer speak, move, or write — they are not silent.
            They still have something to say. The question is whether we are listening."
          </blockquote>
          <div className="vj-why-grid">
            <div className="vj-why-card">
              <span className="vj-why-icon">🧠</span>
              <h4>What is ALS?</h4>
              <p>Amyotrophic Lateral Sclerosis progressively takes away voluntary muscle control. Many patients reach a stage where facial micro‑movements are the only remaining form of expression.</p>
            </div>
            <div className="vj-why-card">
              <span className="vj-why-icon">💬</span>
              <h4>The Problem</h4>
              <p>Existing AAC (augmentative and alternative communication) devices cost thousands of dollars, require calibration expertise, and assume a level of motor ability many patients no longer have.</p>
            </div>
            <div className="vj-why-card">
              <span className="vj-why-icon">🕯️</span>
              <h4>The Intention</h4>
              <p>Use a Raspberry Pi, an IR camera, and personalized calibration to build something affordable, accessible, and genuinely useful — for the patient, and for the caregiver who just wants to know if their loved one is in pain.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────── */}
      <section className="vj-timeline-section">
        <div className="vj-timeline-header">
          <h2 className="vj-section-title">The Road, Milestone by Milestone</h2>
          <p className="vj-section-sub">April 2025 → May 2026 · A bell, two gestures, and a system that refused to stop growing</p>
        </div>

        <div className="vj-timeline">
          <div className="vj-timeline-line" />
          {MILESTONES.map((m, i) => (
            <MilestoneCard key={m.id} m={m} index={i} />
          ))}
        </div>
      </section>

      {/* ── STATS ─────────────────────────────── */}
      <section className="vj-stats-section">
        <div className="vj-stats-inner">
          <h2 className="vj-stats-title">By the Numbers</h2>
          <div className="vj-stats-grid">
            {STATS.map((s) => (
              <StatItem key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SYSTEM SNAPSHOT ───────────────────── */}
      <section className="vj-system">
        <div className="vj-system-inner">
          <h2 className="vj-section-title">How It Works</h2>
          <p className="vj-section-sub">The full pipeline — from a patient's face to a caregiver's phone</p>
          <div className="vj-pipeline">
            {[
              { icon: '📷', label: 'IR Camera', desc: 'Bedside edge device captures the face in real‑time' },
              { icon: '🤖', label: 'Vision AI', desc: '478 facial landmarks + real‑time iris inference' },
              { icon: '⚙️', label: 'Gesture Engine', desc: '8 detectors with per‑patient calibrated thresholds' },
              { icon: '☁️', label: 'Firebase', desc: 'Gesture events written to Firestore in real‑time' },
              { icon: '📱', label: 'VaniCare App', desc: 'Caregiver receives push notification instantly' },
            ].map((step, i) => (
              <React.Fragment key={step.label}>
                <div className="vj-pipeline-step">
                  <div className="vj-pipeline-icon">{step.icon}</div>
                  <div className="vj-pipeline-label">{step.label}</div>
                  <div className="vj-pipeline-desc">{step.desc}</div>
                </div>
                {i < 4 && <div className="vj-pipeline-arrow">→</div>}
              </React.Fragment>
            ))}
          </div>

          <div className="vj-gesture-grid">
            {[
              { gesture: 'Gaze Left', action: 'YES' },
              { gesture: 'Gaze Right', action: 'NO' },
              { gesture: 'Double Blink', action: 'HELP' },
              { gesture: 'Wink Left', action: 'PAIN' },
              { gesture: 'Wink Right', action: 'WATER' },
              { gesture: 'Mouth Open', action: 'CALL NURSE' },
              { gesture: 'Head Left', action: 'FOOD' },
              { gesture: 'Head Right', action: 'TOILET' },
            ].map((g) => (
              <div className="vj-gesture-chip" key={g.gesture}>
                <span className="vj-gesture-name">{g.gesture}</span>
                <span className="vj-gesture-arrow">→</span>
                <span className="vj-gesture-action">{g.action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING ───────────────────────────── */}
      <section className="vj-close">
        <div className="vj-close-inner">
          <div className="vj-close-glow" />
          <h2 className="vj-close-title">Still Building — For Her</h2>
          <p className="vj-close-body">
            My mother's name is Arepu Vijaya Vani. VANI carries her name.
            Watching her closely is what made this real — not an idea from a paper,
            not a project for a portfolio, but an answer to something I saw with my own eyes.
            The first installer is in a client's hands. Patients are waiting.
            This keeps going because it has to.
          </p>
          <div className="vj-close-tags">
            <span className="vj-ctag">Open Source Intent</span>
            <span className="vj-ctag">ALS Community</span>
            <span className="vj-ctag">No Login. No Cost.</span>
            <span className="vj-ctag">Edge AI for Good</span>
          </div>
        </div>
      </section>

    </div>
  );
}
