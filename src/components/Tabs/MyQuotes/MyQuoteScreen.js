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
        "When we are getting nothing out of spending money, we feel so pain right? And we knew that, there is no limitation of earning! But do we feel any pain, if we dont get back anything, when we spent time on some thing, though the life(time) is short and limited!",
      refined:
        "While we experience pain when we gain nothing from spending money, we often overlook the potential agony of investing our limited time without any returns in life, despite its brevity and finite nature.",
      author: "Arepu Pavan Kumar",
    },
    {
      original:
        "‘You are working with integrity as you are getting paid’ is different than ‘You are taking a salary for the work you did with integrity‘",
      refined:
        "“Working with integrity goes beyond earning a salary; it encompasses taking pride in the quality of your work and deserving the compensation you receive.”\n“True integrity in work lies not only in receiving a paycheck but in earning it through an unwavering commitment to excellence and a deep sense of personal accountability.”",
      author: "Arepu Pavan Kumar",
    },
  ];

  return (
    <div className="myQuote-screen">
      <div className="myQuote-content">
        <h2>{`This ${tabName} Page`}</h2>
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
