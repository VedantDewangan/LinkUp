import { Conversation } from "../../Database/Model/Conversation.js";

export const GetConversation = async (req, res) => {
  try {
    const { user } = req.user;

    const data = await Conversation.find({
      users: { $in: [user._id] },
    })
      .populate("users")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      data,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
