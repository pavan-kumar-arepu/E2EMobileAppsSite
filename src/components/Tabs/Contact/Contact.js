// src/components/Tabs/Contact/Contact.js
import React from "react";
import "./Contact.css";
import contactImage from "../../../assets/contact.png";

const Contact = () => {
  return (
    <div className="contact-container">
      <img src={contactImage} alt="Contact" className="contact-image" />
      <div className="contact-content">
        <h2>Contact Information</h2>
        <p>
          Let's connect and collaborate on exciting projects! Reach out to me on
          LinkedIn or WhatsApp to discuss ideas and opportunities.
        </p>
        <h3>LinkedIn</h3>
        <p>
          Connect with me on LinkedIn:{" "}
          <a
            href="https://www.linkedin.com/in/your-linkedin-profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            Your LinkedIn Profile
          </a>
        </p>
        <h3>Indian WhatsApp Number</h3>
        <p>+91 8121 040308</p>
        <h3>Sweden Number</h3>
        <p>+46 76 431 6599</p>
        <h3>Email</h3>
        <p>
          Email me at:{" "}
          <a href="mailto:iOSDeveloper.ipa@gmail.com">
            iOSDeveloper.ipa@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Contact;
