import { FollowRequest } from "../../Database/Model/FollowRequest.js";

export const GetFollowRequest = async (req, res) => {
  try {
    const { user } = req.user;
    const data = await FollowRequest.find({
      to: user._id,
    }).populate("from");
    res.status(200).json({
      followRequests: data,
    });
  } catch (error) {
    console.log("Error in getting follow Request");
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};
