const {connectToNetwork} = require('../fabric/network');
const fs = require('fs');
const path = require('path');
const fastcsv = require('fast-csv');
const PDFDocument = require('pdfkit');

async function createUserReport(req, res) {
    let transGateway, landGateway, userGateway;
    try {
        const role = req.user?.role;

        let userId;
        if (role === 'Admin') {
            userId = req.params.userId || req.user?.userId;
        } else {
            userId = req.user?.userId;
        }

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID không được cung cấp' });
        }
        const format = (req.query.format || 'json').toLowerCase();

        // Kết nối chaincode
        const transConnection = await connectToNetwork('qlchuyennhuong');
        transGateway = transConnection.gateway;
        const landConnection = await connectToNetwork('qlthongtindat');
        landGateway = landConnection.gateway;
        const userConnection = await connectToNetwork('qltaikhoan');
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
            const filePath = path.join(__dirname, `user_report_${userId}.csv`);
            const ws = fs.createWriteStream(filePath);
            // Chuyển reportData thành flat array cho CSV
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
            fastcsv.write(csvData, { headers: true }).pipe(ws).on('finish', () => {
                res.download(filePath, `user_report_${userId}.csv`, (err) => {
                    if (err) console.error(err);
                    fs.unlinkSync(filePath);
                });
            });
            return;
        }

        // ===== XUẤT PDF =====
        if (format === 'pdf') {
            const filePath = path.join(__dirname, `user_report_${userId}.pdf`);
            const doc = new PDFDocument();
            doc.pipe(fs.createWriteStream(filePath));
            doc.fontSize(18).text(`Báo cáo người dùng: ${reportData.name}`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`User ID: ${reportData.userId}`);
            doc.text(`Email: ${reportData.email}`);
            doc.text(`Phone: ${reportData.phone}`);
            doc.text(`Số thửa đất: ${reportData.numOfLands}`);
            doc.text(`Tổng diện tích: ${reportData.totalLandArea}`);
            doc.text(`Tổng giá trị đất: ${reportData.totalLandValue}`);
            doc.text(`Số giao dịch: ${reportData.numOfTransactions}`);
            doc.text(`Số giao dịch pending: ${reportData.numOfPendingTransactions}`);
            doc.moveDown();

            doc.end();
            doc.on('finish', () => {
                res.download(filePath, `user_report_${userId}.pdf`, (err) => {
                    if (err) console.error(err);
                    fs.unlinkSync(filePath);
                });
            });
            return;
        }

        // ===== TRẢ JSON MẶC ĐỊNH =====
        res.status(200).json({ success: true, data: reportData });

    } catch (error) {
        console.error(`Lỗi khi tạo báo cáo người dùng: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi tạo báo cáo người dùng: ${error.message}` });
    } finally {
        if (transGateway) await transGateway.disconnect().catch(() => {});
        if (landGateway) await landGateway.disconnect().catch(() => {});
        if (userGateway) await userGateway.disconnect().catch(() => {});
    }
}


module.exports = {
    createUserReport
};