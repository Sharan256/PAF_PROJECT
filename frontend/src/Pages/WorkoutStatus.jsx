import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import backgroundImg from '../images/statusBck.jpg';

const WorkoutStatus = ({ user }) => {
  const [workoutStatuses, setWorkoutStatuses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkoutStatuses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/workoutStatus");
        if (res.status === 200) {
          setWorkoutStatuses(res.data);
        }
      } catch (error) {
        toast.error("Failed to fetch workout statuses");
      }
    };
    fetchWorkoutStatuses();
  }, []);

  const deleteWorkOut = async (status) => {
    try {
      await axios.delete(
        `http://localhost:8080/workoutStatus/${status.statusId}`
      );

      setWorkoutStatuses((prevStatuses) =>
        prevStatuses.filter((s) => s.statusId !== status.statusId)
      );

      toast.success("Workout status deleted successfully");
    } catch (error) {
      toast.error("Failed to delete workout status");
    }
  };

  const navigateEditPage = (status) => {
    navigate(`/CreateWorkoutStatus/${status.statusId}`);
  };

  return (
    <div
      className="container mx-auto p-4 min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}>
      <div className="space-y-4 flex justify-center flex-col items-center">
        {workoutStatuses.map((status, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 w-[600px] hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={status?.userProfile}
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{status?.username}</h2>
                  <p className="text-sm text-gray-500">Workout on {status.date}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                {user?.id === status?.userId && (
                  <>
                    <button
                      onClick={() => deleteWorkOut(status)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <AiFillDelete size={20} />
                    </button>
                    <button
                      onClick={() => navigateEditPage(status)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <AiFillEdit size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-3 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="text-lg font-semibold">{status.distance} <span className="text-sm">km</span></p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Push-ups</p>
                  <p className="text-lg font-semibold">{status.pushUps}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="text-lg font-semibold">{status.weight} <span className="text-sm">kg</span></p>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Workout Description</h3>
                <p className="text-gray-600">{status.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutStatus;
