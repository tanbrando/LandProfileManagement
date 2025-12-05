import { useState } from "react";
import { updatePassword } from "../../services/userService";
import { Form, Button } from "react-bootstrap";

const ChangePasswordForm = () => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setFormData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setError(null);
        setSuccess(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        if (formData.newPassword !== formData.confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            setLoading(false);
            return;
        }
        try {
            const response = await updatePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            });
            if (response.success === false) {
                setError(response.message || "Lỗi khi thay đổi mật khẩu");

            } else {
                setSuccess("Thay đổi mật khẩu thành công.");
                setError(null);
                handleCancel();
            }
        } catch (err) {
            setError(err.message || "Lỗi khi thay đổi mật khẩu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <h3 className="main-title mb-3">
                    <i className="bi bi-key-fill me-2"></i>
                    Đổi mật khẩu
            </h3>

            <Form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <Form.Group controlId="formOldPassword">
                    <Form.Label>Mật khẩu cũ</Form.Label>
                    <Form.Control
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu cũ"
                    />
                </Form.Group>
                <Form.Group controlId="formNewPassword">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu mới"
                    />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Nhập lại mật khẩu mới"
                    />
                </Form.Group>
                
                <Button type="submit" disabled={loading} className="btn btn--green mt-3 me-2">
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
                <Button variant="secondary" type="button" onClick={handleCancel} disabled={loading} className="mt-3">
                    Hủy
                </Button>
            </Form>
        </div>
    );
};

export default ChangePasswordForm;