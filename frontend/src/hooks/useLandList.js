import { useState, useEffect } from "react";
import {
    getAllLandProfiles, getLandProfilesByOwner, getLandProfilesByRange,
    getLandProfilesByStatus, getLandProfilesByType
} from "../services/landService";

export const useLandList = (filter = {}) => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLands = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (filter.owner) {
                response = await getLandProfilesByOwner(filter.owner);
            } else if (filter.status) {
                response = await getLandProfilesByStatus(filter.status);
            } else if (filter.type) {
                response = await getLandProfilesByType(filter.type);
            } else if (filter.minValue && filter.maxValue) {
                response = await getLandProfilesByRange(filter.minValue, filter.maxValue);
            } else {
                response = await getAllLandProfiles();
            }
            if (response.success === false) {
                setError(response.message || "Lỗi khi tải danh sách đất");
                setLands([]);
                return;
            } else {
                setError(null);
                setLands(response.data);
            }
        } catch (error) {
            setError(error.message || "Lỗi khi tải danh sách đất");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLands();
    }, [filter.owner, filter.status, filter.type, filter.minValue, filter.maxValue]);

    return { lands, loading, error, refetch: fetchLands };
};