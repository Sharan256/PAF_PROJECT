import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Sidebar2 = ({ toggleSideBar2 }) => {
  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/users/active");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchActiveUsers();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setLoggedUser(user);
  }, []);

  const handleClose = () => {
    toggleSideBar2();
  };

  return (
    <aside className="fixed top-[70px] right-0 h-[calc(100vh-70px)] w-[300px] bg-gradient-to-b from-indigo-50 to-white border-l border-l-gray-200">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Active Users</h2>
          <div className="space-y-4">
            {users?.map((user) => 
              loggedUser?.id !== user?.id && (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  className="flex items-center p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="mr-4">
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-12 h-12 rounded-full border-2 border-blue-200 shadow-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>

        <div className="mt-auto p-4">
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-sm hover:shadow-md transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar2;
