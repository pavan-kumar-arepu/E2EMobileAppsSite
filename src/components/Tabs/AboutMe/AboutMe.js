import React from "react";
import "./AboutMe.css";

const AboutMe = ({ tabName }) => {
  const backgroundImage = `linear-gradient(to right, #8A2387, #E94057, #F27121)`;

  return (
    <div className="about-me" style={{ backgroundImage }}>
      <div className="about-content">
        <h2>{`This ${tabName} Page is being prepared`}</h2>
        <p>Placeholder text describing the content being prepared.</p>
        <img src="/path/to/making_image.jpg" alt="Preparing" />
      </div>
    </div>
  );
};

export default AboutMe;
