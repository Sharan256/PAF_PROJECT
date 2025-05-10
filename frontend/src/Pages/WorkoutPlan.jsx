import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useActiveTab } from "../context/ActiveTabContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const WorkoutPlan = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [user, setUser] = useState({});
  const { setActiveTab } = useActiveTab();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/workoutPlans");
      setWorkoutPlans(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch workout plans");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/workoutPlans/${id}`);
      toast.success("Workout plan deleted successfully");
      fetchWorkoutPlans();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete workout plan");
    }
  };

  const handleEdit = (id) => {
    navigate(`/CreateWorkoutPlan/${id}`);
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Workout Plans</h1>
            <p className="text-gray-600">Track your workout routines</p>
          </div>
          <button
            onClick={() => navigate("/CreateWorkoutPlan")}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create New Plan
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          {workoutPlans.map((plan) => (
            <div
              key={plan.workoutPlanId}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <img
                        src={plan.userProfile || "https://via.placeholder.com/40"}
                        alt="user"
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {plan.workoutType}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {plan.username || "Anonymous"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(plan.workoutPlanId)}
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors rounded-xl"
                      title="Edit"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.workoutPlanId)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors rounded-xl"
                      title="Delete"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-2xl p-3">
                    <p className="text-sm text-gray-600">Exercises</p>
                    <p className="text-lg font-semibold text-blue-700">{plan.exercises}</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-3">
                    <p className="text-sm text-gray-600">Sets</p>
                    <p className="text-lg font-semibold text-green-700">{plan.sets}</p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-3">
                    <p className="text-sm text-gray-600">Repetitions</p>
                    <p className="text-lg font-semibold text-purple-700">{plan.repetitions}</p>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-3">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-lg font-semibold text-orange-700">{formatDate(plan.date)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-800">{plan.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {workoutPlans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No workout plans found. Start creating your workout routine!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlan;
