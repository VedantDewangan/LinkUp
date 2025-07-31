import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: "Say Hii... and start Conversation",
    },
  },
  {
    timestamps: true,
  }
);

export const Conversation = mongoose.model("Conversations", ConversationSchema);
