import { Notification } from "../../Database/Model/Notification.js";

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.log("Error in delete notification");
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
