// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/Tabs/Home/Home";
import Contact from "./components/Tabs/Contact/Contact";
import ContributionScreen from "./components/Tabs/Contributions/ContributionScreen";
import StoreApps from "./components/Tabs/StoreApps/StoreApps";
import MyQuoteScreen from "./components/Tabs/MyQuotes/MyQuoteScreen";
import CertificationScreen from "./components/Tabs/Certifications/CertificationScreen";
import VaniCore from "./components/Tabs/VaniCore/VaniCore";

import "./App.css";
import AboutMe from "./components/Tabs/AboutMe/AboutMe";

function AppInner() {
  const location = useLocation();
  const hideHeader = location.pathname === '/vanicore';
  return (
    <div className="App">
      {!hideHeader && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutMe tabName="AboutMe" />} />
          <Route
            path="/contributions"
            element={<ContributionScreen tabName="Contributions" />}
          />
          <Route
            path="/linkedin"
            element={<CertificationScreen tabName="Certifications" />}
          />
          <Route path="/apps" element={<StoreApps tabName="StoreApps" />} />
          <Route
            path="/quotes"
            element={<MyQuoteScreen tabName="MyQuotes" />}
          />
          <Route path="/vanicore" element={<VaniCore />} />
          {/* Add more routes as needed */}
        </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
