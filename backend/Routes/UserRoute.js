import express from "express";
import { updateBio } from "../Controller/UserController/updateBio.js";
import { updateProfilePhoto } from "../Controller/UserController/updateProfilePhoto.js";
import { updatePassword } from "../Controller/UserController/updatePassword.js";
import isLogin from "../middleware/isLogin.js";
import { SearchUser } from "../Controller/UserController/SearchUser.js";
import { GetUserDetail } from "../Controller/UserController/GetUserDetail.js";
import { GetMe } from "../Controller/UserController/GetMe.js";
import { UpdateLink } from "../Controller/UserController/UpdateLink.js";
import { GetFollowerFollowing } from "../Controller/UserController/GetFollowerFollowing.js";

const UserRoute = express.Router();

UserRoute.put("/update/bio", isLogin, updateBio);
UserRoute.put("/update/verify-link", UpdateLink);
UserRoute.put("/update/profile-photo", isLogin, updateProfilePhoto);
UserRoute.put("/update/password", isLogin, updatePassword);
UserRoute.get("/search", isLogin, SearchUser);
UserRoute.get("/userDetails", isLogin, GetUserDetail);
UserRoute.get("/get-me", isLogin, GetMe);
UserRoute.get("/followers", isLogin, GetFollowerFollowing);

export default UserRoute;
