import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ActiveUsersList = ({ loggedInUser }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/users");
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();

    // Poll for active users every 30 seconds
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-lg:hidden">
      <div className="flex flex-col min-h-screen items-center">
        <aside className="right-0 fixed lg:w-[250px] w-[250px] border-l border-l-dashed border-l-violet-100 bg-white/80 backdrop-blur-sm h-[calc(100vh-4rem)] top-16">
          <h1 className="text-center font-bold text-lg m-5 text-primary">
            Active Users
          </h1>
          <div className="flex flex-col gap-5 px-8 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {users?.map((user, index) => {
              return loggedInUser?.id !== user?.id ? (
                <div
                  key={index}
                  className="flex items-center gap-5 cursor-pointer hover:bg-purple-50 p-3 rounded-lg transition-colors duration-200"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <div className="relative">
                    <img
                      src={user.profileImage}
                      alt=""
                      className="w-[40px] h-[40px] rounded-full border-2 border-purple-500"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <h1 className="font-medium text-gray-800 hover:text-purple-600 transition-colors">
                    {user.name}
                  </h1>
                </div>
              ) : null;
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ActiveUsersList; 