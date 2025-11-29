const express = require('express');
const router = express.Router();
const { 
    initLedger, getAllLandProfiles, getLandProfileById, 
    getUserLandProfiles, createLandProfile, updateLandProfile, 
    deleteLandProfile, getLandProfilesByRange, getLandProfilesByStatus,
    getLandProfilesByType, importCSVLandProfiles, exportCSVLandProfiles,
    getLandTypeStatistics, getLandStatusStatistics, getAllLandProfilesSummary
} = require('../controllers/landController');
const { authMiddleware, requireAdmin } = require('../middlewares/authMiddleware');
const { validateFields } = require('../middlewares/validateFields');
const { 
    validateLandId, validateUserId, validateAddress, validateArea,
    validateLandType, validateSoGiayTo, validateDate, validateLandValue,
    validateLandStatus
} = require('../utils/validator');

// Khởi tạo dữ liệu ban đầu (Admin)
router.post('/initLedger',authMiddleware, requireAdmin, initLedger);
// Tạo mới hồ sơ đất đai (Admin)
router.post('/createLandProfile', authMiddleware, requireAdmin, validateFields({
    maSo : { required: true, fn: validateLandId, message: "Invalid land ID format" },
    chuSoHuu : { required: true, fn: validateUserId, message: "Invalid user ID format" },
    diaChi : { required: true, fn: validateAddress, message: "Invalid address format" },
    dienTich : { required: true, fn: validateArea, message: "Invalid area format" },
    loaiDat : { required: true, fn: validateLandType, message: "Invalid land type" },
    soGiayTo : { required: true, fn: validateSoGiayTo, message: "Invalid document number format" },
    ngayCapGiayTo : { required: true, fn: validateDate, message: "Invalid document date format" },
    giaTriDat : { required: true, fn: validateLandValue, message: "Invalid land value" },
}), createLandProfile);
// Cập nhật hồ sơ đất đai (Admin)
router.put('/updateLandProfile/:maSo', authMiddleware, requireAdmin, validateFields({
    maSo : { required: false, fn: validateLandId, message: "Invalid land ID format" },
    diaChi : { required: false, fn: validateAddress, message: "Invalid address format" },
    dienTich : { required: false, fn: validateArea, message: "Invalid area format" },
    loaiDat : { required: false, fn: validateLandType, message: "Invalid land type" },
    soGiayTo : { required: false, fn: validateSoGiayTo, message: "Invalid document number format" },
    ngayCapGiayTo : { required: false, fn: validateDate, message: "Invalid document date format" },
    giaTriDat : { required: false, fn: validateLandValue, message: "Invalid land value" },
}), updateLandProfile);
// Xóa hồ sơ đất đai (Admin)
router.delete('/deleteLandProfile/:maSo', authMiddleware, requireAdmin, validateFields({
    maSo : { required: true, fn: validateLandId, message: "Invalid land ID format" },
}), deleteLandProfile);
// Nhập khẩu hồ sơ đất đai từ file CSV (Admin)
router.post('/importCSVLandProfiles', authMiddleware, requireAdmin, importCSVLandProfiles);
// Xuất khẩu hồ sơ đất đai ra file CSV (Admin)
router.get('/exportCSVLandProfiles', authMiddleware, requireAdmin, exportCSVLandProfiles);
// Thống kê loại đất (Admin)
router.get('/getLandTypeStatistics', authMiddleware, requireAdmin, getLandTypeStatistics);
// Thống kê trạng thái đất (Admin)
router.get('/getLandStatusStatistics', authMiddleware, requireAdmin, getLandStatusStatistics);
// Thống kê tất cả hồ sơ đất đai (Admin)
router.get('/getAllLandProfilesSummary', authMiddleware, requireAdmin, getAllLandProfilesSummary);


// Lấy tất cả hồ sơ đất đai
router.get('/getAllLandProfiles', authMiddleware, getAllLandProfiles);
// Lấy hồ sơ đất đai theo mã số
router.get('/getLandProfileById/:maSo', authMiddleware, validateFields({
    maSo : { required: true, fn: validateLandId, message: "Invalid land ID format" },
}), getLandProfileById);
// Lấy hồ sơ đất đai theo khoảng giá trị
router.get('/getLandProfilesByRange/:minGiaTri/:maxGiaTri', authMiddleware, validateFields({
    minGiaTri : { required: true, fn: validateLandValue, message: "Invalid minimum land value" },
    maxGiaTri : { required: true, fn: validateLandValue, message: "Invalid maximum land value" },
}), getLandProfilesByRange);
// Lấy hồ sơ đất đai theo trạng thái
router.get('/getLandProfilesByStatus/:trangThai', authMiddleware, validateFields({
    trangThai : { required: true, fn: validateLandStatus, message: "Invalid land status" },
}), getLandProfilesByStatus);
// Lấy hồ sơ đất đai theo loại đất
router.get('/getLandProfilesByType/:loaiDat', authMiddleware, validateFields({
    loaiDat : { required: true, fn: validateLandType, message: "Invalid land type" },
}), getLandProfilesByType);
// Lấy tất cả hồ sơ đất đai của người dùng hiện tại
router.get('/getUserLandProfiles', authMiddleware, getUserLandProfiles);


module.exports = router;