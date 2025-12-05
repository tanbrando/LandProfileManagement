import { Outlet } from "react-router-dom";
import "./Layout.css";

const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <div className="auth-intro">
                <h1 className="auth-intro__title">Welcome to Land Profile Management</h1>
                <p className="auth-intro__subtitle">Website quản lý hồ sơ đất đai</p>
            </div>
            <div className="auth-content">
                <Outlet /> 
            </div>
        </div>
    );
};

export default AuthLayout;