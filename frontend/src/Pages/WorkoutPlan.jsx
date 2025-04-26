import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import backgroundImg from '../images/statusBck.jpg';


const WorkoutPlan = ({ user }) => {
  const [workoutPlans, setWorkoutPlans] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const res = await axios.get("http://localhost:8080/workoutPlan");
        if (res.status === 200) {
          setWorkoutPlans(res.data);
        }
      } catch (error) {
        toast.error("Failed to fetch workout plans");
      }
    };
    fetchWorkoutPlans();
  }, []);

  // Delete Workout Plans by ID
  const deleteWorkoutPlan = async (plan) => {
    try {
      await axios.delete(`http://localhost:8080/workoutPlan/${plan.planId}`);
      setWorkoutPlans((prevPlans) =>
        prevPlans.filter((p) => p.planId !== plan.planId)
      );
      toast.success("Workout plan deleted successfully");
    } catch (error) {
      toast.error("Failed to delete workout plan");
    }
  };


  const navigateEditPage = (plan) => {
    navigate(`/CreateWorkoutPlan/${plan.planId}`);
  };

  // Function to handle click event
  // const goToWorkoutPlan = () => {
  //   navigate('/CreateWorkoutPlan'); // Use the route you want to navigate to
  // };

  return (
    <div
      className="container mx-auto p-4 min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex justify-between items-center">
        {/* <button
          onClick={goToWorkoutPlan}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Create New Workout Plan
        </button> */}
      </div>

      <div className="space-y-4 flex justify-center flex-col items-center">
        {workoutPlans.map((plan, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 w-[600px] hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={plan?.userProfile}
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{plan?.username}</h2>
                  <p className="text-sm text-gray-500">Plan for {plan.date}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                {user?.id === plan?.userId && (
                  <>
                    <button
                      onClick={() => deleteWorkoutPlan(plan)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <AiFillDelete size={20} />
                    </button>
                    <button
                      onClick={() => navigateEditPage(plan)}
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
                  <p className="text-sm text-gray-600">Target Distance</p>
                  <p className="text-lg font-semibold">{plan.targetDistance} <span className="text-sm">km</span></p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Target Push-ups</p>
                  <p className="text-lg font-semibold">{plan.targetPushUps}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Target Weight</p>
                  <p className="text-lg font-semibold">{plan.targetWeight} <span className="text-sm">kg</span></p>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Plan Description</h3>
                <p className="text-gray-600">{plan.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default WorkoutPlan;
