import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../store/authContext";

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="sidebar d-flex flex-column">
            <h2 className="sidebar__title mb-5">Land Profile Management</h2>
            
            <nav className="flex-grow-1">
                <ul className="nav flex-column">
                    {user?.role === 'admin' ? (
                        // Menu cho Admin
                        <>
                            <li className="nav-item">
                                <Link to="/overview" className="nav-link">
                                    <i className="bi bi-speedometer2 me-2"></i>
                                    Tổng quan
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/lands" className="nav-link">
                                    <i className="bi bi-geo-alt me-2"></i>
                                    Thông tin đất
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/users" className="nav-link">
                                    <i className="bi bi-people me-2"></i>
                                    Người dùng
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/transactions" className="nav-link">
                                    <i className="bi bi-arrow-left-right me-2"></i>
                                    Chuyển nhượng
                                </Link>
                            </li>
                        </>
                    ) : (
                        // Menu cho User
                        <>
                            <li className="nav-item">
                                <Link to="/all-lands" className="nav-link">
                                    <i className="bi bi-geo-alt me-2"></i>
                                    Thông tin đất
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/my-lands" className="nav-link">
                                    <i className="bi bi-geo-alt-fill me-2"></i>
                                    Đất của tôi
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/my-transactions" className="nav-link">
                                    <i className="bi bi-arrow-left-right me-2"></i>
                                    Chuyển nhượng
                                </Link>
                            </li>
                        </>
                    )}
                </ul>

                <hr className="my-3" />

                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link to="/settings" className="nav-link">
                            <i className="bi bi-gear me-2"></i>
                            Cài đặt
                        </Link>
                    </li>
                    <li className="nav-item">
                        <button 
                            onClick={handleLogout} 
                            className="nav-link text-start w-100"
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Đăng xuất
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;