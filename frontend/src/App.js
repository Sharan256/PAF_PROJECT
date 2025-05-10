import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Post from "./Pages/Post";
import { Toaster } from "react-hot-toast";
import Profile from "./Pages/Profile";
import MealPlan from "./Pages/MealPlan";
import CreateWorkoutStatus from "./Pages/CreateWorkoutStatus";
import CreateWorkoutPlan from "./Pages/CreateWorkoutPlan";
import CreateMealPlan from "./Pages/CreateMealPlan";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/MealPlan" element={<MealPlan />} />
        <Route path="/CreateMealPlan" element={<CreateMealPlan />} />
        <Route
          path="/CreateMealPlan/:mealPlanId"
          element={<CreateMealPlan />}
        />
        <Route path="/CreateWorkoutStatus" element={<CreateWorkoutStatus />} />
        <Route
          path="/CreateWorkoutStatus/:statusId"
          element={<CreateWorkoutStatus />}
        />
        <Route path="/CreateWorkoutPlan" element={<CreateWorkoutPlan />} />
        <Route
          path="/CreateWorkoutPlan/:workoutPlanId"
          element={<CreateWorkoutPlan />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
