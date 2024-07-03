// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/Tabs/Home/Home";
import Contact from "./components/Tabs/Contact/Contact";

import DummyScreen from "./components/Tabs/Dummy/DummyScreen";

import ContributionScreen from "./components/Tabs/Contributions/ContributionScreen";
import StoreApps from "./components/Tabs/StoreApps/StoreApps";
import MyQuoteScreen from "./components/Tabs/MyQuotes/MyQuoteScreen";
import LinkedinScreen from "./components/Tabs/Linkedin/LinkedinScreen";

import "./App.css";
import AboutMe from "./components/Tabs/AboutMe/AboutMe";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
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
            element={<LinkedinScreen tabName="Linkedin" />}
          />
          <Route path="/apps" element={<StoreApps tabName="StoreApps" />} />
          <Route
            path="/quotes"
            element={<MyQuoteScreen tabName="MyQuotes" />}
          />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
