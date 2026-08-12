import React from "react";
import "./AboutMe.css";
import pavan from "../../../assets/contact.png";

const STATS = [
  { value: "16+",  label: "Years Experience" },
  { value: "30+",  label: "Apps Shipped" },
  { value: "175+", label: "POCs / Repos" },
  { value: "4",    label: "Countries" },
];

const EXPERIENCE = [
  {
    period: "Oct 2024 – Present",
    company: "Verizon",
    role: "Sr Manager UI/UX (Technical Manager)",
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
  { icon: "", text: "Vani Assistive Communication System — 'Voice of Unheard' — 1st Prize (AI/ML), BITS Technical Symposium 2026." },
  { icon: "🤝", text: "Experience Principle Award (Human) — For leadership, mentoring, and building an inclusive team culture." },
  { icon: "🏆", text: "Best Team Award — TCS Internal 2021 for a successful iOS project." },
  { icon: "🧠", text: "Context Master — TCS Internal 2020/2023 for process improvement." },
  { icon: "💡", text: "Ranked Top 3 in the 2017 Healthcare Ideathon for innovation." },
  { icon: "🏢", text: "Worked as MDM & MAM Admin — deployed 200+ iOS and Android apps across enterprise using AirWatch / Apperian / MobileIron across 20+ countries." },
  { icon: "📱", text: "Shipped 25–30 professional mobile apps (iOS, Android, React Native, Flutter) for enterprise clients." },
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
  { icon: "📚", text: "2022–2024: Pure Software Developer Program — Scaler Academy (Data Structures, System Design, LLD & HLD)" },
];

const AboutMe = () => {
  return (
    <div className="about-me">

      {/* Hero banner */}
      <div className="about-banner">
        <div className="about-avatar-ring">
          <img src={pavan} alt="Pavan Kumar Arepu" className="about-avatar" />
        </div>
        <div className="about-banner-text">
          <span className="about-badge">About Me</span>
          <h2>Sr Manager UI/UX (Technical Manager)</h2>
          <p>
            Senior Engineering Manager with 16+ years of experience leading global
            engineering teams across platform engineering, enterprise architecture, and
            enterprise-scale mobile solutions. Proven track record of building
            high-performing teams, delivering scalable platforms, and driving
            engineering excellence across Android, iOS, cloud, and DevOps ecosystems.
          </p>
          <p>
            Passionate about accelerating software delivery through AI-driven
            engineering practices, leveraging Generative AI, Large Language Models
            (LLMs), intelligent automation, and AI-assisted development workflows to
            improve developer productivity and product quality. Experienced in defining
            technical strategy, modernizing engineering processes, and delivering
            secure, scalable, and customer-centric solutions.
          </p>
          <p>
            Skilled in collaborating with cross-functional stakeholders, mentoring
            engineers, and aligning technology investments with business outcomes.
            Currently expanding expertise in AI systems, cloud-native architectures,
            RAG, AI agents, Model Context Protocol (MCP), vector databases, AI
            observability, and MLOps to build the next generation of intelligent
            software platforms.
          </p>
        </div>
      </div>

      {/* AI & Projects (top) — split into Personal and BITS M.Tech sections; Personal shown first per request */}
      <div className="about-card">
        <h3><span className="about-card-icon"></span> AI & Projects</h3>

        <div style={{ marginBottom: 12 }}>
          <strong>Personal Projects</strong>
          <p style={{ margin: '6px 0 8px' }}>
            Motivated to build assistive and practical AI systems that improve accessibility and real-world workflows.
          </p>
          <ul>
            <li className="about-li-icon">
              <span>✦</span>
              <span>
                <span className="vc-tag vc-tag-pilot">Pilot</span>
                Vani — Assistive Personal Project: real-time gesture detection, patient calibration and caregiver dashboards for non-verbal users. <a href="http://pavanapps.netlify.app/vanicore" target="_blank" rel="noreferrer">VaniCore Pilot Portal</a>
              </span>
            </li>
            <li className="about-li-icon">
              <span>✦</span>
              <span>
                <strong><a href="https://github.com/pavan-kumar-arepu/CV_ImageComparions" target="_blank" rel="noreferrer">Image Discrepancy Detector (POC)</a></strong>
                <div className="about-repo-desc">SSIM-based pixel-level comparison POC using OpenCV and Colab/Jupyter notebooks, with demo video and execution steps.</div>
              </span>
            </li>
          </ul>
        </div>

        <div>
          <strong>BITS M.Tech AI/ML</strong>
          <p style={{ margin: '6px 0 8px' }}>
            M.Tech (AI/ML) — BITS Pilani (WILP): specialized / deep-dive focus — ML on Edge (quantized models); also Deep Learning, Computer Vision, NLP, Probabilistic Models and Production ML workflows.
          </p>
          <ul>
            <li className="about-li-icon">
              <span>🎓</span>
              <span>
                <span className="vc-tag vc-tag-completed">Completed</span>
                <strong><a href="https://github.com/pavan-kumar-arepu/SpeechProcessing" target="_blank" rel="noreferrer">HMM-DNN Based Automatic Speech Recognition</a></strong>
                <div className="about-repo-desc">Hybrid HMM-DNN ASR pipeline with notebooks demonstrating feature extraction, LSTM acoustic modeling, and Viterbi decoding.</div>
              </span>
            </li>
            <li className="about-li-icon">
              <span>🎓</span>
              <span>
                <span className="vc-tag vc-tag-completed">Completed</span>
                <strong><a href="https://github.com/pavan-kumar-arepu/ConAI-NaturalLanguageGenerator" target="_blank" rel="noreferrer">NLG — Natural Language Generator</a></strong>
                <div className="about-repo-desc">Sequence-to-text generation assignment: notebooks, dataset exports, and architecture diagrams.</div>
              </span>
            </li>
            <li className="about-li-icon">
              <span>🎓</span>
              <span>
                <span className="vc-tag vc-tag-completed">Completed</span>
                <strong><a href="https://github.com/pavan-kumar-arepu/Parameter-Efficient-Fine-Tuning" target="_blank" rel="noreferrer">Parameter-Efficient Fine-Tuning</a></strong>
                <div className="about-repo-desc">LoRA adapter pipeline for banking instruction data with scripts, diagrams, and example checkpoints.</div>
              </span>
            </li>
            {/* CV_ImageComparions moved to Personal Projects per request */}
            <li className="about-li-icon">
              <span>🎓</span>
              <span>
                <span className="vc-tag vc-tag-completed">Completed</span>
                <strong><a href="https://github.com/pavan-kumar-arepu/MLSO_Assignment2_Group35" target="_blank" rel="noreferrer">ML System Optimization — Assignment 2 (Group 35)</a></strong>
                <div className="about-repo-desc">ML system optimization assignment notebooks and code artifacts (group submission).</div>
              </span>
            </li>
            <li className="about-li-icon">
              <span>🎓</span>
              <span>
                <span className="vc-tag vc-tag-completed">Completed</span>
                <strong><a href="https://github.com/pavan-kumar-arepu/LLM-Domain-Adaptation-QLoRA" target="_blank" rel="noreferrer">LLM Domain Adaptation — QLoRA</a></strong>
                <div className="about-repo-desc">Pipeline for adapting domain PDFs to a fine-tuned, quantized domain LLM for benchmarking and serving.</div>
              </span>
            </li>
            <li className="about-li-icon">
              <span>🎓</span>
              <span>
                <span className="vc-tag vc-tag-completed">Completed</span>
                <strong>FreightBridge — Edge AI</strong>
                <div className="about-repo-desc">Edge AI for cold-chain monitoring (project completed as part of BITS coursework).</div>
              </span>
            </li>
            <li className="about-li-icon">
              <span>🎓</span>
              <span>
                <span className="vc-tag vc-tag-completed">Completed</span>
                <strong><a href="https://github.com/pavan-kumar-arepu/RAG" target="_blank" rel="noreferrer">LLM RAG Assignment — Project Overview</a></strong>
                <div className="about-repo-desc">Retrieval-Augmented Generation pipeline for document-level QA: indexing, retrieval, reranking, and evaluation (branch: assignment-2b).</div>
              </span>
            </li>
          </ul>
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

      {/* duplicate AI & Projects removed (kept the top section) */}

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
