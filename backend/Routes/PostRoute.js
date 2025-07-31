import express from "express";
import isLogin from "../middleware/isLogin.js";
import { getAllPost } from "../Controller/PostController/getAllPost.js";
import { createPost } from "../Controller/PostController/CreatePost.js";
import { LikeUnLike } from "../Controller/PostController/LikeUnlinkPost.js";
import { CommentPost } from "../Controller/PostController/CommentPost.js";
import { DeletePost } from "../Controller/PostController/DeletePost.js";
import { SaveUnsavePost } from "../Controller/PostController/SaveUnSavePost.js";

const postRoute = express.Router();

postRoute.get("/getPost", isLogin, getAllPost);
postRoute.post("/createPost", isLogin, createPost);
postRoute.put("/like-unlike", isLogin, LikeUnLike);
postRoute.post("/add-comment", isLogin, CommentPost);
postRoute.put("/save-unsave", isLogin, SaveUnsavePost);
postRoute.delete("/deletePost/:id", isLogin, DeletePost);

export default postRoute;
