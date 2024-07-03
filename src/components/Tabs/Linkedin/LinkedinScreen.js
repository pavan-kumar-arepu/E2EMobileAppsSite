// src/components/DummyScreen/DummyScreen.js
import React from "react";
import "./LinkedinScreen.css";
import preparingImage from "../../../assets/casserole-pot.png";

const LinkedinScreen = ({ tabName }) => {
  const backgroundImage = `linear-gradient(to right, #8A2387, #E94057, #F27121)`;

  return (
    <div className="linkedin-screen" style={{ backgroundImage }}>
      <div className="linkedin-content">
        <h2>{`This ${tabName} Page is being prepared`}</h2>
        <p>Placeholder text describing the content being prepared.</p>
        <img src={preparingImage} alt="Preparing" />
      </div>
    </div>
  );
};

export default LinkedinScreen;
