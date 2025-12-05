import { useState, useEffect } from "react";
import PieChartComponent from "../components/PieChart";
import BarChartComponent from "../components/BarChart";
import MainHeader from "../components/MainHeader";
import { Row, Col } from "react-bootstrap";
import { getAllLandProfilesSummary, getLandStatusStatistics, getLandTypeStatistics } from "../services/landService";    
import { getTransactionStatusStatistics, getTransactionTypeStatistics } from "../services/transactionService";

const OverviewPage = () => {
    const [landTypeData, setLandTypeData] = useState([]);
    const [landStatusData, setLandStatusData] = useState([]);
    const [transactionTypeData, setTransactionTypeData] = useState([]);
    const [transactionStatusData, setTransactionStatusData] = useState([]);
    const [summaryData, setSummaryData] = useState(
        {
            tongSoDat: 0,
            tongGiaTriDat: 0,
            tongDienTich: 0
        }
    );

    // Hàm convert object {LUC: 1, ONT: 2} thành array [{name: 'LUC', value: 1}, {name: 'ONT', value: 2}]
    const convertObjectToArray = (obj) => {
        if (!obj || typeof obj !== 'object') return [];
        return Object.entries(obj).map(([key, value]) => ({
            name: key,
            value: value
        }));
    };

    const fetchOverviewData = async () => {
        const landTypeRes = await getLandTypeStatistics();
        if (landTypeRes.success) {
            const convertedData = convertObjectToArray(landTypeRes.data);
            setLandTypeData(convertedData);
        }
        const landStatusRes = await getLandStatusStatistics();
        if (landStatusRes.success) {
            const convertedData = convertObjectToArray(landStatusRes.data);
            setLandStatusData(convertedData);
        }
        const transactionTypeRes = await getTransactionTypeStatistics();
        if (transactionTypeRes.success) {
            const convertedData = convertObjectToArray(transactionTypeRes.data);
            setTransactionTypeData(convertedData);
        }
        const transactionStatusRes = await getTransactionStatusStatistics();
        if (transactionStatusRes.success) {
            const convertedData = convertObjectToArray(transactionStatusRes.data);
            setTransactionStatusData(convertedData);
        }
        const summaryRes = await getAllLandProfilesSummary();
        if (summaryRes.success) {
            setSummaryData(summaryRes.data);
        }
    };

    useEffect(() => {
        fetchOverviewData();
    }, []);

    return (
        <div className="page-container">
            <MainHeader title="Tổng Quan Hồ Sơ Đất" />
            <div className="main-container mb-4">
                <Row >
                    <Col>
                        <h4>Tổng số đất</h4>
                        <p>{summaryData.tongSoDat}</p>
                    </Col>
                    <Col>
                        <h4>Tổng giá trị đất (VNĐ)</h4>
                        <p>{summaryData.tongGiaTriDat.toLocaleString()}</p>
                    </Col>
                    <Col>
                        <h4>Tổng diện tích (m²)</h4>
                        <p>{summaryData.tongDienTich.toLocaleString()}</p>
                    </Col>
                </Row>
            </div>
            <Row className="mb-4">
                <Col>
                    <div className="chart-card">
                        <h5>Phân bố theo trạng thái đất</h5>
                        <PieChartComponent data={landStatusData} dataKey="value" nameKey="name" />
                    </div>
                </Col>
                <Col>
                    <div className="chart-card">
                        <h5>Phân bố theo loại đất</h5>
                        <BarChartComponent data={landTypeData} dataKey="value" nameKey="name" />
                    </div>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <div className="chart-card">
                        <h5>Phân bố theo loại giao dịch</h5>
                        <BarChartComponent data={transactionTypeData} dataKey="value" nameKey="name" />
                    </div>
                </Col>
                <Col>
                    <div className="chart-card">
                        <h5>Phân bố theo trạng thái giao dịch</h5>
                        <PieChartComponent data={transactionStatusData} dataKey="value" nameKey="name" />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default OverviewPage;

