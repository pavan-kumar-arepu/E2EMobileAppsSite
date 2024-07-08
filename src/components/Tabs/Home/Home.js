// src/components/Home/Home.js
import React from "react";
// import ProfileSummary from "./ProfileSummary";
// import Awards from "./Awards";
// import Education from "./Education";
// import Experience from "./Experience";
// import CoreCompetencies from "./CoreCompetencies";
import QuickView from "./QuickView"; // Import QuickView component
import Section from "../../Section";
import TopClients from "./TopClients";
import Separator from "../../Separator";

const Home = () => {
  return (
    <div>
      <Section id="quick-view" title="" style={{ marginBottom: 0 }}>
        <QuickView />
      </Section>
      <Separator />
      <Section id="top-client" title="Top Clients">
        <TopClients />
      </Section>
    </div>
  );
};
export default Home;
