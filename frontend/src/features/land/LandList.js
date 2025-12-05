import { Table, Button, Badge } from "react-bootstrap"

const LandList = ({ lands, onCreateLand, onEditLand, onConfirmAction, onCreateTransaction, onImportCSV, onExportCSV, displayActions = true }) => {
    return (
        <div className="main-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="main-title mb-0">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    Danh sách đất
                </h3>
                <div>
                    {onCreateLand && <Button className="btn btn-primary me-2" onClick={onCreateLand}>
                        <i className="bi bi-plus-lg"></i>
                    </Button>}
                    <Badge bg="secondary" pill>{lands.length} thửa đất</Badge>
                </div>
            </div>
            <div className="table-responsive">
                <Table striped hover className="align-middle">
                    <thead>
                        <tr>
                            <th>Land ID</th>
                            <th>Chủ sở hữu</th>
                            <th>Vị trí</th>
                            <th>Diện tích (m²)</th>
                            <th>Loại đất</th>
                            <th>Giấy tờ</th>
                            <th>Ngày cấp</th>
                            <th>Giá trị (VND)</th>
                            <th>Trạng thái</th>
                            {displayActions && <th className="text-center">Hành động</th>}
                        </tr>
                    </thead>
                    <tbody>
                    {lands.map((land) => (
                        <tr key={land.Key}>
                            <td className="fw-bold">{land.Record.maSo}</td>
                            <td>{land.Record.chuSoHuu}</td>
                            <td>{land.Record.diaChi}</td>
                            <td>{land.Record.dienTich}</td>
                            <td>{land.Record.loaiDat}</td>
                            <td>{land.Record.soGiayTo}</td>
                            <td>{land.Record.ngayCapGiayTo}</td>
                            <td>{land.Record.giaTriDat.toLocaleString()}</td>
                            <td className={land.Record.trangThai === 'active' ? 'text-success' : 'text-danger'}>{land.Record.trangThai === 'active' ? 'Khả dụng' : 'Không khả dụng'}</td>
                            {displayActions && <td className="text-center">
                                <div className="btn-group" role="group">
                                    {onEditLand && <Button
                                        variant="outline-primary"
                                        size="sm"
                                        title="Chỉnh sửa"
                                        onClick={() => onEditLand(land.Record)}
                                        className="me-1"
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </Button>}
                                    {onConfirmAction && <Button
                                        variant="outline-danger"
                                        size="sm"
                                        title="Xóa"
                                        className="me-1"
                                        onClick={() => onConfirmAction('delete', land.Record.maSo)}
                                    >
                                        <i className="bi bi-trash-fill"></i>
                                    </Button>}
                                    {(onCreateTransaction && land.Record.trangThai === 'active') && <Button
                                        variant="outline-success"
                                        size="sm"
                                        title="Tạo giao dịch"
                                        onClick={() => onCreateTransaction(land.Record)}
                                    >
                                        <i className="bi bi-arrow-left-right"></i>
                                    </Button>}
                                </div>
                            </td>}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            {onImportCSV &&
                <Button variant="outline-secondary" onClick={onImportCSV} className="mt-3">
                    Nhập từ CSV
                </Button>
            }
            
            {onExportCSV &&
                <Button variant="outline-secondary" onClick={onExportCSV} className="mt-3 ms-2">
                    Xuất ra CSV
                </Button>
            }
        </div>
    );
}

export default LandList;