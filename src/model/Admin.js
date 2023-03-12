const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    adminType: {
        //Super Admin 0, Sub Admin 1
        type: Number,
        required: false,
    },
    adminName: {
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
    deleteStatus: {
        type: Number,
        required: false,
        default: 0,
    },
}, { timestamps: true });

const AdminModel = mongoose.model("Admin", adminSchema);
module.exports = AdminModel;