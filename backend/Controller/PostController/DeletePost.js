import { Post } from "../../Database/Model/PostModel.js";
import { User } from "../../Database/Model/UserModel.js";

export const DeletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Please provide the post id",
      });
    }

    await Post.deleteOne({ _id: id });

    const allUsers = await User.find();

    const updatePromises = allUsers.map(async (user) => {
      user.savedPost = user.savedPost.filter(
        (postId) => postId.toString() !== id.toString()
      );
      return user.save();
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      message: "Post deleted and removed from all saved lists successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
