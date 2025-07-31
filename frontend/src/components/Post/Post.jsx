import "./Post.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import { useState } from "react";

function Post({ postDetails, setUserPost, setSavedPost }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [wantComment, setWantCommnet] = useState("");
  const [userComment, setUserComment] = useState("");
  const [allComments, SetAllComments] = useState(() =>
    [...postDetails.comments].reverse()
  );

  const getRelativeTimeShort = (timestamp) => {
    const now = new Date();
    const given = new Date(timestamp);
    const diffInSeconds = Math.floor((now - given) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y`;
  };

  const deletePost = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/post/deletePost/${
          postDetails._id
        }`,
        { withCredentials: true }
      );
      toast.success("Post Deleted Successfully");
      setUserPost((prev) =>
        prev.filter((post) => post._id !== postDetails._id)
      );
      if (setSavedPost) {
        setSavedPost((prev) =>
          prev.filter((post) => post._id !== postDetails._id)
        );
      }
    } catch (error) {
      toast.error(error.message);
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  };

  const likePost = async () => {
    try {
      const alreadyLiked = postDetails.likes.includes(user._id);
      setUserPost((prev) =>
        prev.map((post) => {
          if (post._id === postDetails._id) {
            const updatedLikes = alreadyLiked
              ? post.likes.filter((id) => id !== user._id)
              : [...post.likes, user._id];

            return { ...post, likes: updatedLikes };
          }
          return post;
        })
      );
      if (setSavedPost) {
        setSavedPost((prev) =>
          prev.map((post) => {
            if (post._id === postDetails._id) {
              const updatedLikes = alreadyLiked
                ? post.likes.filter((id) => id !== user._id)
                : [...post.likes, user._id];

              return { ...post, likes: updatedLikes };
            }
            return post;
          })
        );
      }
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/post/like-unlike`,
        {
          id: postDetails._id,
        },
        { withCredentials: true }
      );
      if (!alreadyLiked) {
        socket.emit("send-notification", {
          to: postDetails.user._id,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  const savedPost = async () => {
    try {
      const alreadySaved = user.savedPost.includes(postDetails._id);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/post/save-unsave`,
        { id: postDetails._id },
        { withCredentials: true }
      );
      const updatedSavedPosts = alreadySaved
        ? user.savedPost.filter((postId) => postId !== postDetails._id)
        : [...user.savedPost, postDetails._id];

      setUser((prev) => ({
        ...prev,
        savedPost: updatedSavedPosts,
      }));
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (userComment === "") return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/post/add-comment`,
        {
          id: postDetails._id,
          comment: userComment,
        },
        { withCredentials: true }
      );
      setUserComment("");
      if (user._id !== postDetails.user._id) {
        socket.emit("send-notification", {
          to: postDetails.user._id,
        });
      }
      SetAllComments((prev) => [
        {
          comment: userComment,
          userId: user,
        },
        ...prev,
      ]);
      toast.success("Comment Added Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="post-conatiner">
      {wantComment === postDetails._id ? (
        <>
          <div
            onClick={() => {
              setWantCommnet("");
            }}
            className="comment-close-but"
          >
            close
          </div>
          <div className="all-comment-container">
            {allComments.length === 0 ? (
              <p style={{ textAlign: "center" }}>No Comments</p>
            ) : (
              allComments.map((obj, i) => {
                return (
                  <div key={i} className="each-comment">
                    <img
                      onClick={() => {
                        navigate(`/profile/${obj.userId._id}`);
                      }}
                      src={obj.userId.profilePhoto}
                      alt=""
                    />
                    <div className="each-comment-details">
                      <p
                        onClick={() => {
                          navigate(`/profile/${obj.userId._id}`);
                        }}
                      >
                        @{obj.userId.userName}
                      </p>
                      <p>{obj.comment}</p>
                      <p>
                        {obj.timeInfo
                          ? `${obj.timeInfo.time} ${obj.timeInfo.date}`
                          : "now"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="comment-form">
            <form onSubmit={addComment}>
              <input
                type="text"
                placeholder="Add Comment"
                value={userComment}
                onChange={(e) => {
                  setUserComment(e.target.value);
                }}
              />
              <button type="submit">Comment</button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="post-user-details">
            <div>
              <img src={postDetails.user.profilePhoto} alt="" />
              <div
                onClick={() => {
                  navigate(`/profile/${postDetails.user._id}`);
                }}
              >
                <p
                  className="post-user-details-name"
                  style={{ cursor: "pointer" }}
                >
                  {postDetails.user.userName}
                </p>
                <p className="post-user-details-time">
                  {getRelativeTimeShort(postDetails.createdAt)} ago
                </p>
              </div>
            </div>
            <div
              style={{
                display: `${
                  postDetails.user._id === user._id ? "block" : "none"
                }`,
              }}
            >
              <button onClick={deletePost}>Delete</button>
            </div>
          </div>

          <div id="post-caption-conatiner">
            <p className={`post-caption ${expanded ? "expanded" : "clamped"}`}>
              {postDetails.caption}
            </p>

            {postDetails.caption.split(" ").length > 9 && (
              <span
                className="read-toggle"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? "Read less" : "Read more"}
              </span>
            )}
          </div>

          <div id="post-img-conatiner">
            <img src={postDetails.postImageURL} alt="" />
          </div>
          <div className="post-features">
            <div>
              <span>
                {postDetails.likes.includes(user._id) ? (
                  <i
                    onClick={likePost}
                    className="fa-solid fa-heart"
                    style={{ color: "#ff0f77" }}
                  ></i>
                ) : (
                  <i onClick={likePost} className="fa-regular fa-heart"></i>
                )}
              </span>
              <span>
                <i
                  className="fa-regular fa-comment"
                  onClick={() => {
                    setWantCommnet(postDetails._id);
                  }}
                ></i>
              </span>
            </div>
            <span>
              {user.savedPost.includes(postDetails._id) ? (
                <i
                  onClick={savedPost}
                  className="fa-solid fa-bookmark"
                  style={{ color: "#FFD43B" }}
                ></i>
              ) : (
                <i onClick={savedPost} className="fa-regular fa-bookmark"></i>
              )}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default Post;
