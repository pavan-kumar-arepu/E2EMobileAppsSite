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
        <h3>Contact Details</h3>
        <strong>LinkedIn:</strong>{" "}
        <a href="https://www.linkedin.com/in/pavan-kumar-arepu-software-architect-engineer/">
          Pavan Kumar Arepu
        </a>
        <br />
        <br />
        <strong>GitHub:</strong>{" "}
        <a href="https://github.com/pavan-kumar-arepu">
          github.com/pavan-kumar-arepu
        </a>
        <br />
        <br />
        <strong>Email:</strong> iOSDeveloper.ipa@gmail.com
        <br />
        <br />
        <strong>Mobile:</strong> +46 76 431 65 99 / +91 8121 04 03 08
        <br />
      </div>
    </div>
  );
};

export default Contact;
