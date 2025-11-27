const express = require('express');
const router = express.Router();
const {createUserReport} = require('../controllers/reportController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Tạo báo cáo người dùng (Admin hoặc người dùng hiện tại)
router.get('/createUserReport/:userId?', authMiddleware, createUserReport);

module.exports = router;