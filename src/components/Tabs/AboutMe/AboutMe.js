// src/components/AboutMe/AboutMe.js
import React from "react";
import "./AboutMe.css";

const AboutMe = ({ tabName }) => {
  const backgroundImage = `linear-gradient(to right, #8A2387, #E94057, #F27121)`;

  return (
    <div className="about-me" style={{ backgroundImage }}>
      <div className="about-content">
        <h2>{`This ${tabName} Page is being prepared`}</h2>
        <div className="professional-summary">
          <h3>Professional Summary</h3>
          <p>
            I am an accomplished mobile application developer, architect, and
            project manager with extensive experience in both native (iOS,
            Android), semi-hybrid (Cordova), and hybrid (React Native) mobile
            applications. I excel in application development, architecture,
            providing RFCs, and leading large teams of 20-40 members. My
            expertise spans across cross-platform development (web, app, API,
            design, business, finance, marketing), and I have a proven track
            record of collaborating effectively with product owners,
            stakeholders, and teams in both onshore and offshore settings. I
            bridge the gap between clients and TCS teams, ensuring seamless
            project execution and delivery.
          </p>
        </div>

        <div className="key-achievements">
          <h3>Key Achievements</h3>
          <ul>
            <li>
              Developed 25-30 Professional Mobile Applications: Demonstrated
              expertise in delivering high-quality mobile applications that meet
              client requirements and market standards.
            </li>
            <li>
              Contributed to 150+ Repositories: Active GitHub contributor with
              repositories in mobile apps, data structures, Unix, and shell
              scripting.
            </li>
            <li>
              Published 200+ Apps in Enterprise Store: Managed and published
              apps as an AirWatch/Apperian/MobileIron Admin, ensuring
              enterprise-level deployment and maintenance.
            </li>
            <li>
              Published 10+ Apps to App Store and Play Store: Successfully
              launched several mobile applications to public app stores,
              reaching a wide audience.
            </li>
            <li>
              Led 15+ Mobile Applications: Successfully led the development and
              delivery of multiple mobile applications, managing teams and
              project timelines.
            </li>
            <li>
              Architected 10+ Mobile Applications: Architected numerous mobile
              applications professionally, with additional personal projects
              showcasing a wide range of capabilities.
            </li>
            <li>
              Provided RFPs to 10+ Projects: Contributed to project acquisition
              and client engagement by providing comprehensive Request for
              Proposals (RFPs).
            </li>
          </ul>
        </div>

        <div className="experience-major-clients">
          <h3>Experience with Major Clients</h3>
          <ul>
            <li>Swedbank (Stockholm, Sweden)</li>
            <li>British Telecom (Belfast, Ireland)</li>
            <li>ICICI (Hyderabad, India)</li>
            <li>BNP (Chennai, India)</li>
            <li>Johnson & Johnson (London, UK)</li>
            <li>JPMorgan Chase (Hyderabad, India)</li>
          </ul>
        </div>

        <div className="certifications">
          <h3>Certifications</h3>
          <ul>
            <li>
              Cloud Certifications:
              <ul>
                <li>Amazon Solution Architect</li>
                <li>Azure Microsoft Fundamentals and Admin</li>
              </ul>
            </li>
            <li>
              Management Certifications:
              <ul>
                <li>PSM1</li>
                <li>PMP Certification (in progress)</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="contributions-publications">
          <h3>Contributions and Publications</h3>
          <ul>
            <li>
              LinkedIn Articles: Authored 10+ articles on topics including iOS,
              Android, React Native, Flutter, and mobile app security.
            </li>
            <li>
              Personal Blogs:
              <ul>
                <li>iOS Apps Blog</li>
                <li>iOS Sprinter Blog</li>
              </ul>
            </li>
            <li>
              Interview Panel Experience: Conducted over 100 candidate
              interviews, contributing to the talent acquisition process within
              the company.
            </li>
            <li>
              Training Experience: Trained more than 150+ students from various
              college students and professionals from various software
              companies.
            </li>
          </ul>
        </div>

        <div className="contact-details">
          <h3>Contact Details</h3>
          <ul>
            <li>
              <strong>LinkedIn:</strong>{" "}
              <a href="https://www.linkedin.com/in/pavan-kumar-arepu">
                Pavan Kumar Arepu
              </a>
            </li>
            <li>
              <strong>GitHub:</strong>{" "}
              <a href="https://github.com/pavan-kumar-arepu">
                github.com/pavan-kumar-arepu
              </a>
            </li>
            <li>
              <strong>Email:</strong> iOSDeveloper.ipa@gmail.com
            </li>
            <li>
              <strong>Mobile:</strong> +46 76 431 65 99 / +91 8121 04 03 08
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
