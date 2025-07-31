import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Request.css";
import axios from "axios";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import socket from "../../socket";

function Request() {
  const [followRequest, setFollowRequest] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [acceptRequest, setAcceptRequest] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(null);
  const { user } = useAuth();

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

  useEffect(() => {
    const getFollowRequest = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/follow-request/get-follow-request`,
          { withCredentials: true }
        );
        setFollowRequest(data.followRequests);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getFollowRequest();
  }, []);

  const AcceptFollowRequest = async (id, otherUserId) => {
    if (buttonLoading) return;
    setButtonLoading(id);
    try {
      const { data } = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/follow-request/accept-follow-request/${id}`,
        { withCredentials: true }
      );

      if (user.following.includes(otherUserId)) {
        setFollowRequest((prev) => prev.filter((item) => item._id !== id));
      } else {
        setAcceptRequest((prev) => [...prev, id]);
      }
      toast.success(data.message);
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error?.response?.data?.message);
    }
    setButtonLoading(null);
  };

  const DeclineFollowRequest = async (id) => {
    if (buttonLoading) return;
    setButtonLoading(id);
    try {
      const { data } = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/follow-request/reject-follow-request/${id}`,
        { withCredentials: true }
      );
      setFollowRequest((prev) => prev.filter((item) => item._id !== id));
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    setButtonLoading(null);
  };

  const followBack = async (id) => {
    try {
      const { data } = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/follow-request/send-follow-request`,
        {
          to: id,
        },
        { withCredentials: true }
      );
      if (data.message !== "Follow Request already sent") {
        socket.emit("send-request", {
          to: id,
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
      <Navbar page={"Request"} />
      <div className="request-page">
        <h2>Follow Request</h2>
        <div className="req-con">
          {loading ? (
            <p
              style={{
                textAlign: "center",
                padding: "20px",
              }}
            >
              Loading...
            </p>
          ) : followRequest.length === 0 ? (
            <div className="no-follow-request-con">
              <span>
                <i className="fa-solid fa-users"></i>
              </span>
              <p>
                When people want to follow you, their requests will appear here.
                You can choose to accept or decline them.
              </p>
            </div>
          ) : (
            <div className="follow-request-con">
              {followRequest.map((obj) => {
                return (
                  <div
                    key={obj._id}
                    className="req-user-con"
                    style={{
                      opacity: `${
                        buttonLoading
                          ? buttonLoading === obj._id
                            ? 0.6
                            : 1
                          : 1
                      }`,
                    }}
                  >
                    <div className="req-user-first">
                      <img src={obj.from.profilePhoto} alt="" />
                    </div>
                    <div className="req-user-second">
                      <div
                        className="req-user-fullname"
                        onClick={() => {
                          navigate(`/profile/${obj.from._id}`);
                        }}
                      >
                        <p>{obj.from.fullName}</p>
                        {obj.from.verified ? (
                          <span>
                            <RiVerifiedBadgeFill />
                          </span>
                        ) : (
                          <span></span>
                        )}
                      </div>
                      <p className="req-user-username">@{obj.from.userName}</p>
                      <p className="req-user-bio">{obj.from.bio}</p>
                      {acceptRequest.includes(obj._id) ? (
                        <div className="req-buts">
                          <button
                            style={{
                              backgroundColor: "#3b82f6",
                            }}
                            onClick={() => {
                              followBack(obj.from._id);
                            }}
                          >
                            Follow Back
                          </button>
                        </div>
                      ) : (
                        <div className="req-buts">
                          <button
                            onClick={() => {
                              AcceptFollowRequest(obj._id, obj.from._id);
                            }}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              DeclineFollowRequest(obj._id);
                            }}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      <p className="req-user-time">
                        {getRelativeTimeShort(obj.createdAt)} ago
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Request;
