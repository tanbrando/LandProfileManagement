import { useEffect, useState, useContext } from 'react';
import { getUserLandProfiles } from '../services/landService';
import { AuthContext } from '../store/authContext';

export const useUserLandList = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchUserLands = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!user || !user.userId) {
                setLands([]);
                setLoading(false);
                return;
            }
            const response = await getUserLandProfiles(user.userId);
            if (response.success === false) {
                setError(response.message || "Lỗi khi tải danh sách đất của người dùng");
                setLands([]);
                return;
            } else {
                setError(null);
                setLands(response.data);
            }
        } catch (error) {
            setError(error.message || "Lỗi khi tải danh sách đất của người dùng");
            setLands([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserLands();
    }, [user.userId]);

    return { lands, loading, error, refetch: fetchUserLands };
};