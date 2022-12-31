const mongoose = require("mongoose");
const userImageSchema = new mongoose.Schema(
  {
    avatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

const UserImage = mongoose.model("UserImage", userImageSchema);
module.exports = UserImage;
