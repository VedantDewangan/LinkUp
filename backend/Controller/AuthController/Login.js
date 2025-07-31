import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../Database/Model/UserModel.js";
import dotenv from "dotenv";

dotenv.config();

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter all the credentials",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Login successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error in login user", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
