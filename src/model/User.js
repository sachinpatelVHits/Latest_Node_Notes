const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    otp: {
      type: Number,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    forgotId: {
      type: String,
      default: null,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    deleteStatus: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;