import { FollowRequest } from "../../Database/Model/FollowRequest.js";
import { User } from "../../Database/Model/UserModel.js";

export const SendFollowRequest = async (req, res) => {
  try {
    const { user } = req.user;
    const { to } = req.body;

    const AlreadyFollowRequest = await FollowRequest.findOne({
      to: to,
      from: user._id,
    });
    if (!to) {
      res.status(400).json({
        message: "Please provide all data",
      });
      return;
    }
    if (to === user._id) {
      res.status(400).json({
        message: "You can not send follow request to yourself",
      });
      return;
    }

    const otherUser = await User.findOne({ _id: to });

    if (user.following.includes(to) || otherUser.followers.includes(user._id)) {
      res.status(400).json({
        message: "You already follow the user",
      });
      return;
    }
    if (AlreadyFollowRequest) {
      res.status(200).json({
        message: "Follow Request already sent",
      });
      return;
    }
    await FollowRequest.create({
      to: to,
      from: user._id,
    });
    res.status(201).json({
      message: "Follow Request Send",
    });
    return;
  } catch (error) {
    console.log("Error in getting follow Request");
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};
