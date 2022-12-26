const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: String,
    profileImg: {
      public_id: String,
      url: String,
    },
    email: String,
    password: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
