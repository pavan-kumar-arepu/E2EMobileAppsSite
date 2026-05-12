import React from "react";
import "./QuickView.css";
import pavan from "../../../assets/contact.png";

const SKILLS = [
  {
    category: "Mobile — Native",
    items: [
      { name: "iOS / Swift / SwiftUI", stars: 5 },
      { name: "Android / Kotlin / Jetpack", stars: 4 },
    ],
  },
  {
    category: "Cross-Platform",
    items: [
      { name: "React Native", stars: 4 },
      { name: "Flutter", stars: 3 },
      { name: "Cordova / Ionic", stars: 4 },
    ],
  },
  {
    category: "Languages",
    items: [
      { name: "Swift", stars: 5 },
      { name: "Kotlin", stars: 4 },
      { name: "JavaScript / TypeScript", stars: 4 },
      { name: "C++", stars: 4 },
      { name: "Python", stars: 4 },
      { name: "Dart", stars: 3 },
    ],
  },
  {
    category: "Cloud & Backend",
    items: [
      { name: "Firebase / Firestore", stars: 5 },
      { name: "AWS", stars: 3 },
      { name: "iCloud", stars: 4 },
      { name: "Node.js / API Gateway", stars: 3 },
      { name: "Azure", stars: 3 },
    ],
  },
  {
    category: "Leadership & Process",
    items: [
      { name: "Scrum / Agile", stars: 5 },
      { name: "Team & Project Management", stars: 5 },
      { name: "Architecture & RFPs", stars: 5 },
      { name: "Offshore / Onshore Delivery", stars: 5 },
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
          <p className="qv-title">Mobile Architect &amp; Engineer</p>
          <p className="qv-tagline">
            Building end-to-end mobile solutions across iOS, Android &amp;
            cross-platform — from concept to App Store.
          </p>
        </div>

        <div className="qv-stats-row">
          <div className="qv-stat">
            <span className="qv-stat-num">16+</span>
            <span className="qv-stat-label">Years Exp.</span>
          </div>
          <div className="qv-stat">
            <span className="qv-stat-num">30+</span>
            <span className="qv-stat-label">Apps Built</span>
          </div>
          <div className="qv-stat">
            <span className="qv-stat-num">150+</span>
            <span className="qv-stat-label">Repos</span>
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
          <p className="qv-skills-sub">Hover a chip to highlight — ★ = proficiency level</p>
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
