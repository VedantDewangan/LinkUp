import express from "express";
import { Login } from "../Controller/AuthController/Login.js";
import { Register } from "../Controller/AuthController/Register.js";
import { Logout } from "../Controller/AuthController/Logout.js";
import isLogin from "../middleware/isLogin.js";

const authRoute = express.Router();

authRoute.post("/register", Register);
authRoute.post("/login", Login);
authRoute.post("/logout", isLogin, Logout);

export default authRoute;
