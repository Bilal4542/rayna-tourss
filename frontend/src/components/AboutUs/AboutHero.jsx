import React, { useState, useEffect } from "react";
import { Users, DollarSign, CalendarHeart, Briefcase, MapPin } from "lucide-react";

const stats = [
  { label: "Guests Served", value: "25M+", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Group Revenue", value: "850M+", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
  { label: "Founded in", value: "2006", icon: CalendarHeart, color: "text-purple-600", bg: "bg-purple-100" },
  { label: "Employees", value: "1300+", icon: Briefcase, color: "text-orange-600", bg: "bg-orange-100" },
  { label: "Headquarters", value: "Dubai", icon: MapPin, color: "text-red-600", bg: "bg-red-100" }
];
const navLinks = [
  { name: "Company", href: "#company" },
  { name: "Achievements", href: "#achievements" },
  { name: "Core Values", href: "#corevalues" },
  { name: "Services", href: "#services" },
  { name: "Leadership", href: "#leadership" },
  { name: "Partner Stories", href: "#partnerstories" },
  { name: "Contact Us", href: "#contactus" }
];

const AboutHero = () => {
  const [activeLink, setActiveLink] = useState("#company");

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    setActiveLink(href);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    <div className="bg-gray-50">
      <div className="">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 border-b border-gray-200 p-6">About Us</h1>
        
        {/* Secondary Navigation */}
        <div className="flex flex-wrap justify-between mx-6 md:mx-12 gap-2 md:gap-4 mt-6 mb-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleScrollTo(e, link.href)}
              className={`text-sm font-medium cursor-pointer pb-2 transition-all ${
                activeLink === link.href 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 border-b-2 border-transparent hover:text-blue-600"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Hero Image & Overlayed Stats */}
        <div className="w-full h-[400px] md:h-[450px] relative mb-16 md:mb-24">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop" 
            alt="Worldwide Travel Destinations" 
            className="w-full h-full object-cover"
          />
          
          {/* Absolutely Positioned Stats */}
          <div className="absolute bottom-10 left-0 z-20 w-full">
            <div className="px-16">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {stats.map((stat, idx) => {
                  return (
                    <div key={idx} className="flex flex-col items-center p-2 md:p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                      <div className="text-xl md:text-3xl font-extrabold text-orange-400 mb-1">{stat.value}</div>
                      <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider text-center">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AboutHero;
