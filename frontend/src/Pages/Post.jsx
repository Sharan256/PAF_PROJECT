import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { TEInput } from "tw-elements-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../db/firebase";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
// import backgroundImg from "../images/PostBac.jpg";

const storage = getStorage(app);

const formSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

const getVideoDurationInSeconds = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      resolve(duration);
    };
    video.onerror = (error) => {
      reject(error);
    };
    video.src = URL.createObjectURL(file);
  });
};

const Post = () => {
  const [imageSelected, setImageSelected] = useState(true);
  const [videoSelected, setVideoSelected] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [user, setUser] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [post, setPost] = useState(null);
  const [editPost, setEditPost] = useState(false);

  const navigate = useNavigate();

  const { postId } = useParams();

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/posts/${postId}`
        );
        setPost(data);

        if (data.video) {
          setVideoSelected(true);
          setImageSelected(false);
        }

        if (data.images.length > 0) {
          setImageSelected(true);
          setVideoSelected(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (postId) {
      fetchSinglePost();
      setEditPost(true);
    } else {
      setEditPost(false);
      setPost(null);
    }
  }, [postId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);

    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setImageURLs(newImageUrls);
  }, [images]);

  function onImageChange(e) {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      setError("images", {
        type: "manual",
        message: "Please select at least one image",
      });
      setImages([]);
      return;
    }

    if (selectedFiles.length > 3) {
      setError("images", {
        type: "manual",
        message: "Maximum of 3 images allowed",
      });
    } else {
      clearErrors("images");
      setImages([...selectedFiles]);
    }
  }

  function onVideoChange(e) {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      getVideoDurationInSeconds(selectedFile).then((duration) => {
        if (duration > 30) {
          setError("video", {
            type: "manual",
            message: "Video duration should be less than 30 seconds",
          });
        } else {
          clearErrors("video");
          setVideo(selectedFile);
          setVideoURL(URL.createObjectURL(selectedFile));
        }
      });
    }
  }

  const onSubmit = async (data) => {
    if (!editPost) {
      if (!imageSelected && !video) {
        setError("video", {
          type: "manual",
          message: "Video is required",
        });
        return;
      }

      if (!videoSelected && images.length === 0) {
        setError("images", {
          type: "manual",
          message: "Please select at least one image",
        });
        return;
      }
    }

    console.log(user);
    if (user) {
      if (imageSelected) {
        const imageUrls = [];

        for (const image of images) {
          const imageRef = ref(storage, `images/${image.name}`);
          await uploadBytes(imageRef, image);
          const imageUrl = await getDownloadURL(imageRef);
          imageUrls.push(imageUrl);
        }

        const updatePost = {
          id: postId,
          title: data.title,
          description: data.description,
          images: imageUrls.length > 0 ? imageUrls : post.images,
          userId: user.id,
          username: user.name,
          userProfile: user.profileImage,
        };

        const postData = {
          title: data.title,
          description: data.description,
          images: imageUrls,
          userId: user.id,
          username: user.name,
          userProfile: user.profileImage,
        };

        if (editPost) {
          try {
            const res = await axios.put(
              `http://localhost:8080/posts`,
              updatePost
            );
            console.log(res);
            setIsUploadSuccess(true);
            navigate("/");
            toast.success("Post updated successfully");
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log(postData);
          try {
            const res = await axios.post(
              "http://localhost:8080/posts",
              postData
            );
            console.log(res);
            setIsUploadSuccess(true);
            navigate("/");
            toast.success("Post uploaded successfully");
          } catch (error) {
            console.log(error);
          }
        }
      }

      if (videoSelected) {
        let videoUrl = null;

        if (video) {
          const videoRef = ref(storage, `videos/${video.name}`);
          await uploadBytes(videoRef, video);
          videoUrl = await getDownloadURL(videoRef);
        }

        const updateData = {
          id: postId,
          title: data.title,
          description: data.description,
          video: videoUrl ? videoUrl : post.video,
          userId: user.id,
          username: user.name,
          userProfile: user.profileImage,
        };

        const videoPostData = {
          title: data.title,
          description: data.description,
          video: videoUrl,
          userId: user.id,
          username: user.name,
          userProfile: user.profileImage,
        };

        if (editPost) {
          try {
            const res = await axios.put(
              `http://localhost:8080/posts`,
              updateData
            );
            console.log(res);
            setIsUploadSuccess(true);
            navigate("/");
            toast.success("Post updated successfully");
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            const res = await axios.post(
              "http://localhost:8080/posts",
              videoPostData
            );
            console.log(res);
            setIsUploadSuccess(true);
            navigate("/");
            toast.success("Post uploaded successfully");
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  };

  useEffect(() => {
    setValue("title", "");
    setValue("description", "");
    setVideo(null);
    setVideoURL(null);
    setImageURLs([]);
    setImages([]);
    // eslint-disable-next-line
  }, [imageSelected, videoSelected, isUploadSuccess]);

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("description", post.description);
      setVideoURL(post.video);
      setImageURLs(post.images);
    }
    // eslint-disable-next-line
  }, [post, postId]);

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {editPost ? "Edit Post" : "Create Post"}
            </h1>
            <p className="text-gray-600 text-lg">Share your fitness journey with others</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div className="transform hover:scale-[1.01] transition-transform duration-200">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register("title")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 shadow-sm hover:shadow-md"
                    placeholder="Enter your post topic"
                  />
                  {errors.title && (
                    <p className="text-xs mt-1 text-red-500 font-medium">{errors.title.message}</p>
                  )}
                </div>

                <div className="transform hover:scale-[1.01] transition-transform duration-200">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register("description")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px] resize-none bg-white/70 shadow-sm hover:shadow-md"
                    placeholder="Write your thoughts here..."
                  />
                  {errors.description && (
                    <p className="text-xs mt-1 text-red-500 font-medium">{errors.description.message}</p>
                  )}
                </div>

                {!editPost && (
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                    <label htmlFor="contentType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      id="contentType"
                      onChange={(e) => {
                        if (e.target.value === "1") {
                          setImageSelected(true);
                          setVideoSelected(false);
                        } else {
                          setImageSelected(false);
                          setVideoSelected(true);
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 shadow-sm hover:shadow-md"
                      defaultValue="1"
                    >
                      <option value="1">Image Upload</option>
                      <option value="2">Video Upload</option>
                    </select>
                  </div>
                )}

                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                  {imageSelected ? (
                    <>
                      <label htmlFor="formFileMultiple" className="block text-sm font-semibold text-gray-700 mb-2">
                        Images Upload
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 shadow-sm hover:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-indigo-50 file:text-blue-700 hover:file:from-blue-100 hover:file:to-indigo-100"
                          type="file"
                          accept="image/*"
                          id="formFileMultiple"
                          multiple
                          onChange={onImageChange}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      {errors.images && (
                        <p className="text-xs mt-1 text-red-500 font-medium">{errors.images.message}</p>
                      )}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {imageURLs.map((imageSrc, index) => (
                          <div key={index} className="relative aspect-square group">
                            <img
                              className="w-full h-full object-cover rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200"
                              src={imageSrc}
                              alt={`Preview ${index + 1}`}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl"></div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor="formFileMultiple" className="block text-sm font-semibold text-gray-700 mb-2">
                        Video Upload
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 shadow-sm hover:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-indigo-50 file:text-blue-700 hover:file:from-blue-100 hover:file:to-indigo-100"
                          type="file"
                          id="formFileMultiple"
                          onChange={onVideoChange}
                          onClick={() => {
                            setVideo(null);
                            setVideoURL(null);
                          }}
                          accept="video/mp4,video/x-m4v,video/*"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      {errors.video && (
                        <p className="text-xs mt-1 text-red-500 font-medium">{errors.video.message}</p>
                      )}
                      {videoURL && (
                        <div className="mt-4 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
                          <video
                            controls
                            className="w-full"
                          >
                            <source src={videoURL} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : editPost ? "Update Post" : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Post;
