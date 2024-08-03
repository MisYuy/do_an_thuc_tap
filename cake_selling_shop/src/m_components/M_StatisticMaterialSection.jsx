import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Arimo from '../components/Arimo/Arimo-VariableFont_wght.ttf'

// Register the necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const M_StatisticMaterialSection = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [materialId, setMaterialId] = useState('');
    const [materials, setMaterials] = useState([]);
    const [statType, setStatType] = useState('by-month'); // Default to 'by-month'

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get(`${URL}/api/material/get-all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMaterials(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchMaterials();
    }, [token]);

    const fetchStatistics = async () => {
        if (!dateFrom || !dateTo || !materialId) {
            setError(new Error('All fields are required.'));
            return;
        }

        if (new Date(dateTo) <= new Date(dateFrom)) {
            setError(new Error('End date must be greater than start date.'));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const params = {
                dateFrom,
                dateTo,
                materialId,
                statType
            };

            const response = await axios.get(`${URL}/api/material/get-statistic`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params
            });
            setStatistics(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dateFrom && dateTo && materialId) {
            fetchStatistics();
        }
    }, [dateFrom, dateTo, materialId, statType]);

    const handleDateFromChange = (e) => {
        setDateFrom(e.target.value);
    };

    const handleDateToChange = (e) => {
        setDateTo(e.target.value);
    };

    const handleMaterialIdChange = (e) => {
        setMaterialId(e.target.value);
    };

    const handleStatTypeChange = (e) => {
        setStatType(e.target.value);
        setStatistics(null); // Clear old chart data
        setDateFrom('');
        setDateTo('');
    };

    const getChartData = () => {
        if (!statistics) return {};

        const labels = ['Current Stock', 'Total Ordered', 'Total Used'];
        const data = [statistics.currentStock, statistics.totalOrdered, statistics.totalUsed];

        return {
            labels,
            datasets: [
                {
                    label: 'Material Statistics',
                    data,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    const renderDateInputs = () => {
        switch (statType) {
            case 'by-day':
                return (
                    <>
                        <label style={{ marginRight: '20px' }}>
                            Từ ngày:
                            <input type="date" value={dateFrom} onChange={handleDateFromChange} />
                        </label>
                        <label style={{ marginRight: '20px' }}>
                            Đến ngày:
                            <input type="date" value={dateTo} onChange={handleDateToChange} />
                        </label>
                    </>
                );
            case 'by-year':
                return (
                    <>
                        <label style={{ marginRight: '20px' }}>
                            Từ năm:
                            <input type="number" value={dateFrom} onChange={handleDateFromChange} placeholder="YYYY" />
                        </label>
                        <label style={{ marginRight: '20px' }}>
                            Đến năm:
                            <input type="number" value={dateTo} onChange={handleDateToChange} placeholder="YYYY" />
                        </label>
                    </>
                );
            case 'by-month':
            default:
                return (
                    <>
                        <label style={{ marginRight: '20px' }}>
                            Từ tháng:
                            <input type="month" value={dateFrom} onChange={handleDateFromChange} />
                        </label>
                        <label style={{ marginRight: '20px' }}>
                            Đến tháng:
                            <input type="month" value={dateTo} onChange={handleDateToChange} />
                        </label>
                    </>
                );
        }
    };

    const isButtonDisabled = () => {
        return !dateFrom || !dateTo || !materialId;
    };

    // Function to convert font to base64
    const loadFont = async (url) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const base64String = btoa(
            new Uint8Array(arrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        return base64String;
    };

    // Helper function to format numbers
    const formatNumber = (number) => {
        return new Intl.NumberFormat('vi-VN').format(number) + ' unit';
    };

    const exportPDF = async () => {
        const doc = new jsPDF();
    
        // Load the Arimo font
        const arimoBase64 = await loadFont(Arimo);
        doc.addFileToVFS('Arimo.ttf', arimoBase64);
        doc.addFont('Arimo.ttf', 'Arimo', 'normal');
        doc.setFont('Arimo');
    
        const selectedMaterial = materials.find(material => String(material.material_id) === String(materialId));
    
        // Format the date range for the title
        const formattedDateFrom = new Date(dateFrom).toLocaleDateString('vi-VN');
        const formattedDateTo = new Date(dateTo).toLocaleDateString('vi-VN');
        const title = `Thống kê vật liệu (${formattedDateFrom} - ${formattedDateTo})`;
    
        doc.text(title, 20, 10);
        doc.autoTable({
            head: [['Material ID', 'Material Name', 'Current Stock', 'Total Ordered', 'Total Used']],
            body: [
                [
                    selectedMaterial.material_id,
                    selectedMaterial.name,
                    formatNumber(statistics.currentStock),
                    formatNumber(statistics.totalOrdered),
                    formatNumber(statistics.totalUsed)
                ]
            ],
        });
        doc.save('material_report.pdf');
    };
    

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ paddingBottom: '150px' }}>
                            <div className="card-header">
                                <strong className="card-title" style={{paddingRight: '20px'}}>Thống kê vật liệu</strong>
                                <div style={{ marginTop: '20px' }}>
                                    {renderDateInputs()}
                                    <label style={{ marginRight: '20px' }}>
                                        Loại thống kê:
                                        <select value={statType} onChange={handleStatTypeChange}>
                                            <option value="by-day">Theo ngày</option>
                                            <option value="by-month">Theo tháng</option>
                                            <option value="by-year">Theo năm</option>
                                        </select>
                                    </label>
                                    <label style={{ marginRight: '20px' }}>
                                        Vật liệu:
                                        <select value={materialId} onChange={handleMaterialIdChange}>
                                            <option value="">Select Material</option>
                                            {materials.map(material => (
                                                <option key={material.material_id} value={material.material_id}>
                                                    {material.name} (ID: {material.material_id})
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                </div>
                            </div>
                            <div className="card-body">
                                {loading && <div>Loading...</div>}
                                {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
                                {statistics && (
                                    <div>
                                        <Bar 
                                            data={getChartData()} 
                                            options={{
                                                scales: {
                                                    y: {
                                                        type: 'linear',
                                                        display: true,
                                                        position: 'left',
                                                    },
                                                },
                                            }}
                                        />
                                        <button onClick={exportPDF} style={{marginTop: '50px'}}>Xuất báo cáo PDF</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default M_StatisticMaterialSection;
