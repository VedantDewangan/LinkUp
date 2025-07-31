import { User } from "../../Database/Model/UserModel.js";

export const SaveUnsavePost = async (req, res) => {
  try {
    const { user } = req.user;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Please provide the post id",
      });
    }

    const fetchedUser = await User.findById(user._id);
    if (!fetchedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const index = fetchedUser.savedPost.indexOf(id);
    let message = "";

    if (index > -1) {
      fetchedUser.savedPost = fetchedUser.savedPost.filter(
        (item) => item.toString() !== id
      );
      message = "Post unsaved successfully";
    } else {
      fetchedUser.savedPost.push(id);
      message = "Post saved successfully";
    }

    await fetchedUser.save();

    res.status(200).json({
      message,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
