import React from "react";
import "./Contact.css";
import contactImage from "../../../assets/contact.png";

const CONTACT_ROWS = [
  {
    icon: "💼",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/pavan-kumar-arepu-software-architect-engineer/",
    value: "pavan-kumar-arepu",
  },
  {
    icon: "📝",
    label: "LinkedIn Articles",
    href: "https://www.linkedin.com/in/pavan-kumar-arepu-software-architect-engineer/recent-activity/all/",
    value: "Recent activity & articles",
  },
  {
    icon: "🐙",
    label: "GitHub",
    href: "https://github.com/pavan-kumar-arepu",
    value: "github.com/pavan-kumar-arepu",
  },
  {
    icon: "✉️",
    label: "Email",
    href: "mailto:Vaaninnovations@gmail.com",
    value: "Vaaninnovations@gmail.com",
  },
  {
    icon: "📱",
    label: "Mobile",
    href: "tel:+918121040308",
    value: "+91 8121 040 308",
  },
  {
    icon: "📍",
    label: "Based In",
    href: null,
    value: "Hyderabad, India · Open to global opportunities",
  },
];

const Contact = () => (
  <div className="contact-page">
    <div className="contact-content">

      {/* Dark gradient banner — matches other tabs */}
      <div className="contact-banner">
        <div className="contact-avatar-ring">
          <img src={contactImage} alt="Pavan Kumar Arepu" className="contact-image" />
        </div>
        <div className="contact-banner-text">
          <h2>Pavan Kumar Arepu</h2>
          <p>Sr Manager UI/UX · Technical Manager · Verizon</p>
          <span className="contact-availability">🟢 Open to contribute to global and humanitarian projects</span>
        </div>
      </div>

      {/* Contact card */}
      <div className="contact-card">
        <div className="contact-card-header">
          <h3>💬 Let's Connect</h3>
          <p>
            Reach out to discuss architecture challenges, real-time solutions,
            or collaboration opportunities — I'm always up for a conversation.
          </p>
        </div>

        <div className="contact-rows">
          {CONTACT_ROWS.map((row) => (
            <div key={row.label} className="contact-row">
              <span className="contact-row-icon">{row.icon}</span>
              <div className="contact-row-body">
                <div className="contact-row-label">{row.label}</div>
                <div className="contact-row-value">
                  {row.href ? (
                    <a
                      href={row.href}
                      target={row.href.startsWith("http") ? "_blank" : undefined}
                      rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </div>
              </div>
              {row.href && row.href.startsWith("http") && (
                <span className="contact-row-arrow">↗</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Contact;
