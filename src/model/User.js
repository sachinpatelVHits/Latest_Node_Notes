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
    password: {
      type: String,
      required: false,
    },
    resetPassword: {
      forgotId: {
        type: String,
        default: null,
        required: false,
      },
      ExpiresIn: {
        type: Date,
        required: false,
      },
    },
    otpVerify: {
      otp: {
        type: Number,
        required: false,
      },
      ExpiresIn: {
        type: Date,
        required: false,
      },
    },
    isAccountVerified: {
      type: Number,
      required: false,
      default: 0,
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