import React from "react";
import "./MyQuoteScreen.css";

const quotes = [
  {
    text: "Hock your GOAL / desire / aspiration to TIME — then TIME takes you to the GOAL, on TIME!",
    author: "Arepu Pavan Kumar",
  },
  {
    text: "While we experience pain when we gain nothing from spending money, we often overlook the potential agony of investing our limited time without any returns — despite life's brevity and finite nature.",
    author: "Arepu Pavan Kumar",
  },
  {
    text: "True integrity in work lies not only in receiving a paycheck but in earning it through an unwavering commitment to excellence and a deep sense of personal accountability.",
    author: "Arepu Pavan Kumar",
  },
];

const MyQuoteScreen = () => (
  <div className="quote-page">
    <div className="quote-header">
      <span className="quote-header-badge">My Quotes</span>
      <h2>Words I Live By</h2>
      <p>Original thoughts on time, integrity, and purpose — authored by Pavan Kumar Arepu.</p>
    </div>
    <div className="quote-grid">
      {quotes.map((q, i) => (
        <div key={i} className="quote-card">
          <span className="quote-mark">"</span>
          <p className="quote-text">{q.text}</p>
          <div className="quote-divider" />
          <span className="quote-author">— {q.author}</span>
        </div>
      ))}
    </div>
  </div>
);

export default MyQuoteScreen;
