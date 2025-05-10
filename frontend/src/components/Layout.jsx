import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import MainSideBar from "./MainSideBar";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   // State to control whether the sidebar is open or closed
  const [user, setUser] = useState(null);
  // State to store user data

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar user={user} />

      {/* Button to toggle sidebar visibility (mobile only) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors duration-200 md:hidden"
      >
        {/* Toggle icon based on sidebar state */}
        {isSidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>
      {/* Sidebar component receives user info and open/close state */}
      <MainSideBar user={user} isOpen={isSidebarOpen} />

      {/* Main content area, adjusts left margin based on sidebar state (for md+ screens) */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'} pt-16`}>
        <div className="p-6">
          {React.Children.map(children, child =>
            React.isValidElement(child)
              ? React.cloneElement(child, { user })
              : child
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
