const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_APP_PASSWORD  
    }
});

async function sendEmailOTP(to, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Mã OTP xác thực',
        text: `Mã OTP của bạn là: ${otp}. Hiệu lực trong 3 phút.`,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendEmailOTP };
