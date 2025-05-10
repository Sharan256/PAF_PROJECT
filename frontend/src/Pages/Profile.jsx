import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PostsList from "../components/PostsList";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [reFetchPost, setReFetchPost] = useState(false);
  const [reFetchUser, setReFetchUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: ""
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setUser(null);
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/users/${userId}`);
        setUser(res.data);
        setEditForm({
          name: res.data.name || "",
          email: res.data.email || "",
          password: "",
          profileImage: res.data.profileImage || ""
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, reFetchUser]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/posts/user/${userId}`
        );
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserPosts();
  }, [userId, reFetchPost]);

  useEffect(() => {
    setLoading(true);
    setUser(null);
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const userData = localStorage.getItem("user");
        setLoginUser(JSON.parse(userData));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFollowUser = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/users/follow?userId=${loginUser.id}&FollowedUserId=${user?.id}`
      );
      setReFetchUser(!reFetchUser);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      profileImage: user.profileImage || ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditForm(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!editForm.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!editForm.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (editForm.password && editForm.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleUpdateProfile = async () => {
    try {
      console.log('Starting profile update...');
      setError("");
      setSuccess("");
      
      if (!validateForm()) {
        console.log('Form validation failed');
        return;
      }
      
      // Create update payload with only changed fields
      const updatePayload = {
        name: editForm.name,
        email: editForm.email,
        profileImage: editForm.profileImage || ""
      };
      
      // Only include password if it's not empty
      if (editForm.password && editForm.password.trim()) {
        updatePayload.password = editForm.password;
      }
      
      console.log('Update payload:', updatePayload);
      
      // Make sure we have a valid userId
      if (!userId) {
        console.log('No userId found');
        setError("User ID is missing");
        return;
      }
      
      console.log('Sending update request to:', `http://localhost:8080/users/${userId}`);
      const res = await axios.put(`http://localhost:8080/users/${userId}`, updatePayload);
      console.log('Update response:', res.data);
      
      if (res.data) {
        // Update local user state with the response data
        setUser(res.data);
        setIsEditing(false);
        setReFetchUser(!reFetchUser);
        setSuccess("Profile updated successfully!");
        
        // Update localStorage if it's the logged-in user
        if (loginUser?.id === userId) {
          const updatedUserData = { ...loginUser, ...res.data };
          localStorage.setItem("user", JSON.stringify(updatedUserData));
          setLoginUser(updatedUserData);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setError("Failed to update profile. No data received from server.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Error response:", error.response);
      
      // Handle different types of error responses
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          setError(error.response.data);
        } else if (error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError("Failed to update profile. Please try again.");
        }
      } else {
        setError("Failed to update profile. Please try again.");
      }
    }
  };

  // Add this function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateProfile();
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:8080/users/${user.id}`);
      toast.success("Account deleted successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete account");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
        <div className="max-w-6xl mx-auto">
          {loading && !user ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Cover Photo */}
                <div className="relative h-48">
                  <img
                    src="https://hometriangle.com/blogs/content/images/2022/02/Home-Gym-for-Small-Spaces-1.png"
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative -mt-20">
                      <img
                        src={user?.profileImage || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h1>
                      <p className="text-gray-600 mb-4">{user?.email}</p>
                      {loginUser?.id === userId ? (
                        <div className="flex gap-4">
                          <button
                            onClick={handleEditClick}
                            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            Edit Profile
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                          >
                            Delete Account
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleFollowUser}
                          className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          {user?.followers?.includes(loginUser?.id) ? "Unfollow" : "Follow"}
                        </button>
                      )}
                    </div>
                    <div className="flex gap-6 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-800">{user?.followersCount || 0}</p>
                        <p className="text-gray-600">Followers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">{user?.followingCount || 0}</p>
                        <p className="text-gray-600">Following</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">{posts?.length || 0}</p>
                        <p className="text-gray-600">Posts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              {isEditing && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                      <input
                        type="password"
                        name="password"
                        value={editForm.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                      <div className="mt-1 flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={imagePreview || user?.profileImage || "https://via.placeholder.com/150"}
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                          />
                          <label
                            htmlFor="profile-image-upload"
                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </label>
                          <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">
                            Upload a new profile picture. Supported formats: JPG, PNG, GIF
                          </p>
                          {selectedImage && (
                            <p className="text-sm text-green-600 mt-1">
                              Image selected: {selectedImage.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {error && (
                      <div className="text-red-600 bg-red-50 p-3 rounded-xl">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="text-green-600 bg-green-50 p-3 rounded-xl">
                        {success}
                      </div>
                    )}
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* User Posts */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Posts</h2>
                <div className="grid gap-6">
                  {posts?.map((post, index) => (
                    <div 
                      key={index} 
                      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 transform hover:scale-[1.01] transition-all duration-200"
                    >
                      <PostsList
                        post={post}
                        user={loginUser}
                        onUpdatePost={(updatedPost) => {
                          setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
                        }}
                        onDeletePost={(deletedPost) => {
                          setPosts(posts.filter(p => p._id !== deletedPost._id));
                        }}
                        reFetchPost={reFetchPost}
                        setReFetchPost={setReFetchPost}
                      />
                    </div>
                  ))}
                </div>

                {posts?.length === 0 && (
                  <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-gray-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No posts yet. Start sharing your fitness journey!</p>
                    {loginUser?.id === userId && (
                      <button
                        onClick={() => navigate('/post')}
                        className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Create Your First Post
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Delete Account</h2>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <IoClose size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
