import { Conversation } from "../../Database/Model/Conversation.js";
import { FollowRequest } from "../../Database/Model/FollowRequest.js";

export const AcceptFollowRequest = async (req, res) => {
  try {
    const { user } = req.user;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Follow request not found",
      });
    }

    const followRequest = await FollowRequest.findById(id).populate("to from");

    if (!followRequest) {
      return res.status(404).json({
        message: "Follow request does not exist",
      });
    }

    const { to, from } = followRequest;

    if (to._id.toString() !== user._id.toString()) {
      return res.status(400).json({
        message: "You can not accept the follow request",
      });
    }

    if (to.followers.includes(from._id) || from.following.includes(to._id)) {
      return res.status(200).json({
        message: "Already following",
      });
    }

    to.followers.push(from._id);
    await to.save();

    from.following.push(to._id);
    await from.save();

    await FollowRequest.findByIdAndDelete(id);

    const existingConversation = await Conversation.findOne({
      users: { $all: [to._id, from._id], $size: 2 },
    });

    if (!existingConversation) {
      await Conversation.create({
        users: [to._id, from._id],
      });
    }

    return res.status(200).json({
      message: "Follow request accepted",
    });
  } catch (error) {
    console.error("Error in accepting follow request:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
