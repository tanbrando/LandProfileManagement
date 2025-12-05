import React, { use, useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { editUser } from "../../services/userService";
import LoadingOverlay from "../../components/LoadingOverlay";

const EditUserModal = ({ 
    showModal,
    closeModal,
    user,
    onActionSuccess
}) => {
    const [formData, setFormData] = useState({
        userId: '',
        name: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await editUser(formData.userId, {
                name: formData.name,
                phone: formData.phone
            });
            if (res.success === false) {
                setError(res.message);
            } else {
                setError(null);
                onActionSuccess();
                closeModal();
            }
        } catch (error) {
            console.error("Failed to update user:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            setFormData({
                userId: user.userId,
                name: user.name,
                phone: user.phone
            });
        }
    }, [user]);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    return (
        <Modal show={showModal} onHide={closeModal}>
            {loading && <LoadingOverlay />}
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {error && <p className="alert alert-danger">{error}</p>}
                    <Form.Group controlId="formUserId" className="mb-3">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="userId"
                            value={formData.userId}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group controlId="formName" className="mb-3">
                        <Form.Label>Tên</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPhone" className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <button type="submit" className="btn btn-primary">Lưu</button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditUserModal;