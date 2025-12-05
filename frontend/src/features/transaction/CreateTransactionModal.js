import React, { use, useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { createTransaction } from "../../services/transactionService";
import LoadingOverlay from "../../components/LoadingOverlay";

const CreateTransactionModal = ({
    showModal,
    closeModal,
    onActionSuccess, 
    landData = null,
}) => {
    const [formData, setFormData] = useState({
        txId: "",
        maSo: "",
        chuSoHuuCu: "",
        chuSoHuuMoi: "",
        giaTri: "",
        loaiGiaoDich: "",
        thoiGian: ""
    });

    const [isLandSet, setIsLandSet] = useState(false);

    useEffect(() => {
        if (landData) {
            setFormData({
                ...formData,
                maSo: landData.maSo,
                chuSoHuuCu: landData.chuSoHuu,
                giaTri: landData.giaTriDat
            });
            setIsLandSet(true);
        }
    }, [landData]);



    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await createTransaction(formData);
            if (response.success) {
                onActionSuccess();
                closeModal();
                setError(null);
            } else {
                setError(response.message || "Lỗi khi tạo giao dịch");
            }
        } catch (error) {
            setError("Lỗi khi tạo giao dịch");
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
                <Modal.Title>Tạo mới giao dịch</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTxId" className="mb-3">
                        <Form.Label>Mã giao dịch</Form.Label>
                        <Form.Control
                            type="text"
                            name="txId"
                            value={formData.txId}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formMaSo" className="mb-3">
                        <Form.Label>Mã sổ</Form.Label>
                        <Form.Control
                            type="text"
                            name="maSo"
                            readOnly={isLandSet}
                            value={formData.maSo}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formChuSoHuuCu" className="mb-3">
                        <Form.Label>Chủ sở hữu cũ</Form.Label>
                        <Form.Control
                            type="text"
                            name="chuSoHuuCu"
                            readOnly={isLandSet}
                            value={formData.chuSoHuuCu}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formChuSoHuuMoi" className="mb-3">
                        <Form.Label>Chủ sở hữu mới</Form.Label>
                        <Form.Control
                            type="text"
                            name="chuSoHuuMoi"
                            value={formData.chuSoHuuMoi}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formGiaTri" className="mb-3">
                        <Form.Label>Giá trị</Form.Label>
                        <Form.Control
                            type="number"
                            name="giaTri"
                            value={formData.giaTri}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formLoaiGiaoDich" className="mb-3">
                        <Form.Label>Loại giao dịch</Form.Label>
                        <Form.Select
                            name="loaiGiaoDich"
                            value={formData.loaiGiaoDich}
                            onChange={handleInputChange}
                        >
                            <option value="">Chọn loại giao dịch</option>
                            <option value="transfer">Chuyển nhượng</option>
                            <option value="mortgage">Thế chấp</option>
                            <option value="inheritance">Thừa kế</option>
                            <option value="gift">Tặng cho</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="formThoiGian" className="mb-3">
                        <Form.Label>Thời gian (YYYY-MM-DD)</Form.Label>
                        <Form.Control
                            type="text"
                            name="thoiGian"
                            value={formData.thoiGian}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <button type="submit" className="btn btn-primary">
                        Tạo giao dịch
                    </button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default CreateTransactionModal;