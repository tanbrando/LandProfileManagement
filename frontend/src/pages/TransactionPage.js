import React, { useState } from "react";
import DataListHeader from "../components/MainHeader";
import TransactionList from "../features/transaction/TransactionList";
import CreateTransactionModal from "../features/transaction/CreateTransactionModal";
import EditTransactionModal from "../features/transaction/EditTransactionModal";
import TransactionConfirmModal from "../features/transaction/TransactionConfirmModal";
import LoadingOverlay from "../components/LoadingOverlay";
import SearchBar from "../components/SearchBar";

import { useTransactionList } from "../hooks/useTransactionList";
import { initTransactionLedger } from "../services/transactionService";
import './Page.css';

const TransactionPage = () => {
    const [searchFilter, setSearchFilter] = useState({});
    const { transactions, loading, error, refetch } = useTransactionList(searchFilter);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [confirmActionType, setConfirmActionType] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const openEditModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsEditModalOpen(true);
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    }

    const openConfirmModal = (actionType, transactionId) => {
        setConfirmActionType(actionType);
        setSelectedTransactionId(transactionId);
        setIsConfirmModalOpen(true);
    }

    const closeConfirmModal = () => {
        setConfirmActionType(null);
        setSelectedTransactionId(null);
        setIsConfirmModalOpen(false);
    }

    const handleSearch = (filter) => {
        setSearchFilter(filter);
    };

    const initTransaction = async () => {
        await initTransactionLedger();
        refetch();
    }

    const searchConfigs = {
        userId: {
            name: "Người dùng",
            label1: "userId",
            placeholder1: "Nhập mã người dùng...",
            showSecondInput: false
        },
        status: {
            name: "Trạng thái",
            label1: "status",
            placeholder1: "Nhập trạng thái (active/inactive)...",
            showSecondInput: false
        },
        type: {
            name: "Loại giao dịch",
            label1: "type",
            placeholder1: "Nhập loại giao dịch...",
            showSecondInput: false
        }
    };

    return (
        <div className="page-container">
            {loading && <LoadingOverlay />}
            <DataListHeader title="Quản lý giao dịch" initFunction={initTransaction}/>
            <SearchBar searchConfigs={searchConfigs} onSearch={handleSearch}/>
            {error && <p className="alert alert-danger">Lỗi: {error}</p>}
            <TransactionList 
                transactions={transactions} 
                onCreateTransaction={openCreateModal}
                onEditTransaction={openEditModal}
                onConfirmAction={openConfirmModal}
            />
            <CreateTransactionModal
                showModal={isCreateModalOpen}
                closeModal={closeCreateModal}
                onActionSuccess={refetch}
            />
            <EditTransactionModal
                showModal={isEditModalOpen}
                closeModal={closeEditModal}
                transaction={selectedTransaction}
                onActionSuccess={refetch}
            />
            <TransactionConfirmModal
                showModal={isConfirmModalOpen}
                closeModal={closeConfirmModal}
                actionType={confirmActionType}
                txId={selectedTransactionId}
                onActionSuccess={refetch}
            />
        </div>
    );
};

export default TransactionPage;