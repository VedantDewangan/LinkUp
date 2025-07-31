import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Message.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import socket from "../../socket";

function Message() {
  const { id } = useParams();
  const [otherUser, setOther] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allMessage, setAllMessage] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessage]);

  useEffect(() => {
    const getAllMessage = async () => {
      try {
        const conversationResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/message/get-conversation`,
          { withCredentials: true }
        );
        let include = false;
        conversationResponse.data.data.forEach((element) => {
          element._id === id ? (include = true) : null;
        });
        if (!include) {
          navigate("/message");
        }
        setOther(
          conversationResponse.data.data
            .filter((item) => item._id === id)[0]
            .users.filter((item) => item._id !== user._id)[0]
        );
        const messageResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/message/getMessage?id=${id}`,
          { withCredentials: true }
        );
        setAllMessage(messageResponse.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllMessage();
  }, []);

  function formatToIndianTime(isoString) {
    const date = new Date(isoString);

    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };

    const formatter = new Intl.DateTimeFormat("en-IN", options);
    return formatter.format(date).toLowerCase(); // returns like '11:45 pm'
  }

  const sendMessage = async () => {
    if (messageLoading) return;
    if (message.trim() === "") return;
    setMessageLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/message/send-message`,
        {
          id: id,
          message: message,
        },
        { withCredentials: true }
      );
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/message/update-conversation`,
        { id: id, message: message },
        { withCredentials: true }
      );
      setMessage("");
      socket.emit("send-message", {
        ...data.newMessage,
        from: { _id: data.newMessage.from },
      });
      setAllMessage((prev) => [
        ...prev,
        {
          ...data.newMessage,
          from: { _id: data.newMessage.from },
        },
      ]);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setMessageLoading(false);
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data.to === id) {
        setAllMessage((prev) => [...prev, data]);
      }
    };

    socket.on("recive-message", handleReceiveMessage);

    return () => {
      socket.off("recive-message", handleReceiveMessage);
    };
  }, [id]);

  return (
    <div className="page">
      <Navbar page={"Message"} />
      <div className="all-post-container-home" style={{ padding: 0 }}>
        <div className="message-con-1">
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-arrow-left"
            onClick={() => {
              window.history.back();
            }}
          ></i>
          <img src={otherUser?.profilePhoto} alt="" />
          <p>@{otherUser?.userName}</p>
        </div>
        <div className="message-con-2">
          {allMessage.map((obj) => {
            return (
              <div
                key={obj._id}
                className={
                  obj.from._id === user._id ? "send-message" : "recive-message"
                }
              >
                <p>{obj.message}</p>
                <p>{formatToIndianTime(obj.createdAt)}</p>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="message-con-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            style={{
              opacity: `${messageLoading ? 0.6 : 1}`,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;
