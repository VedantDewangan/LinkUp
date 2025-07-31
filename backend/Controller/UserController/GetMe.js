import { User } from "../../Database/Model/UserModel.js";

export const GetMe = async (req, res) => {
  try {
    const { user } = req.user;
    const data = await User.findById(user._id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};
