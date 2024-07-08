// src/components/AboutMe/AboutMe.js
import React from "react";
import "./AboutMe.css";

const AboutMe = ({ tabName }) => {
  const backgroundImage = `linear-gradient(to right, #f5f7fa, #c3cfe2)`;
  // const backgroundImage = : `linear-gradient(to right, #f5f7fa, #c3cfe2)`;

  return (
    <div className="about-me" style={{ backgroundImage }}>
      <div className="about-content">
        {/* <h2>{`This ${tabName} Page is being prepared`}</h2> */}
        <div className="professional-summary">
          {/* <h3>Professional Summary</h3> */}
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
            <br />
            <li>
              Contributed to 150+ Repositories: Active GitHub contributor with
              repositories in mobile apps, data structures, Unix, and shell
              scripting.
            </li>
            <br />

            <li>
              Published 200+ Apps in Enterprise Store: Managed and published
              apps as an AirWatch/Apperian/MobileIron Admin, ensuring
              enterprise-level deployment and maintenance.
            </li>
            <br />

            <li>
              Published 10+ Apps to App Store and Play Store: Successfully
              launched several mobile applications to public app stores,
              reaching a wide audience.
            </li>
            <br />

            <li>
              Led 15+ Mobile Applications: Successfully led the development and
              delivery of multiple mobile applications, managing teams and
              project timelines.
            </li>
            <br />

            <li>
              Architected 10+ Mobile Applications: Architected numerous mobile
              applications professionally, with additional personal projects
              showcasing a wide range of capabilities.
            </li>
            <br />

            <li>
              Provided RFPs to 10+ Projects: Contributed to project acquisition
              and client engagement by providing comprehensive Request for
              Proposals (RFPs).
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
            <br />

            <li>
              Personal Blogs:
              <ul>
                <li>iOS Apps Blog</li>
                <li>iOS Sprinter Blog</li>
              </ul>
            </li>
            <br />

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
      </div>
    </div>
  );
};

export default AboutMe;
