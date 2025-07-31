import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Conversation.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import img from "../../asset/ai-bot.png";
import socket from "../../socket";

function Conversation() {
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getAllConversation = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/message/get-conversation`,
          { withCredentials: true }
        );
        setConversation(data.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    getAllConversation();
    socket.on("update-last-message", (data) => {
      setConversation((prev) => {
        // Update the matching item
        const updated = prev.map((item) =>
          item._id === data.to ? { ...item, lastMessage: data.message } : item
        );

        // Reorder: bring matched item to the front
        const reordered = [
          ...updated.filter((item) => item._id === data.to),
          ...updated.filter((item) => item._id !== data.to),
        ];

        return reordered;
      });
    });
  }, []);

  return (
    <div className="page">
      <Navbar page={"Message"} />
      <div
        id="conversation-page"
        className="all-post-container-home con-con-con"
      >
        <img
          src={img}
          className="ai-bot"
          alt=""
          onClick={() => {
            navigate("/ai");
          }}
        />
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <p>Loading...</p>
          </div>
        ) : conversation.length === 0 ? (
          <div className="no-conversation-con">
            <i className="fa-solid fa-comments"></i>
            <p style={{ fontSize: "1.6rem" }}>No Conversations</p>
            <p>Follow people and start texting...😏</p>
          </div>
        ) : (
          <div className="all-conversation-con">
            {conversation.map((obj) => {
              const otherUser = obj.users.filter(
                (item) => item._id !== user._id
              )[0];
              return (
                <div
                  key={obj._id}
                  className="each-conversation"
                  onClick={() => {
                    navigate(`/message/${obj._id}`);
                  }}
                >
                  <img src={otherUser.profilePhoto} alt="" />
                  <div id="last-msg-details">
                    <p id="username-p-1">@{otherUser.userName}</p>
                    <p id="last-msg-p-2">
                      {obj.lastMessage ? obj.lastMessage : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Conversation;
