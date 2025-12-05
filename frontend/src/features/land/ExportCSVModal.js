import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { exportCSVLandProfiles } from "../../services/landService";
import LoadingOverlay from "../../components/LoadingOverlay";

const ExportCSVModal = ({ 
    showModal, 
    closeModal,
    onExportSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleExport = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await exportCSVLandProfiles();
            if (response.success) {
                // Tạo blob từ data
                const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `land_profiles_${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
                setSuccessMessage("Tệp CSV đã được tải xuống thành công.");
                setTimeout(() => {
                    closeModal();
                    onExportSuccess();
                }, 1500);
            } else {
                setError(response.message || "Lỗi khi xuất tệp CSV");
            }
        } catch (error) {
            setError(error.message || "Lỗi khi xuất tệp CSV");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Xuất Hồ Sơ Đất ra CSV</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <LoadingOverlay />}
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <p>Bạn có chắc chắn muốn xuất tất cả hồ sơ đất ra tệp CSV không?</p>
                <Button variant="primary" onClick={handleExport} disabled={loading}>
                    Xuất CSV
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default ExportCSVModal;