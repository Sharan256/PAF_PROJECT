import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useActiveTab } from "../context/ActiveTabContext";
import axios from "axios";

const MainSidebar = ({ user, toggleSideBar2 }) => {
  const { activeTab, setActiveTab } = useActiveTab();

  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.id) {
        await axios.post(`http://localhost:8080/users/${user.id}/deactivate`);
      }
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
      // Still proceed with logout even if deactivation fails
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const tabs = [
    { id: "tab1", label: "Workout Status", path: "/" },
    { id: "tab2", label: "Workout Plan", path: "/workout-plan" },
    { id: "tab3", label: "Create Status", path: "/create-status" },
    { id: "tab4", label: "Meal Plan", path: "/meal-plan" },
    { id: "tab5", label: "Create Meal Plan", path: "/create-meal-plan" },
  ];

  return (
    <aside className="fixed top-[70px] left-0 h-[calc(100vh-70px)] w-[250px] bg-gradient-to-b from-gray-100 via-gray-60 to-gray-300 border-r border-r-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-evenly px-8 py-5 bg-gradient-to-r from-blue-200 to-indigo-70 rounded-xl m-4 shadow-sm">
          <Link
            to={`/profile/${user?.id}`}
            className="flex items-center w-full"
          >
            <div className="mr-4">
              <div className="">
                <img
                  className="w-[50px] h-[50px] min-w-[50px] rounded-full border-2 border-blue-400 shadow-sm"
                  src={user?.profileImage}
                  alt="profile"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            </div>
          </Link>
        </div>

        <div className="relative pl-3 my-5">
          <div className="flex flex-col w-full font-medium">
            <div>
              <span className="select-none flex items-center px-4 py-[.375rem] cursor-pointer my-[.0.5rem] rounded-xl">
                <NavLink
                  to="/"
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "pending"
                      : isActive
                      ? "flex items-center rounded-xl w-full px-4 py-3 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "flex items-center rounded-xl w-full px-4 py-3 h-12 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 transition-all"
                  }
                >
                  Home
                </NavLink>
              </span>
            </div>

            <div>
              <span className="select-none flex items-center px-4 py-[.375rem] cursor-pointer my-[.0.5rem] rounded-xl">
                <NavLink
                  to="/post"
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "pending"
                      : isActive
                      ? "flex items-center rounded-xl w-full px-4 py-3 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "flex items-center rounded-xl w-full px-4 py-3 h-12 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 transition-all"
                  }
                >
                  Post
                </NavLink>
              </span>
            </div>

            <div>
              <span className="select-none flex items-center px-4 py-[.375rem] cursor-pointer my-[.0.5rem] rounded-xl">
                <NavLink
                  to="/CreateWorkoutStatus"
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "pending"
                      : isActive
                      ? "flex items-center rounded-xl w-full px-4 py-3 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "flex items-center rounded-xl w-full px-4 py-3 h-12 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 transition-all"
                  }
                >
                  Workout Status
                </NavLink>
              </span>
            </div>

            <div>
              <span className="select-none flex items-center px-4 py-[.375rem] cursor-pointer my-[.0.5rem] rounded-xl">
                <NavLink
                  to="/CreateWorkoutPlan"
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "pending"
                      : isActive
                      ? "flex items-center rounded-xl w-full px-4 py-3 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "flex items-center rounded-xl w-full px-4 py-3 h-12 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 transition-all"
                  }
                >
                  Workout Plan
                </NavLink>
              </span>
            </div>

            <div>
              <span className="select-none flex items-center px-4 py-[.375rem] cursor-pointer my-[.0.5rem] rounded-xl">
                <NavLink
                  to="/CreateMealPlan"
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "pending"
                      : isActive
                      ? "flex items-center rounded-xl w-full px-4 py-3 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "flex items-center rounded-xl w-full px-4 py-3 h-12 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 transition-all"
                  }
                >
                  Meal Plan
                </NavLink>
              </span>
            </div>

            <div className="my-5">
              <span className="select-none flex items-center px-4 py-[.175rem] cursor-pointer my-[.1rem] rounded-xl">
                <button
                  className="flex items-center rounded-xl w-full px-4 py-2 h-10 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm hover:shadow-md transition-all"
                  onClick={toggleSideBar2}
                >
                  Active Users
                </button>
              </span>
            </div>

            <div className="my-5">
              <span className="select-none flex items-center px-4 py-[.175rem] cursor-pointer my-[.1rem] rounded-xl">
                <button
                  className="flex items-center rounded-xl w-full px-4 py-2 h-10 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:shadow-md transition-all"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default MainSidebar;
