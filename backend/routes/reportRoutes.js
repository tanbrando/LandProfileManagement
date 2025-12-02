const express = require('express');
const router = express.Router();
const {createUserReport} = require('../controllers/reportController');
const { authMiddleware, requireAdmin } = require('../middlewares/authMiddleware');
const { validateFields } = require('../middlewares/validateFields');
const { validateUserId } = require('../utils/validator');


// Tạo báo cáo người dùng hiện tại
router.get('/createUserReport', authMiddleware, createUserReport);
// Tạo báo cáo người dùng (Admin)
router.get('/createUserReport/:userId', authMiddleware, requireAdmin, validateFields({
    userId: { required: true, fn: validateUserId, message: "Invalid user ID format" }
}), createUserReport);

module.exports = router;