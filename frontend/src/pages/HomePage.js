import MainHeader from "../components/MainHeader";

const HomePage = () => {
    return (
        <div className="page-container">
            <MainHeader title="Trang Chủ" />
            <div className="main-container">
                <h2>Chào mừng đến với Hệ Thống Quản Lý Hồ Sơ Đất</h2>
                <p>Vui lòng sử dụng thanh điều hướng để truy cập các chức năng khác nhau của hệ thống.</p>
            </div>
        </div>
    )
};

export default HomePage;