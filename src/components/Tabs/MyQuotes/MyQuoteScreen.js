// src/components/Tabs/MyQuotes/MyQuoteScreen.js
import React from "react";
import "./MyQuoteScreen.css";

const MyQuoteScreen = ({ tabName }) => {
  const quotes = [
    {
      original:
        "Hock your GOAL/desire/aspiration to the TIME then THE TIME take up you to the GOAL on TIME!",
      refined: "",
      author: "Arepu Pavan Kumar",
    },
    {
      original:
        "While we experience pain when we gain nothing from spending money, we often overlook the potential agony of investing our limited time without any returns in life, despite its brevity and finite nature.",
      refined: "",
      author: "Arepu Pavan Kumar",
    },
    {
      original:
        "True integrity in work lies not only in receiving a paycheck but in earning it through an unwavering commitment to excellence and a deep sense of personal accountability.",
      refined: "",
      author: "Arepu Pavan Kumar",
    },
  ];

  return (
    <div className="myQuote-screen">
      <div className="myQuote-content">
        {/* <h2>{`This ${tabName} Page`}</h2> */}
        {quotes.map((quote, index) => (
          <div key={index} className="quote">
            <p className="original-quote">"{quote.original}"</p>
            {quote.refined && (
              <p className="refined-quote">"{quote.refined}"</p>
            )}
            <p className="author">- {quote.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyQuoteScreen;
