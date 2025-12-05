import api from "./axiosInstance";

const initTransactionLedger = async () => {
    try {
        const response = await api.post('/transactions/initLedger');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const getAllTransactions = async () => {
    try {
        const response = await api.get('/transactions/getAllTransactions');
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
}

const getTransactionsByStatus = async (status) => {
    try {
        const response = await api.get(`/transactions/getTransactionsByStatus/${status}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const getTransactionsByType = async (type) => {
    try {
        const response = await api.get(`/transactions/getTransactionsByType/${type}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const getTransactionStatusStatistics = async () => {
    try {
        const response = await api.get('/transactions/getTransactionStatusStatistics');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const getTransactionTypeStatistics = async () => {
    try {
        const response = await api.get('/transactions/getTransactionTypeStatistics');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const createTransaction = async (transactionData) => {
    try {
        const response = await api.post('/transactions/createTransaction', transactionData);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const approveTransaction = async (txId) => {
    try {
        const response = await api.post(`/transactions/approveTransaction/${txId}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const rejectTransaction = async (txId) => {
    try {
        const response = await api.post(`/transactions/rejectTransaction/${txId}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const cancelTransaction = async (txId) => {
    try {
        const response = await api.post(`/transactions/cancelTransaction/${txId}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const updateTransaction = async (txId, transactionData) => {
    try {
        const response = await api.put(`/transactions/updateTransaction/${txId}`, transactionData);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const getTransaction = async (txId) => {
    try {
        const response = await api.get(`/transactions/getTransaction/${txId}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const getUserTransactions = async () => {
    try {
        const response = await api.get('/transactions/getTransactionsByUser');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

const getTransactionsByUser = async (userId) => {
    try {
        const response = await api.get(`/transactions/getTransactionsByUser/${userId}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export {
    initTransactionLedger,
    getAllTransactions,
    getTransactionsByStatus,
    getTransactionsByType,
    getTransactionStatusStatistics,
    getTransactionTypeStatistics,
    createTransaction,
    updateTransaction,
    approveTransaction,
    rejectTransaction,
    cancelTransaction,
    getTransaction,
    getUserTransactions,
    getTransactionsByUser
};