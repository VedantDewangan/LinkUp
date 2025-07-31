import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Profile.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Post from "../../components/Post/Post";
import toast from "react-hot-toast";
import socket from "../../socket";

function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [activetab, setActiveTab] = useState("post");
  const [profileUser, setProfileUser] = useState(null);
  const [allPost, setAllPost] = useState([]);
  const [laodingSave, setLoadingSave] = useState(false);
  const navigate = useNavigate();
  const [savedPost, setSavedPost] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/userDetails?id=${id}`,
          { withCredentials: true }
        );
        setProfileUser(data);

        setSavedPost(data.savedPost);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/post/getPost`,
          { withCredentials: true }
        );

        setAllPost(response.data.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getUser();
    setActiveTab("post");
  }, [id]);

  const changeState = async () => {
    setActiveTab("saved");
    setLoadingSave(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/userDetails?id=${id}`,
        { withCredentials: true }
      );

      setProfileUser(data);
      setSavedPost(data.savedPost);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/post/getPost`,
        { withCredentials: true }
      );
      setAllPost(response.data.data);
    } catch (error) {
      console.log(error);
    }
    setLoadingSave(false);
  };

  const followHim = async () => {
    try {
      const { data } = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/follow-request/send-follow-request`,
        {
          to: profileUser._id,
        },
        { withCredentials: true }
      );
      if (data.message !== "Follow Request already sent") {
        socket.emit("send-request", {
          to: profileUser._id,
        });
      }
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="page">
      <Navbar
        page={
          profileUser ? (profileUser._id === user._id ? "Profile" : "") : ""
        }
      />
      {loading ? (
        <div
          className="profile-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              textAlign: "center",
            }}
          >
            Loading...
          </p>
        </div>
      ) : profileUser ? (
        <div className="profile-container">
          <div className="profile-container-up">
            <div className="profile-container-up-1">
              <img src={profileUser.profilePhoto} alt="" />
            </div>
            <div className="profile-container-up-2">
              <p className="profile-fullname">
                {profileUser.fullName}
                {profileUser.verified ? (
                  <span>
                    <RiVerifiedBadgeFill />
                  </span>
                ) : (
                  <span></span>
                )}
              </p>
              <p className="profile-username">@{profileUser.userName}</p>
              <p className="profile-bio">{profileUser.bio}</p>
              <div className="followers-following-post">
                <p>
                  {
                    allPost.filter((post) => post.user._id === profileUser._id)
                      .length
                  }{" "}
                  Post
                </p>
                <p>{profileUser.followers.length} Followers</p>
                <p>{profileUser.following.length} Following</p>
              </div>
            </div>
            <div className="profile-container-up-3">
              <button
                style={{
                  display: `${
                    id !== user._id
                      ? user.following.includes(profileUser._id)
                        ? "none"
                        : "block"
                      : "none"
                  }`,
                }}
                onClick={followHim}
              >
                Follow
              </button>
              <button
                style={{
                  display: `${id === user._id ? "block" : "none"}`,
                }}
                onClick={() => {
                  navigate("/edit-profile");
                }}
              >
                Edit
              </button>
              <button
                style={{
                  display: `${id === user._id ? "block" : "none"}`,
                }}
                onClick={() => {
                  navigate("/create/post");
                }}
              >
                Create Post
              </button>
            </div>
          </div>

          <div className="mobile-profile-con">
            <div>
              <div className="profile-container-up-1">
                <img src={profileUser.profilePhoto} alt="" />
              </div>
            </div>
            <div className="xyz">
              <div className="profile-container-up-2">
                <p className="profile-fullname">
                  {profileUser.fullName}
                  {profileUser.verified ? (
                    <span>
                      <RiVerifiedBadgeFill />
                    </span>
                  ) : (
                    <span></span>
                  )}
                </p>
                <p className="profile-username">@{profileUser.userName}</p>
                <p className="profile-bio">{profileUser.bio}</p>
                <div className="followers-following-post">
                  <p>
                    {
                      allPost.filter(
                        (post) => post.user._id === profileUser._id
                      ).length
                    }{" "}
                    Post
                  </p>
                  <p>{profileUser.followers.length} Followers</p>
                  <p>{profileUser.following.length} Following</p>
                </div>
              </div>
              <div className="profile-container-up-3">
                <button
                  style={{
                    display: `${
                      id !== user._id
                        ? user.following.includes(profileUser._id)
                          ? "none"
                          : "block"
                        : "none"
                    }`,
                  }}
                  onClick={followHim}
                >
                  Follow
                </button>
                <button
                  style={{
                    display: `${id === user._id ? "block" : "none"}`,
                  }}
                  onClick={() => {
                    navigate("/edit-profile");
                  }}
                >
                  Edit
                </button>
                <button
                  style={{
                    display: `${id === user._id ? "block" : "none"}`,
                  }}
                  onClick={() => {
                    navigate("/create/post");
                  }}
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>

          <div className="animated-boxes">
            <div className="box box1"></div>
            <div className="box box2"></div>
            <div className="box box3"></div>
            <div className="box box4"></div>
            <div className="box box5"></div>
          </div>

          <div className="profile-container-down">
            <div className="tabs">
              <button
                onClick={() => {
                  setActiveTab("post");
                }}
                id={
                  activetab === "post" ? "active-tab-but" : "not-active-tab-but"
                }
              >
                Post
              </button>
              <button
                onClick={changeState}
                id={
                  activetab !== "post" ? "active-tab-but" : "not-active-tab-but"
                }
                style={{
                  display: `${id === user._id ? "block" : "none"}`,
                }}
              >
                Saved
              </button>
            </div>
            <div className="post-profile-container">
              {activetab === "post" ? (
                allPost.filter((post) => post.user._id === profileUser._id)
                  .length === 0 ? (
                  <p>No Post</p>
                ) : (
                  allPost
                    .filter((post) => post.user._id === profileUser._id)
                    .map((obj) => {
                      return (
                        <Post
                          key={obj._id}
                          postDetails={obj}
                          setUserPost={setAllPost}
                        />
                      );
                    })
                )
              ) : laodingSave ? (
                <p>Loading...</p>
              ) : savedPost.length === 0 ? (
                <p>No Saved Post</p>
              ) : (
                savedPost.map((obj) => {
                  return (
                    <Post
                      key={obj._id}
                      postDetails={obj}
                      setUserPost={setAllPost}
                      setSavedPost={setSavedPost}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Profile;
