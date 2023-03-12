const express= require('express');
const router = express.Router();
const AdminController  = require('../controller/AdminController');

router.post('/admin/register', AdminController.registerAdmin)
router.post('/admin/login', AdminController.login)
router.post('/admin/forgot-password', AdminController.forgotPassword)
router.post('/admin/reset-password', AdminController.resetPassword)

module.exports = router;