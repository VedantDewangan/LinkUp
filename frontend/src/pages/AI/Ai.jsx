import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Ai.css";
import img from "../../asset/ai-bot.png";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Ai() {
  const messagesEndRef = useRef();
  const [allMessage, setAllMessage] = useState([]);
  const [message, setMessage] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessage]);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    if (allMessage.length === 0) {
      setAllMessage([
        {
          from: "ai",
          message:
            "Hi there! 👋 I'm your social media assistant. Ask me anything—how to grow your audience, create engaging content, or even tips on what to post today!",
        },
      ]);
    }
  }, []);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const newUserMessage = { from: "user", message };
    setAllMessage((prev) => [...prev, newUserMessage]);
    setMessage("");

    const contextMessages = [...allMessage, newUserMessage]
      .slice(-20)
      .map((m) => `${m.from === "user" ? "User" : "AI"}: ${m.message}`)
      .join("\n");

    const prompt = `
You are a helpful AI assistant on a social media platform. Your role is to help users with content creation, growing their audience, increasing engagement, and staying updated with trends.

Respond briefly, clearly, and only to relevant queries. If something is off-topic, kindly decline.

Conversation history:
${contextMessages}

Now reply to the user's latest message.
`;

    try {
      setMessageLoading(true);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      setAllMessage((prev) => [...prev, { from: "ai", message: responseText }]);
    } catch (error) {
      console.error("AI response error:", error);
      setAllMessage((prev) => [
        ...prev,
        {
          from: "ai",
          message: "Sorry, I couldn't process that. Please try again later.",
        },
      ]);
    } finally {
      setMessageLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="all-post-container-home" style={{ padding: 0 }}>
        <div className="message-con-1">
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-arrow-left"
            onClick={() => window.history.back()}
          ></i>
          <img src={img} alt="" />
          <p>@Chat Bot</p>
        </div>

        <div className="message-con-2">
          {allMessage.map((obj, i) => (
            <div
              key={i}
              className={obj.from !== "ai" ? "send-message" : "recive-message"}
            >
              <p>{obj.message}</p>
              <p>{""}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-con-3">
          <input
            type="text"
            placeholder="Ask something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={messageLoading}
          />
          <button onClick={sendMessage} disabled={messageLoading}>
            {messageLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ai;
