import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider} from './store/authContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PrivateRoute from './routes/privateRoute';
import RoleRoute from './routes/roleRoute';
import DashboardLayout from './layout/DashboardLayout';
import AuthLayout from './layout/AuthLayout';
import UserPage from './pages/UserPage';
import LandPage from './pages/LandPage';
import UserLandPage from './pages/UserLandPage';
import LandPageForUser from './pages/LandPageForUser';
import TransactionPage from './pages/TransactionPage';
import UserTransactionPage from './pages/UserTransactionPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SettingPage from './pages/SettingPage';
import OverviewPage from './pages/OverviewPage';
import './App.css';
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
        <AuthProvider>
            <Routes >
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/my-lands" element={<UserLandPage />} />
                        <Route path="/all-lands" element={<LandPageForUser />} />
                        <Route path="/my-transactions" element={<UserTransactionPage />} />
                        <Route path="/settings" element={<SettingPage />} />
                        
                        {/* Admin routes */}
                        <Route element={<RoleRoute allowedRoles={['admin']} />}>
                            <Route path="/users" element={<UserPage />} />
                            <Route path="/lands" element={<LandPage />} />
                            <Route path="/transactions" element={<TransactionPage />} />
                            <Route path="/overview" element={<OverviewPage />} />
                        </Route>
                    </Route>
                </Route>
                
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </AuthProvider>
    </Router>
    );
}

export default App;