import React, { useEffect, useState } from "react";
import MainSideBar from "./MainSideBar";
import Navbar from "./Navbar";
import SideBar2 from "./SideBar2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const [user, setUser] = useState({});
  const [showMainSideBar, setShowMainSideBar] = useState(false);
  const [showSideBar2, setShowSideBar2] = useState(false);

  const toggleMainSideBar = () => {
    setShowMainSideBar(!showMainSideBar);
  };
  const toggleSideBar2 = () => {
    setShowSideBar2(!showSideBar2);
  };

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
    <div className="flex h-full bg-indigo-100 ">
      <div className="flex w-full fixed  ">
        <Navbar user={user} toggleMainSideBar={toggleMainSideBar} />
      </div>
      <div className="flex  mt-[70px]  w-full ">
        {showMainSideBar && (
          <div className=" flex lg:w-[300px] w-[250px] bg-indigo-100">
            <MainSideBar user={user} toggleSideBar2={toggleSideBar2} />
          </div>
        )}
        <div className="flex-1 bg-white">{children}</div>
        {showSideBar2 && (
          <div className="  lg:flex   lg:w-[250px] lg:bg-indigo-100 max-lg:hidden">
            <SideBar2 logUser={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
