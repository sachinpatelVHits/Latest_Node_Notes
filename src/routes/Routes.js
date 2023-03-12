const express= require('express');
const router = express.Router();
const AdminController  = require('../controller/AdminController');
const UserController  = require('../controller/UserController');

// admin side APIs
router.post('/admin/register', AdminController.registerAdmin)
router.post('/admin/login', AdminController.login)
router.post('/admin/forgot-password', AdminController.forgotPassword)
router.post('/admin/reset-password', AdminController.resetPassword)

// user side APIs
router.post('/user/register', UserController.registerUser)
router.post('/user/login', UserController.login)
router.post('/user/login-with-otp', UserController.loginWithOtp)
router.post('/user/resend-otp', UserController.resendOtp)
router.post('/user/verify-otp', UserController.verifyOtp)
router.post('/user/forgot-password', UserController.forgotPassword)
router.post('/user/reset-password', UserController.resetPassword)

module.exports = router;