import React, { useState, useEffect } from 'react'
import MainCarousel from '../components/MainCarousel'
import { holidaySlides } from '../data/carouselData'
import BestCities from '../components/BestCities'
import ActivitySection from '../components/ActivitySection'
import { azerbaijanHolidayPackages, baliHolidayPackages, dubaiHolidayPackages, europeHolidayPackages, georgiaHolidayPackages, indiaHolidayPackages, kazakhstanHolidayPackages, saudiArabiaHolidayPackages, thailandHolidayPackages, uaeHolidayPackages, vietnamHolidayPackages } from '../data/holidayPageData/holidaysData'
import ExploreMore from '../components/ExploreMore'
import {holidayTabs} from '../data/exploreMoreData/exploreMoreData'
import { homeApi } from '../services/homeApi'

const Holidays = () => {
  const [bannerSlides, setBannerSlides] = useState(holidaySlides);

  useEffect(() => {
    homeApi
      .getBannerSlides(["holidays", "holiday"])
      .then((slides) => {
        if (slides.length > 0) setBannerSlides(slides);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <MainCarousel slides={bannerSlides}/>
      <BestCities
        mainHeading="Best Cities to Visit"
        cardHeadingPrefix="Holidays Packages in"
        category="holiday"
      />
       <ActivitySection title='Dubai Holidays Packages' activities={dubaiHolidayPackages}/>
       <ActivitySection title='Bali Holiday Packages' activities={baliHolidayPackages}/>
       <ActivitySection title='Europe Holiday Packages' activities={europeHolidayPackages}/>
       <ActivitySection title='UAE Holiday Packages' activities={uaeHolidayPackages}/>
       <ActivitySection title='Thialiand Holiday Packages' activities={thailandHolidayPackages}/>
       <ActivitySection title='Saudi Arabia Holiday Packages' activities={saudiArabiaHolidayPackages}/>
       <ActivitySection title='Vietnam Holiday Packages' activities={vietnamHolidayPackages}/>
       <ActivitySection title='Georgia Holiday Packages' activities={georgiaHolidayPackages}/>
       <ActivitySection title='Azerbaijan Holiday Packages' activities={azerbaijanHolidayPackages}/>
       <ActivitySection title='Kazakhstan Holiday Packages' activities={kazakhstanHolidayPackages}/>
       <ActivitySection title='India Holiday Packages' activities={indiaHolidayPackages}/>
        <ExploreMore tabsData={holidayTabs} />
    </div>
  )
}

export default Holidays
