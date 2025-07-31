import { Notification } from "../../Database/Model/Notification.js";

export const getMyNotification = async (req, res) => {
  try {
    const { user } = req.user;
    const data = await Notification.find({ to: user._id })
      .sort({
        createdAt: -1,
      })
      .populate("from", "-password");
    res.status(200).json({
      notifications: data,
    });
  } catch (error) {
    console.log("Error in get notification");
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};
