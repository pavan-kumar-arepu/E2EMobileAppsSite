import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [capsuleStyle, setCapsuleStyle] = useState({});
  const [menuOpen, setMenuOpen] = useState(false); // State for menu toggle
  const navRef = useRef(null);

  const tabs = [
    { name: "Home", link: "/" },
    { name: "AboutMe", link: "/about" },
    { name: "Contributions", link: "/contributions" },
    { name: "Certifications", link: "/linkedin" },
    { name: "StoreApps", link: "/apps" },
    { name: "MyQuotes", link: "/quotes" },
    { name: "Contact", link: "/contact" },
  ];

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
    setMenuOpen(false); // Close menu on tab click
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
        <p className="header-left-description">
          Transforming Ideas into Impactful Mobile App Solutions
        </p>
      </div>
      <div className="header-right">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <ul className={`nav ${menuOpen ? "open" : ""}`} ref={navRef}>
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
