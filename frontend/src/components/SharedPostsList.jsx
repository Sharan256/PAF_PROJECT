import axios from "axios";
import TimeAgo from "./TimeAgo";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa6";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdOutlineInsertComment } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa6";

const SharedPostsList = ({ post, user, onUpdatePost, onDeletePost, reFetchPost, setReFetchPost }) => {
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [shareDescription, setShareDescription] = useState("");
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const likeBtnClick = async (post) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/posts/like?postId=${post.id}&userId=${user.id}`
      );
      console.log(res.data);
      setReFetchPost(!reFetchPost);
    } catch (error) {
      console.log(error);
    }
  };

  const navigateEditPage = () => {
    navigate(`/post/${post.id}`);
  };

  const deletePost = async (post) => {
    try {
      await axios.delete(`http://localhost:8080/posts/${post.id}`);
      setReFetchPost(!reFetchPost);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = (comment) => {
    setComment(comment.content);
    setEditComment(true);
    setCommentId(comment.id);
  };

  const commentAdd = async (postId) => {
    try {
      setIsLoading(true);
      setError("");

      if (!comment) {
        setError("Please add a comment");
        return;
      }

      if (editComment && commentId) {
        const response = await axios.put(`http://localhost:8080/api/comments/${commentId}`, null, {
          params: {
            content: comment
          }
        });

        if (response.data) {
          setComments(prev => prev.map(c => 
            c.id === commentId ? { ...c, content: comment } : c
          ));
          toast.success("Comment updated successfully");
          setEditComment(false);
          setCommentId(null);
        }
      } else {
        const response = await axios.post(`http://localhost:8080/api/comments/post/${postId}`, null, {
          params: {
            content: comment,
            commentBy: user.name,
            commentById: user.id,
            commentByProfile: user.profileImage
          }
        });

        if (response.data) {
          const newComment = {
            ...response.data,
            createdAt: new Date().toISOString()
          };
          setComments(prev => [...prev, newComment]);
          toast.success("Comment added successfully");
        }
      }

      setComment("");
      setError("");
      setReFetchPost(!reFetchPost);
    } catch (error) {
      console.error('Error with comment:', error);
      setError(error.response?.data?.message || 'Failed to process comment');
      toast.error(error.response?.data?.message || 'Failed to process comment');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    const commentToDelete = comments.find(c => c.id === commentId);
    if (!commentToDelete) {
      toast.error("Comment not found");
      return;
    }

    try {
      setIsLoading(true);
      setComments(prev => prev.filter(c => c.id !== commentId));
      if (post.comments) {
        post.comments = post.comments.filter(c => c.id !== commentId);
      }
      
      await axios.delete(`http://localhost:8080/api/comments/${post.id}/${commentId}`);
      toast.success("Comment deleted successfully");
      setReFetchPost(prev => !prev);
      
    } catch (error) {
      console.error('Error deleting comment:', error);
      setComments(prev => [...prev, commentToDelete]);
      if (post.comments) {
        post.comments = [...post.comments, commentToDelete];
      }
      toast.error('Failed to delete comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8080/share`, {
        description: shareDescription,
        userid: user.id,
        postId: post.id,
      });
      if (res.data) {
        setShareModal(false);
        toast.success("Post shared successfully");
        setReFetchPost(!reFetchPost);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sharedPostDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/share/${post.id}`);
      setReFetchPost(!reFetchPost);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white mt-6 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="gap-4 flex items-center">
              <img
                src={post?.sharedBy?.profileImage}
                alt=""
                className="object-cover rounded-full w-12 h-12 ring-2 ring-gray-100"
              />
              <div className="flex flex-col">
                <b className="mb-1 capitalize text-gray-800">{post?.sharedBy?.name}</b>
                <p className="text-sm text-gray-500">shared this post</p>
              </div>
            </div>
            <div className="rounded-full p-2 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors duration-200">
              {user?.id === post?.sharedBy?.id && (
                <>
                  <AiFillDelete
                    size={20}
                    color="red"
                    className="cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={sharedPostDelete}
                  />
                </>
              )}
            </div>
          </div>
          <div className="mb-4 border-b border-gray-100">
            <p className="mt-1 text-sm text-gray-600 p-3 leading-relaxed">
              {post.description}
            </p>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="gap-4 flex items-center">
              <img
                src={post?.post?.userProfile}
                alt=""
                className="object-cover rounded-full w-12 h-12 ring-2 ring-gray-100"
              />
              <div className="flex flex-col">
                <b className="mb-2 capitalize text-gray-800">{post?.post?.username}</b>
                <time datetime="06-08-21" className="text-gray-400 text-xs">
                  <TimeAgo date={post?.post?.date} />
                </time>
              </div>
            </div>
          </div>
          <div className="whitespace-pre-wrap mt-7 font-bold text-xl text-gray-800 mb-3">
            {post?.post?.title}
          </div>
          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
            {post?.post?.description}
          </p>
          <div className="mt-6 flex gap-4 justify-center border-b border-gray-100 pb-6">
            {post?.post?.images?.length === 3 ? (
              <div className="grid grid-cols-3 gap-4 w-full">
                <img
                  src={post?.post?.images[0]}
                  alt=""
                  className="rounded-2xl w-full aspect-square object-cover hover:opacity-90 transition-opacity duration-200"
                />
                <img
                  src={post?.post?.images[1]}
                  alt=""
                  className="rounded-2xl w-full aspect-square object-cover hover:opacity-90 transition-opacity duration-200"
                />
                <img
                  src={post?.post?.images[2]}
                  alt=""
                  className="rounded-2xl w-full aspect-square object-cover hover:opacity-90 transition-opacity duration-200"
                />
              </div>
            ) : post?.post?.images?.length === 2 ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                <img
                  src={post?.post?.images[0]}
                  alt=""
                  className="rounded-2xl w-full aspect-square object-cover hover:opacity-90 transition-opacity duration-200"
                />
                <img
                  src={post?.post?.images[1]}
                  alt=""
                  className="rounded-2xl w-full aspect-square object-cover hover:opacity-90 transition-opacity duration-200"
                />
              </div>
            ) : post?.post?.images?.length === 1 ? (
              <div className="w-full">
                <img
                  src={post?.post?.images[0]}
                  alt=""
                  className="rounded-2xl w-full max-h-[600px] object-contain hover:opacity-90 transition-opacity duration-200"
                />
              </div>
            ) : post?.post?.video ? (
              <div className="w-full">
                <video
                  controls
                  className="rounded-2xl w-full max-h-[600px] object-contain hover:opacity-90 transition-opacity duration-200"
                >
                  <source src={post?.post?.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : null}
          </div>
          <div className="h-16 border-b border-gray-100 flex items-center justify-around">
            <div className="flex items-center gap-3 cursor-pointer hover:text-red-500 transition-colors duration-200">
              {post?.likedBy?.includes(user?.id) ? (
                <FaHeart size={24} color="red" onClick={() => likeBtnClick(post)} />
              ) : (
                <CiHeart size={24} color="red" onClick={() => likeBtnClick(post)} />
              )}
              <p className="text-gray-600">{post?.likeCount} Like</p>
            </div>
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-blue-500 transition-colors duration-200"
              onClick={() => setShowModal(true)}
            >
              <MdOutlineInsertComment size={24} color="blue" />
              <p className="text-gray-600">{post?.comments?.length} Comment</p>
            </div>
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-green-500 transition-colors duration-200"
              onClick={() => setShareModal(true)}
            >
              <FaShareFromSquare size={22} />
              <p className="text-gray-600">Share</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl ring-1 ring-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Comments</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex space-x-2">
                  <img
                    src={comment.commentByProfile}
                    alt="Profile"
                    className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-gray-100 hover:ring-yellow-200 transition-all duration-200"
                    onClick={() => navigate(`/profile/${comment.commentById}`)}
                  />
                  <div className="flex-1">
                    <div className="rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <span
                          className="font-semibold cursor-pointer hover:text-yellow-600 transition-colors duration-200"
                          onClick={() => navigate(`/profile/${comment.commentById}`)}
                        >
                          {comment.commentBy}
                        </span>
                        <span className="text-gray-500 text-sm">
                          <TimeAgo date={comment.createdAt} />
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.content}</p>
                      {user.id === comment.commentById && (
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                          >
                            <AiFillEdit size={20} />
                          </button>
                          <button
                            onClick={() => {
                              const commentId = comment.id || comment._id;
                              if (commentId) {
                                deleteComment(commentId);
                              } else {
                                console.error('Comment object missing ID:', comment);
                                toast.error('Comment ID not found');
                              }
                            }}
                            className="text-red-500 hover:text-red-600 transition-colors duration-200"
                          >
                            <AiFillDelete size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="flex items-start space-x-2">
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-gray-100 hover:ring-yellow-200 transition-all duration-200"
                  onClick={() => navigate(`/profile/${user.id}`)}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={editComment ? "Edit your comment..." : "Write a comment..."}
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => commentAdd(post.id)}
                      disabled={!comment || isLoading}
                      className={`p-2 ${!comment || isLoading ? 'text-gray-400' : 'text-yellow-500 hover:text-yellow-600'} transition-colors duration-200`}
                    >
                      <FaPaperPlane />
                    </button>
                    {editComment && (
                      <button
                        onClick={() => {
                          setComment("");
                          setEditComment(false);
                          setCommentId(null);
                        }}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                      >
                        <IoClose />
                      </button>
                    )}
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm mt-2">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {shareModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col outline-none focus:outline-none w-[550px] h-[300px] px-10 justify-between py-10">
                <div className="text-center font-bold text-xl flex justify-between">
                  <h1 className="text-blue-800">Share</h1>
                  <IoClose
                    color="red"
                    size={28}
                    className="cursor-pointer"
                    onClick={() => setShareModal(false)}
                  />
                </div>
                <form className="flex flex-col" onSubmit={handleShare}>
                  <textarea
                    className="border h-32 p-2"
                    placeholder="Write something"
                    onChange={(e) => setShareDescription(e.target.value)}
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white mt-4 h-8"
                  >
                    Share
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SharedPostsList; 