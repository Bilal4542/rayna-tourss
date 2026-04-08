import React from 'react';
import { Mail, Phone, MessageCircle} from 'lucide-react';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram, FaYoutube   } from "react-icons/fa";
import logo from '../assets/raynatourslogo.webp'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-8 pb-4 px-4">
      <div className="max-w-[97%] mx-auto">
        <div className=" flex justify-between flex-wrap flex-col md:flex-row  gap-12 mb-8">
          
          {/* Column 1: Brand & App Download */}
          <div className="space-y-8">
            <img 
              src={logo} 
              alt="Rayna Tours" 
              className="h-12 w-auto"
            />
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Download App</h4>
              <div className="flex gap-3">
                <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" /></a>
                <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10" /></a>
              </div>
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 text-lg">Rayna Tours</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><Link to={'/about-us'} className="hover:underline transition-colors">About us</Link></li>
              <li><a href="#" className="hover:underline transition-colors">Partner with us</a></li>
              <li><a href="#" className="hover:underline transition-colors">Become an affiliate</a></li>
            </ul>
          </div>

          {/* Column 3: Contact & Help */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 text-lg">Get Help 24/7</h4>
            <div className="space-y-4 text-gray-500 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <a href="mailto:help@raynatours.com" className='hover:underline'>help@raynatours.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <span className='hover:underline'>+971 42087112</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-gray-400" />
                <span className='hover:underline'>+971 42087112</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 pt-4">
              {[FaFacebookF , FaLinkedinIn , FaTwitter , FaInstagram, FaYoutube].map((Icon, idx) => (
                <a key={idx} href="#" className="p-2 rounded-xl border border-gray-200  hover:bg-gray-50 text-gray-900 transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payments */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span>© 2026 Rayna Tours. Built by SkyraSoft</span>
            <span className="hidden md:inline text-gray-200">|</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span className="hidden md:inline text-gray-200">|</span>
            <a href="#" className="hover:underline">Terms & conditions</a>
          </div>

          {/* Payment Icons Placeholder */}
<div className="flex flex-wrap items-center gap-4">
  {/* Visa */}
  {/* <img 
    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
    alt="Visa" 
    className="h-3 md:h-4 object-contain" 
  /> */}
  
  {/* Mastercard */}
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
    alt="Mastercard" 
    className="h-6 w-8 shadow border-gray-400 border rounded p-1 object-contain" 
  />
  
  {/* American Express */}
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" 
    alt="Amex" 
    className="h-6 w-8 shadow border-gray-400 border rounded p-1 object-contain" 
  />

  {/* PayPal */}
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
    alt="PayPal" 
    className="h-6 w-8 shadow border-gray-400  border rounded p-1 object-contain" 
  />

  {/* Maestro / Mada Style */}
  {/* <img 
    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.svg" 
    alt="Mada" 
    className="h-5  border rounded p-1 object-contain" 
  /> */}

  {/* Apple Pay */}
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" 
    alt="Apple Pay" 
    className="h-6 w-8 shadow border-gray-400   border rounded p-1 object-contain" 
  />

  {/* Google Pay */}
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" 
    alt="Google Pay" 
    className="h-6 w-8 shadow border-gray-400   border rounded p-1 object-contain" 
  />
</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;