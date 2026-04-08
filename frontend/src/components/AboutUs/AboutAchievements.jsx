import React from "react";
import { Award, Star } from "lucide-react";
import img1 from '../../assets/achei1.webp'
import img2 from '../../assets/achei2.webp'
import img3 from '../../assets/achei3.webp'
import img4 from '../../assets/achei4.webp'


const achievements = [
  { img: img1, title: "La Perle", subtitle: "5 Years of Magnificence", year: "2017" },
  { img: img2, title: "Dubai Parks and Resorts", subtitle: "Partner of the Year", year: "2017" },
  { img: img3, title: "Arabian Travel Award", subtitle: "Best Destination Management Company", year: "2018" },
  { img: img4, title: "Louvre Abu Dhabi", subtitle: "Exceptional Partner", year: "2023" }
];

const AboutAchievements = () => {
  return (
    <section id="achievements" className="py-10 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="mb-10 relative z-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Our Achievements</h2>
          <p className="text-gray-500 text-sm">Milestones of excellence and recognition from industry leaders across the globe.</p>
        </div>

        {/* Timeline / Cards */}
        <div className="flex flex-wrap flex-col md:flex-row gap-6 relative z-10">
          {achievements.map((item, idx) => (
            <div 
              key={idx} 
              className="group bg-white p-6 rounded-2xl border border-gray-200 relative overflow-hidden"
            >             
              <div className="relative z-10 flex items-center gap-4">
                <img src={item.img} alt="" className="w-20" />
                <div className="text-sm text-blue-600 flex flex-col gap-4">
                <h3 className="text-gray-600 leading-tight">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.subtitle}</p>
                <p className="text-sm text-gray-600">{item.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutAchievements;
