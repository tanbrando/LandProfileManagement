import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import LoadingOverlay from "../../components/LoadingOverlay";
import { importCSVLandProfiles } from "../../services/landService";

const ImportCSVModal = ({ 
    showModal, 
    closeModal,
    onImportSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleImport = async () => {
        if (!file) {
            setError("Vui lòng chọn tệp CSV để nhập.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Tạo FormData để gửi file
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await importCSVLandProfiles(formData);
            if (response.success === false) {
                setError(response.message || "Lỗi khi nhập tệp CSV");
                setLoading(false);
                return;
            }
            setLoading(false);
            onImportSuccess();
            closeModal();
        } catch (err) {
            setLoading(false);
            setError("Lỗi khi nhập tệp CSV: " + err.message);
        }
    };
    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Nhập Hồ Sơ Đất từ CSV</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <LoadingOverlay />}
                {error && <div className="alert alert-danger">{error}</div>}
                <Form.Group controlId="formFile">
                    <Form.Label>Chọn tệp CSV</Form.Label>
                    <Form.Control 
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleImport} disabled={loading}>
                    Nhập
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImportCSVModal;  