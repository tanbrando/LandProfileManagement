const {connectToNetwork} = require('../fabric/network');
const fs = require('fs');
const path = require('path');
const fastcsv = require('fast-csv');
const PDFDocument = require('pdfkit');

async function createUserReport(req, res) {
    let transGateway, landGateway, userGateway;
    try {
        const userId = req.params.userId || req.user.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID không được cung cấp' });
        }
        const format = (req.query.format || 'json').toLowerCase();

        // Kết nối chaincode
        const transConnection = await connectToNetwork('QLChuyenNhuong');
        transGateway = transConnection.gateway;
        const landConnection = await connectToNetwork('QLThongTinDat');
        landGateway = landConnection.gateway;
        const userConnection = await connectToNetwork('QLTaiKhoan');
        userGateway = userConnection.gateway;

        const transContract = transConnection.contract;
        const landContract = landConnection.contract;
        const userContract = userConnection.contract;

        // Lấy dữ liệu user
        const userData = await userContract.evaluateTransaction('queryUser', userId);
        if (!userData || userData.length === 0) {
            return res.status(404).json({ success: false, message: `Người dùng ${userId} không tồn tại` });
        }

        const transactionsData = await transContract.evaluateTransaction('queryTransactionsByUser', userId);
        const landData = await landContract.evaluateTransaction('queryAllLandProfiles');

        const user = JSON.parse(userData.toString());
        const transactions = JSON.parse(transactionsData.toString());
        const lands = JSON.parse(landData.toString());
        const userLands = lands.filter(land => land.Record.chuSoHuu === userId);
        const pendingTransactions = transactions.filter(tx => tx.Record.status === 'pending');

        // Tổng hợp dữ liệu
        const reportData = {
            userId: user.userId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            numOfLands: userLands.length,
            totalLandArea: userLands.reduce((sum, land) => sum + parseFloat(land.Record.dienTich), 0),
            totalLandValue: userLands.reduce((sum, land) => sum + parseFloat(land.Record.giaTriDat), 0),
            numOfTransactions: transactions.length,
            numOfPendingTransactions: pendingTransactions.length
        };

        // ===== XUẤT CSV =====
        if (format === 'csv') {
            const csvData = [
                {
                    userId: reportData.userId,
                    name: reportData.name,
                    email: reportData.email,
                    phone: reportData.phone,
                    numOfLands: reportData.numOfLands,
                    totalLandArea: reportData.totalLandArea,
                    totalLandValue: reportData.totalLandValue,
                    numOfTransactions: reportData.numOfTransactions,
                    numOfPendingTransactions: reportData.numOfPendingTransactions,
                }
            ];

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=user_report_${userId}.csv`);
            
            const csvStream = fastcsv.format({ headers: true });
            csvStream.pipe(res);
            csvData.forEach(row => csvStream.write(row));
            csvStream.end();
            return;
        }

        // ===== XUẤT PDF =====
        if (format === 'pdf') {
            const doc = new PDFDocument();
            const chunks = [];
            
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(chunks);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=user_report_${userId}.pdf`);
                res.send(pdfBuffer);
            });

            // Đăng ký font tiếng Việt (sử dụng font hệ thống Windows)
            try {
                // Thử các đường dẫn font phổ biến
                const fontPaths = [
                    'C:\\Windows\\Fonts\\Arial.ttf',
                    'C:\\Windows\\Fonts\\times.ttf',
                    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', // Linux
                    '/System/Library/Fonts/Supplemental/Arial.ttf' // Mac
                ];
                
                let fontRegistered = false;
                for (const fontPath of fontPaths) {
                    if (fs.existsSync(fontPath)) {
                        doc.registerFont('Vietnamese', fontPath);
                        doc.font('Vietnamese');
                        fontRegistered = true;
                        break;
                    }
                }
                
                if (!fontRegistered) {
                    console.warn('Không tìm thấy font tiếng Việt, sử dụng font mặc định');
                }
            } catch (err) {
                console.error('Lỗi khi load font:', err);
            }

            doc.fontSize(18).text(`Báo cáo người dùng: ${reportData.name}`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`User ID: ${reportData.userId}`);
            doc.text(`Email: ${reportData.email}`);
            doc.text(`Điện thoại: ${reportData.phone}`);
            doc.text(`Số thửa đất: ${reportData.numOfLands}`);
            doc.text(`Tổng diện tích: ${reportData.totalLandArea} m²`);
            doc.text(`Tổng giá trị đất: ${reportData.totalLandValue.toLocaleString('vi-VN')} VNĐ`);
            doc.text(`Số giao dịch: ${reportData.numOfTransactions}`);
            doc.text(`Số giao dịch chờ duyệt: ${reportData.numOfPendingTransactions}`);
            doc.end();
            return;
        }

        // ===== TRẢ JSON MẶC ĐỊNH =====
        res.status(200).json({ success: true, data: reportData });

    } catch (error) {
        console.error(`Lỗi khi tạo báo cáo người dùng: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi tạo báo cáo người dùng: ${error.message}` });
    } finally {
        if (transGateway) {
            try {
                transGateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway chuyển nhượng:', err);
            }
        }
        if (landGateway) {
            try {
                landGateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway đất:', err);
            }
        }
        if (userGateway) {
            try {
                userGateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway người dùng:', err);
            }
        }
    }
}


module.exports = {
    createUserReport
};