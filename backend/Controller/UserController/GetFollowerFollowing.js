import { User } from "../../Database/Model/UserModel.js";

export const GetFollowerFollowing = async (req, res) => {
  try {
    const { user } = req.user;

    const follower = (
      await User.findOne({ _id: user._id }).populate("followers")
    ).followers;
    const following = (
      await User.findOne({ _id: user._id }).populate("following")
    ).following;
    return res.status(200).json({
      follower,
      following,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
