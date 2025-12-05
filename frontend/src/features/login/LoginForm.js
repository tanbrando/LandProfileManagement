import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/authContext";
import { Form } from "react-bootstrap";

const LoginForm = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.success) {
            navigate("/home");
        } else {
            setError(result.message);
        }
    };
    return (
        <Form onSubmit={handleSubmit}>
            {error && <p className="alert alert-danger"> Đăng nhập thất bại: {error}</p>}
            <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                />
            </Form.Group>
            <button type="submit" className="btn btn--green btn--login">Đăng nhập</button>
            <p>Bạn chưa có tài khoản ? <Link to="/register" className="link--login">Đăng ký</Link></p>
            <p>Bạn quên mật khẩu ? <Link to="/reset-password" className="link--login">Đặt lại mật khẩu</Link></p>
        </Form>
    );
};

export default LoginForm;