import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { exportReport } from "../../services/reportService";
import LoadingOverlay from "../../components/LoadingOverlay";

const ExportReportModal = ({ 
    showModal, 
    closeModal,
    userId,
    onActionSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [format, setFormat] = useState("json");

    const handleExport = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            console.log("Exporting report for userId:", userId, "with format:", format);
            const response = await exportReport(userId, format);
            if (response.success) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${userId || "my"}_report.${format}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                setSuccessMessage("Báo cáo đã được tải xuống thành công.");
                onActionSuccess();
            } else {
                setError(response.message || "Lỗi khi xuất báo cáo");
            }
        } catch (error) {
            setError(error.message || "Lỗi khi xuất báo cáo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Xuất Báo Cáo {userId ? `cho Người Dùng ${userId}` : "của Tôi"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <LoadingOverlay />}
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                
                <Form.Group controlId="reportFormat">
                    <Form.Label>Chọn Định Dạng Báo Cáo</Form.Label>
                    <Form.Select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                    >
                        <option value="json">JSON</option>
                        <option value="pdf">PDF</option>
                        <option value="csv">CSV</option>
                    </Form.Select>
                </Form.Group>
                <Button variant="primary" onClick={handleExport} disabled={loading} className="mt-3">
                    Xuất Báo Cáo
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default ExportReportModal;