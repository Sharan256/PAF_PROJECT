import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import backgroundImg from "../images/mealBck1.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { TEInput, TETextarea } from "tw-elements-react";
import { useActiveTab } from "../context/ActiveTabContext";
import axios from "axios";
import toast from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../db/firebase";

const storage = getStorage(app);

const CreateMealPlan = () => {
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const [selectedDietaryPreference, setSelectedDietaryPreference] =
    useState("vegan");
  const [recipes, setRecipes] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [cookingInstruction, setCookingInstruction] = useState("");
  const [nutritionalInformation, setNutritionalInformation] = useState("");
  const [portionSizes, setPortionSizes] = useState("");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");
  const [user, setUser] = useState({});
  const [editMealPlans, setEditMealPlans] = useState(false);
  const [source, setSource] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setActiveTab } = useActiveTab();

  const { mealPlanId } = useParams();

  const onImageChange = (e) => {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Please select at least one image");
    }

    const currentFile = selectedFiles[0];
    setImage(currentFile);
  };

  useEffect(() => {
    const fetchSingleMealPlan = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/mealPlans/${mealPlanId}`
        );
        setRecipes(data.recipes);
        setIngredients(data.ingredients);
        setCookingInstruction(data.cookingInstruction);
        setNutritionalInformation(data.nutritionalInformation);
        setPortionSizes(data.portionSizes);
        setSource(data.source);
        setDate(data.date);
        console.log(data);
        setEditMealPlans(true);
        setSelectedMealType(data.mealType);
        setSelectedDietaryPreference(data.dietaryPreferences);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleMealPlan();
  }, [mealPlanId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!user) {
      return;
    }

    if (
      !selectedMealType ||
      !selectedDietaryPreference ||
      !recipes ||
      !ingredients ||
      !cookingInstruction ||
      !nutritionalInformation ||
      !portionSizes ||
      !date
    ) {
      setIsLoading(false);
      return toast.error("Please fill all the fields");
    }

    if (!image && !source) {
      setIsLoading(false);
      return toast.error("Please upload an image");
    }

    let imageUrl = null;

    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const mealPlanData = {
      userId: user.id,
      mealType: selectedMealType,
      dietaryPreferences: selectedDietaryPreference,
      recipes,
      ingredients,
      cookingInstruction,
      nutritionalInformation,
      portionSizes,
      source: imageUrl,
      date,
    };

    const updateMealPlanData = {
      userId: user.id,
      mealType: selectedMealType,
      dietaryPreferences: selectedDietaryPreference,
      recipes,
      ingredients,
      cookingInstruction,
      nutritionalInformation,
      portionSizes,
      source: imageUrl ? imageUrl : source,
      date,
    };

    console.log(mealPlanData);

    if (editMealPlans) {
      try {
        const res = await axios.put(
          `http://localhost:8080/mealPlans/update/${mealPlanId}`,
          updateMealPlanData
        );
        if (res.status === 200) {
          toast.success("Meal Plans Updated Successfully");
          setRecipes("");
          setSelectedMealType("");
          setSelectedDietaryPreference("");
          setIngredients("");
          setCookingInstruction("");
          setNutritionalInformation("");
          setPortionSizes("");
          setSource("");
          setDate("");
          navigate("/");
          setActiveTab("tab4");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Failed to update workout plans");
      }
    } else {
      try {
        const res = await axios.post(
          `http://localhost:8080/mealPlans/add`,
          mealPlanData
        );
        if (res.status === 201) {
          toast.success("Meal Plans added Successfully");
          setRecipes("");
          setSelectedMealType("");
          setSelectedDietaryPreference("");
          setIngredients("");
          setCookingInstruction("");
          setNutritionalInformation("");
          setPortionSizes("");
          setSource("");
          setDate("");
          navigate("/");
          setActiveTab("tab4");
        }
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to add meal plans");
        setIsLoading(false);
      }
    }
  };

  const navigate = useNavigate();

  const goToMealPlans = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div
        className="container mx-auto p-4"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white b">
          {editMealPlans ? "Edit Meal Plan" : "Create Meal Plan"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md rounded-lg shadow-md bg-transparent"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.85)" }}
          >
            <div className="relative md:w-96">
            <label
                  htmlFor="mealType"
                  className="block text-sm font-medium text-gray-700 items-center"
                >
                 Select Meal Type
                </label>
              <select
                name="mealType"
                className="border rounded h-10 w-full p-2 mt-4"
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="tea-time">Tea-Time</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div className="relative md:w-96 mt-2">
            <label
                  htmlFor="dietaryPreferences"
                  className="block text-sm font-medium text-gray-700 items-center"
                >
                 Select Dietary Preferences
                </label>
              <select
                name="dietaryPreferences"
                className="border rounded h-10 w-full p-2 mt-4"
                value={selectedDietaryPreference}
                onChange={(e) => setSelectedDietaryPreference(e.target.value)}
              >
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="keto">Keto</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
            </div>

            <TEInput
              type="text"
              label="Recipes Name"
              className="my-4 "
              value={recipes}
              onChange={(e) => setRecipes(e.target.value)}
              
            ></TEInput>

            <TETextarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="my-5"
              id="ingredients"
              label="Ingredients"
              rows={3}
            ></TETextarea>

            <TETextarea
              value={cookingInstruction}
              onChange={(e) => setCookingInstruction(e.target.value)}
              className="my-5"
              id="cooking-instruction"
              label="Cooking Instruction"
              rows={4}
            ></TETextarea>

            <TETextarea
              value={nutritionalInformation}
              onChange={(e) => setNutritionalInformation(e.target.value)}
              className="my-5"
              id="nutritional-info"
              label="Nutritional Information"
              rows={2}
            ></TETextarea>

            <TEInput
              type="number"
              label="Portion Sizes (g - gram)"
              className="my-5"
              value={portionSizes}
              onChange={(e) => setPortionSizes(e.target.value)}
            ></TEInput>

            <div className="mb-3 w-96">
              <label
                htmlFor="formFile"
                className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
              >
                Upload picture of your meal
              </label>
              <input
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                id="formFile"
                onChange={onImageChange}
              />
            </div>

            <TEInput
              type="date"
              className="my-5"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            ></TEInput>

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="meal"
                className="w-40 h-40"
              />
            )}

            {!image && source && (
              <img src={source} alt="meal" className="w-40 h-40" />
            )}

            <button
              type="submit"
              className="w-full mt-6 px-4 py-2 text-sm font-medium text-white bg-success rounded-md shadow hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLoading ? "Loading..." : editMealPlans ? "Update" : "Create"}
            </button>

            <button
              onClick={goToMealPlans}
              className="w-full px-4 mt-2 py-2 text-sm font-medium text-white hover:text-white bg-red-500 rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateMealPlan;
