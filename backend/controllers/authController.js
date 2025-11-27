const {connectToNetwork} = require('../fabric/network');
const chaincodeName = 'qltaikhoan';
const jwt = require('jsonwebtoken');
const { SECRET } = require('./authMiddleware');
const { generateOTP, saveOTP, verifyOTP } = require('../services/otpService');
const { sendEmailOTP } = require('../config/email');
const { validateEmail, validatePassword } = require('../utils/validator');

async function authenticate(req, res) {
    let gateway;
    try {
        const { userId, password } = req.body;

        const connection = await connectToNetwork(chaincodeName);
        gateway = connection.gateway;
        const contract = connection.contract;   
        const result = await contract.evaluateTransaction('authenticate', userId, password);

        const user = JSON.parse(result.toString());
        const token = jwt.sign({ userId: user.userId, role: user.role }, SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, user, token });
    } catch (error) {
        console.error(`Lỗi khi xác thực tài khoản: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi xác thực tài khoản: ${error.message}` });
    } finally {
        if (gateway) await gateway.disconnect().catch(() => {});
    }
} 

async function sendOTP(req, res) {
    try {
        const { email } = req.body;

        const otp = generateOTP();
        saveOTP(email, otp);

        await sendEmailOTP(email, otp);

        res.json({ success: true, message: "OTP đã được gửi đến email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Lỗi gửi OTP" });
    }
}

async function verifyOTPCode(req, res) {
    try {
        const { email, otp } = req.body;

        if (!verifyOTP(email, otp)) {
            return res.status(400).json({ success: false, message: "OTP không đúng hoặc đã hết hạn" });
        }

        const tempToken = jwt.sign({ email, otpVerified: true }, SECRET, { expiresIn: '10m' });

        res.json({ success: true, tempToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Lỗi xác thực OTP" });
    }
}

async function resetPassword(req, res) {
    let gateway;
    try {
        const { newPassword } = req.body;
        const email = req.email;

        // tìm userId bằng email trên chaincode
        const connection = await connectToNetwork(chaincodeName);
        gateway = connection.gateway;
        const contract = connection.contract;

        const result = await contract.evaluateTransaction("queryUserByEmail", email);
        const user = JSON.parse(result.toString());

        await contract.submitTransaction("updatePassword", user.userId, user.passwordHash, hashPassword(newPassword));

        res.json({ success: true, message: "Đã đặt lại mật khẩu thành công" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi reset password: " + error.message });
    } finally {
        if (gateway) await gateway.disconnect().catch(() => {});
    }
}
module.exports = { authenticate, sendOTP, verifyOTPCode, resetPassword };