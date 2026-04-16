import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import Activities from "./pages/Activities";
import HomePage from "./pages/HomePage";
import Holidays from "./pages/Holidays";
import Visas from "./pages/Visas";
import Cruise from "./pages/Cruise";
import AboutUs from "./pages/AboutUs";
import Footer from "./components/Footer";
import UserSidebar from "./components/UserSidebar";
import { useState } from "react";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <Navbar onOpenUserMenu={() => setIsSidebarOpen(true)}/>
      <UserSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        {/* Canonical routes (used by Navbar) */}
        <Route path="/activity" element={<HomePage/>}/>
        <Route path="/holiday" element={<Holidays/>}/>
        <Route path="/visa" element={<Visas/>}/>
        <Route path="/cruises" element={<Cruise/>}/>

        {/* Backwards-compatible routes (keep existing links working) */}
        <Route path="/activities" element={<HomePage/>}/>
        <Route path="/holidays" element={<Holidays/>}/>
        <Route path="/visas" element={<Visas/>}/>
        <Route path="/about-us" element={<AboutUs/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
