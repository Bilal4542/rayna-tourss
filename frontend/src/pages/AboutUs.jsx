import React from 'react';
import AboutHero from '../components/AboutUs/AboutHero';
import AboutMissionVision from '../components/AboutUs/AboutMissionVision';
import AboutHistory from '../components/AboutUs/AboutHistory';
import AboutServices from '../components/AboutUs/AboutServices';
import AboutAchievements from '../components/AboutUs/AboutAchievements';
import AboutCoreValues from '../components/AboutUs/AboutCoreValues';
import AboutLeadership from '../components/AboutUs/AboutLeadership';
import AboutContact from '../components/AboutUs/AboutContact';
import AboutAffiliates from '../components/AboutUs/AboutAffiliates';

const AboutUs = () => {
  return (
    <div className="">
      <AboutHero />
      <AboutMissionVision />
      <AboutHistory />
      <AboutServices />
      <AboutAffiliates />
      <AboutAchievements />
      <AboutCoreValues />
      <AboutLeadership />
      <AboutContact />
    </div>
  );
};

export default AboutUs;
