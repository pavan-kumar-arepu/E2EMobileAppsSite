import React from "react";
import "./QuickView.css";
import pavan from "../../../assets/contact.png";

const SKILLS = [
  {
    category: "Leadership & Management",
    items: [
      { name: "People Leadership", stars: 5 },
      { name: "Scrum Master (PSM1) / Agile", stars: 5 },
      { name: "Architecture & RFPs", stars: 5 },
      { name: "Multi-region Delivery", stars: 5 },
      { name: "Project Management", stars: 5 },
    ],
  },
  {
    category: "Mobile — Native",
    items: [
      { name: "iOS / Swift / SwiftUI", stars: 5 },
      { name: "Android / Kotlin / Jetpack Compose", stars: 4 },
      { name: "Objective-C", stars: 5 },
    ],
  },
  {
    category: "Cross-Platform",
    items: [
      { name: "React Native", stars: 4 },
      { name: "Flutter", stars: 3 },
      { name: "Cordova / Xamarin", stars: 4 },
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      { name: "AWS (SAA-C03 Certified)", stars: 4 },
      { name: "Azure / Google Cloud", stars: 3 },
      { name: "CI/CD & DevOps", stars: 4 },
    ],
  },
  {
    category: "Languages & Tools",
    items: [
      { name: "Swift / Kotlin / Python", stars: 5 },
      { name: "JavaScript / TypeScript", stars: 4 },
      { name: "C / C++ / Java", stars: 4 },
      { name: "Shell Scripting / Unix", stars: 5 },
      { name: "Firebase / Realm / Cosmos DB", stars: 4 },
    ],
  },
];

const AI_SECTION = {
  title: 'AI / ML — Focus',
  items: [
    {
      heading: 'M.Tech (AI/ML) — BITS Pilani (WILP)',
      body: 'Advanced subjects: Deep Learning, Computer Vision, NLP, Probabilistic Models, and Production ML workflows.',
    },
    {
      heading: 'Vani — Assistive Personal Project',
      body: 'Core project: real-time assistive gestures, patient calibration, notifications and caregiver dashboards for non-verbal users.',
    },
  ],
};

// AI projects have been moved to the Home/About page; keep Skills focused on skill lists.

const AI_SKILLS = [
  {
    title: 'Artificial Intelligence',
    items: [
      'Generative AI',
      'Large Language Models (LLMs)',
      'Multimodal AI',
      'AI Agents',
      'Agentic AI Systems',
      'Edge AI',
      'AI System Design',
      'AI Platform Engineering',
      'AI Solution Architecture',
    ],
  },
  {
    title: 'LLM & Generative AI',
    items: [
      'Prompt Engineering',
      'Retrieval-Augmented Generation (RAG)',
      'LLM Fine-Tuning',
      'PEFT / LoRA / QLoRA',
      'LLM Evaluation',
      'Context Engineering',
      'Embedding Models',
      'Vector Search',
      'Knowledge-Augmented AI',
    ],
  },
  {
    title: 'Computer Vision',
    items: [
      'Object Detection',
      'Image Classification',
      'Face & Gesture Recognition',
      'Eye Tracking Systems',
      'MediaPipe / ML Kit / OpenCV',
    ],
  },
];

const Stars = ({ count }) => (
  <span className="qv-chip-stars">
    {"★".repeat(count)}{"☆".repeat(5 - count)}
  </span>
);

const QuickView = () => (
  <section className="qv-hero">
    <div className="qv-inner">
      {/* Left — Profile */}
      <aside className="qv-profile">
        <div className="qv-avatar-ring">
          <img src={pavan} alt="Pavan Kumar Arepu" className="qv-avatar" />
        </div>

        <div>
          <h1 className="qv-name">Pavan Kumar Arepu</h1>
          <p className="qv-title">Sr Manager UI/UX (Technical Manager)</p>
          <p className="qv-company">📍 Verizon · Mobile Platform &amp; Architecture</p>
          <p className="qv-tagline">
            Leading Mobile Platform Engineering &amp; MobileCoE at Verizon.
            16+ years delivering scalable mobile solutions across the UK,
            Sweden, Ireland &amp; India.
          </p>
        </div>

        <div className="qv-stats-row">
          <div className="qv-stat">
            <span className="qv-stat-num">16+</span>
            <span className="qv-stat-label">Years Exp.</span>
          </div>
          <div className="qv-stat">
            <span className="qv-stat-num">30+</span>
            <span className="qv-stat-label">Apps Shipped</span>
          </div>
          <div className="qv-stat">
            <span className="qv-stat-num">170+</span>
            <span className="qv-stat-label">POCs / Repos</span>
          </div>
          <div className="qv-stat">
            <span className="qv-stat-num">4</span>
            <span className="qv-stat-label">Countries</span>
          </div>
        </div>

        <div className="qv-cta-row">
          <a
            href="https://www.linkedin.com/in/pavan-kumar-arepu-software-architect-engineer/"
            target="_blank"
            rel="noreferrer"
            className="qv-btn qv-btn-primary"
          >
            💼 LinkedIn
          </a>
          <a
            href="https://github.com/pavan-kumar-arepu"
            target="_blank"
            rel="noreferrer"
            className="qv-btn qv-btn-ghost"
          >
            🐙 GitHub
          </a>
        </div>
      </aside>

      {/* Right — Skills */}
      <div className="qv-skills">
        <div>
          <h2 className="qv-skills-heading">Skills &amp; Expertise</h2>
          <p className="qv-skills-sub">★ = proficiency level</p>
        </div>
        {/* AI / ML focused card */}
        <div className="qv-ai-card">
          <h3 className="qv-ai-title">{AI_SECTION.title}</h3>
          <div className="qv-ai-items">
            {AI_SECTION.items.map((it) => (
              <div key={it.heading} className="qv-ai-item">
                <strong>{it.heading}</strong>
                <p className="qv-ai-body">{it.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Projects were moved to AboutMe (Home) per request. */}

        {/* Awards */}
        <div className="qv-awards">
          <h3 className="qv-awards-title">Awards & Achievements</h3>
          <ul>
            <li>Vani Assistive Communication System — "Voice of Unheard" — 1st Prize (AI/ML), BITS Technical Symposium 2026</li>
          </ul>
        </div>

        {/* AI Skills — concise categorized listing */}
        <div className="qv-ai-skills">
          <h3 className="qv-ai-skills-heading">Artificial Intelligence</h3>
          <div className="qv-ai-skills-grid">
            {AI_SKILLS.map((cat) => (
              <div key={cat.title} className="qv-ai-skills-cat">
                <div className="qv-ai-skills-cat-title">{cat.title}</div>
                <ul>
                  {cat.items.map((it) => (
                    <li key={it} className="qv-li-icon">▸ {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {SKILLS.map((cat) => (
          <div key={cat.category} className="qv-category">
            <p className="qv-category-title">{cat.category}</p>
            <div className="qv-chips">
              {cat.items.map((item) => (
                <span key={item.name} className="qv-chip">
                  {item.name}
                  <Stars count={item.stars} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default QuickView;
