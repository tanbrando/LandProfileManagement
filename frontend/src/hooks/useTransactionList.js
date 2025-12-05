import { useState, useEffect } from "react";
import {
    getAllTransactions, getTransactionsByUser, getTransactionsByStatus,
    getTransactionsByType
} from "../services/transactionService";

export const useTransactionList = (filter = {}) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (filter.userId) {
                response = await getTransactionsByUser(filter.userId);
            } else if (filter.status) {
                response = await getTransactionsByStatus(filter.status);
            } else if (filter.type) {
                response = await getTransactionsByType(filter.type);
            } else {
                response = await getAllTransactions();
            }
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
    }, [filter.userId, filter.status, filter.type]);

    return { transactions, loading, error, refetch: fetchTransactions };
}