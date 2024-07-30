import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [capsuleStyle, setCapsuleStyle] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  // const [visitorCount, setVisitorCount] = useState(0);
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

  // useEffect(() => {
  //   const countKey = "visitorCount";
  //   let count = parseInt(localStorage.getItem(countKey), 10);

  //   if (isNaN(count)) {
  //     count = 50; // Default value if not set
  //   }

  //   // Update the count only if it's not already incremented
  //   const updateCount = () => {
  //     localStorage.setItem(countKey, count + 1);
  //     setVisitorCount(count + 1);
  //   };

  //   // Update count after a brief delay to avoid rapid increments
  //   const timer = setTimeout(updateCount, 100); // 100ms delay

  //   return () => clearTimeout(timer); // Clean up timeout on unmount
  // }, []);

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
        {/* <div className="visitor-count">Visitors: {visitorCount}</div> */}
      </div>
    </header>
  );
};

export default Header;
