import { useState, useEffect } from 'react';
import { getAllUsers } from '../services/userService';

const useUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        const response = await getAllUsers();
        if (response.success === false) {
            setError(response.message);
        } else {
            setUsers(response.data);
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, error, refetch: fetchUsers};
};

export default useUserList;