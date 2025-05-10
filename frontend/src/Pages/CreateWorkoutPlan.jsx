import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import backgroundImg from "../images/workoutBck.jpg";
import { useActiveTab } from "../context/ActiveTabContext";
import chestImg from "../images/chestImg.png";
import backImg from "../images/backImage.jpg";
import armsImg from "../images/armsImage.jpg";
import legsImg from "../images/legsImage.png";
import toast from "react-hot-toast";
import axios from "axios";

const workoutTypes = [
  { name: "Chest", image: chestImg },
  { name: "Back", image: backImg },
  { name: "Arms", image: armsImg },
  { name: "Legs", image: legsImg },
];

const CreateWorkoutPlan = () => {
  const [selectedWorkout, setSelectedWorkout] = useState("Chest");
  const [exercises, setExercises] = useState("");
  const [sets, setSets] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [user, setUser] = useState({});
  const [editWorkoutPlans, setEditWorkoutPlans] = useState(false);
  const { setActiveTab } = useActiveTab();

  const { workoutPlanId } = useParams();

  useEffect(() => {
    const fetchSingleWorkoutPlan = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/workoutPlans/${workoutPlanId}`
        );
        setSelectedWorkout(data.workoutPlanName);
        setExercises(data.exercises);
        setSets(data.sets);
        setRepetitions(data.repetitions);
        setDescription(data.description);
        setDate(data.date);
        setEditWorkoutPlans(true);
      } catch (error) {
        console.log(error);
      }
    };
    if (workoutPlanId) {
    fetchSingleWorkoutPlan();
    }
  }, [workoutPlanId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  const validateForm = () => {
    const setsNum = parseInt(sets);
    const repsNum = parseInt(repetitions);

    if (setsNum <= 0) {
      toast.error("Sets count must be greater than 0");
      return false;
    }
    if (repsNum <= 0) {
      toast.error("Repetitions count must be greater than 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return toast.error("Please login to continue");
    }

    if (!selectedWorkout || !exercises || !sets || !repetitions || !description || !date) {
      return toast.error("Please fill all the fields");
    }

    if (!validateForm()) {
      return;
    }

    const workoutData = {
      userId: user.id,
      sets,
      date,
      exercises,
      repetitions,
      description,
      workoutPlanName: selectedWorkout,
    };

    if (editWorkoutPlans) {
      try {
        const res = await axios.put(
          `http://localhost:8080/workoutPlans/${workoutPlanId}`,
          workoutData
        );
        if (res.status === 200) {
          toast.success("Workout Plans Updated Successfully");
          resetForm();
          navigate("/");
          setActiveTab("tab3");
        }
      } catch (error) {
        toast.error("Failed to update workout plans");
      }
    } else {
      try {
        const res = await axios.post(
          `http://localhost:8080/workoutPlans`,
          workoutData
        );
        if (res.status === 201) {
          toast.success("Workout Plans added Successfully");
          resetForm();
          navigate("/");
          setActiveTab("tab3");
        }
      } catch (error) {
        toast.error("Failed to add workout plans");
      }
    }
  };

  const resetForm = () => {
    setSets("");
    setDate(new Date().toISOString().split('T')[0]);
    setExercises("");
    setRepetitions("");
    setDescription("");
    setSelectedWorkout("Chest");
  };

  const navigate = useNavigate();

  const goToWorkoutPlans = () => {
    navigate("/");
    setActiveTab("tab3");
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {editWorkoutPlans ? "Edit Workout Plan" : "Create Workout Plan"}
            </h1>
            <p className="text-gray-600">Design your perfect workout routine</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Select Workout Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {workoutTypes.map((workout, index) => (
                  <div key={index} className="p-2">
                    <div
                      className={`cursor-pointer rounded-xl overflow-hidden transition-all transform hover:scale-105 ${
                        selectedWorkout === workout.name
                          ? "ring-4 ring-blue-500 shadow-lg"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedWorkout(workout.name)}
                    >
                      <img
                        src={workout.image}
                        alt={workout.name}
                        className="w-full h-32 object-cover rounded-t-xl"
                      />
                      <div
                        className={`p-3 text-center font-medium transition-colors ${
                          selectedWorkout === workout.name
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        {workout.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="exercises" className="block text-sm font-semibold text-gray-700 mb-2">
                  Exercise Name
                </label>
                <input
                  type="text"
                  id="exercises"
                  value={exercises}
                  onChange={(e) => setExercises(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                  placeholder="Enter exercise name"
                  required
                />
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="sets" className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Sets
                </label>
                <input
                  type="number"
                  id="sets"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                  placeholder="Enter number of sets"
                  min="1"
                  required
                />
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="repetitions" className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Repetitions
                </label>
                <input
                  type="number"
                  id="repetitions"
                  value={repetitions}
                  onChange={(e) => setRepetitions(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                  placeholder="Enter number of repetitions"
                  min="1"
                  required
                />
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                  required
                />
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px] resize-none bg-white/70"
                placeholder="Describe your workout plan..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={goToWorkoutPlans}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {editWorkoutPlans ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateWorkoutPlan;
