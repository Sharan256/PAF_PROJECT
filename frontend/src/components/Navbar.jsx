import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logoGym.png";

const Navbar = ({ user }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg shadow-md z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Fitness Hub
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <Link 
                to={`/profile/${user.id}`} 
                className="flex items-center space-x-2 group"
              >
                <div className="relative">
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-10 h-10 rounded-full border-2 border-purple-500 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="hidden md:block text-gray-700 font-medium group-hover:text-purple-600 transition-colors">
                  {user.name}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
