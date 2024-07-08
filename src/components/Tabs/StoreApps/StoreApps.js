// src/components/DummyScreen/DummyScreen.js
import React from "react";
import "./StoreApps.css";
import preparingImage from "../../../assets/casserole-pot.png";

const StoreApps = ({ tabName }) => {
  //  `linear-gradient(to right, #8A2387, #E94057, #F27121)`;
  const backgroundImage = `linear-gradient(to right,#f5f7fa, #c3cfe2)`;

  return (
    <div className="storeapps-screen" style={{ backgroundImage }}>
      <div className="storeapps-content">
        <h2>{`This ${tabName} Page is being Cooking!`}</h2>
        <p>Placeholder text describing the content being prepared.</p>
        <img src={preparingImage} alt="Preparing" /> {/* Use imported image */}
      </div>
    </div>
  );
};

export default StoreApps;
