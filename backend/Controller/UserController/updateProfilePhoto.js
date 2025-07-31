import { User } from "../../Database/Model/UserModel.js";
import axios from "axios";
import FormData from "form-data";

export const updateProfilePhoto = async (req, res) => {
  try {
    const { user } = req.user;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        message: "Please provide the image",
      });
    }

    // const apiKey = "0af3cfa29c3d69f05c167ad66b693281";

    // const formData = new FormData();
    // formData.append("image", image);

    // const response = await axios.post(
    //   `https://api.imgbb.com/1/upload?key=${apiKey}`,
    //   formData,
    //   {
    //     headers: formData.getHeaders(),
    //   }
    // );
    // response.data.data.display_url

    await User.findOneAndUpdate({ email: user.email }, { profilePhoto: image });

    return res.status(200).json({
      message: "Profile photo updated successfully",
    });
  } catch (error) {
    console.log("Error in updating the profile photo:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
