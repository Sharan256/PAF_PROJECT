import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { TEInput, TETextarea } from "tw-elements-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../db/firebase";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import backgroundImg from "../images/PostBac.jpg";

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
      <div
      className="container mx-auto p-4 min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fit",
      }}
    >
      
        <h1 className="text-3xl text-white font-bold mb-6 text-center">
          {editPost ? "Edit Post" : "Add Post"}
        </h1>

        <div           className="max-w-xl mx-auto p-6 rounded-lg shadow-md bg-transparent"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.75)" }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-lg space-y-6 -z-0"
            
          >
            <div className="w-full">
              <TEInput
                type="text"
                label="Topic"
                {...register("title")}
                isInvalid={errors.title}
                className="mb-1"
              ></TEInput>
              {errors.title && (
                <p className="text-xs mt-1 mb-1 text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <textarea
                id="textareaExample"
                label="Description"
                rows={4}
                placeholder="Write your thoughts here..."
                className="mb-1 resize-none w-full border border-gray-400 focus:outline-blue-700 rounded-lg p-5"
                {...register("description")}
                isInvalid={errors.description}
              />
              {errors.description && (
                <p className="text-xs mt-1 mb-1 text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            {!editPost && (
              <select
                onChange={(e) => {
                  if (e.target.value === 1) {
                    setImageSelected(true);
                    setVideoSelected(false);
                  } else {
                    setImageSelected(false);
                    setVideoSelected(true);
                  }
                }}
                className="w-full p-2 mt-4 mb-4 border border-gray-300 rounded-md"
                defaultValue={1}
                onClick={(e) => console.log(e.target.value)}
              >
                <option value={1}>Image Upload</option>
                <option value={2}>Video Upload</option>
              </select>
            )}

            <div>
              {imageSelected ? (
                <>
                  <label
                    htmlFor="formFileMultiple"
                    className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
                  >
                    Images Upload
                  </label>
                  <input
                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                    type="file"
                    accept="image/*"
                    id="formFileMultiple"
                    multiple
                    onChange={onImageChange}
                  />
                  {errors.images && (
                    <p className="text-xs mt-1 mb-1 text-red-500">
                      {errors.images.message}
                    </p>
                  )}
                  <div className="flex gap-2 ">
                    {imageURLs.map((imageSrc, index) => (
                      <img
                        key={index}
                        className="mt-3 flex items-center justify-center w-[100px] h-[100px] bg-gray-200 rounded-lg"
                        src={imageSrc}
                        alt="not found"
                        width={"250px"}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <label
                    htmlFor="formFileMultiple"
                    className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
                  >
                    Video Upload
                  </label>
                  <input
                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                    type="file"
                    id="formFileMultiple"
                    onChange={onVideoChange}
                    onClick={() => {
                      setVideo(null);
                      setVideoURL(null);
                    }}
                    accept="video/mp4,video/x-m4v,video/*"
                  />
                  {errors.video && (
                    <p className="text-xs mt-1 mb-1 text-red-500">
                      {errors.video.message}
                    </p>
                  )}
                  <div className="">
                    {videoURL && (
                      <div className="flex justify-center items-center">
                        <video
                          controls
                          className="mt-3"
                          style={{ maxWidth: "400px", height: "auto" }}
                        >
                          <source src={videoURL} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              className="flex w-full rounded  items-center justify-center  bg-success px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-success-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] "
            >
              {isSubmitting ? "uploading....." : "post"}
            </button>
          </form>
        </div>

      </div>
    </Layout>
  );
};
export default Post;
