// src/components/Home/QuickView.js
import React from "react";
import "./QuickView.css";
import pavan from "../../assets/Pavan_newPic.png"; // Adjust the path if necessary

const QuickView = () => {
  const skills = {
    Frontend: ["iOS", "Android", "ReactNative", "Flutter"],
    "Programming Languages": ["C++", "Swift", "Java", "Kotlin", "Dart"],
    Scripting: ["Shell Scripting", "JavaScript"],
    Backend: ["NodeJS", "API Gateway"],
    Cloud: ["AWS", "Azure", "Firebase Cloud", "iCloud"],
    Integrations: ["Salesforce", "RxSwift"],
  };

  return (
    <div className="quick-view">
      <div className="quick-view-left">
        <img src={pavan} alt="Pavan" className="profile-photo" />
        <p className="description">
          Response to end to end Mobile application irrespective of any Mobile
          Technology
        </p>
      </div>
      <div className="quick-view-right">
        {Object.keys(skills).map((category) => (
          <div key={category} className="skills-category">
            <h3>{category}</h3>
            <div className="skills-buttons">
              {skills[category].map((skill) => (
                <button key={skill} className="skill-button">
                  {skill}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickView;
