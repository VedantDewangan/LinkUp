import "./Navbar.css";
import { MdLogout } from "react-icons/md";
import { MdElectricBolt } from "react-icons/md";
import { MdHome } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { MdNotifications } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { MdExplore } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import socket from "../../socket";
import toast from "react-hot-toast";

function Navbar({ page }) {
  const { user, setUser } = useAuth();
  const [notification, setNotification] = useState([]);
  const [followRequest, setFollowRequest] = useState([]);

  const getNotification = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notification/get-notification`,
        { withCredentials: true }
      );
      setNotification(data.notifications);
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowRequest = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/follow-request/get-follow-request`,
        { withCredentials: true }
      );
      setFollowRequest(data.followRequests);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotification();
    getFollowRequest();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const arr = useMemo(
    () => [
      {
        link: "/",
        name: "Home",
        span: <MdHome />,
        num: 0,
      },
      {
        link: "/explore",
        name: "Explore",
        span: <MdExplore />,
        num: 0,
      },
      {
        link: "/search",
        name: "Search",
        span: <FaSearch />,
        num: 0,
      },
      {
        link: "/message",
        name: "Message",
        span: <FaMessage />,
        num: 0,
      },
      {
        link: "/notification",
        name: "Notification",
        span: <MdNotifications />,
        num: notification.length,
      },
      {
        link: "/request",
        name: "Request",
        span: <FaUserFriends />,
        num: followRequest.length,
      },
      {
        link: `/profile/${user._id}`,
        name: "Profile",
        span: <FaUser />,
        num: 0,
      },
    ],
    [notification, followRequest]
  );

  useEffect(() => {
    socket.on("recive-notification", (data) => {
      if (data.to === user._id) {
        setNotification((prev) => [...prev, { data }]);
      }
    });

    socket.on("recive-request", (data) => {
      console.log(data);

      if (data.to === user._id) {
        setFollowRequest((prev) => [...prev, { data }]);
      }
    });
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-up">
          <div className="logo">
            <span>
              <MdElectricBolt />
            </span>
            <Link to={"/"}>LinkUp</Link>
          </div>
          <hr className="navbar-line" />
          {arr.map((obj, i) => {
            return (
              <div
                key={i}
                className={`${page === obj.name ? "active" : "not-active"}`}
                onClick={() => {
                  navigate(`${obj.link}`);
                }}
              >
                <span>{obj.span}</span>
                <Link to={obj.link}>{obj.name}</Link>
                {obj.num !== 0 ? (
                  <div
                    id="red-dot"
                    style={{
                      display: `${page === obj.name ? "none" : "flex"}`,
                    }}
                  >
                    {obj.num}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="navbar-down">
          <button onClick={logout}>
            <span>
              <MdLogout />
            </span>
            <p>Logout</p>
          </button>
        </div>
      </div>
      <div
        id="mobile-notification-red-dot"
        style={{
          display: `${notification.length === 0 ? "none" : "flex"}`,
          height: "20px",
          width: "20px",
        }}
      >
        {notification.length}
      </div>
      <div
        id="mobile-follow-red-dot"
        style={{
          display: `${followRequest.length === 0 ? "none" : "flex"}`,
          height: "20px",
          width: "20px",
        }}
      >
        {followRequest.length}
      </div>
      <div className="mobile-navbar" id="navbar-top">
        <p
          onClick={() => {
            navigate("/");
          }}
        >
          LU
        </p>
        <div>
          <i
            style={{
              opacity: `${page === "Notification" ? 1 : 0.7}`,
            }}
            className={`fa-solid fa-bell ${
              page === "Notification" ? "mobile-active" : null
            }`}
            onClick={() => {
              navigate("/notification");
            }}
          ></i>

          <i
            style={{
              opacity: `${page === "Message" ? 1 : 0.7}`,
            }}
            className={`fa-solid fa-message ${
              page === "Message" ? "mobile-active" : null
            }`}
            onClick={() => {
              navigate("/message");
            }}
          ></i>
        </div>
      </div>
      <div className="mobile-navbar" id="navbar-bottom">
        <i
          style={{
            opacity: `${page === "Home" ? 1 : 0.7}`,
          }}
          className={`fa-solid fa-house ${
            page === "Home" ? "mobile-active" : null
          }`}
          onClick={() => {
            navigate("/");
          }}
        ></i>
        <i
          style={{
            opacity: `${page === "Explore" ? 1 : 0.7}`,
          }}
          className={`fa-solid fa-compass ${
            page === "Explore" ? "mobile-active" : null
          }`}
          onClick={() => {
            navigate("/explore");
          }}
        ></i>
        <i
          style={{
            opacity: `${page === "Search" ? 1 : 0.7}`,
          }}
          className={`fa-solid fa-magnifying-glass ${
            page === "Search" ? "mobile-active" : null
          }`}
          onClick={() => {
            navigate("/search");
          }}
        ></i>
        <i
          style={{
            opacity: `${page === "Request" ? 1 : 0.7}`,
          }}
          className={`fa-solid fa-users ${
            page === "Request" ? "mobile-active" : null
          }`}
          onClick={() => {
            navigate("/request");
          }}
        ></i>
        <i
          style={{
            opacity: `${page === "Profile" ? 1 : 0.7}`,
          }}
          className={`fa-solid fa-user ${
            page === "Profile" ? "mobile-active" : null
          }`}
          onClick={() => {
            navigate(`/profile/${user._id}`);
          }}
        ></i>
        <i
          style={{
            opacity: 0.7,
          }}
          className={`fa-solid fa-arrow-right-from-bracket`}
          onClick={logout}
        ></i>
      </div>
    </>
  );
}

export default Navbar;
