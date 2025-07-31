import { User } from "../../Database/Model/UserModel.js";

export const GetUserDetail = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: "Please provide user id",
      });
    }

    const data = await User.findById(id).populate({
      path: "savedPost",
      populate: {
        path: "user", // this should match the field name in each savedPost object that holds the user reference
      },
    });

    res.status(200).json(data);
  } catch (error) {
    console.log("Error in get user details");
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
