const {connectToNetwork} = require('../fabric/network');
const contractName = 'QLTaiKhoan';

async function initLedger(req, res) {
    let gateway;
    try {
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;
        await contract.submitTransaction('initLedger');
        res.status(200).json({ success: true, message: 'Đã khởi tạo tài khoản thành công' });
    } catch (error) {
        console.error(`Lỗi khi khởi tạo tài khoản: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi khởi tạo tài khoản: ${error.message}` });
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

async function createUser(req, res) {
    let gateway;
    try {
        const { userId, name, password, email, phone } = req.body;
        if (email != req.email) {
            return res.status(403).json({ success: false, message: "Email không khớp với email đã xác thực qua OTP" });
        }
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        await contract.submitTransaction('createUser', userId, name, password, email, phone);
        res.status(201).json({ success: true, message: `Đã tạo tài khoản ${userId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi tạo tài khoản: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi tạo tài khoản: ${error.message}` });
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

async function updateUserRole(req, res) {
    let gateway;
    try {
        const { userId } = req.params;
        const { newRole } = req.body;
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;   
        await contract.submitTransaction('updateUserRole', userId, newRole);
        res.status(200).json({ success: true, message: `Đã cập nhật vai trò tài khoản ${userId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi cập nhật vai trò tài khoản: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi cập nhật vai trò tài khoản: ${error.message}` });
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

async function deactivateUser(req, res) {
    let gateway;
    try {
        const { userId } = req.params;
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;   
        await contract.submitTransaction('deactivateUser', userId);
        res.status(200).json({ success: true, message: `Đã vô hiệu hóa tài khoản ${userId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi vô hiệu hóa tài khoản: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi vô hiệu hóa tài khoản: ${error.message}` });
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

async function reactivateUser(req, res) {
    let gateway;
    try {
        const { userId } = req.params;
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;   
        await contract.submitTransaction('reactivateUser', userId);
        res.status(200).json({ success: true, message: `Đã kích hoạt lại tài khoản ${userId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi kích hoạt lại tài khoản: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi kích hoạt lại tài khoản: ${error.message}` });
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

async function getUser(req, res) {
    let gateway;
    try {
        userId = req.user?.userId;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;   
        const result = await contract.evaluateTransaction('queryUser', userId);
        res.status(200).json({ success: true, data: JSON.parse(result.toString()) });
    } catch (error) {
        console.error(`Lỗi khi truy vấn tài khoản: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi truy vấn tài khoản: ${error.message}` });
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

async function getUserById(req, res) {
    let gateway;
    try {
        const { userId } = req.params;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;   
        const result = await contract.evaluateTransaction('queryUser', userId);
        res.status(200).json({ success: true, data: JSON.parse(result.toString()) });
    } catch (error) {
        console.error(`Lỗi khi truy vấn tài khoản theo ID: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi truy vấn tài khoản theo ID: ${error.message}` });
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

async function getAllUsers(req, res) {
    let gateway;
    try {
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllUsers');
        res.status(200).json({ success: true, data: JSON.parse(result.toString()) });
    } catch (error) {
        console.error(`Lỗi khi truy vấn tất cả tài khoản: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi truy vấn tất cả tài khoản: ${error.message}` });
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

async function updatePassword(req, res) {
    let gateway;
    try {
        const userId = req.user?.userId;
        const { oldPassword, newPassword } = req.body;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;   
        await contract.submitTransaction('updatePassword', userId, oldPassword, newPassword);
        res.status(200).json({ success: true, message: `Đã cập nhật mật khẩu tài khoản ${userId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi cập nhật mật khẩu tài khoản: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi cập nhật mật khẩu tài khoản: ${error.message}` });
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

async function updateUserProfile(req, res) {
    let gateway;
    try {
        const userId = req.user?.userId;
        const { name, phone } = req.body;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;   
        await contract.submitTransaction('updateUserProfile', userId, name, phone);
        res.status(200).json({ success: true, message: `Đã cập nhật thông tin tài khoản ${userId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi cập nhật thông tin tài khoản: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi cập nhật thông tin tài khoản: ${error.message}` });
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

async function deleteUser(req, res) {
    let gateway;
    try {
        const { userId } = req.params;
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;   
        await contract.submitTransaction('deleteUser', userId);
        res.status(200).json({ success: true, message: `Đã xóa tài khoản ${userId} thành công` });
    } catch (error) {
        console.error(`Lỗi khi xóa tài khoản: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi xóa tài khoản: ${error.message}` });
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
    initLedger,
    createUser,
    updateUserRole,
    deactivateUser,
    reactivateUser,
    getUser,
    getUserById,
    getAllUsers,
    updatePassword,
    updateUserProfile,
    deleteUser
};