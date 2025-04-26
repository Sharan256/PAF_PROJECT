import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logoGym.png"; //
import { FaBars } from "react-icons/fa";

const Navbar = ({ user, toggleMainSideBar }) => {
  return (
    <div className="bg-violet-700 flex w-full h-[70px] z-50">
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center">
          <button
            className="text-white text-2xl mr-4"
            onClick={toggleMainSideBar}
          >
            <FaBars />
          </button>
          <img src={logo} alt="logo" className="w-8 h-8 mr-2" />{" "}
          {/* Logo image */}
          <div className="text-white text-lg font-bold">Fitness Hub</div>
          <div className="flex items-center ml-6">
            {/* <div className="text-white text-sm font-semibold">Home</div>
            <div className="text-white text-sm font-semibold ml-6">About</div>
            <div className="text-white text-sm font-semibold ml-6">Contact</div> */}
          </div>
        </div>
        <Link to={`/profile/${user?.id}`} className="flex items-center">
          <img
            src={user?.profileImage}
            alt="profile"
            className="w-[40px] h-[40px] rounded-full"
          />
          {/* <div className="text-white text-sm font-semibold">Login</div>
          <div className="text-white text-sm font-semibold ml-6">Register</div> */}
        </Link>
      </div>
    </div>
  );
};
export default Navbar;
