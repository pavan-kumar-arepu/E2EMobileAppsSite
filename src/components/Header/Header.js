// src/components/Header.js
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink for navigation
import "./Header.css";

const Header = () => {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [capsuleStyle, setCapsuleStyle] = useState({});
  const navRef = useRef(null);

  const tabs = [
    { name: "Home", link: "/" }, // Updated links for other tabs
    { name: "AboutMe", link: "/about" },
    { name: "Contributions", link: "/contributions" },
    { name: "Certifications", link: "/linkedin" },
    { name: "StoreApps", link: "/apps" },
    { name: "MyQuotes", link: "/quotes" },
    { name: "Contact", link: "/contact" }, // Link to the Contact component
  ];

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

  useEffect(() => {
    const selectedTabElement = navRef.current.querySelector(
      `li[data-tab='${selectedTab}']`
    );
    if (selectedTabElement) {
      const { offsetLeft, offsetWidth } = selectedTabElement;
      setCapsuleStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [selectedTab]);

  return (
    <header className="header">
      <div className="header-left">
        <h1>E2E Mobile App Solutions</h1>
        <p className="header-left">
          Transforming Ideas into Impactful Mobile App Solutions
        </p>
      </div>
      <div className="header-right">
        <ul className="nav" ref={navRef}>
          <div className="capsule" style={capsuleStyle}></div>
          {tabs.map((tab) => (
            <li
              key={tab.name}
              data-tab={tab.name}
              className={`nav-item ${
                selectedTab === tab.name ? "selected" : ""
              }`}
              onClick={() => handleTabClick(tab.name)}
            >
              <NavLink to={tab.link} activeClassName="active">
                {tab.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
