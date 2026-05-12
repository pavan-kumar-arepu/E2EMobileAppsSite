// src/components/Home/Home.js
import React from "react";
import QuickView from "./QuickView";
import Section from "../../Section";

const Home = () => {
  return (
    <div>
      <Section id="quick-view" title="" style={{ marginBottom: 0 }}>
        <QuickView />
      </Section>
    </div>
  );
};
export default Home;
