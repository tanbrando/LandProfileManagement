import { useState } from "react";
import DataListHeader from "../components/MainHeader";
import TransactionList from "../features/transaction/TransactionList";
import EditTransactionModal from "../features/transaction/EditTransactionModal";
import TransactionConfirmModal from "../features/transaction/TransactionConfirmModal";
import LoadingOverlay from "../components/LoadingOverlay";
import { useUserTransactionList } from "../hooks/userUserTransactionList";
import ExportReportModal from "../features/report/ExportReportModal";
import './Page.css';

const UserTransactionPage = () => {
    const { transactions, loading, error, refetch } = useUserTransactionList();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [isExportReportModalOpen, setIsExportReportModalOpen] = useState(false);

    const openEditModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsEditModalOpen(true);
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    }

    const openConfirmModal = (actionType, transactionId) => {
        setSelectedTransactionId(transactionId);
        setIsConfirmModalOpen(true);
    }

    const closeConfirmModal = () => {
        setSelectedTransactionId(null);
        setIsConfirmModalOpen(false);
    }

    const openExportReportModal = () => {
        setIsExportReportModalOpen(true);
    }

    const closeExportReportModal = () => {
        setIsExportReportModalOpen(false);
    }

    return (
        <div className="page-container">
            {loading && <LoadingOverlay />}
            <DataListHeader title="Quản lý giao dịch" exportFunction={openExportReportModal}/>
            {error && <p className="alert alert-danger">Lỗi: {error}</p>}
            <TransactionList 
                transactions={transactions} 
                onEditTransaction={openEditModal}
                onConfirmAction={openConfirmModal}
                isAdmin={false}
            />
            {isExportReportModalOpen && (
                <ExportReportModal
                    showModal={isExportReportModalOpen}
                    closeModal={closeExportReportModal}
                    onActionSuccess={() => {}}
                />
            )}
            <EditTransactionModal
                showModal={isEditModalOpen}
                closeModal={closeEditModal}
                transaction={selectedTransaction}
                onActionSuccess={refetch}
            />
            <TransactionConfirmModal
                showModal={isConfirmModalOpen}
                closeModal={closeConfirmModal}
                actionType={'cancel'}
                txId={selectedTransactionId}
                onActionSuccess={refetch}
            />
        </div>
    );
};

export default UserTransactionPage;