const express = require('express');
const router = express.Router();
const { 
    createTransaction, approveTransaction, rejectTransaction, 
    getAllTransactions, getTransaction, getTransactionsByUser,
    getTransactionStatusStatistics, getTransactionTypeStatistics, 
    cancelTransaction, getTransactionsByStatus, getTransactionsByType 
} = require('../controllers/transactionController');
const { authMiddleware, requireAdmin } = require('../middlewares/authMiddleware');
const { validateFields } = require('../middlewares/validateFields');
const { 
    validateLandId, validateUserId, validateLandValue, 
    validateTxType, validateTxId, validateDate, 
    validateTxStatus 
} = require('../utils/validator');

// Phê duyệt giao dịch (Admin)
router.post('/approveTransaction/:txId', authMiddleware, requireAdmin, validateFields({
    txId: { required: true, fn: validateTxId, message: "Invalid transaction ID format" }
}), approveTransaction);
// Từ chối giao dịch (Admin)
router.post('/rejectTransaction/:txId', authMiddleware, requireAdmin, validateFields({
    txId: { required: true, fn: validateTxId, message: "Invalid transaction ID format" }
}), rejectTransaction);
// Lấy tất cả giao dịch (Admin)
router.get('/getAllTransactions', authMiddleware, requireAdmin, getAllTransactions);
// Lấy giao dịch theo trạng thái (Admin)
router.get('/getTransactionsByStatus/:status', authMiddleware, requireAdmin, validateFields({
    status: { required: true, fn: validateTxStatus, message: "Transaction status is required" }
}), getTransactionsByStatus);
// Lấy giao dịch theo loại (Admin)
router.get('/getTransactionsByType/:loaiGiaoDich', authMiddleware, requireAdmin, validateFields({
    loaiGiaoDich: { required: true, fn: validateTxType, message: "Transaction type is required" }
}), getTransactionsByType);
// Thống kê trạng thái giao dịch (Admin)
router.get('/getTransactionStatusStatistics', authMiddleware, requireAdmin, getTransactionStatusStatistics);
// Thống kê loại giao dịch (Admin)
router.get('/getTransactionTypeStatistics', authMiddleware, requireAdmin, getTransactionTypeStatistics);

// Tạo giao dịch
router.post('/createTransaction', authMiddleware, validateFields({
    maSo : { required: true, fn: validateLandId, message: "Invalid land ID format" },
    chuSoHuuCu : { required: true, fn: validateUserId, message: "Invalid old owner ID format" },
    chuSoHuuMoi : { required: true, fn: validateUserId, message: "Invalid new owner ID format" },
    giaTri : { required: true, fn: validateLandValue, message: "Invalid land value" },
    loaiGiaoDich : { required: true, fn: validateTxType, message: "Invalid transaction type" },
    thoiGian : { required: true, fn: validateDate, message: "Transaction time is required" }
}), createTransaction);
// Lấy chi tiết giao dịch
router.get('/getTransaction/:txId', authMiddleware, validateFields({
    txId: { required: true, fn: validateTxId, message: "Invalid transaction ID format" }
}), getTransaction);
// Lấy giao dịch theo người dùng hiện tại
router.get('/getTransactionsByUser', authMiddleware, getTransactionsByUser);
// Lấy tất cả giao dịch của một người dùng (Admin)
router.get('/getTransactionsByUser/:userId', authMiddleware, requireAdmin, validateFields({
    userId: { required: true, fn: validateUserId, message: "Invalid user ID format" }
}), getTransactionsByUser);
// Hủy giao dịch
router.post('/cancelTransaction/:txId', authMiddleware, validateFields({
    txId: { required: true, fn: validateTxId, message: "Invalid transaction ID format" }
}), cancelTransaction);

module.exports = router;