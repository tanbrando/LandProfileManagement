import React, { useState } from "react";
import { Table, Button, Badge } from "react-bootstrap"

const TRANSSTATUSTEXT = {
    pending: 'Đang chờ',
    approved: 'Đã phê duyệt',
    rejected: 'Đã từ chối',
    cancelled: 'Đã hủy'
};

const TRANSSTATUSCOLOR = {
    pending: 'text-warning',
    approved: 'text-success',
    rejected: 'text-danger',
    cancelled: 'text-secondary'
};

const TRANSTYPETEXT = {
    transfer: 'Chuyển nhượng',
    mortgage: 'Thế chấp',
    inheritance: 'Thừa kế',
    gift: 'Tặng cho'
};

const TransactionList = ({ transactions, onCreateTransaction, onEditTransaction, onConfirmAction, isAdmin = true }) => {
    return (
        <div className="main-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="main-title mb-0">
                    <i className="bi bi-arrow-left-right me-2"></i>Danh sách giao dịch
                </h3>
                <div>
                    {onCreateTransaction && 
                    <Button className="btn btn-primary me-2" onClick={onCreateTransaction}>
                        <i className="bi bi-plus-lg"></i>
                    </Button>}
                    <Badge bg="secondary" pill>{transactions.length} giao dịch</Badge>
                </div>
            </div>
            <div className="table-responsive">
                <Table striped hover className="align-middle">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Land ID</th>
                            <th>Người chuyển nhượng</th>
                            <th>Người nhận chuyển nhượng</th>
                            <th>Loại giao dịch</th>
                            <th>Ngày giao dịch</th>
                            <th>Giá trị (VND)</th>
                            <th>Trạng thái</th>
                            <th className="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody> 
                    {transactions.map((tx) => (
                        <tr key={tx.Key}>
                            <td className="fw-bold">{tx.Record.txId}</td>
                            <td>{tx.Record.maSo}</td>
                            <td>{tx.Record.from}</td>
                            <td>{tx.Record.to}</td>
                            <td>{TRANSTYPETEXT[tx.Record.loaiGiaoDich]}</td>
                            <td>{tx.Record.thoiGian}</td>
                            <td>{tx.Record.giaTri}</td>
                            <td className={TRANSSTATUSCOLOR[tx.Record.status]}>{TRANSSTATUSTEXT[tx.Record.status]}</td>
                            <td className="text-center">
                                <div className="btn-group" role="group">
                                    {
                                        tx.Record.status === 'pending' && (
                                        <Button
                                            variant="outline-primary" 
                                            size="sm"
                                            className="me-1"
                                            title="Chỉnh sửa"
                                            onClick={() => onEditTransaction(tx.Record)}>
                                                <i className="bi bi-pencil-square"></i>
                                        </Button>
                                    )}
                                    {isAdmin && tx.Record.status === 'pending' && (
                                        <Button 
                                            variant="outline-success"
                                            size="sm"
                                            title="Phê duyệt"
                                            onClick={() => onConfirmAction('approve', tx.Record.txId)}
                                            className="me-1">
                                                <i className="bi bi-check-lg"></i>
                                        </Button>
                                    )}
                                    {isAdmin && tx.Record.status === 'pending' && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="me-1"
                                            title="Từ chối"
                                            onClick={() => onConfirmAction('reject', tx.Record.txId)}>
                                                <i className="bi bi-x-lg"></i>
                                        </Button>
                                    )}
                                    {!isAdmin && tx.Record.status === 'pending' && (
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            title="Hủy giao dịch"
                                            onClick={() => onConfirmAction('cancel', tx.Record.txId)}>
                                                <i className="bi bi-ban"></i>
                                        </Button>
                                    )}
                                    
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default TransactionList;