import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import {jwtDecode as jwt_decode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwt_decode(storedToken);
      setUser({ userId: decoded.userId, role: decoded.role });
    }
    setLoading(false);
  }, []);

  const login = async (userId, password) => {
    const res = await authService.login(userId, password);
    if (res.success && res.token) {
      setToken(res.token);
      localStorage.setItem('token', res.token);
      sessionStorage.removeItem('tempToken');
      
      const decoded = jwt_decode(res.token);
      setUser({ userId: decoded.userId, role: decoded.role });
      return { success: true };
    }
    return { success: false, message: res.message};
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const verifyOTP = async (email, otp) => {
    const res = await authService.verifyOTP(email, otp);
    if (res.success && res.tempToken) {
      sessionStorage.setItem('tempToken', res.tempToken);
      return { success: true};
    } 
    return { success: false, message: res.message };
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, verifyOTP, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
