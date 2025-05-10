import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { TETabs, TETabsItem } from "tw-elements-react";
import PostsList from "../components/PostsList";
import SharedPostsList from "../components/SharedPostsList";
import axios from "axios";
import toast from "react-hot-toast";
import WorkoutStatus from "./WorkoutStatus";
import WorkoutPlan from "./WorkoutPlan";
import MealPlan from "./MealPlan";
import { useActiveTab } from "../context/ActiveTabContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { activeTab, setActiveTab } = useActiveTab();
  const [user, setUser] = useState(null);
  const [reFetchPost, setReFetchPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [reFetchSharedPost, setReFetchSharedPost] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/posts");
        console.log('Fetched posts:', data);
        setPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllPosts();
  }, [reFetchPost]);

  useEffect(() => {
    const fetchSharedPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/share");
        console.log('Fetched shared posts:', data);
        setSharedPosts(data);
      } catch (error) {
        console.error("Error fetching shared posts:", error);
      }
    };
    fetchSharedPosts();
  }, [reFetchSharedPost]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const userData = localStorage.getItem("user");
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const deletePost = (deletedPost) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPost._id)
    );
  };

  const handleWhatsOnMind = () => {
    navigate("/post");
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* What's on your mind section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 transform hover:scale-[1.01] transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={user?.profileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div
                className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-6 py-3 cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={handleWhatsOnMind}
              >
                <p className="text-gray-600 font-medium">What's on your mind?</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
            <TETabs className="flex flex-wrap sm:flex-nowrap justify-evenly p-2">
              <TETabsItem
                onClick={() => setActiveTab("tab1")}
                active={activeTab === "tab1"}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === "tab1"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Posts
              </TETabsItem>
              <TETabsItem
                onClick={() => setActiveTab("tab2")}
                active={activeTab === "tab2"}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === "tab2"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Workout Status
              </TETabsItem>
              <TETabsItem
                onClick={() => setActiveTab("tab3")}
                active={activeTab === "tab3"}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === "tab3"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Workout Plan
              </TETabsItem>
              <TETabsItem
                onClick={() => setActiveTab("tab4")}
                active={activeTab === "tab4"}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === "tab4"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Meal Plan
              </TETabsItem>
            </TETabs>
          </div>

          <div className="space-y-6">
            {activeTab === "tab1" && (
              <>
                {sharedPosts?.map((sharedPost, index) => (
                  <div key={`shared-${index}`} className="transform hover:scale-[1.01] transition-all duration-200">
                    <SharedPostsList
                      post={sharedPost}
                      user={user}
                      reFetchSharedPost={reFetchSharedPost}
                      setReFetchSharedPost={setReFetchSharedPost}
                    />
                  </div>
                ))}
                {posts?.map((post, index) => (
                  <div key={index} className="transform hover:scale-[1.01] transition-all duration-200">
                    <PostsList
                      post={post}
                      user={user}
                      onUpdatePost={updatePost}
                      onDeletePost={deletePost}
                      reFetchPost={reFetchPost}
                      setReFetchPost={setReFetchPost}
                      setReFetchSharedPost={setReFetchSharedPost}
                      reFetchSharedPost={reFetchSharedPost}
                    />
                  </div>
                ))}
              </>
            )}
            {activeTab === "tab2" && (
              <div className="transform hover:scale-[1.01] transition-all duration-200">
                <WorkoutStatus />
              </div>
            )}
            {activeTab === "tab3" && (
              <div className="transform hover:scale-[1.01] transition-all duration-200">
                <WorkoutPlan />
              </div>
            )}
            {activeTab === "tab4" && (
              <div className="transform hover:scale-[1.01] transition-all duration-200">
                <MealPlan />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
