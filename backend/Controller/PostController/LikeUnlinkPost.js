import { Notification } from "../../Database/Model/Notification.js";
import { Post } from "../../Database/Model/PostModel.js";

export const LikeUnLike = async (req, res) => {
  try {
    const { id } = req.body;
    const { user } = req.user;

    if (!id) {
      return res.status(400).json({
        message: "Please provide the post id",
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const liked = post.likes.includes(user._id);

    if (liked) {
      post.likes = post.likes.filter(
        (uid) => uid.toString() !== user._id.toString()
      );
    } else {
      post.likes.push(user._id);
      if (post.user._id.toString() !== user._id.toString()) {
        await Notification.create({
          to: post.user._id,
          from: user._id,
          type: "like",
          notification: "liked on your post",
        });
      }
    }

    await post.save();

    return res.status(200).json({
      message: liked ? "Post unliked successfully" : "Post liked successfully",
    });
  } catch (error) {
    console.log("Error in LikeUnLike controller:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
