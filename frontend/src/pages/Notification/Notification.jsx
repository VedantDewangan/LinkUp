import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Notification.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Notification() {
  const [likeNotification, setLikeNotification] = useState([]);
  const [commentNotification, setCommentNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("like");
  const [loadingDelete, setLoadingDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllNotification = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/notification/get-notification`,
          { withCredentials: true }
        );
        setLikeNotification(
          data.notifications.filter((item) => item.type === "like")
        );
        setCommentNotification(
          data.notifications.filter((item) => item.type === "comment")
        );
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getAllNotification();
  }, []);

  const deleteNotification = async (id) => {
    if (loadingDelete) return;
    setLoadingDelete(id);

    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/notification/delete-notification/${id}`,
        { withCredentials: true }
      );
      setCommentNotification((prev) => prev.filter((post) => post._id !== id));
      setLikeNotification((prev) => prev.filter((post) => post._id !== id));
      toast.success("Notification deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setLoadingDelete(null);
  };

  return (
    <div className="page">
      <Navbar page={"Notification"} />
      <div className="notification-page-con">
        <h2>Notifications</h2>
        <div className="notification-tabs">
          <button
            id={`${
              activeTab === "like"
                ? "notification-active-tab"
                : "notification-no-active-tab"
            }`}
            onClick={() => {
              setActiveTab("like");
            }}
          >
            <span>
              <i className="fa-regular fa-heart"></i>
            </span>
            <p>Like</p>
          </button>
          <button
            id={`${
              activeTab === "comment"
                ? "notification-active-tab"
                : "notification-no-active-tab"
            }`}
            onClick={() => {
              setActiveTab("comment");
            }}
          >
            <span>
              <i className="fa-regular fa-comment"></i>
            </span>
            <p>Comment</p>
          </button>
        </div>
        <div className="all-noti-con">
          {loading ? (
            <p>Loading...</p>
          ) : activeTab === "like" ? (
            likeNotification.length === 0 ? (
              <p>No Notification</p>
            ) : (
              likeNotification.map((obj) => {
                return (
                  <div
                    key={obj._id}
                    className="noti"
                    style={{
                      opacity: `${deleteNotification === obj._id ? 0.4 : 0.8}`,
                    }}
                  >
                    <div className="noti-first">
                      <img src={obj.from.profilePhoto} alt="" />
                      <div
                        className="noti-first-details"
                        onClick={() => {
                          navigate(`/profile/${obj.from._id}`);
                        }}
                      >
                        <p>{obj.from.fullName}</p>
                        <p>@{obj.from.userName}</p>
                      </div>
                      <p className="noti-first-notification">
                        {obj.notification}
                      </p>
                    </div>
                    <div className="noti-last">
                      <i
                        className="fa-solid fa-trash"
                        onClick={() => {
                          deleteNotification(obj._id);
                        }}
                      ></i>
                    </div>
                  </div>
                );
              })
            )
          ) : commentNotification.length === 0 ? (
            <p>No Notification</p>
          ) : (
            commentNotification.map((obj) => {
              return (
                <div
                  key={obj._id}
                  className="noti"
                  style={{
                    opacity: `${deleteNotification === obj._id ? 0.4 : 0.8}`,
                  }}
                >
                  <div className="noti-first">
                    <img src={obj.from.profilePhoto} alt="" />
                    <div
                      className="noti-first-details"
                      onClick={() => {
                        navigate(`/profile/${obj.from._id}`);
                      }}
                    >
                      <p>{obj.from.fullName}</p>
                      <p>@{obj.from.userName}</p>
                    </div>
                    <p className="noti-first-notification">
                      {obj.notification}
                    </p>
                  </div>
                  <div className="noti-last">
                    <i
                      className="fa-solid fa-trash"
                      onClick={() => {
                        deleteNotification(obj._id);
                      }}
                    ></i>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;
