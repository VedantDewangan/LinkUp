import express from "express";
import isLogin from "../middleware/isLogin.js";
import { GetConversation } from "../Controller/MessageController/GetConversation.js";
import { GetMessage } from "../Controller/MessageController/GetMessage.js";
import { SendMessage } from "../Controller/MessageController/sendMessage.js";
import { updateConversation } from "../Controller/MessageController/updateConversation.js";

const MessageRoute = express.Router();

MessageRoute.get("/get-conversation", isLogin, GetConversation);
MessageRoute.get("/getMessage", isLogin, GetMessage);
MessageRoute.post("/send-message", isLogin, SendMessage);
MessageRoute.put("/update-conversation", isLogin, updateConversation);

export default MessageRoute;
