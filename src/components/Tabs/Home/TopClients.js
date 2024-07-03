import React from "react";
import "./TopClients.css"; // Import your CSS file for styling

// Import your client logos using require
import btLogo from "../../../assets/clients/bt.png";
import jnjLogo from "../../../assets/clients/jnj.png";
import scandicLogo from "../../../assets/clients/scandic.png";
import bpLogo from "../../../assets/clients/bp.png";
import davitaLogo from "../../../assets/clients/davita.png";
import jpmcLogo from "../../../assets/clients/jpmc.png";
import iciciLogo from "../../../assets/clients/icici.png";
import avivaLogo from "../../../assets/clients/aviva.png";

// Define your clients array with correct image paths
const clients = [
  { name: "BT", image: btLogo },
  { name: "JNJ", image: jnjLogo },
  { name: "Scandic", image: scandicLogo },
  { name: "BP", image: bpLogo },
  { name: "Davita", image: davitaLogo },
  { name: "JPMC", image: jpmcLogo },
  { name: "ICICI", image: iciciLogo },
  { name: "Aviva", image: avivaLogo },
  // Add more clients as needed
];

const TopClients = () => {
  return (
    <div className="top-clients">
      <div className="top-clients-summary">
        Over 30+ Real time Mobile Application Experience from India, UK, Sweden,
        Ireland
      </div>
      <div className="top-clients-logos">
        {clients.map((client, index) => (
          <div key={index} className="client-logo">
            <img src={client.image} alt={client.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopClients;
