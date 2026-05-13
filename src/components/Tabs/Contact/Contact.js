import React from "react";
import "./Contact.css";
import contactImage from "../../../assets/contact.png";

const CONTACT_ROWS = [
  {
    icon: "💼",
    label: "LinkedIn",
    value: (
      <a
        href="https://www.linkedin.com/in/pavan-kumar-arepu-software-architect-engineer/"
        target="_blank"
        rel="noopener noreferrer"
      >
        pavan-kumar-arepu
      </a>
    ),
  },
  {
    icon: "🐙",
    label: "GitHub",
    value: (
      <a
        href="https://github.com/pavan-kumar-arepu"
        target="_blank"
        rel="noopener noreferrer"
      >
        github.com/pavan-kumar-arepu
      </a>
    ),
  },
  {
    icon: "✉️",
    label: "Email",
    value: (
      <a href="mailto:iOSDeveloper.ipa@gmail.com">iOSDeveloper.ipa@gmail.com</a>
    ),
  },
  {
    icon: "📱",
    label: "Mobile",
    value: "+46 76 431 65 99  ·  +91 8121 040 308",
  },
  {
    icon: "✍️",
    label: "Blog",
    value: (
      <>
        <a href="https://iossprinter.blogspot.com" target="_blank" rel="noopener noreferrer">iOS Sprinter Blog</a>
        {" · "}
        <a href="https://iosapps.blogspot.com" target="_blank" rel="noopener noreferrer">iOS Apps Blog</a>
      </>
    ),
  },
  {
    icon: "📍",
    label: "Based In",
    value: "Hyderabad, India · Open to global opportunities",
  },
];

const Contact = () => (
  <div className="contact-page">
    <div className="contact-inner">
      {/* Left — avatar */}
      <div className="contact-left">
        <div className="contact-avatar-ring">
          <img src={contactImage} alt="Pavan Kumar Arepu" className="contact-image" />
        </div>
        <p className="contact-name">Pavan Kumar Arepu</p>
        <p className="contact-role">Sr Manager UI/UX (Technical Manager) · Verizon</p>
      </div>

      {/* Right — contact card */}
      <div className="contact-card">
        <h2>Let's Connect</h2>
        <p>
          Reach out to discuss exciting mobile projects, architecture challenges,
          or collaboration opportunities — I'm always up for a conversation.
        </p>
        <div className="contact-rows">
          {CONTACT_ROWS.map((row) => (
            <div key={row.label} className="contact-row">
              <span className="contact-row-icon">{row.icon}</span>
              <div>
                <div className="contact-row-label">{row.label}</div>
                <div className="contact-row-value">{row.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Contact;
