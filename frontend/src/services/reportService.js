import api from "./axiosInstance";

const exportReport = async (userId, format) => {
    try {
        const endpoint = userId ? `/reports/createUserReport/${userId}?format=${format}` : `/reports/createUserReport?format=${format}`;
        const response = await api.get(endpoint, {
            responseType: 'blob',
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tạo báo cáo người dùng" };
    }
};

export { exportReport };