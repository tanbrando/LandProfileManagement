import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateLandProfile } from "../../services/landService";
import LoadingOverlay from "../../components/LoadingOverlay";

const LANDTYPES = {
    'ONT': 'Đất ở tại nông thôn',
    'ODT': 'Đất ở tại đô thị',
    'LUC': 'Đất trồng lúa',
    'CLN': 'Đất trồng cây lâu năm',
    'RSX': 'Đất rừng sản xuất',
    'NTS': 'Đất nuôi trồng thủy sản',
    'SKC': 'Đất cơ sở sản xuất phi nông nghiệp',
    'TMD': 'Đất thương mại dịch vụ',
    'DGT': 'Đất giao thông',
    'DKV': 'Đất khu vui chơi, giải trí công cộng',
}

const EditLandModal = ({ 
    showModal,
    closeModal,
    land,
    onActionSuccess
}) => {
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (land) {
            const { docType, ...rest } = land;
            setFormData(rest);
        }
    }, [land]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await updateLandProfile(formData.maSo, formData);
            if (res.success) {
                onActionSuccess();
                closeModal();
                setError(null);
            } else {
                setError(res.message || 'Cập nhật hồ sơ đất thất bại');
            }
        } catch (error) {
            setError('Đã xảy ra lỗi khi cập nhật hồ sơ đất');
        } finally {
            setLoading(false);
        }
    }
    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }
    if (!formData) return null;
    
    return (
        <Modal show={showModal} onHide={closeModal}>
            {loading && <LoadingOverlay />}
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa hồ sơ đất đai</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {error && <p className="alert alert-danger">{error}</p>}
                    <Form.Group controlId="formMaSo" className="mb-3">
                        <Form.Label>Land ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="maSo"
                            value={formData.maSo}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group controlId="formDiaChi" className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                            type="text"
                            name="diaChi"
                            value={formData.diaChi}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDienTich" className="mb-3">
                        <Form.Label>Diện tích (m²)</Form.Label>
                        <Form.Control
                            type="number"
                            name="dienTich"
                            value={formData.dienTich}
                            onChange={handleInputChange}
                        />  
                    </Form.Group>
                    <Form.Group controlId="formLoaiDat" className="mb-3">
                        <Form.Label>Loại đất</Form.Label>
                        <Form.Select
                            name="loaiDat"
                            value={formData.loaiDat}
                            onChange={handleInputChange}
                        >
                            {Object.entries(LANDTYPES).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="formSoGiayTo" className="mb-3">
                        <Form.Label>Số giấy tờ</Form.Label>
                        <Form.Control
                            type="text"
                            name="soGiayTo"
                            value={formData.soGiayTo}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formNgayCapGiayTo" className="mb-3">
                        <Form.Label>Ngày cấp giấy tờ (YYYY-MM-DD)</Form.Label>
                        <Form.Control
                            type="text"
                            name="ngayCapGiayTo"
                            value={formData.ngayCapGiayTo}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formGiaTriDat" className="mb-3">
                        <Form.Label>Giá trị đất (VND)</Form.Label>
                        <Form.Control
                            type="number"
                            name="giaTriDat"
                            value={formData.giaTriDat}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Lưu thay đổi
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditLandModal;