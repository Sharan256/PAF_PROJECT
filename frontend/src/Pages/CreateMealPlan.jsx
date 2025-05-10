import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useActiveTab } from "../context/ActiveTabContext";

const mealTypes = [
  { name: "Breakfast", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
  { name: "Lunch", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80" },
  { name: "Dinner", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
  { name: "Snacks", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
];

const CreateMealPlan = () => {
  const { setActiveTab } = useActiveTab();
  const [selectedMealType, setSelectedMealType] = useState("Breakfast");
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [user, setUser] = useState({});
  const [editMealPlan, setEditMealPlan] = useState(false);

  const { mealPlanId } = useParams();

  useEffect(() => {
    const fetchSingleMealPlan = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/mealPlans/${mealPlanId}`
        );
        setSelectedMealType(data.mealType);
        setMealName(data.mealName);
        setCalories(data.calories);
        setProtein(data.protein);
        setCarbs(data.carbs);
        setFats(data.fats);
        setDescription(data.description);
        setDate(data.date);
        setEditMealPlan(true);
      } catch (error) {
        console.log(error);
      }
    };
    if (mealPlanId) {
      fetchSingleMealPlan();
    }
  }, [mealPlanId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  const validateForm = () => {
    const caloriesNum = parseFloat(calories);
    const proteinNum = parseFloat(protein);
    const carbsNum = parseFloat(carbs);
    const fatsNum = parseFloat(fats);

    if (caloriesNum < 0) {
      toast.error("Calories cannot be negative");
      return false;
    }
    if (proteinNum < 0) {
      toast.error("Protein cannot be negative");
      return false;
    }
    if (carbsNum < 0) {
      toast.error("Carbs cannot be negative");
      return false;
    }
    if (fatsNum < 0) {
      toast.error("Fats cannot be negative");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return toast.error("Please login to continue");
    }

    if (!selectedMealType || !mealName || calories === "" || protein === "" || carbs === "" || fats === "" || !description || !date) {
      return toast.error("Please fill all the fields");
    }

    if (!validateForm()) {
      return;
    }

    const mealPlanData = {
      userId: user.id,
      mealType: selectedMealType,
      mealName,
      calories,
      protein,
      carbs,
      fats,
      description,
      date,
    };

    if (editMealPlan) {
      try {
        const res = await axios.put(
          `http://localhost:8080/mealPlans/update/${mealPlanId}`,
          mealPlanData
        );
        if (res.status === 200) {
          toast.success("Meal plan updated successfully");
          resetForm();
          navigate("/");
          setActiveTab("tab4");
        }
      } catch (error) {
        toast.error("Failed to update meal plan");
      }
    } else {
      try {
        const res = await axios.post(
          "http://localhost:8080/mealPlans/add",
          mealPlanData
        );
        if (res.status === 201) {
          toast.success("Meal plan added successfully");
          resetForm();
          navigate("/");
          setActiveTab("tab4");
        }
      } catch (error) {
        toast.error("Failed to add meal plan");
      }
    }
  };

  const resetForm = () => {
    setSelectedMealType("Breakfast");
    setMealName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFats("");
    setDescription("");
    setDate(new Date().toISOString().split('T')[0]);
  };

  const navigate = useNavigate();

  const goToMealPlans = () => {
    navigate("/");
    setActiveTab("tab4");
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {editMealPlan ? "Edit Meal Plan" : "Create Meal Plan"}
            </h1>
            <p className="text-gray-600">Plan your nutritious meals</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Select Meal Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mealTypes.map((meal, index) => (
                  <div key={index} className="p-2">
                    <div
                      className={`cursor-pointer rounded-xl overflow-hidden transition-all transform hover:scale-105 ${
                        selectedMealType === meal.name
                          ? "ring-4 ring-blue-500 shadow-lg"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedMealType(meal.name)}
                    >
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-32 object-cover rounded-t-xl"
                      />
                      <div
                        className={`p-3 text-center font-medium transition-colors ${
                          selectedMealType === meal.name
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        {meal.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="mealName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Meal Name
                </label>
                <input
                  type="text"
                  id="mealName"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                  placeholder="Enter meal name"
                  required
                />
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="calories" className="block text-sm font-semibold text-gray-700 mb-2">
                  Calories
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                    placeholder="Enter calories"
                    min="0"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">kcal</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="protein" className="block text-sm font-semibold text-gray-700 mb-2">
                  Protein
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="protein"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                    placeholder="Enter protein"
                    min="0"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">g</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="carbs" className="block text-sm font-semibold text-gray-700 mb-2">
                  Carbohydrates
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="carbs"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                    placeholder="Enter carbs"
                    min="0"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">g</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <label htmlFor="fats" className="block text-sm font-semibold text-gray-700 mb-2">
                  Fats
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="fats"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
                    placeholder="Enter fats"
                    min="0"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">g</span>
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
                placeholder="Describe your meal plan..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={goToMealPlans}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {editMealPlan ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateMealPlan;
