import React from "react";
import "./QuickView.css";
import pavan from "../../../assets/contact.png"; // Adjust the path if necessary
import mobileAppImage from "../../../assets/mobile-apps.png"; // Adjust the path if necessary

const QuickView = () => {
  const skills = {
    Frontend: ["iOS ⭑⭑⭑⭑⭑", "Android ⭑⭑⭑⭑", "ReactNative ⭑⭑⭑⭑", "Flutter ⭑⭑⭑"],
    "Programming Languages": [
      "C++ ⭑⭑⭑⭑",
      "Swift ⭑⭑⭑⭑⭑",
      "Java ⭑⭑⭑",
      "Kotlin ⭑⭑⭑⭑",
      "Dart ⭑⭑⭑",
    ],
    Scripting: ["Shell ⭑⭑⭑⭑⭑", "JavaScript ⭑⭑⭑⭑", "Python ⭑⭑⭑⭑"],
    Backend: ["NodeJS ⭑⭑⭑", "API Gateway ⭑⭑⭑"],
    Cloud: ["AWS ⭑⭑⭑⭑", "Azure ⭑⭑⭑⭑", "Firebase Cloud ⭑⭑⭑⭑⭑", "iCloud ⭑⭑⭑⭑⭑"],
    // Integrations: ["Salesforce ☆☆☆", "RxSwift ☆☆☆"],
  };

  return (
    <div className="quick-view">
      <div className="quick-view-left">
        <img src={pavan} alt="Pavan" className="contact-image" />
        {/* <div className="quick-view-left">
          <p className="description">
            Proficient in overseeing the complete lifecycle of mobile app
            development, from conceptualization to deployment, ensuring seamless
            user experiences and robust functionality.
          </p>
        </div> */}
      </div>

      <div className="quick-view-right">
        {Object.keys(skills).map((category) => (
          <div key={category} className="skills-category">
            <h3>{category}</h3>
            <div className="skills-list">
              {skills[category].map((skill) => (
                <button key={skill} className="skill-button">
                  {skill}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="quick-view-middle">
        <img
          src={mobileAppImage}
          alt="Mobile App"
          className="mobile-app-image"
        />
      </div>
    </div>
  );
};

export default QuickView;
