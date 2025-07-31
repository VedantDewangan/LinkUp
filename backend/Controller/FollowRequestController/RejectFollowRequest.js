import { FollowRequest } from "../../Database/Model/FollowRequest.js";

export const RejectFollowRequest = async (req, res) => {
  try {
    const { user } = req.user;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Follow request ID is required",
      });
    }

    const followRequest = await FollowRequest.findById(id).populate("to");

    if (!followRequest) {
      return res.status(404).json({
        message: "Follow request does not exist",
      });
    }

    if (followRequest.to._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to reject this follow request",
      });
    }

    await FollowRequest.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Follow request rejected successfully",
    });
  } catch (error) {
    console.log("Error in rejecting follow request");
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
