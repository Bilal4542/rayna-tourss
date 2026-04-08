import React, { useState } from "react";
import { Phone, User, ShoppingCart, Search, ChevronDown } from "lucide-react";
import logo from "../assets/raynatourslogo.webp";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    label: "Activities",
    icon: "🔭",
    path: "/activities",
  },
  {
    id: 2,
    label: "Holidays",
    icon: "⛱️",
    path: "/holidays",
  },
  {
    id: 3,
    label: "Visas",
    icon: "💳",
    path: "/visas",
  },
  {
    id: 4,
    label: "Cruises",
    icon: "🚢",
    path: "/cruises",
  },
];
const Navbar = ({ onOpenUserMenu }) => {
  const [activeTab, setActiveTab] = useState("Activities");
// 1. State to manage open/close (Disappear/Appear)
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-100 pb-4">
      {/* Top Row: Logo & Actions */}
      <div className="max-w-[99%] mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="">
          {/* Replace this placeholder src with your actual Rayna Tours logo path */}
          <img src={logo} alt="Rayna Tours" className="w-40" />
        </Link>

        {/* Top Right Controls */}
        <div className="flex items-center space-x-4">

     {/* 2. THE Wrapper (Crucial for positioning) */}
        <div className="relative">
          {/* 3. The Toggle Button */}

          {/* Helpline Button */}
          <button onClick={() => setIsOpen(!isOpen)}  className={`flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 transition-colors cursor-pointer ${isOpen ? 'relative z-50 bg-white' : 'hover:bg-gray-50'}`}>
            <Phone size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500 font-medium">Helpline</span>
          </button>     

          {/* 4. The Floating Box Logic */}
          {isOpen && (
            <>
              {/* Invisible backdrop to close the menu when clicking outside */}
              <div 
                className="fixed inset-0 z-40 bg-black/50" 
                onClick={() => setIsOpen(false)} // Disappear on outside click
              />
              
              {/* --- EXACT REPLICATION OF YOUR IMAGE BELOW --- */}
              <div className="absolute right-0 mt-1 w-60 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2">
                  
                  {/* UAE Contact */}
                  <a href="tel:+97142087444" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl group transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className="text-gray-500 group-hover:text-primary transition-colors">
                        <Phone size={18} />
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm text-gray-500">UAE</p>
                        <p className="text-sm text-gray-500 tracking-tight">+971 4 208 7444</p>
                      </div>
                    </div>
                  </a>

                  {/* Divider */}
                  <div className="h-0.5 rounded-2xl bg-gray-200 mx-2" />

                  {/* India Contact */}
                  <a href="tel:+912066838877" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl group transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className="text-gray-500 group-hover:text-primary transition-colors">
                        <Phone size={18} />
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm  text-gray-500">India</p>
                        <p className="text-sm text-gray-500 tracking-tight">+91 20 6683 8877</p>
                      </div>
                    </div>
                  </a>

                </div>
              </div>
            </>
          )}
        </div>
          {/* Language / Currency Button */}
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="text-sm text-gray-500 font-medium">
              English / AED
            </span>
          </button>

          {/* User Profile Icon */}
          <button
            onClick={onOpenUserMenu}
            className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-full text-gray-500 bg-gray-200 transition-colors"
          >
            <User size={20} />
          </button>

          {/* Cart Icon */}
          <button className="text-gray-500 hover:text-gray-700 transition-colors pl-2 cursor-pointer">
            <ShoppingCart size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Bottom Row: Categories & Search */}
      <div className="max-w-[99%] mx-auto px-6 flex justify-between items-center">
        {/* Left Category Pills */}

        <div className="flex items-center space-x-3">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;

            return (
              <Link
                to={cat.path}
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`
              flex items-center space-x-0.5 justify-center px-5 py-2.5 rounded-xl font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-white text-gray-800 shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
              }
            `}
              >
                <span className="">{cat.icon}</span>
                <span className="">{cat.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Search Bar */}
        <div className="relative w-full max-w-86">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" strokeWidth={2} />
          </div>
          <input
            type="text"
            placeholder="Search Tours.."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg  placeholder-gray-400 text-gray-700 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-all"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
