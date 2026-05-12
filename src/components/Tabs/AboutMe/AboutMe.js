import React from "react";
import "./AboutMe.css";

const STATS = [
  { value: "16+",  label: "Years Experience" },
  { value: "30+",  label: "Apps Delivered" },
  { value: "150+", label: "GitHub Repos" },
  { value: "4",    label: "Countries Worked" },
];

const ACHIEVEMENTS = [
  { icon: "📱", text: "Developed 25–30 professional mobile applications across iOS, Android, React Native, and Flutter that meet enterprise standards." },
  { icon: "🗂️", text: "Contributed to 150+ GitHub repositories covering mobile apps, data structures, Unix, and shell scripting." },
  { icon: "🏪", text: "Published 200+ apps in enterprise stores (AirWatch / Apperian / MobileIron) ensuring enterprise deployment and maintenance." },
  { icon: "🚀", text: "Launched 10+ apps to the App Store and Play Store, reaching a wide consumer audience." },
  { icon: "🏆", text: "Led 15+ mobile application programmes managing cross-functional teams and project timelines." },
  { icon: "🎯", text: "Architected 10+ mobile applications professionally, with additional personal projects showcasing broad capabilities." },
  { icon: "📝", text: "Provided RFPs to 10+ projects, contributing to client engagement and project acquisition." },
  { icon: "🎓", text: "Trained 150+ students and professionals across colleges and software companies." },
  { icon: "🧑‍⚖️", text: "Interviwed 100+ candidates as an interview panelist, contributing to talent acquisition." },
];

const CONTRIBUTIONS = [
  { icon: "✍️", text: "Authored 10+ LinkedIn articles on iOS, Android, React Native, Flutter, and mobile security." },
  { icon: "📰", text: "Personal blogs: iOS Apps Blog · iOS Sprinter Blog." },
  { icon: "🏅", text: "Recipient of multiple awards and recognitions for exceptional contributions to the company." },
  { icon: "🌍", text: "Worked across India, UK, Sweden, and Ireland — collaborating with global clients and teams." },
];

const AboutMe = () => {
  return (
    <div className="about-me">
      {/* Hero banner */}
      <div className="about-banner">
        <div className="about-banner-text">
          <span className="about-badge">About Me</span>
          <h2>Mobile Architect &amp; Engineer</h2>
          <p>
            Accomplished mobile application developer, architect, and project
            manager with extensive experience in native (iOS, Android),
            semi-hybrid (Cordova), and hybrid (React Native / Flutter) mobile
            applications. I excel in architecture, RFPs, and leading large teams
            of 20–40 members across cross-platform development — bridging the
            gap between clients and delivery teams for seamless execution.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="about-stats">
        {STATS.map((s) => (
          <div key={s.label} className="about-stat-card">
            <span className="about-stat-value">{s.value}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Key Achievements */}
      <div className="about-card">
        <h3><span className="about-card-icon">🏆</span> Key Achievements</h3>
        <ul>
          {ACHIEVEMENTS.map((a, i) => (
            <li key={i} className="about-li-icon">
              <span>{a.icon}</span>
              <span>{a.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contributions */}
      <div className="about-card">
        <h3><span className="about-card-icon">🌐</span> Contributions &amp; Publications</h3>
        <ul>
          {CONTRIBUTIONS.map((c, i) => (
            <li key={i} className="about-li-icon">
              <span>{c.icon}</span>
              <span>{c.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AboutMe;
