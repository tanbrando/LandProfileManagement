import react, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { deleteUser, deactivateUser, reactivateUser } from '../../services/userService';
import LoadingOverlay from '../../components/LoadingOverlay';

const UserConfirmModal = ({ 
    showModal,
    closeModal,
    actionType,
    userId,
    onActionSuccess
 }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const actionMessages = {
        delete: {
            title: 'Xác nhận xóa người dùng',
            body: `Bạn có chắc chắn muốn xóa người dùng với ID: ${userId}? Hành động này không thể hoàn tác.`,
            button: 'Xóa người dùng'
        },
        deactivate: {
            title: 'Xác nhận vô hiệu hóa người dùng',
            body: `Bạn có chắc chắn muốn vô hiệu hóa người dùng với ID: ${userId}?`,
            button: 'Vô hiệu hóa người dùng'
        },
        reactivate: {
            title: 'Xác nhận kích hoạt lại người dùng',
            body: `Bạn có chắc chắn muốn kích hoạt lại người dùng với ID: ${userId}?`,
            button: 'Kích hoạt lại người dùng'
        }
    };
    const handleAction = async () => {
        setLoading(true);
        setError(null);
        try {
            if (actionType === 'delete') {
                await deleteUser(userId);   
            } else if (actionType === 'deactivate') {
                await deactivateUser(userId);
            } else if (actionType === 'reactivate') {
                await reactivateUser(userId);
            }
            onActionSuccess();
            closeModal();
        } catch (err) {
            setError('Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (!actionMessages[actionType]) {
        return null;
    }   
    return (
        <Modal show={showModal} onHide={closeModal}>
            {loading && <LoadingOverlay />}
            <Modal.Header closeButton>
                <Modal.Title>{actionMessages[actionType].title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{actionMessages[actionType].body}</Modal.Body>
            {error && <p className="alert alert-danger">{error}</p>}
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal} disabled={loading}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={handleAction} disabled={loading}>
                    {actionMessages[actionType].button}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserConfirmModal;