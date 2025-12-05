import React, { useState } from "react";
import { Table, Button, Badge } from "react-bootstrap"

const UserList = ({ users, onEditUser, onConfirmAction, onExportReport }) => {
    return (
        <div className="main-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="main-title mb-0">
                    <i className="bi bi-people-fill me-2"></i>
                    Danh sách người dùng
                </h3>
                <Badge bg="secondary" pill>{users.length} người dùng</Badge>
            </div>
            
            <div className="table-responsive">
                <Table striped hover className="align-middle">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>SĐT</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th className="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.Key}>
                            <td className="fw-bold">{user.Record.userId}</td>
                            <td>{user.Record.name}</td>
                            <td>
                                {user.Record.email}
                            </td>
                            <td>
                                {user.Record.phone}
                            </td>
                            <td>
                                {user.Record.role}
                            </td>
                            <td className={user.Record.active ? 'text-success' : 'text-danger'}>
                                {user.Record.active ? 'Hoạt động' : 'Đã vô hiệu'}
                            </td>
                            <td className="text-center">
                                <div className="btn-group" role="group">
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        title="Chỉnh sửa"
                                        onClick={() => onEditUser(user.Record)}
                                        className="me-1"
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </Button>
                                    {user.Record.active ? (
                                        <Button 
                                            variant="outline-warning" 
                                            size="sm"
                                            title="Vô hiệu hóa"
                                            onClick={() => onConfirmAction('deactivate', user.Record.userId)}
                                            className="me-1"
                                        >
                                            <i className="bi bi-ban"></i>
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="outline-success" 
                                            size="sm"
                                            title="Kích hoạt lại"
                                            onClick={() => onConfirmAction('reactivate', user.Record.userId)}
                                            className="me-1"
                                        >
                                            <i className="bi bi-check-circle"></i>
                                        </Button>
                                    )}
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        title="Xóa"
                                        className="me-1"
                                        onClick={() => onConfirmAction('delete', user.Record.userId)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                    
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        title="Xuất Báo Cáo"
                                        onClick={() => onExportReport(user.Record.userId)}
                                    >
                                        <i className="bi bi-download"></i>
                                    </Button>
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

export default UserList;