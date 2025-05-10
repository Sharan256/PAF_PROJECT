import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useActiveTab } from "../context/ActiveTabContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const WorkoutStatus = () => {
  const [workoutStatuses, setWorkoutStatuses] = useState([]);
  const [user, setUser] = useState({});
  const { setActiveTab } = useActiveTab();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    fetchWorkoutStatuses();
  }, []);

  const fetchWorkoutStatuses = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/workoutStatus");
      setWorkoutStatuses(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch workout statuses");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/workoutStatus/${id}`);
      toast.success("Workout status deleted successfully");
      fetchWorkoutStatuses();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete workout status");
    }
  };

  const handleEdit = (id) => {
    navigate(`/CreateWorkoutStatus/${id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Workout Status</h1>
            <p className="text-gray-600">Track your fitness progress</p>
          </div>
          <button
            onClick={() => navigate("/CreateWorkoutStatus")}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create New Status
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          {workoutStatuses.map((status) => (
            <div
              key={status.statusId}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {status.userProfile && (
                      <img
                        src={status.userProfile}
                        alt={status.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {formatDate(status.date)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {status.username || "Anonymous"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(status.statusId)}
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors rounded-xl"
                      title="Edit"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(status.statusId)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors rounded-xl"
                      title="Delete"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-2xl p-3">
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="text-lg font-semibold text-blue-700">{status.distance} km</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-3">
                    <p className="text-sm text-gray-600">Push-ups</p>
                    <p className="text-lg font-semibold text-green-700">{status.pushUps}</p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-3">
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-lg font-semibold text-purple-700">{status.weight} kg</p>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-3">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-lg font-semibold text-orange-700">{formatDate(status.date)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-800">{status.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {workoutStatuses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No workout statuses found. Start tracking your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutStatus;
