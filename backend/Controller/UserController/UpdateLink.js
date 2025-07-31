import { User } from "../../Database/Model/UserModel.js";

export const UpdateLink = async (req, res) => {
  try {
    const id = req.body._id;

    await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        verified: true,
      }
    );
    res.status(200).json({
      message: "Email verified",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
