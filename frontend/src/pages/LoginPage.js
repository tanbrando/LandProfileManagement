import LoginForm from "../features/login/LoginForm";
import "./Page.css";

const LoginPage = () => {
    return (
        <div className="auth-container">
            <h2 className="auth-title">Đăng nhập</h2>
            <LoginForm />
        </div>
    );
};

export default LoginPage;