function validateFields(rules) {
    return (req, res, next) => {
        for (const field in rules) {
            const validator = rules[field];
            const value = req.body[field] || req.query[field] || req.params[field];

            // Nếu field bắt buộc nhưng không có
            if (validator.required && (value === undefined || value === null || value === "")) {
                return res.status(400).json({
                    success: false,
                    message: `Trường '${field}' là bắt buộc`
                });
            }

            // Nếu không bắt buộc và không có giá trị → bỏ qua
            if (!value) continue;

            // Nếu có validator thì check
            if (validator.fn && !validator.fn(value)) {
                return res.status(400).json({
                    success: false,
                    message: validator.message || `Trường '${field}' không hợp lệ`
                });
            }
        }

        next();
    };
}

module.exports = { validateFields };
