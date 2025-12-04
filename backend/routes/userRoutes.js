const express = require('express');
const router = express.Router();
const { 
    initLedger, createUser, updateUserRole, 
    deactivateUser, reactivateUser, getUser, 
    getAllUsers, updatePassword, updateUserProfile, 
    deleteUser
} = require('../controllers/userController');
const { authMiddleware, requireAdmin, requireOTP } = require('../middlewares/authMiddleware');
const { validateFields } = require('../middlewares/validateFields');
const { validateUserId, validateEmail, validatePassword, validatePhone, validateUserRole, validateName } = require('../utils/validator');

// Khởi tạo dữ liệu ban đầu (Admin)
router.post('/initLedger', authMiddleware, requireAdmin, initLedger);
// Cập nhật vai trò người dùng (Admin)
router.put('/updateUserRole/:userId', authMiddleware, requireAdmin, validateFields({
    userId: { required: true, fn: validateUserId, message: "Invalid user ID format" },
    newRole: { required: true, fn: validateUserRole, message: "Invalid user role" }
}), updateUserRole);
// Vô hiệu hóa tài khoản người dùng (Admin)
router.put('/deactivateUser/:userId', authMiddleware, requireAdmin, validateFields({
    userId: { required: true, fn: validateUserId, message: "Invalid user ID format" }
}), deactivateUser);
// Kích hoạt lại tài khoản người dùng (Admin)
router.put('/reactivateUser/:userId', authMiddleware, requireAdmin, validateFields({
    userId: { required: true, fn: validateUserId, message: "Invalid user ID format" }
}), reactivateUser);
// Xóa tài khoản người dùng (Admin)
router.delete('/deleteUser/:userId', authMiddleware, requireAdmin, validateFields({
    userId: { required: true, fn: validateUserId, message: "Invalid user ID format" }
}), deleteUser);
// Lấy tất cả người dùng (Admin)
router.get('/getAllUsers', authMiddleware, requireAdmin, getAllUsers);


// Tạo tài khoản người dùng (Yêu cầu OTP)
router.post('/createUser', requireOTP, validateFields({
    userId: { required: true, fn: validateUserId, message: "Invalid user ID format" },
    name: { required: true, fn: validateName, message: "Invalid name format" },
    email: { required: true, fn: validateEmail, message: "Invalid email format" },
    password: { required: true, fn: validatePassword, message: "Invalid password format" },
    phone: { required: true, fn: validatePhone, message: "Invalid phone number format" }
}), createUser);
// Lấy thông tin người dùng hiện tại
router.get('/getUser', authMiddleware, getUser);
// Lấy thông tin người dùng theo ID (Admin)
router.get('/getUser/:userId', authMiddleware, requireAdmin, validateFields({
    userId: { required: true, fn: validateUserId, message: "Invalid user ID format" }
}), getUser);
// Cập nhật mật khẩu người dùng
router.put('/updatePassword', authMiddleware, validateFields({
    oldPassword: { required: true, fn: validatePassword, message: "Invalid password format" },
    newPassword: { required: true, fn: validatePassword, message: "Invalid password format" }
}), updatePassword);
// Cập nhật thông tin hồ sơ người dùng
router.put('/updateUserProfile', authMiddleware, validateFields({
    name: { required: true, fn: validateName, message: "Invalid name format" },
    phone: { required: true, fn: validatePhone, message: "Invalid phone number format" }
}), updateUserProfile);
// Cập nhật thông tin hồ sơ người dùng bởi Admin
router.put('/updateUserProfile/:userId', authMiddleware, requireAdmin, validateFields({
    userId: { required: true, fn: validateUserId, message: "Invalid user ID format" },
    name: { required: true, fn: validateName, message: "Invalid name format" },
    phone: { required: true, fn: validatePhone, message: "Invalid phone number format" }
}), updateUserProfile);





module.exports = router;