import { useState, useEffect, useContext } from "react";
import { Form, Alert, Row, Col, Button } from "react-bootstrap";
import authService from "../../services/authService";
import { AuthContext } from "../../store/authContext";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../../services/userService";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        userId: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const { verifyOTP } = useContext(AuthContext);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSendOTP = async () => {
        setError(null);
        setSuccess(null);
        if (!formData.email) {
            setError("Vui lòng nhập email để nhận mã OTP.");
            return;
        }
        setLoading(true);
        try {
            const response = await authService.sendOTP(formData.email);
            if (response.success) {
                setOtpSent(true);
                setSuccess("Mã OTP đã được gửi đến email của bạn.");
            } else {
                setError(response.message || "Lỗi khi gửi mã OTP.");
            }
        } catch (error) {
            setError("Lỗi khi gửi mã OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setError(null);
        setSuccess(null);
        if (!formData.email || !otp) {
            setError("Vui lòng nhập email và mã OTP.");
            return;
        }
        setLoading(true);
        try {
            const response = await verifyOTP(formData.email, otp);
            if (response.success) {
                setIsOtpVerified(true);
                setSuccess("Xác thực OTP thành công.");
            } else {
                setError(response.message || "Lỗi khi xác thực mã OTP.");
            }
        } catch (error) {
            setError("Lỗi khi xác thực mã OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }
        setLoading(true);
        try {

            const response = await createUser(formData);
            if (response.success) {
                setSuccess("Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.");
                setFormData({
                    userId: "",
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                });
                setOtpSent(false);
                setIsOtpVerified(false);
                setOtp("");
                navigate("/login");
            } else {
                setError(response.message || "Lỗi khi đăng ký.");
            }
        } catch (error) {
            setError("Lỗi khi đăng ký.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <p className="text-success">{success}</p>}
            <Form.Group controlId="userId">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Row className="align-items-center">
                    <Col xs={12} md={8}>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Col>

                    <Col xs={12} md="4">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="w-100"
                        >
                            Gửi OTP
                        </Button>
                    </Col>
                </Row>
            </Form.Group>

            {otpSent && !isOtpVerified && (
                <Form.Group controlId="otp">
                    <Form.Label>Mã OTP</Form.Label>
                    <Row className="align-items-center">
                        <Col xs={12} md={6}>
                            <Form.Control
                                type="text"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </Col>

                        <Col xs={12} md={6}>
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={handleVerifyOTP}
                                disabled={loading}
                                className="w-100"
                            >
                                Xác thực OTP
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
            )}
                        
            <Form.Group controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <button type="submit" disabled={loading || !isOtpVerified} className="mt-3 btn btn--green btn--login">
                {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
            <p>Bạn đã có tài khoản ? <Link to="/login" className="link--login">Đăng nhập</Link></p>
        </Form>
    );
};

export default RegisterForm;