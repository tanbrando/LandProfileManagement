import { useState, useEffect, useContext } from "react";
import {
    getUserTransactions
} from "../services/transactionService";

import { AuthContext } from "../store/authContext";

export const useUserTransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!user || !user.userId) {
                setTransactions([]);
                setLoading(false);
                return;
            }
            const response = await getUserTransactions();
            if (response.success === false) {
                setError(response.message || "Lỗi khi tải danh sách giao dịch");
                setTransactions([]);
                return;
            } else {
                setError(null);
                setTransactions(response.data);
            }
        } catch (error) {
            setError(error.message || "Lỗi khi tải danh sách giao dịch");
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [user.userId]);

    return { transactions, loading, error, refetch: fetchTransactions };
}

