import LandList from "../features/land/LandList";
import DataListHeader from "../components/MainHeader";
import { useState, useMemo } from "react";
import { useLandList } from "../hooks/useLandList";
import SearchBar from "../components/SearchBar";
import "./Page.css";

const LandPageForUser = () => {
    const [searchFilter, setSearchFilter] = useState({});
    const filter = useMemo(() => {
        return searchFilter;
    }, [searchFilter]);
    const { lands, loading, error } = useLandList(filter);
    
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
            <DataListHeader title="Danh sách hồ sơ đất đai"/>
            {loading && <p>Đang tải hồ sơ đất đai...</p>}
            {error && <p className="alert alert-danger">Lỗi: {error}</p>}
            <SearchBar searchConfigs={searchConfigs} onSearch={handleSearch} />
            <LandList 
                lands={lands} 
                displayActions={false}
            />
            
        </div>
    );
}

export default LandPageForUser;