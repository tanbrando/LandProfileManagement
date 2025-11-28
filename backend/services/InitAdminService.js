const {connectToNetwork} = require('../fabric/network');
const contractName = 'QLTaikhoan';
require('dotenv').config();

const InitAdminService = async () => {
    try {
        const {contract} = await connectToNetwork(contractName, true);
        const adminId = process.env.ADMIN_ID || 'admin001';
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
        await contract.submitTransaction('initAdmin', adminId, adminEmail, adminPassword);
        console.log('Admin account initialized successfully');
        return { success: true, message: 'Admin account initialized successfully' };
    } catch (error) {
        console.error(`Failed to initialize admin account: ${error}`);
        return { success: false, message: `Failed to initialize admin account: ${error.message}` };
    }
};

module.exports = InitAdminService;