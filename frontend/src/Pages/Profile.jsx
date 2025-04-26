import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostsList from "../components/PostsList";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [reFetchPost, setReFetchPost] = useState(false);
  const [reFetchUser, setReFetchUser] = useState(false);

  useEffect(() => {
    setLoading(true);
    setUser(null);
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/users/${userId}`);
        setUser(res.data);

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

//   if (loading && !user) {
//     return <Layout>loading...</Layout>;
//   }

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

  return (
    <Layout>
      <div className="w-full flex items-center justify-center flex-col bg-gray-100">
        <div className=" w-[800px] bg-white rounded-lg">
          {/* <section className=" flex items-center top-0 bg-opacity-95 ">
            <p className="py-5 text-xl font-bold  ml-1 ">{user?.name}</p>
          </section> */}

          <section>
            <img
              className="w-full h-64 object-cover"
              src="https://hometriangle.com/blogs/content/images/2022/02/Home-Gym-for-Small-Spaces-1.png"
              alt=""
            />
          </section>

          <section className="pl-6">
            <div className="flex justify-between items-start mt-5 h-20 ">
              <img
                className="-mt-28 w-40 h-40  border-4 border-white rounded-full "
                alt="w"
                src={user?.profileImage}
              />

              {loginUser?.id !== user?.id ? (
                <button
                  onClick={handleFollowUser}
                  className="bg-blue-700 text-white px-4 py-2 rounded-3xl"
                >
                  {user?.followingUsers?.includes(loginUser?.id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              ) : null}
            </div>

            <div>
              <div className="flex item-center flex-col">
                <h1 className="font-bold text-lg">{user?.name}</h1>
              </div>
            </div>

            <div className="mt-2 space-y-3">
              <p>Hey there!</p>
              <div className="flex items-center space-x-5">
                <div className="flex items-center space-x-1 font-semibold">
                  <span>{user?.followingCount}</span>
                  <span className="text-gray-500">Following</span>
                </div>
                <div className="flex items-center space-x-1 font-semibold">
                  <span>{user?.followersCount}</span>
                  <span className="text-gray-500">Followers</span>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="mt-10 ">
          {/* <p className="text-xl font-bold">
            {user?.name}
            <span className="text-gray-500"> 's Posts</span>
          </p> */}
          {posts?.map((post, index) => {
            return (
              <PostsList
                post={post}
                user={loginUser}
                key={index}
                //   onUpdatePost={updatePost}
                //   onDeletePost={deletePost}
                reFetchPost={reFetchPost}
                setReFetchPost={setReFetchPost}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
