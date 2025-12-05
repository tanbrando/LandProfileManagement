import api from './axiosInstance';

const getAllUsers = async () => {
  try {
    const res = await api.get('/users/getAllUsers');
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const getUser = async () => {
  try {
    const res = await api.get(`/users/getUser`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const getUserById = async (userId) => {
  try {
    const res = await api.get(`/users/getUserById/${userId}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const createUser = async (userData) => {
  try {
    const res = await api.post('/users/createUser', userData);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const updateUser = async (userData) => {
  try {
    const res = await api.put(`/users/updateUserProfile`, userData);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const editUser = async (userId, userData) => {
  try {
    const res = await api.put(`/users/updateUserProfile/${userId}`, userData);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const deleteUser = async (userId) => {
  try {
    const res = await api.delete(`/users/deleteUser/${userId}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const updatePassword = async (passwordData) => {
  try {
    const res = await api.put('/users/updatePassword', passwordData);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const deactivateUser = async (userId) => {
  try {
    const res = await api.put(`/users/deactivateUser/${userId}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const reactivateUser = async (userId) => {
  try {
    const res = await api.put(`/users/reactivateUser/${userId}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const updateUserRole = async (userId, newRole) => {
  try {
    const res = await api.put(`/users/updateUserRole/${userId}`, { newRole });
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

const initUserLedger = async () => {
  try {
    const res = await api.post('/users/initLedger');
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

export { 
  getAllUsers, 
  getUser, 
  createUser, 
  updateUser, 
  editUser,
  deleteUser, 
  updatePassword, 
  deactivateUser, 
  reactivateUser, 
  getUserById, 
  updateUserRole,
  initUserLedger
};