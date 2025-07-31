import express from "express";
import isLogin from "../middleware/isLogin.js";
import { getMyNotification } from "../Controller/NotificationController/getMyNotification.js";
import { deleteNotification } from "../Controller/NotificationController/deleteNotification.js";

const NotificationRoute = express.Router();

NotificationRoute.get("/get-notification", isLogin, getMyNotification);
NotificationRoute.delete(
  "/delete-notification/:id",
  isLogin,
  deleteNotification
);

export default NotificationRoute;
