import React from 'react'
import { visaSlides } from '../data/carouselData'
import MainCarousel from '../components/MainCarousel'
import ActivitySection from '../components/ActivitySection'
import { eVisaHassleFree, travelAbroadVisa } from '../data/visaPageData/visaPageData'
import ExploreMore from '../components/ExploreMore'
import { visaTabs } from '../data/exploreMoreData/exploreMoreData'

const Visas = () => {
  return (
    <div>
      <MainCarousel slides={visaSlides} />
      <ActivitySection title={'Apply for Your eVisa Hassle-Free'} desc={'Skip long queues—apply for your eVisa online effortlessly from anywhere.'} activities={eVisaHassleFree} isGrid={true} hidePricing={true} />
      <ActivitySection title={'Travel Abroad? Apply for Your Visa Today'} desc={'Fast, easy, and secure international visa application. Apply now and get ready to travel!'} activities={travelAbroadVisa} isGrid={true} hidePricing={true} />
      <ExploreMore tabsData={visaTabs}/>
    </div>
  )
}

export default Visas
