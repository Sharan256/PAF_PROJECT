import React, { useEffect, useState } from "react";
import MainSideBar from "./MainSideBar";
import Navbar from "./Navbar";
import SideBar2 from "./SideBar2";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const [user, setUser] = useState({});
  const [showMainSideBar, setShowMainSideBar] = useState(false);
  const [showSideBar2, setShowSideBar2] = useState(false);
  const location = useLocation();

  const toggleMainSideBar = () => {
    setShowMainSideBar(!showMainSideBar);
  };
  const toggleSideBar2 = () => {
    setShowSideBar2(!showSideBar2);
  };

  // Close sidebar when route changes
  useEffect(() => {
    setShowMainSideBar(false);
  }, [location.pathname]);

  const navigate = useNavigate();
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      fetchUser();
    }
    setUser(JSON.parse(userData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/user", {
        withCredentials: true,
      });
      console.log(res);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="min-h-screen bg-indigo-100">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar user={user} toggleMainSideBar={toggleMainSideBar} />
      </div>
      <div className="flex pt-[70px] w-full">
        {showMainSideBar && (
          <div className="fixed top-[70px] left-0 h-[calc(100vh-70px)] w-[250px] bg-indigo-100">
            <MainSideBar user={user} toggleSideBar2={toggleSideBar2} />
          </div>
        )}
        <main className={`flex-1 bg-white min-h-screen transition-all duration-300 ${showMainSideBar ? 'lg:ml-[250px]' : ''}`}>
          <div className="w-full">
            {children}
          </div>
        </main>
        {showSideBar2 && (
          <div className="lg:flex lg:w-[250px] lg:bg-indigo-100 max-lg:hidden">
            <SideBar2 toggleSideBar2={toggleSideBar2} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
