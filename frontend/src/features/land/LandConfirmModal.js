import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { deleteLandProfile} from "../../services/landService";
import LoadingOverlay from "../../components/LoadingOverlay";
const LandConfirmModal = ({ 
    showModal,
    closeModal,
    landId,
    onActionSuccess,
    actionType // 'delete' or other actions in future
}) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    async function handleConfirm() {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (actionType === 'delete') {
                response = await deleteLandProfile(landId);
            }
            if (response.success === false) {
                setError(response.message || 'Đã xảy ra lỗi');
                return;
            }
            onActionSuccess();
            closeModal();
        } catch (error) {
            setError('Đã xảy ra lỗi khi thực hiện hành động');
        } finally {
            setLoading(false);
        }
    }
    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận hành động</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <LoadingOverlay />}
                {actionType === 'delete' && (
                    <p>Bạn có chắc chắn muốn xóa hồ sơ đất {landId} này không?</p>
                )}
                {error && <p className="alert alert-danger">{error}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={handleConfirm}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LandConfirmModal;