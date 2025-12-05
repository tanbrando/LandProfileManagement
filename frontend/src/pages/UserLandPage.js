import LandList from "../features/land/LandList";
import MainHeader from "../components/MainHeader";
import { useState } from "react";
import { useUserLandList } from "../hooks/useUserLandList";
import "./Page.css";
import LoadingOverlay from "../components/LoadingOverlay";
import ExportReportModal from "../features/report/ExportReportModal";
import CreateTransactionModal from "../features/transaction/CreateTransactionModal";

const UserLandPage = () => {
    const { lands, loading, error, refetch } = useUserLandList();

    const [currentLand, setCurrentLand] = useState(null);
    const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = useState(false);
    const [isExportReportModalOpen, setIsExportReportModalOpen] = useState(false);

    const openCreateTransactionModal = (land) => {
        setCurrentLand(land);
        setIsCreateTransactionModalOpen(true);
    };

    const closeCreateTransactionModal = () => {
        setIsCreateTransactionModalOpen(false);
        setCurrentLand(null);
    };

    const openExportReportModal = () => {
        setIsExportReportModalOpen(true);
    };

    const closeExportReportModal = () => {
        setIsExportReportModalOpen(false);
    };

    return (
        <div className="page-container">
            <MainHeader
                title="Danh sách đất của tôi"
                exportFunction={openExportReportModal}
            />
            {loading && <LoadingOverlay />}
            {error && <p className="alert alert-danger">Lỗi: {error}</p>}
            <div className="page-content">
                <LandList
                    lands={lands}
                    onCreateLand={null}
                    onEditLand={null}
                    onConfirmAction={null}
                    onCreateTransaction={openCreateTransactionModal}
                />
                {isCreateTransactionModalOpen && (
                    <CreateTransactionModal
                        showModal={isCreateTransactionModalOpen}
                        closeModal={closeCreateTransactionModal}
                        onActionSuccess={refetch}
                        landData={currentLand}
                    />
                )}
                {isExportReportModalOpen && (
                    <ExportReportModal 
                        showModal={isExportReportModalOpen}
                        closeModal={() => setIsExportReportModalOpen(false)}
                        onActionSuccess={() => {}}
                    />
                )}
            </div>
        </div>
    );
}

export default UserLandPage;