import ResetPasswordForm from "../features/login/ResetPasswordForm";
import "./Page.css";

const ResetPasswordPage = () => {
    return (
        <div className="auth-container">
            <h2 className="auth-title">Đặt lại mật khẩu</h2>
            <ResetPasswordForm />
        </div>
    );
};

export default ResetPasswordPage;