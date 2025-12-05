import react, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { approveTransaction, rejectTransaction, cancelTransaction} from '../../services/transactionService';
import LoadingOverlay from '../../components/LoadingOverlay';

const TransactionConfirmModal = ({ 
    showModal,
    closeModal,
    actionType,
    txId,
    onActionSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const actionMessages = {
        approve: {
            title: 'Xác nhận phê duyệt giao dịch',
            body: `Bạn có chắc chắn muốn phê duyệt giao dịch với ID: ${txId}?`,
            button: 'Phê duyệt giao dịch'
        },
        reject: {
            title: 'Xác nhận từ chối giao dịch',
            body: `Bạn có chắc chắn muốn từ chối giao dịch với ID: ${txId}?`,
            button: 'Từ chối giao dịch'
        },
        cancel: {
            title: 'Xác nhận hủy giao dịch',
            body: `Bạn có chắc chắn muốn hủy giao dịch với ID: ${txId}?`,
            button: 'Hủy giao dịch'
        }
    };
    const handleAction = async () => {
        setLoading(true);
        setError(null);
        try {
            if (actionType === 'approve') {
                await approveTransaction(txId);   
            } else if (actionType === 'reject') {
                await rejectTransaction(txId);
            } else if (actionType === 'cancel') {
                await cancelTransaction(txId);
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
            {error && <div className="alert alert-danger m-3">{error}</div>}
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal} disabled={loading}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleAction} disabled={loading}>
                    {actionMessages[actionType].button}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TransactionConfirmModal;