// src/components/DummyScreen/DummyScreen.js
import React from "react";
import "./MyQuoteScreen.css";
import preparingImage from "../../../assets/casserole-pot.png";

const MyQuoteScreen = ({ tabName }) => {
  const backgroundImage = `linear-gradient(to right, #8A2387, #E94057, #F27121)`;

  return (
    <div className="myQuote-screen" style={{ backgroundImage }}>
      <div className="myQuote-content">
        <h2>{`This ${tabName} Page is being Cooking!`}</h2>
        <p>Placeholder text describing the content being prepared.</p>
        <img src={preparingImage} alt="Preparing" /> {/* Use imported image */}
      </div>
    </div>
  );
};

export default MyQuoteScreen;
