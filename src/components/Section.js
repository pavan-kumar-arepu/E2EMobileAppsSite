// src/components/Section.js
import React from "react";
import "./Section.css";

const Section = ({ id, title, children }) => {
  return (
    <section id={id} className="section">
      <h2>{title}</h2>
      <div className="content">{children}</div>
    </section>
  );
};

export default Section;
