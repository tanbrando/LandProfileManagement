import useUserList from '../hooks/useUserList';
import EditUserModal from '../features/user/EditUserModal';
import UserConfirmModal from '../features/user/UserConfirmModal';
import UserList from '../features/user/UserList';
import ExportReportModal from '../features/report/ExportReportModal';
import "./Page.css";
import DataListHeader from '../components/MainHeader';
import { initUserLedger } from '../services/userService';
import { useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

const UserPage = () => {
    const { users, loading, error, refetch } = useUserList();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmActionType, setConfirmActionType] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isExportReportModalOpen, setIsExportReportModalOpen] = useState(false);
    const [exportReportUserId, setExportReportUserId] = useState(null);

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };
    
    const closeEditModal = () => {
        setSelectedUser(null);
        setIsEditModalOpen(false);
    };

    const openConfirmModal = (actionType, userId) => {
        setConfirmActionType(actionType);
        setSelectedUserId(userId);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setConfirmActionType(null);
        setSelectedUserId(null);
        setIsConfirmModalOpen(false);
    };

    const initUser = async () => {
        await initUserLedger();
        refetch();
    };

    const openExportReportModal = (userId) => {
        setExportReportUserId(userId);
        setIsExportReportModalOpen(true);
    };

    const closeExportReportModal = () => {
        setExportReportUserId(null);
        setIsExportReportModalOpen(false);
    };

    return (
        <div className="page-container">
            <DataListHeader title="Quản lý người dùng" initFunction={initUser} />
            {loading && <LoadingOverlay />}
            {error && <p className="alert alert-danger">Lỗi: {error}</p>}
            <UserList users={users} 
                onEditUser={openEditModal} 
                onConfirmAction={openConfirmModal} 
                onExportReport={openExportReportModal} 
            />
            {isEditModalOpen && (
                <EditUserModal 
                    showModal={isEditModalOpen} 
                    closeModal={closeEditModal} 
                    user={selectedUser} 
                    onActionSuccess={refetch} 
                />
            )}
            {isConfirmModalOpen && (
                <UserConfirmModal 
                    showModal={isConfirmModalOpen}
                    closeModal={closeConfirmModal}
                    actionType={confirmActionType}
                    userId={selectedUserId}
                    onActionSuccess={refetch}
                />
            )}
            {isExportReportModalOpen && (
                <ExportReportModal 
                    showModal={isExportReportModalOpen}
                    closeModal={closeExportReportModal}
                    userId={exportReportUserId}
                    onActionSuccess={() => {}}
                />
            )}
        </div>
    );
};

export default UserPage;