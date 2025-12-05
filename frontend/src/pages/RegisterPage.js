import RegisterForm from "../features/register/RegisterForm";
import "./Page.css";

const RegisterPage = () => {
    return (
        <div className="auth-container">
            <h2 className="auth-title">Đăng ký tài khoản</h2>
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;