import React from "react";
import "./AboutMe.css";

const STATS = [
  { value: "16+",  label: "Years Experience" },
  { value: "30+",  label: "Apps Shipped" },
  { value: "200+", label: "POCs / Repos" },
  { value: "4",    label: "Countries" },
];

const EXPERIENCE = [
  {
    period: "Oct 2024 – Present",
    company: "Verizon",
    role: "Senior Software Development Manager",
    location: "India",
    points: [
      "Built and scaled MobileCoE, influencing architecture across multiple Verizon applications.",
      "Drove Verizon Design System — defining scalable iOS & Android architecture, governance, and shared component libraries.",
      "Leveraged AI-assisted tools (Gemini & GitHub Copilot) to reduce onboarding & documentation effort by ~30–40%.",
      "Acting as single-threaded owner for native component strategy and governance.",
      "Regularly presenting architecture, roadmap, and execution status to senior leadership.",
    ],
  },
  {
    period: "Oct 2011 – Sept 2024",
    company: "Tata Consultancy Services (TCS)",
    role: "Associate Consultant → Senior Manager",
    location: "India · UK · Sweden · Ireland",
    points: [
      "Owned end-to-end delivery of mobile platforms at Scandic (Stockholm), DaVita, BT Vision, J&J, Swedbank, iMobile Pay, JPMC, BNPP, and Microsoft Azure.",
      "Led Agile transformations and complex programs across telecom, banking, healthcare, and hospitality domains.",
      "Managed cross-functional teams of 20–40 engineers across onshore and offshore settings.",
      "Defined and executed multi-quarter technical roadmaps aligned with business priorities.",
      "Established engineering quality standards: architecture reviews, code quality, security, testing, and release governance.",
    ],
  },
];

const ACHIEVEMENTS = [
  { icon: "🏅", text: "Spotlight Award — For driving cross-org mobile platform unification and delivery excellence at Verizon." },
  { icon: "🤝", text: "Experience Principle Award (Human) — For leadership, mentoring, and building an inclusive team culture." },
  { icon: "🏆", text: "Best Team Award — TCS Internal 2021 for a successful iOS project." },
  { icon: "🧠", text: "Context Master — TCS Internal 2020/2023 for process improvement." },
  { icon: "💡", text: "Ranked Top 3 in the 2017 Healthcare Ideathon for innovation." },
  { icon: "📱", text: "Shipped 25–30 professional mobile apps (iOS, Android, React Native, Flutter) for enterprise clients." },
  { icon: "🏪", text: "Published 200+ apps in enterprise stores (AirWatch / Apperian / MobileIron) across 20+ countries." },
  { icon: "🚀", text: "Launched 10+ consumer apps to the App Store and Google Play Store." },
  { icon: "🔥", text: "Maintained a 365-day coding streak on Scalar." },
  { icon: "🎓", text: "Trained 150+ students and professionals; interviewed 100+ engineering candidates as a panelist." },
];

const UTILITIES = [
  { icon: "⚙️", text: "Cross-Platform IPA Generator — web app for generating IPA files on macOS & Windows." },
  { icon: "📄", text: "Automated Mobile App Documentation Tool — auto-generates app documentation, saving hours of manual effort." },
  { icon: "🔍", text: "NSLOG Collector & Exporter — gathers NSLOGs from apps and exports them to Word and PDF." },
  { icon: "🔄", text: "Objective-C to Swift Conversion Tool — shell script converter to modernise legacy codebases." },
  { icon: "💥", text: "iOS Crash Report Symboliser — symbolises crash reports in under 10 seconds via shell scripting." },
];

const EDUCATION = [
  { icon: "🎓", text: "Pursuing M.Tech in AI / ML — BITS Pilani (WILP Program)" },
  { icon: "🏫", text: "B.Tech in Computer Science — Nagarjuna University, India (2008)" },
  { icon: "📚", text: "2022–2024: Pure Software Developer Program — Data Structures, System Design, LLD & HLD" },
];

const AboutMe = () => {
  return (
    <div className="about-me">

      {/* Hero banner */}
      <div className="about-banner">
        <div className="about-banner-text">
          <span className="about-badge">About Me</span>
          <h2>Senior Software Development Manager</h2>
          <p>
            Senior Software Development Manager with a proven track record of leading
            high-performance engineering teams and owning the delivery of scalable mobile
            and platform solutions. Currently driving <strong>Mobile Platform Engineering
            &amp; MobileCoE</strong> at Verizon — experienced in architectural strategy,
            developer productivity, CI/CD automation, and growing inclusive teams while
            delivering measurable customer outcomes.
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

      {/* Work Experience */}
      <div className="about-card">
        <h3><span className="about-card-icon">💼</span> Work Experience</h3>
        {EXPERIENCE.map((job) => (
          <div key={job.company} className="about-job">
            <div className="about-job-header">
              <div>
                <span className="about-job-role">{job.role}</span>
                <span className="about-job-company"> · {job.company}</span>
              </div>
              <span className="about-job-meta">{job.period} · {job.location}</span>
            </div>
            <ul>
              {job.points.map((p, i) => (
                <li key={i} className="about-li-icon">
                  <span>▸</span><span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Awards & Achievements */}
      <div className="about-card">
        <h3><span className="about-card-icon">🏆</span> Awards &amp; Achievements</h3>
        <ul>
          {ACHIEVEMENTS.map((a, i) => (
            <li key={i} className="about-li-icon">
              <span>{a.icon}</span><span>{a.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Technical Utilities */}
      <div className="about-card">
        <h3><span className="about-card-icon">🛠️</span> Technical Utilities Built</h3>
        <ul>
          {UTILITIES.map((u, i) => (
            <li key={i} className="about-li-icon">
              <span>{u.icon}</span><span>{u.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Education */}
      <div className="about-card">
        <h3><span className="about-card-icon">🎓</span> Education</h3>
        <ul>
          {EDUCATION.map((e, i) => (
            <li key={i} className="about-li-icon">
              <span>{e.icon}</span><span>{e.text}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default AboutMe;
