// src/components/DummyScreen/DummyScreen.js
import React from "react";
import "./DummyScreen.css";
import preparingImage from "../../../assets/casserole-pot.png";

const DummyScreen = ({ tabName }) => {
  const backgroundImage = `linear-gradient(to right, #8A2387, #E94057, #F27121)`;

  return (
    <div className="dummy-screen" style={{ backgroundImage }}>
      <div className="dummy-content">
        <h2>{`This ${tabName} Page is being Cooking!`}</h2>
        <p>Placeholder text describing the content being prepared.</p>
        <img src={preparingImage} alt="Preparing" /> {/* Use imported image */}
      </div>
    </div>
  );
};

export default DummyScreen;
