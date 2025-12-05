import { useState } from "react";
import { updateUser } from "../../services/userService";
import { Form, Button } from "react-bootstrap";

const EditUserForm = ({ userData, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: userData.name || "",
        phone: userData.phone || "",
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
    }

    const handleCancel = () => {
        setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
        });
        setError(null);
        setSuccess(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await updateUser(formData);
            if (response.success === false) {
                setError(response.message || "Lỗi khi cập nhật thông tin người dùng");
            } else {
                setSuccess("Cập nhật thông tin người dùng thành công.");
                onUpdate(response.data);
            }
        } catch (err) {
            setError(err.message || "Lỗi khi cập nhật thông tin người dùng");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="main-container">
            <h3 className="main-title mb-3">
                    <i className="bi bi-person-fill me-2"></i>
                    Chỉnh sửa thông tin người dùng
                </h3>
            <Form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <Form.Group controlId="formName">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên"
                    />
                </Form.Group>
                <Form.Group controlId="formPhone">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                    />
                </Form.Group>
                <Button type="submit" disabled={loading} className="btn--green mt-3 me-2">
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
                <Button variant="secondary" type="button" onClick={handleCancel} disabled={loading} className="mt-3">
                    Hủy
                </Button>
            </Form>
        </div>
    );
};

export default EditUserForm;