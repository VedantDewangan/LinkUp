import { Message } from "../../Database/Model/Message.js";

export const SendMessage = async (req, res) => {
  try {
    const { user } = req.user;
    const { id, message } = req.body;

    if (!id || !message) {
      return res
        .status(400)
        .json({ message: "Conversation ID and Message is required" });
    }

    const msg = await Message.create({
      from: user._id,
      to: id,
      message: message,
    });

    res.status(200).json({ message: "Message sent", newMessage: msg });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
