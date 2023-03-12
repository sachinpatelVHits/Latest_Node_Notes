const Admin = require('../model/Admin')
const responseMessage = require("../utils/ResponseMessage.json");
const http = require("http");
const code = http.STATUS_CODES;
const { encryptPassword, createJwtToken } = require("../services/Functions")
const { resetPasswordMailforAdmin } = require('../config/MailService')
const bcrypt = require('bcryptjs')

//#region Admin Register First Time
exports.registerAdmin = async (req, res) => {
    try {
        let { adminName, email, phoneNumber, password } = req.body
        email = email.toLowerCase();
        const existAdmin = await Admin.findOne({ email })
        if (existAdmin) {
            return res.status(200).json({
                status: code[200],
                message: responseMessage.ADMIN_ALREADY_EXIST,
                data: [],
            })
        } else {
            encrypt = await encryptPassword(password)
            const data = new Admin({
                adminName,
                email,
                phoneNumber,
                password: encrypt
            })
            let result = await data.save()
            if (result) {
                return res.status(201).json({
                    status: code[201],
                    message: responseMessage.ADMIN_ACCOUNT_CREATED,
                    data: result,
                })
            } else {
                return res.status(400).json({
                    status: code[400],
                    message: responseMessage.FAILED_TO_REGISTER_AS_ADMIN,
                    data: [],
                })
            }
        }
    } catch (err) {
        return res.status(500).json({
            status: code[500],
            message: responseMessage.INTERNAL_SERVER_ERROR,
            data: [err.message],
        })
    }
}
//#endregion

//#region login
exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();
        const existAdmin = await Admin.findOne({ email });
        if (existAdmin && existAdmin._id) {
            const validPassword = await bcrypt.compare(
                password,
                existAdmin.password
            );
            if (validPassword) {
                let payload = { userId: existAdmin._id };
                let token = await createJwtToken(payload);
                return res.status(200).json({
                    status: code[200],
                    message: responseMessage.ADMIN_LOGGED_IN,
                    data: { token, ...existAdmin._doc },
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
                message: responseMessage.ADMIN_NOT_EXIST,
                data: [],
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: code[500],
            message: responseMessage.INTERNAL_SERVER_ERROR,
            data: [error.message],
        });
    }
};
//#endregion

//#region Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        let { email } = req.body;
        email = email.toLowerCase();
        const existAdmin = await Admin.findOne({ email }, { password: false });
        if (existAdmin) {
            let forgotId = (Math.random() + 1).toString(36).substring(7);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            existAdmin.resetPassword.forgotId = forgotId;
            existAdmin.resetPassword.ExpiresIn = expiryDate
            await existAdmin.save();

            resetPasswordMailforAdmin(existAdmin); // reset password email sent to Admin
            res.status(200).json({
                status: code[200],
                message: responseMessage.FORGOT_PASSWORD_MAIL_SEND,
                data: existAdmin,
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
    };
};
//#endregion

//#region resetPassword
exports.resetPassword = async (req, res) => {
    try {
        const { forgotId } = req.body
        const user = await Admin.findOne({ 'resetPassword.forgotId': forgotId, 'resetPassword.ExpiresIn': { $gt: Date.now() } });
        if (user) {
            const { newPassword } = req.body;
            let existPassword = await bcrypt.compare(newPassword, user.password);
            if (existPassword) {
                return res.status(400).json({
                    status: code[400],
                    message: responseMessage.PLEASE_USE_DIFFRENT_PASSWORD,
                    data: [],
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(newPassword, salt);
            const result = await Admin.findByIdAndUpdate(
                { _id: user._id },
                { $set: { password: hashPass, 'resetPassword.forgotId': null, 'resetPassword.ExpiresIn': null } },
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