import { User } from "../../Database/Model/UserModel.js";
import bcrypt from "bcryptjs";

export const Register = async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  try {
    if (!userName || !fullName || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    if (userName.length < 3 || fullName.length < 3 || password.length < 8) {
      return res.status(400).json({
        message: "Please enter valid data",
      });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const existingUserByUsername = await User.findOne({ userName });
    if (existingUserByUsername) {
      return res.status(400).json({
        message: "Username not available",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      userName,
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Error in Register controller:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
