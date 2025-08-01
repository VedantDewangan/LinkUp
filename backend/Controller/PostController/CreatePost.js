import { Post } from "../../Database/Model/PostModel.js";

export const createPost = async (req, res) => {
  try {
    const { caption, image_link, isReel } = req.body;
    const { user } = req.user;
    if (!caption) {
      return res.status(400).json({
        message: "Please proivde the caption",
      });
    }
    if (!image_link) {
      return res.status(400).json({
        message: "Please proivde the image Link",
      });
    }
    await Post.create({
      caption: caption,
      postImageURL: image_link,
      user: user._id,
      isReel: isReel,
    });
    return res.status(201).json({
      message: "Image Posted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
