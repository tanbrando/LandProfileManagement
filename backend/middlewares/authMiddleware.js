const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'changeme';

// Middleware kiểm tra token và attach user info vào req
function authMiddleware(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) return res.status(401).json({ success:false, error:'No token provided' });

    try {
        const payload = jwt.verify(token, SECRET);
        req.user = payload;  // { userId, role }
        next();
    } catch (err) {
        res.status(401).json({ success:false, error:'Invalid token' });
    }
}

function requireAdmin(req, res, next) {
    if(req.user?.role !== 'admin') {
        return res.status(403).json({ success:false, error:'Admin access required' });
    }
    next();
}

function requireOTP(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ success: false, message: "Missing token" });

        const decoded = jwt.verify(token, SECRET);

        if (!decoded.otpVerified)
            return res.status(403).json({ success: false, message: "OTP chưa được xác thực" });

        req.email = decoded.email;
        next();
    } catch {
        return res.status(401).json({ success: false, message: "Token không hợp lệ" });
    }
}


module.exports = { authMiddleware, requireAdmin, requireOTP, SECRET };