import api from "./axiosInstance";

const initLandProfileLedger = async () => {
    try {
        const res = await api.post('/lands/initLedger');
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const createLandProfile = async (landData) => {
    try {
        const res = await api.post('/lands/createLandProfile', landData);
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const updateLandProfile = async (landId, landData) => {
    try {
        const res = await api.put(`/lands/updateLandProfile/${landId}`, landData);
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const deleteLandProfile = async (landId) => {
    try {
        const res = await api.delete(`/lands/deleteLandProfile/${landId}`);
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const importCSVLandProfiles = async (formData) => {
    try {
        const res = await api.post('/lands/importCSVLandProfiles', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const exportCSVLandProfiles = async () => {
    try {
        const res = await api.get('/lands/exportCSVLandProfiles', { 
            responseType: 'blob',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getLandTypeStatistics = async () => {
    try {
        const res = await api.get('/lands/getLandTypeStatistics');
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getLandStatusStatistics = async () => {
    try {
        const res = await api.get('/lands/getLandStatusStatistics');
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getAllLandProfilesSummary = async () => {
    try {
        const res = await api.get('/lands/getAllLandProfilesSummary');
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getAllLandProfiles = async () => {
    try {
        const res = await api.get('/lands/getAllLandProfiles');
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getLandProfileById = async (landId) => {
    try {
        const res = await api.get(`/lands/getLandProfileById/${landId}`);
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getLandProfilesByRange = async (minValue, maxValue) => {
    try {
        const res = await api.get(`/lands/getLandProfilesByRange/${minValue}/${maxValue}`);
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getLandProfilesByStatus = async (status) => {
    try {
        const res = await api.get(`/lands/getLandProfilesByStatus/${status}`);
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getLandProfilesByType = async (type) => {
    try {
        const res = await api.get(`/lands/getLandProfilesByType/${type}`);
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getUserLandProfiles = async () => {
    try {
        const res = await api.get('/lands/getUserLandProfiles');
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getLandProfilesByOwner = async (ownerId) => {
    try {
        const res = await api.get(`/lands/getUserLandProfiles/${ownerId}`);
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

export {
    initLandProfileLedger,
    createLandProfile,
    updateLandProfile,
    deleteLandProfile,
    importCSVLandProfiles,
    exportCSVLandProfiles,
    getLandTypeStatistics,
    getLandStatusStatistics,
    getAllLandProfilesSummary,
    getAllLandProfiles,
    getLandProfileById,
    getLandProfilesByRange,
    getLandProfilesByStatus,
    getLandProfilesByType,
    getUserLandProfiles,
    getLandProfilesByOwner
};