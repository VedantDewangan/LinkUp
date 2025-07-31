import { Message } from "../../Database/Model/Message.js";

export const GetMessage = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    const data = await Message.find({ to: id }).populate("to from");

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
