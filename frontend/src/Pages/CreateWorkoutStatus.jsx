import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import backgroundImg from "../images/statusBck.jpg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useActiveTab } from "../context/ActiveTabContext";

const CreateWorkouStatus = () => {
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
        console.log(data);
        setEditStatus(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSinglePost();
  }, [statusId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    if (!distance || !pushups || !weight || !description || !date) {
      return toast.error("Please fill all the fields");
    }

    const workoutStatusData = {
      userId: user.id,
      distance,
      pushUps: pushups,
      weight,
      description,
      date,
    };

    const updateWorkoutStatusData = {
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
          updateWorkoutStatusData
        );
        if (res.status === 200) {
          toast.success("Workout status updated successfully");
          setDistance("");
          setPushups("");
          setWeight("");
          setDescription("");
          setDate("");
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
          setDistance("");
          setPushups("");
          setWeight("");
          setDescription("");
          setDate("");
          navigate("/");
          setActiveTab("tab2");
        }
      } catch (error) {
        toast.error("Failed to add workout status");
      }
    }
  };
  const navigate = useNavigate();

  const goToWorkoutStatus = () => {
    navigate("/");
    setActiveTab("tab2");
  };

  return (
    <Layout>
      <div
        className="min-h-screen p-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <h1 className="mb-4 text-3xl font-semibold text-center text-white">
          {editStatus ? "Edit Workout Status" : "Create Workout Status"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 rounded-lg shadow-md bg-transparent"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.65)" }}
        >
          <div className="mb-4">
            <label
              htmlFor="distance"
              className="block text-sl font-medium text-gray-700 "
            >
              Distance ran (in km)
            </label>
            <input
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter distance"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="pushups"
              className="block text-sm font-medium text-gray-700"
            >
              Number of push-ups
            </label>
            <input
              type="number"
              id="pushups"
              value={pushups}
              onChange={(e) => setPushups(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter push-ups count"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700"
            >
              Weight lifted (in kg)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter weight"
            />
          </div>
          <div className="relative max-w-sm">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Select Date
            </label>
            <input
              type="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Select date"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description of your workout
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your workout achievements..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-success rounded-md shadow hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {editStatus ? "Update Status" : "Create Status"}
          </button>
          <button
            onClick={goToWorkoutStatus}
            className="w-full px-4 mt-2 py-2 text-sm font-medium text-black bg-transparent rounded-md shadow hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateWorkouStatus;
