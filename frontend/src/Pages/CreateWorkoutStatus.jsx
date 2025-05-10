import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import backgroundImg from "../images/statusBck.jpg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useActiveTab } from "../context/ActiveTabContext";

const CreateWorkoutStatus = () => {
  const { setActiveTab } = useActiveTab();
  const [distance, setDistance] = useState("");
  const [pushups, setPushups] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState({});
  const [editStatus, setEditStatus] = useState(false);

  const { statusId } = useParams();

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/workoutStatus/${statusId}`
        );
        setWeight(data.weight);
        setDistance(data.distance);
        setPushups(data.pushUps);
        setDescription(data.description);
        setDate(data.date);
        setEditStatus(true);
      } catch (error) {
        console.log(error);
      }
    };
    if (statusId) {
    fetchSinglePost();
    }
  }, [statusId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  const validateForm = () => {
    const distanceNum = parseFloat(distance);
    const pushupsNum = parseInt(pushups);
    const weightNum = parseFloat(weight);
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today

    if (distanceNum < 0 || distanceNum > 500) {
      toast.error("Distance must be between 0 and 500 km");
      return false;
    }
    if (pushupsNum < 0) {
      toast.error("Push-ups cannot be negative");
      return false;
    }
    if (weightNum < 0) {
      toast.error("Weight lifting cannot be negative");
      return false;
    }
    if (selectedDate > today) {
      toast.error("Cannot select future dates");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return toast.error("Please login to continue");
    }

    if (!distance || !pushups || !weight || !description || !date) {
      return toast.error("Please fill all the fields");
    }

    if (!validateForm()) {
      return;
    }

    const workoutStatusData = {
      userId: user.id,
      distance,
      pushUps: pushups,
      weight,
      description,
      date,
    };

    if (editStatus) {
      try {
        const res = await axios.put(
          `http://localhost:8080/workoutStatus/${statusId}`,
          workoutStatusData
        );
        if (res.status === 200) {
          toast.success("Workout status updated successfully");
          resetForm();
          navigate("/");
          setActiveTab("tab2");
        }
      } catch (error) {
        toast.error("Failed to update workout status");
      }
    } else {
      try {
        const res = await axios.post(
          "http://localhost:8080/workoutStatus",
          workoutStatusData
        );
        if (res.status === 201) {
          toast.success("Workout status added successfully");
          resetForm();
          navigate("/");
          setActiveTab("tab2");
        }
      } catch (error) {
        toast.error("Failed to add workout status");
      }
    }
  };

  const resetForm = () => {
    setDistance("");
    setPushups("");
    setWeight("");
    setDescription("");
    setDate("");
  };

  const navigate = useNavigate();

  const goToWorkoutStatus = () => {
    navigate("/");
    setActiveTab("tab2");
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {editStatus ? "Edit Workout Status" : "Create Workout Status"}
            </h1>
            <p className="text-gray-600">Track your fitness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="distance" className="block text-sm font-semibold text-gray-700 mb-2">
                  Distance (km)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="distance"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                    placeholder="Enter distance"
                    min="0"
                    max="500"
                    step="0.1"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">km</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="pushups" className="block text-sm font-semibold text-gray-700 mb-2">
                  Push-ups
                </label>
                <input
                  type="number"
                  id="pushups"
                  value={pushups}
                  onChange={(e) => setPushups(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                  placeholder="Enter push-ups count"
                  min="0"
                  required
                />
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight Lifting (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                    placeholder="Enter weight"
                    min="0"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">kg</span>
                </div>
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
                  max={new Date().toISOString().split('T')[0]}
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
                placeholder="How was your workout?"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={goToWorkoutStatus}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {editStatus ? "Update Status" : "Create Status"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateWorkoutStatus;
