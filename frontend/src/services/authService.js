import api from './axiosInstance';

const login = async (userId, password) => {
  try {
    const response = await api.post('/auth/authenticate', { userId, password });
    return response.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const sendOTP = async (email) => {
  try {
    const response = await api.post('/auth/sendOTP', { email });
    return response.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/verifyOTP', { email, otp });
    return response.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const resetPassword = async (newPassword) => {
  try {
    const response = await api.post('/auth/resetPassword', { newPassword });
    return response.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

export default {
  login,
  sendOTP,
  verifyOTP,
  resetPassword,
};