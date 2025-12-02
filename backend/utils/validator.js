// Email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Phone (Việt Nam)
function validatePhone(phone) {
    const regex = /^(0[3|5|7|8|9])[0-9]{8,9}$/;
    return regex.test(phone);
}

// Password
// - Min 8 chars
// - Uppercase
// - Lowercase
// - Number
// - Special char
function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?=\S+$).{8,}$/;
    return regex.test(password);
}

// userId
// - Chữ + số
// - 6–30 ký tự
function validateUserId(id) {
    const regex = /^[A-Za-z0-9]{6,30}$/;
    return regex.test(id);
}

// landId (maSo)
// Format: DAT001
function validateLandId(id) {
    const regex = /^DAT[0-9]{3}$/;
    return regex.test(id);
}

// soGiayTo
// Format: GCN001
function validateSoGiayTo(num) {
    const regex = /^GCN[0-9]{3}$/;
    return regex.test(num);
}

// ngayCapGiayTo (YYYY-MM-DD)
// Kiểm tra ngày hợp lệ thật
function validateDate(dateStr) {
    // Kiểm tra đúng format cơ bản
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

    const date = new Date(dateStr);
    const [y, m, d] = dateStr.split('-').map(Number);

    return (
        date.getFullYear() === y &&
        date.getMonth() + 1 === m &&
        date.getDate() === d
    );
}

// OTP
function validateOTP(otp) {
    return typeof otp === 'string' && otp.length === 6;
}

function validateLandType(type) {
    const landTypes = ['ONT', 'ODT', 'LUC', 'CLN', 'RSX', 'NTS', 'SKC', 'TMD', 'DGT', 'DKV'];
    return landTypes.includes(type);
}

function validateLandStatus(status) {
    const landStatuses = ['active', 'inactive', 'removed'];
    return landStatuses.includes(status);
}

function validateTxType(type) {
    const transactionTypes = ['transfer', 'mortgage', 'inheritance', 'gift'];
    return transactionTypes.includes(type);
}

function validateTxStatus(status) {
    const transactionStatuses = ['pending', 'approved', 'rejected', 'cancelled'];
    return transactionStatuses.includes(status);
}

function validateTxId(id) {
    return /^[a-f0-9]{64}$/.test(id);
}

function validateUserRole(role) {
    const userRoles = ['admin', 'user'];
    return userRoles.includes(role);
}

function validateLandValue(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
}

function validateArea(area) {
    const num = parseFloat(area);
    return !isNaN(num) && num > 0;
}

function validateAddress(address) {
    return typeof address === 'string' && address.trim().length > 0;
}

function validateName(name) {
    return typeof name === 'string' && name.trim().length > 0;
}

module.exports = {
    validateEmail,
    validatePhone,
    validatePassword,
    validateUserId,
    validateLandId,
    validateSoGiayTo,
    validateDate,
    validateOTP,
    validateLandType,
    validateLandStatus,
    validateTxType,
    validateTxId,
    validateUserRole,
    validateLandValue,
    validateArea,
    validateAddress,
    validateName,
    validateTxStatus
};
