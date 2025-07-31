import { User } from "../../Database/Model/UserModel.js";

export const SearchUser = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const regex = new RegExp(name, "i"); // case-insensitive match

    const users = await User.find({
      $or: [{ fullName: { $regex: regex } }, { username: { $regex: regex } }],
    });

    return res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log("Error in get user details");
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
