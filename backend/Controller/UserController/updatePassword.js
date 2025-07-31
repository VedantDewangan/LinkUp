import bcrypt from "bcryptjs";
import { User } from "../../Database/Model/UserModel.js";

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { user } = req.user;
    if (!oldPassword || !newPassword) {
      res.status(400).json({
        message: "Please provide credentisal",
      });
      return;
    }
    const correctPasssword = await bcrypt.compare(oldPassword, user.password);

    if (!correctPasssword) {
      res.status(400).json({
        message: "Wrong password",
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        message: "Password length should be atleast 8 characters",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await User.findOneAndUpdate(
      {
        email: user.email,
      },
      {
        password: hashedPassword,
      }
    );

    res.status(200).json({
      message: "Password updated successfully",
    });
    return;
  } catch (error) {
    console.log("Error in updating the bio");
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};
