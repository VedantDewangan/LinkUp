import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
      minlength: 5,
    },
    postImageURL: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        comment: {
          type: String,
          required: true,
        },
        timeInfo: {
          type: Object,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Posts", PostSchema);
