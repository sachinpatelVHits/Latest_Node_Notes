const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require('dotenv').config()

var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "faac71f6f23688",
        pass: "28b7b18d88bf01"
    }
});

//#region reset password Mail of User 
exports.resetPasswordMailforAdmin = (data) => {
    let to = [data.email];
    const userName = data.adminName;
    const forgotId = data.resetPassword.forgotId;
    ejs.renderFile(
        path.join(__dirname, "../templates/ForgotPasswordMail.ejs"),
        { userName, forgotId },
        (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const mailOptions = {
                    from: process.env.USER_FROM,
                    to: to,
                    subject: "Reset password link",
                    html: data,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Message sent");

                    }
                });
            }
        }
    );
};
//#endregion