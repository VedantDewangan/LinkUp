import express from "express";
import isLogin from "../middleware/isLogin.js";
import { SendFollowRequest } from "../Controller/FollowRequestController/SendFollowRequest.js";
import { GetFollowRequest } from "../Controller/FollowRequestController/GetFollowRequest.js";
import { AcceptFollowRequest } from "../Controller/FollowRequestController/AcceptFollowRequest.js";
import { RejectFollowRequest } from "../Controller/FollowRequestController/RejectFollowRequest.js";

const FollowRequestRoute = express.Router();

FollowRequestRoute.post("/send-follow-request", isLogin, SendFollowRequest);
FollowRequestRoute.get("/get-follow-request", isLogin, GetFollowRequest);
FollowRequestRoute.delete(
  "/accept-follow-request/:id",
  isLogin,
  AcceptFollowRequest
);
FollowRequestRoute.delete(
  "/reject-follow-request/:id",
  isLogin,
  RejectFollowRequest
);

export default FollowRequestRoute;
