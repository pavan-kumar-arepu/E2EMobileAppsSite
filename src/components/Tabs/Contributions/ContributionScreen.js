import React, { useState } from "react";
import styled from "styled-components";
import smartphoneImage from "../../../assets/smartphone.png";
import articleImage from "../../../assets/application.png";
import CardItem from "../../../Reusable/CardItem";

const featuredApps = {
  iOS: [
    {
      name: "APINetworkTracker - iOS Swift Package",
      description:
        "APKNetworkTracker is a Swift package that has been gaining attention in the iOS development community",
      link: "https://github.com/pavan-kumar-arepu/APKNetworkTracker-Package",
      thumbnail: smartphoneImage,
    },
    {
      name: "Swift Image Loader",
      description:
        "An iOS app which is responsible to load load and display images in a scrollable grid, enffienctly.",
      link: "https://github.com/pavan-kumar-arepu/SpritualMaster-A-Smart-ImageLoaderApp",
      thumbnail: smartphoneImage,
    },
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
    name: "APKNetwork Tracker",
    description:
      "An article on how to create a SwiftPackage Manager to Track API calls in iOS applications",
    link: "https://www.linkedin.com/pulse/apknetworktracker-ios-applications-pavan-kumar-arepu-hyvbf/?trackingId=tjJjWp6YQY6x4B0gY%2BmLUQ%3D%3D",
    thumbnail: articleImage,
    isArticle: true,
  },
  {
    name: "Pre-flight: InSide Mobile App Security",
    description:
      "An article on any mobile app security, this mainly focused on Preflight i.e. Inside the Mobile App Bundle",
    link: "https://www.linkedin.com/pulse/pre-flight-inside-mobile-app-security-pavan-kumar-arepu-mpfff/?trackingId=dPY4NUKPQaeUG%2F2Nyc%2Bgsg%3D%3D",
    thumbnail: articleImage,
    isArticle: true,
  },
  {
    name: "A Essential guide for Mobile App Security:",
    description:
      "An article on Mobile app security mainly focusing on Banking domain, Security and Authentication",
    link: "https://www.linkedin.com/pulse/essential-mobile-app-security-banking-beyond-focus-pavan-kumar-arepu-hg6kc/?trackingId=dPY4NUKPQaeUG%2F2Nyc%2Bgsg%3D%3D",
    thumbnail: articleImage,
    isArticle: true,
  },
  {
    name: "Forecast Weather using AppleCloud",
    description: "Detailed article on using AppleCloud for weather forecasting",
    link: "https://www.linkedin.com/pulse/power-propritory-weatherapi-pavan-kumar-arepu-qrf8f/?trackingId=gfGMGEAoKi%2FOXH0JgT1v9Q%3D%3D",
    thumbnail: articleImage,
    isArticle: true,
  },
  {
    name: "All In One ",
    description:
      "An artcile, I meticulously compared and contrasted these mobile platforms to help you navigate their differences and similarities.",
    link: "https://www.linkedin.com/pulse/all-one-pavan-kumar-arepu-yppif/?trackingId=dPY4NUKPQaeUG%2F2Nyc%2Bgsg%3D%3D",
    thumbnail: articleImage,
    isArticle: true,
  },
  {
    name: "The Subconscious Mind in Achieving Goals ",
    description:
      "An artcile on Embracing the Power of the Subconscious Mind in Achieving Goals",
    link: "https://www.linkedin.com/pulse/embracing-power-subconscious-mind-achieving-goals-pavan-kumar-arepu-gc67f/?trackingId=dPY4NUKPQaeUG%2F2Nyc%2Bgsg%3D%3D",
    thumbnail: articleImage,
    isArticle: true,
  },
  // Add more articles as needed
];

const Container = styled.div`
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const SegmentControl = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const SegmentButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #007bff;
  background-color: ${(props) => (props.active ? "#007bff" : "white")};
  color: ${(props) => (props.active ? "white" : "#007bff")};
  cursor: pointer;
  border-radius: 5px;
  font-size: 1rem;
  margin: 0 5px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

// const SectionTitle = styled.h2`
//   font-size: 2rem;
//   margin-bottom: 15px;
// `;

const AppCategory = styled.div`
  margin-bottom: 30px;
`;

const AppCategoryTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const ArticleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Contributions = () => {
  const [selectedTab, setSelectedTab] = useState("MobileApps");

  return (
    <Container>
      <SegmentControl>
        <SegmentButton
          active={selectedTab === "MobileApps"}
          onClick={() => setSelectedTab("MobileApps")}
        >
          Featured Mobile Apps
        </SegmentButton>
        <SegmentButton
          active={selectedTab === "Articles"}
          onClick={() => setSelectedTab("Articles")}
        >
          LinkedIn Articles
        </SegmentButton>
      </SegmentControl>

      <div className="content">
        {selectedTab === "MobileApps" && (
          <>
            {/* <SectionTitle>Featured Mobile Apps</SectionTitle> */}
            {Object.keys(featuredApps).map((category, index) => (
              <AppCategory key={index}>
                <AppCategoryTitle>{category}</AppCategoryTitle>
                {featuredApps[category].map((app, appIndex) => (
                  <CardItem key={appIndex} {...app} />
                ))}
              </AppCategory>
            ))}
          </>
        )}

        {selectedTab === "Articles" && (
          <>
            {/* <SectionTitle>LinkedIn Articles</SectionTitle> */}
            <ArticleSection>
              {articles.map((article, index) => (
                <CardItem key={index} {...article} isArticle />
              ))}
            </ArticleSection>
          </>
        )}
      </div>
    </Container>
  );
};

export default Contributions;
