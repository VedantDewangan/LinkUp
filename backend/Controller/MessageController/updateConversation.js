import { Conversation } from "../../Database/Model/Conversation.js";

export const updateConversation = async (req, res) => {
  try {
    const { id, message } = req.body;
    await Conversation.findOneAndUpdate(
      {
        _id: id,
      },
      {
        lastMessage: message,
      }
    );
    res.status(200).json({
      message: "Last message updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
