import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logoGym.png"; //
import { FaBars } from "react-icons/fa";

const Navbar = ({ user, toggleMainSideBar }) => {
  return (
    <div className="bg-gradient-to-r from-violet-700 to-indigo-700 flex w-full h-[70px] z-50 shadow-lg">
      <div className="flex items-center justify-between w-full px-6">
        <div className="flex items-center space-x-4">
          <button
            className="text-white text-2xl p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
            onClick={toggleMainSideBar}
          >
            <FaBars />
          </button>
          <div className="flex items-center space-x-3">
            <img src={logo} alt="logo" className="w-10 h-10" />
            <div className="text-white text-xl font-bold tracking-wide">Fitness Connect</div>
          </div>
        </div>

        <Link 
          to={`/profile/${user?.id}`} 
          className="flex items-center space-x-3 group bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2 transition-all duration-200"
        >
          <div className="flex flex-col items-end mr-2">
            <span className="text-white text-sm font-medium group-hover:text-indigo-200 transition-colors duration-200">
              {user?.name}
            </span>
            <span className="text-indigo-200 text-xs group-hover:text-white transition-colors duration-200">
              View Profile
            </span>
          </div>
          <div className="relative">
            <img
              src={user?.profileImage}
              alt="profile"
              className="w-[45px] h-[45px] rounded-full border-2 border-white/30 group-hover:border-white/50 transition-all duration-200 shadow-md"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default Navbar;
