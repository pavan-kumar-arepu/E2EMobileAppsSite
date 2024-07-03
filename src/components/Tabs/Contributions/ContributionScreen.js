// src/components/Tabs/Contributions/Contributions.js
import React from "react";
import smartphoneImage from "../../../assets/smartphone.png";
import articleImage from "../../../assets/application.png";
import CardItem from "../../../Reusable/CardItem";

const featuredApps = {
  ReactNative: [
    {
      name: "TripAdvisor",
      description: "A trip calculator application built with React Native.",
      link: "https://github.com/pavan-kumar-arepu/TripCalculator",
      thumbnail: smartphoneImage,
    },
    {
      name: "FirebaseAuth",
      description:
        "Real time Registrations, Login, Logout Feature using Firebase",
      link: "https://github.com/pavan-kumar-arepu/FirebaseAuth",
      thumbnail: smartphoneImage,
    },
    {
      name: "Instagram ",
      description: "Tried to clone the Instragram front page",
      link: "https://github.com/pavan-kumar-arepu/Instagram_React",
      thumbnail: smartphoneImage,
    },
  ],
  iOS: [
    {
      name: "Weather Forcast",
      description:
        "Built a real time forecast app, which is perfect clone of Apple Weather App",
      link: "https://github.com/pavan-kumar-arepu/SwiftForecast",
      thumbnail: smartphoneImage,
    },
    {
      name: "Voice Recorder",
      description: "Built an Audio Recorder App using SwiftUI, MVVM",
      link: "https://github.com/pavan-kumar-arepu/AudioRecorderPavanKumar",
      thumbnail: smartphoneImage,
    },
    {
      name: "Spiritual Master",
      description:
        "Built a high performance image loader dynamically, with SwiftUI, Cache and API's",
      link: "https://github.com/pavan-kumar-arepu/SmartImageLoader",
      thumbnail: smartphoneImage,
    },
  ],
  Android: [
    {
      name: "PrimeMinister of India(Upcoming Playstore App)",
      description:
        "Made an Android App with JetPackCompose, it fetches data from Firebase and renders the Prime Ministers data on all Android Devices",
      link: "https://github.com/pavan-kumar-arepu/PrimeMinisterOfIndia",
      thumbnail: smartphoneImage,
    },
    {
      name: "A wishlist app",
      description:
        "Made a Wishlist app using latest JetPackCompose and on all Android Devices",
      link: "https://github.com/pavan-kumar-arepu/MyWishListApp",
      thumbnail: smartphoneImage,
    },
  ],
  Flutter: [
    {
      name: "Yet To come",
      thumbnail: smartphoneImage,
    },
  ],
};

const articles = [
  {
    name: "Forecast Weather using AppleCloud",
    description: "Detailed article on using AppleCloud for weather forecasting",
    link: "https://www.linkedin.com/pulse/power-propritory-weatherapi-pavan-kumar-arepu-qrf8f/?trackingId=gfGMGEAoKi%2FOXH0JgT1v9Q%3D%3D",
    thumbnail: articleImage,
    isArticle: true,
  },
  // Add more articles as needed
];

const Contributions = () => {
  return (
    <div className="contributions">
      <h2 className="section-title">Featured Mobile Apps</h2>
      {Object.keys(featuredApps).map((category, index) => (
        <div key={index} className="app-category">
          <h3 className="app-category-title">{category}</h3>
          {featuredApps[category].map((app, appIndex) => (
            <CardItem key={appIndex} {...app} />
          ))}
        </div>
      ))}

      <h2 className="section-title">LinkedIn Articles</h2>
      <div className="article-section">
        {articles.map((article, index) => (
          <CardItem key={index} {...article} isArticle />
        ))}
      </div>
    </div>
  );
};

export default Contributions;
