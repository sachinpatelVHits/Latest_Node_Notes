const User = require("../model/User");
const responseMessage = require("../utils/ResponseMessage.json");
const http = require("http");
const code = http.STATUS_CODES;
const { encryptPassword, createJwtToken } = require("../services/Functions");
const { resetPasswordMailforUser } = require("../config/MailService");
const bcrypt = require("bcryptjs");

//#region User Register First Time
exports.registerUser = async (req, res) => {
  try {
    let { userName, email, phoneNumber, password } = req.body;
    email = email.toLowerCase();
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(200).json({
        status: code[200],
        message: responseMessage.USER_ALREADY_EXIST,
        data: [],
      });
    } else {
      encrypt = await encryptPassword(password);
      const data = new User({
        userName,
        email,
        phoneNumber,
        password: encrypt,
      });
      let result = await data.save();
      if (result) {
        return res.status(201).json({
          status: code[201],
          message: responseMessage.USER_ACCOUNT_CREATED,
          data: result,
        });
      } else {
        return res.status(400).json({
          status: code[400],
          message: responseMessage.FAILED_TO_REGISTER_AS_USER,
          data: [],
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      status: code[500],
      message: responseMessage.INTERNAL_SERVER_ERROR,
      data: [err.message],
    });
  }
};
//#endregion

//#region login
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const existUser = await User.findOne({ email });
    if (existUser && existUser._id) {
      const validPassword = await bcrypt.compare(password, existUser.password);
      if (validPassword) {
        let payload = { userId: existUser._id };
        let token = await createJwtToken(payload);
        return res.status(200).json({
          status: code[200],
          message: responseMessage.USER_LOGGED_IN,
          data: { token, ...existUser._doc },
        });
      } else {
        res.status(401).json({
          status: code[401],
          message: responseMessage.INCORRECT_CREDENTIALS,
          data: [],
        });
      }
    } else {
      return res.status(404).json({
        status: code[404],
        message: responseMessage.USER_NOT_EXIST,
        data: [],
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: code[500],
      message: responseMessage.INTERNAL_SERVER_ERROR,
      data: [err.message],
    });
  }
};
//#endregion

//#region Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    email = email.toLowerCase();
    const existUser = await User.findOne({ email }, { password: false });
    if (existUser) {
      let forgotId = (Math.random() + 1).toString(36).substring(7);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      existUser.resetPassword.forgotId = forgotId;
      existUser.resetPassword.ExpiresIn = expiryDate;
      await existUser.save();

      resetPasswordMailforUser({
        status: code[200],
        message: responseMessage.FORGOT_PASSWORD_MAIL_SEND,
        data: existUser,
      });
    } else {
      res.status(404).json({
        status: code[400],
        message: responseMessage.USER_NOT_EXIST,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: code[500],
      message: responseMessage.INTERNAL_SERVER_ERROR,
      data: [err.message],
    });
  }
};
//#endregion

//#region resetPassword
exports.resetPassword = async (req, res) => {
  try {
    const { forgotId } = req.body;
    const existUser = await User.findOne({
      "resetPassword.forgotId": forgotId,
      "resetPassword.ExpiresIn": { $gt: Date.now() },
    });
    if (existUser) {
      const { newPassword } = req.body;
      let existPassword = await bcrypt.compare(newPassword, existUser.password);
      if (existPassword) {
        return res.status(400).json({
          status: code[400],
          message: responseMessage.PLEASE_USE_DIFFRENT_PASSWORD,
          data: [],
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(newPassword, salt);
      const result = await User.findByIdAndUpdate(
        { _id: existUser._id },
        {
          $set: {
            password: hashPass,
            "resetPassword.forgotId": null,
            "resetPassword.ExpiresIn": null,
          },
        },
        { new: true }
      );
      res.status(200).json({
        status: code[200],
        message: responseMessage.PASSWORD_CHANGED,
        data: result,
      });
    } else {
      res.status(404).json({
        status: code[404],
        message: responseMessage.RESET_LINK_IS_EXPIRED,
        data: [],
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: code[500],
      message: responseMessage.INTERNAL_SERVER_ERROR,
      data: [err.message],
    });
  }
};
//#endregion

//#region login with otp
exports.loginWithOtp = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const existUser = await User.findOne({ email });
    if (existUser && existUser._id) {
      const validPassword = await bcrypt.compare(password, existUser.password);
      if (validPassword) {
        // let payload = { userId: existUser._id };
        // let token = await createJwtToken(payload);
        let otp = Math.floor(100000 + Math.random() * 900000);
        existUser.otp = otp;
        await existUser.save();
        return res.status(200).json({
          status: code[200],
          message: responseMessage.USER_LOGGED_IN,
          // data: { token, ...existUser._doc },
          data: { ...existUser._doc },
        });
      } else {
        res.status(401).json({
          status: code[401],
          message: responseMessage.INCORRECT_CREDENTIALS,
          data: [],
        });
      }
    } else {
      return res.status(404).json({
        status: code[404],
        message: responseMessage.USER_NOT_EXIST,
        data: [],
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: code[500],
      message: responseMessage.INTERNAL_SERVER_ERROR,
      data: [err.message],
    });
  }
};
//#endregion