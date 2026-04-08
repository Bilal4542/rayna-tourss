import React from "react";
import img1 from '../../assets/core1.webp'
import img2 from '../../assets/core2.webp'
import img3 from '../../assets/core3.webp'
import img4 from '../../assets/core4.webp'
import img5 from '../../assets/core5.webp'
import img6 from '../../assets/core6.webp'

const values = [
  { image: img1, title: "Passion for Travel", desc: "Driven by the love of exploration and creating unforgettable memories for our customers." },
  { image: img2, title: "Client-Centric Approach", desc: "Putting our customers at the heart of everything we do, ensuring personalized experiences." },
  { image: img3, title: "Innovation & Adaptability", desc: "Embracing new technologies to stay ahead in the dynamic travel industry." },
  { image: img4, title: "Ethical & Sustainable", desc: "Committed to responsible tourism and preserving destinations for future generations." },
  { image: img5, title: "Teamwork & Collaboration", desc: "Fostering a culture of mutual respect and collective success across our global offices." },
  { image: img6, title: "Professionalism & Integrity", desc: "Upholding the highest standards of honesty and transparency in all our dealings." }
];

const AboutCoreValues = () => {
  return (
    <section id="corevalues" className="py-10 px-8 bg-gray-50 border-t border-gray-100">
      <div className="px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-4">Core Values</h2>
          <p className="text-sm text-gray-500">Our values shape who we are and guide every decision we make. We believe in integrity, respect, and accountability. We strive for excellence in everything we do, value teamwork and innovation, and are committed to delivering the best experience to our clients and partners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((v, idx) => {
            const Icon = v.image;
            return (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center hover:border-blue-100 transition-colors">
                <div className="w-30 bg-gray-50 text-gray-800 rounded-2xl flex items-center justify-center mb-6">
                  {/* <Icon size={28} strokeWidth={1.5} /> */}
                  <img src={v.image} alt="" className="w-full" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm text-center">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutCoreValues;
