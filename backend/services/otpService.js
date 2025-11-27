const otpStore = new Map();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function saveOTP(email, otp) {
    otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 3*60*1000
    });
}

function verifyOTP(email, otp) {
    const record = otpStore.get(email);
    if (!record || Date.now() > record.expiresAt) return false;
    return record.otp === otp;
}

module.exports = { generateOTP, saveOTP, verifyOTP };
    