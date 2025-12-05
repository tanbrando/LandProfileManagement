import LandList from "../features/land/LandList";
import MainHeader from "../components/MainHeader";
import { initLandProfileLedger } from "../services/landService";
import { useState, useMemo } from "react";
import CreateLandModal from "../features/land/CreateLandModal";
import EditLandModal from "../features/land/EditLandModal";
import LandConfirmModal from "../features/land/LandConfirmModal";
import CreateTransactionModal from "../features/transaction/CreateTransactionModal";
import ImportCSVModal from "../features/land/ImportCSVModal";
import ExportCSVModal from "../features/land/ExportCSVModal";
import { useLandList } from "../hooks/useLandList";
import SearchBar from "../components/SearchBar";
import "./Page.css";
import LoadingOverlay from "../components/LoadingOverlay";
import { useContext } from "react";
import { AuthContext } from "../store/authContext";

const LandPage = () => {
    const [searchFilter, setSearchFilter] = useState({});
    const filter = useMemo(() => {
        return searchFilter;
    }, [searchFilter]);
    const { lands, loading, error, refetch } = useLandList(filter);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedLand, setSelectedLand] = useState(null);
    const [confirmActionType, setConfirmActionType] = useState(null);
    const [selectedLandId, setSelectedLandId] = useState(null);
    const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = useState(false);
    const [isImportCSVModalOpen, setIsImportCSVModalOpen] = useState(false);
    const [isExportCSVModalOpen, setIsExportCSVModalOpen] = useState(false);

    const { user } = useContext(AuthContext);

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const openEditModal = (land) => {
        setSelectedLand(land);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedLand(null);
        setIsEditModalOpen(false);
    };

    const openConfirmModal = (actionType, landId) => {
        setConfirmActionType(actionType);
        setSelectedLandId(landId);
        console.log("Selected Land ID:", landId);
        setIsConfirmModalOpen(true);
    }

    const closeConfirmModal = () => {
        setConfirmActionType(null);
        setSelectedLandId(null);
        setIsConfirmModalOpen(false);
    }

    const openCreateTransactionModal = (land) => {
        setSelectedLand(land);
        setIsCreateTransactionModalOpen(true);
    };

    const closeCreateTransactionModal = () => {
        setSelectedLand(null);
        setIsCreateTransactionModalOpen(false);
    };

    const initLand = async () => {
        await initLandProfileLedger();
        refetch();
    }

    const handleSearch = (filter) => {
        setSearchFilter(filter);
    };


    const searchConfigs = {
        owner: {
            name: "Chủ Sở Hữu",
            label1: "owner",
            placeholder1: "Nhập Owner ID...",
            showSecondInput: false
        },
        status: {
            name: "Trạng Thái",
            label1: "status",
            placeholder1: "Nhập trạng thái (active/inactive)...",
            showSecondInput: false
        },
        type: {
            name: "Loại Đất",
            label1: "type",
            placeholder1: "Nhập loại đất...",
            showSecondInput: false
        },
        range: {
            name: "Khoảng Giá Trị",
            label1: "minValue",
            label2: "maxValue",
            placeholder1: "Giá trị tối thiểu...",
            placeholder2: "Giá trị tối đa...",
            showSecondInput: true
        }
    };

    return (
        <div className="page-container">
            <MainHeader title="Quản lý hồ sơ đất đai" initFunction={initLand} onCreate={openCreateModal} />
            {loading && <LoadingOverlay /> }
            {error && <p className="alert alert-danger">Lỗi: {error}</p>}
            <SearchBar searchConfigs={searchConfigs} onSearch={handleSearch} />
            <LandList 
                lands={lands} 
                onCreateLand={openCreateModal} 
                onEditLand={openEditModal} 
                onConfirmAction={openConfirmModal} 
                onCreateTransaction={openCreateTransactionModal}
                onImportCSV={() => setIsImportCSVModalOpen(true)}
                onExportCSV={() => setIsExportCSVModalOpen(true)}
            />
            {isCreateModalOpen && (
                <CreateLandModal 
                    showModal={isCreateModalOpen}
                    closeModal={closeCreateModal}
                    onActionSuccess={refetch}
                />
            )}
            {isEditModalOpen && (
                <EditLandModal
                    showModal={isEditModalOpen}
                    closeModal={closeEditModal}
                    land={selectedLand}
                    onActionSuccess={refetch}
                />
            )}
            {isConfirmModalOpen && (
                <LandConfirmModal
                    showModal={isConfirmModalOpen}
                    closeModal={closeConfirmModal}
                    landId={selectedLandId}
                    actionType={confirmActionType}
                    onActionSuccess={refetch}
                />
            )}
            {isCreateTransactionModalOpen && (
                <CreateTransactionModal
                    showModal={isCreateTransactionModalOpen}
                    closeModal={closeCreateTransactionModal}
                    landData={selectedLand}
                    onActionSuccess={refetch}
                />
            )}
            {isImportCSVModalOpen && (
                <ImportCSVModal
                    showModal={isImportCSVModalOpen}
                    closeModal={() => setIsImportCSVModalOpen(false)}
                    onImportSuccess={refetch}
                />
            )}
            {isExportCSVModalOpen && (
                <ExportCSVModal
                    showModal={isExportCSVModalOpen}
                    closeModal={() => setIsExportCSVModalOpen(false)}
                    onExportSuccess={refetch}
                />
            )}
        </div>
    );
}

export default LandPage;