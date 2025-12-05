import React, { use, useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { updateTransaction } from "../../services/transactionService";
import LoadingOverlay from "../../components/LoadingOverlay";

const EditTransactionModal = ({
    showModal,
    closeModal,
    transaction,
    onActionSuccess
}) => {
    const [formData, setFormData] = useState({
        chuSoHuuCu: '',
        chuSoHuuMoi: '',
        giaTri: '',
        loaiGiaoDich: '',
        thoiGian: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (transaction) {
            transaction.chuSoHuuCu = transaction.from
            transaction.chuSoHuuMoi = transaction.to
            const { txId, from, to, ...rest } = transaction;
            setFormData(rest);
        }
    }, [transaction]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await updateTransaction(transaction.txId, formData);
            if (response.success === false) {
                setError(response.message || "Failed to update transaction");
            } else {
                onActionSuccess();
                closeModal();
                setError(null);
            }
        } catch (err) {
            setError(err.message || "Failed to update transaction");
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    return (
        <Modal show={showModal} onHide={closeModal}>
            {loading && <LoadingOverlay />}
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa giao dịch</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {error && <p className="alert alert-danger">{error}</p>}
                    <Form.Group className="mb-3" controlId="chuSoHuuCu">
                        <Form.Label>Chủ Sở Hữu Cũ</Form.Label>
                        <Form.Control
                            type="text"
                            name="chuSoHuuCu"
                            value={formData.chuSoHuuCu}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="chuSoHuuMoi">
                        <Form.Label>Chủ Sở Hữu Mới</Form.Label>
                        <Form.Control
                            type="text"
                            name="chuSoHuuMoi"
                            value={formData.chuSoHuuMoi}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="giaTri">
                        <Form.Label>Giá Trị</Form.Label>
                        <Form.Control
                            type="text"
                            name="giaTri"
                            value={formData.giaTri}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="loaiGiaoDich">
                        <Form.Label>Loại Giao Dịch</Form.Label>
                        <Form.Control
                            type="text"
                            name="loaiGiaoDich"
                            value={formData.loaiGiaoDich}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="thoiGian">
                        <Form.Label>Thời Gian (YYYY-MM-DD)</Form.Label>
                        <Form.Control
                            type="text"
                            name="thoiGian"
                            value={formData.thoiGian}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <button type="submit" className="btn btn-primary">Lưu</button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditTransactionModal;