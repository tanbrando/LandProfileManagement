const {connectToNetwork} = require('../fabric/network');
const contractName = 'QLChuyenNhuong';

async function createTransaction(req, res) {
    let gateway;
    try {
        if (req.user?.userId !== req.body.chuSoHuuCu && req.user?.role !== 'admin') 
            return res.status(403).json({ success: false, message: 'Bạn không có quyền tạo giao dịch cho người khác' });
        const { maSo, chuSoHuuCu, chuSoHuuMoi, giaTri, loaiGiaoDich, thoiGian } = req.body;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        await contract.submitTransaction('createTransaction', maSo, chuSoHuuCu, chuSoHuuMoi, giaTri, loaiGiaoDich, thoiGian);
        res.status(201).json({ success: true, message: `Đã tạo giao dịch cho đất ${maSo} thành công` });
    } catch (error) {
        console.error(`Lỗi khi tạo giao dịch: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi tạo giao dịch: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function approveTransaction(req, res) {
    let gateway;
    try {
        const { txId } = req.params;
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;
        await contract.submitTransaction('approveTransaction', txId);
        res.status(200).json({ success: true, message: `Đã phê duyệt giao dịch ${txId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi phê duyệt giao dịch: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi phê duyệt giao dịch: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function rejectTransaction(req, res) {
    let gateway;
    try {
        const { txId } = req.params;
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;
        await contract.submitTransaction('rejectTransaction', txId);
        res.status(200).json({ success: true, message: `Đã từ chối giao dịch ${txId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi từ chối giao dịch: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi từ chối giao dịch: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function cancelTransaction(req, res) {
    let gateway;
    try {
        const { txId } = req.params;
        const userId = req.user?.userId;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        await contract.submitTransaction('cancelTransaction', txId, userId);
        res.status(200).json({ success: true, message: `Đã hủy giao dịch ${txId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi hủy giao dịch: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi hủy giao dịch: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getTransaction(req, res) {
    let gateway;
    try {
        const { txId } = req.params;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryTransaction', txId);
        const transaction = JSON.parse(result.toString());
        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        console.error(`Lỗi khi truy vấn giao dịch: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi truy vấn giao dịch: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getAllTransactions(req, res) {
    let gateway;
    try {
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllTransactions');
        const transactions = JSON.parse(result.toString());
        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        console.error(`Lỗi khi truy vấn tất cả giao dịch: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi truy vấn tất cả giao dịch: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getTransactionsByUser(req, res) {
    let gateway;
    try {
        const userId = req.user?.userId;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryTransactionsByUser', userId);
        const transactions = JSON.parse(result.toString());
        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        console.error(`Lỗi khi truy vấn giao dịch của người dùng: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi truy vấn giao dịch của người dùng: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getTransactionStatusStatistics(req, res) {
    let gateway;
    try {
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllTransactions');
        const allTransactions = JSON.parse(result.toString());

        const statusCounts = allTransactions.reduce((acc, tx) => {
            const status = tx.Record.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        res.status(200).json({ success: true, data: statusCounts });
    } catch (error) {
        console.error(`Lỗi khi truy vấn thống kê trạng thái giao dịch: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi truy vấn thống kê trạng thái giao dịch: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getTransactionTypeStatistics(req, res) {
    let gateway;
    try {
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllTransactions');
        const allTransactions = JSON.parse(result.toString());
        const typeCounts = allTransactions.reduce((acc, tx) => {
            const type = tx.Record.loaiGiaoDich;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        res.status(200).json({ success: true, data: typeCounts });
    } catch (error) {
        console.error(`Lỗi khi truy vấn thống kê loại giao dịch: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi truy vấn thống kê loại giao dịch: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

module.exports = { 
    createTransaction,
    approveTransaction, 
    rejectTransaction, 
    cancelTransaction,
    getTransaction, 
    getAllTransactions, 
    getTransactionsByUser,
    getTransactionStatusStatistics,
    getTransactionTypeStatistics 
};