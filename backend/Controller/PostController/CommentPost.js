import { Notification } from "../../Database/Model/Notification.js";
import { Post } from "../../Database/Model/PostModel.js";

export const CommentPost = async (req, res) => {
  try {
    const { user } = req.user;
    const { comment, id } = req.body;
    if (!comment) {
      return res.status(400).json({
        message: "Please Enter Comment",
      });
    }
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

    const now = new Date();

    post.comments.push({
      comment: comment,
      userId: user._id,
      timeInfo: {
        date: now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }), // e.g., "12 Aug 2024"
        time: now.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }), // e.g., "12:05 pm"
      },
    });

    await post.save();

    if (post.user._id.toString() !== user._id.toString()) {
      await Notification.create({
        to: post.user._id,
        from: user._id,
        type: "comment",
        notification: "commented on your post",
      });
    }

    return res.status(201).json({
      message: "Comment Add in the post",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
