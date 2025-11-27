const express = require('express');
const router = express.Router();
const { authenticate, sendOTP, verifyOTPCode, resetPassword } = require('../controllers/authController');
const { requireOTP } = require('../middlewares/authMiddleware');
const { validateFields } = require('../middlewares/validateFields');
const { validateUserId, validatePassword, validateEmail, validateOTP } = require('../utils/validator');


// Xác thực người dùng
router.post('/authenticate', validateFields({
    userId: { required: true, fn: validateUserId, message: "Invalid userId format" },
    password: { required: true, fn: validatePassword, message: "Invalid password format" }
}), authenticate);
// Gửi mã OTP
router.post('/sendOTP', validateFields({
    email: { required: true, fn: validateEmail, message: "Invalid email format" }
}), sendOTP);
// Xác minh mã OTP
router.post('/verifyOTP', validateFields({
    email: { required: true, fn: validateEmail, message: "Invalid email format" },
    otp: { required: true, fn: validateOTP, message: "Invalid OTP format" }
}), verifyOTPCode);
// Đặt lại mật khẩu
router.post('/resetPassword', requireOTP, validateFields({
    newPassword: { required: true, fn: validatePassword, message: "Invalid password format" }
}), resetPassword);


module.exports = router;