import { User } from "../../Database/Model/UserModel.js";

export const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    const { user } = req.user;

    if (!bio) {
      return res.status(400).json({
        message: "Please Enter Bio",
      });
    }

    await User.findOneAndUpdate(
      { email: user.email },
      { bio: bio },
      { new: true } // returns updated doc
    );

    return res.status(200).json({
      message: "Bio Updated Successfully",
    });
  } catch (error) {
    console.error("Error in updating the bio:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
