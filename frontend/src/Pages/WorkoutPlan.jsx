import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import backgroundImg from '../images/workoutBck.jpg';


const WorkoutPlan = ({ user }) => {
  const [workoutPlans, setWorkoutPlans] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const res = await axios.get("http://localhost:8080/workoutPlans");
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
  const deleteWorkOutPlan = async (workoutplans) => {
    try {
      await axios.delete(
        `http://localhost:8080/workoutPlans/${workoutplans.workoutPlanId}`
      );

      setWorkoutPlans((prevWokoutPlans) =>
        prevWokoutPlans.filter((wp) => wp.workoutPlanId !== workoutplans.workoutPlanId)
      );

      toast.success("Workout Plan deleted successfully");
    } catch (error) {
      toast.error("Failed to delete workout Plan");
    }
  };


  const navigateEditPage = (workoutplans) => {
    navigate(`/CreateWorkoutPlan/${workoutplans.workoutPlanId}`);
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
        {workoutPlans.map((workoutplans, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 w-[600px]"
          >
            <div className="flex justify-between ">
              <div className="flex gap-3">
                <div>
                  <img
                    src={workoutplans?.userProfile}
                    alt="user"
                    className="w-14 h-14 rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {workoutplans?.username}
                  </h2>
                  <p className="text-sm font-bold mb-2">
                    Workout on {workoutplans.date}
                  </p>
                </div>
              </div>
              <div className="gap-3 flex">
                {user?.id === workoutplans?.userId && (
                  <>
                    <AiFillDelete
                      size={20}
                      color="red"
                      className="cursor-pointer"
                      onClick={() => deleteWorkOutPlan(workoutplans)}
                    />
                    <AiFillEdit
                      size={20}
                      color="blue"
                      className="cursor-pointer"
                      onClick={() => navigateEditPage(workoutplans)}
                    />
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="list-disc pl-5 space-y-1 mt-2">
                <h2 className="text-xl font-semibold mb-2">
                  {workoutplans.workoutPlanName}
                </h2>
                <p className="font-medium">
                  Exercise: {workoutplans.exercises}
                </p>
                <p className="text-sm">Sets: {workoutplans.sets}</p>
                <p className="text-sm">
                  Repetitions: {workoutplans.repetitions}
                </p>
                <p className="text-sm">Routine: {workoutplans.routine}</p>
                <p className="text-sm italic">"{workoutplans.description}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default WorkoutPlan;
