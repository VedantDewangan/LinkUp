import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./EditProfile.css";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

function EditProfile() {
  const { user } = useAuth();

  const [bio, setBio] = useState(user ? user.bio : "");
  const [bioLoading, setBioLoading] = useState(false);

  const [oldPassword, SetOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("follower");

  useEffect(() => {
    const getFollowers = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/followers`,
        { withCredentials: true }
      );
      setFollowers(data.follower);
      setFollowing(data.following);
    };

    getFollowers();
  }, []);

  const updateBio = async (e) => {
    e.preventDefault();
    if (bioLoading) return;
    setBioLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update/bio`,
        {
          bio: bio,
        },
        { withCredentials: true }
      );
      toast.success("Bio Updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setBioLoading(false);
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (passwordLoading) return;
    setPasswordLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update/password`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        { withCredentials: true }
      );
      toast.success("Password Updated successfully");
      SetOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    setPasswordLoading(false);
  };

  const updatePhoto = async (e) => {
    e.preventDefault();
    if (photoLoading) return;
    setPhotoLoading(true);
    try {
      if (!image) return;
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update/profile-photo`,
        {
          image: response.data.data.display_url,
        },
        { withCredentials: true }
      );
      toast.success("Profile Photo Updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    setPhotoLoading(false);
  };

  return (
    <div className="page">
      <Navbar />
      <div className="edit-page-container">
        <p onClick={() => window.history.back()} className="back-button">
          <i className="fa-solid fa-arrow-left"></i>
        </p>
        <h2>Edit Profile</h2>

        <div className="edit-forms">
          <form className="edit-form" onSubmit={updatePhoto}>
            <label htmlFor="photo">Update Profile Photo</label>
            <input
              type="file"
              id="photo"
              required
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
            <button type="submit">
              {photoLoading ? "loading..." : "Update Photo"}
            </button>
          </form>

          <form className="edit-form" onSubmit={updateBio}>
            <label htmlFor="bio">Update Bio</label>
            <input
              type="text"
              id="bio"
              value={bio}
              maxLength={50}
              onChange={(e) => {
                setBio(e.target.value);
              }}
              placeholder="Your new bio..."
            />
            <button type="submit">
              {bioLoading ? "Loading..." : "Update Bio"}
            </button>
          </form>

          <form className="edit-form" onSubmit={updatePassword}>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              placeholder="Current password"
              onChange={(e) => {
                SetOldPassword(e.target.value);
              }}
              value={oldPassword}
              required
            />
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              placeholder="New password"
              required
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
            <button type="submit">
              {passwordLoading ? "Loading..." : "Update Password"}
            </button>
          </form>

          <form className="edit-form">
            <div className="see-follower-following">
              <button
                type="button"
                id={
                  activeTab === "follower"
                    ? "see-follower-active"
                    : "see-follower-inactive"
                }
                onClick={() => {
                  setActiveTab("follower");
                }}
              >
                Follower
              </button>
              <button
                type="button"
                id={
                  activeTab !== "follower"
                    ? "see-follower-active"
                    : "see-follower-inactive"
                }
                onClick={() => {
                  setActiveTab("");
                }}
              >
                Following
              </button>
            </div>
            <div className="all-follower-con">
              {activeTab === "follower"
                ? followers.map((obj) => {
                    return (
                      <div className="each-follower">
                        <img src={obj.profilePhoto} alt="" />
                        <p>@{obj.userName}</p>
                      </div>
                    );
                  })
                : following.map((obj) => {
                    return (
                      <div className="each-follower">
                        <img src={obj.profilePhoto} alt="" />
                        <p>@{obj.userName}</p>
                      </div>
                    );
                  })}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
