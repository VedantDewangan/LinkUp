import { Post } from "../../Database/Model/PostModel.js";

export const getAllPost = async (req, res) => {
  try {
    const data = await Post.find()
      .populate("user")
      .populate("comments.userId")
      .sort({ createdAt: -1 });
    res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
