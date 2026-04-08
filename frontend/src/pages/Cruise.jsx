import React from 'react';
import MainCarousel from '../components/MainCarousel';
import { cruiseSlides } from '../data/carouselData';
import BestCities from '../components/BestCities';
import { cruiseDepartureCities } from '../data/BestCitiesData';
import CruiseSection from '../components/CruiseSection';
import { specialSaverCruises, mscCruises, costaCruises, royalCaribbeanCruises } from '../data/cruisePageData/cruisePageData';
import ExploreMore from '../components/ExploreMore';
import { cruiseTabs } from '../data/exploreMoreData/exploreMoreData';

const Cruise = () => {
  return (
    <div>
      <MainCarousel slides={cruiseSlides} />
      <BestCities mainHeading="Explore Cruises by Departure City" cardHeadingPrefix="Cruises from" data={cruiseDepartureCities} />
      <CruiseSection title="Special Saver Cruise Packages" activities={specialSaverCruises} />
      <CruiseSection title="MSC Cruises Holidays" activities={mscCruises} />
      <CruiseSection title="Costa Cruises Holidays" activities={costaCruises} />
      <CruiseSection title="Royal Caribbean Cruises Holidays" activities={royalCaribbeanCruises} />
      <ExploreMore tabsData={cruiseTabs} />
    </div>
  );
};

export default Cruise;
