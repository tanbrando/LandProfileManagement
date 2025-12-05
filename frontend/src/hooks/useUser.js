import { useEffect, useState } from 'react';
import { getUser } from '../services/userService';

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUser();
            if (response.success === false) {
                setError(response.message || "Lỗi khi tải thông tin người dùng");
                setUser(null);
            } else {
                setError(null);
                setUser(response.data);
            }
        } catch (error) {
            setError(error.message || "Lỗi khi tải thông tin người dùng");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);
    return { user, loading, error, refetch: fetchUser };
}

