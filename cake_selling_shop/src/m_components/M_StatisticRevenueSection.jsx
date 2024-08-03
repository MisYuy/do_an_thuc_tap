import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Arimo from '../components/Arimo/Arimo-VariableFont_wght.ttf'

// Register the necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const M_StatisticRevenueSection = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [statType, setStatType] = useState('by-month'); // Default to 'by-month'
    const [quarterFrom, setQuarterFrom] = useState({ year: '', quarter: '' });
    const [quarterTo, setQuarterTo] = useState({ year: '', quarter: '' });

    const token = sessionStorage.getItem("token");

    const fetchStatistics = async () => {
        if (statType === 'by-quarter') {
            if (!quarterFrom.year || !quarterFrom.quarter || !quarterTo.year || !quarterTo.quarter) {
                setError(new Error('Both quarter fields are required.'));
                return;
            }
        } else {
            if (!dateFrom || !dateTo) {
                setError(new Error('Both date fields are required.'));
                return;
            }
    
            if (new Date(dateTo) <= new Date(dateFrom)) {
                setError(new Error('End date must be greater than start date.'));
                return;
            }
        }
    
        setLoading(true);
        setError(null);
        try {
            const params = statType === 'by-quarter' ? {
                dateFrom: `${quarterFrom.year}-Q${quarterFrom.quarter}`,
                dateTo: `${quarterTo.year}-Q${quarterTo.quarter}`
            } : {
                dateFrom,
                dateTo
            };
    
            const response = await axios.get(`${URL}/api/statistic/${statType}`, {
                params,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStatistics(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (statType === 'by-quarter') {
            if (quarterFrom.year && quarterFrom.quarter && quarterTo.year && quarterTo.quarter) {
                fetchStatistics();
            }
        } else {
            if (dateFrom && dateTo) {
                fetchStatistics();
            }
        }
    }, [dateFrom, dateTo, quarterFrom, quarterTo, statType]);

    const handleDateFromChange = (e) => {
        setDateFrom(e.target.value);
    };

    const handleDateToChange = (e) => {
        setDateTo(e.target.value);
    };

    const handleStatTypeChange = (e) => {
        setStatType(e.target.value);
        setStatistics(null); // Clear old chart data
        setDateFrom('');
        setDateTo('');
        setQuarterFrom({ year: '', quarter: '' });
        setQuarterTo({ year: '', quarter: '' });
    };

    const handleQuarterFromChange = (e) => {
        const [year, quarter] = e.target.value.split('-Q');
        setQuarterFrom({ year, quarter });
    };

    const handleQuarterToChange = (e) => {
        const [year, quarter] = e.target.value.split('-Q');
        setQuarterTo({ year, quarter });
    };

    const getChartData = () => {
        if (!statistics) return {};

        const labels = Object.keys(statistics[`revenue_by_${statType.split('-')[1]}`]);
        const data = Object.values(statistics[`revenue_by_${statType.split('-')[1]}`]);

        return {
            labels,
            datasets: [
                {
                    label: 'Doanh thu',
                    data,
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                },
            ],
        };
    };

    const renderDateInputs = () => {
        switch (statType) {
            case 'by-hour':
                return (
                    <>
                        <label style={{ marginRight: '20px' }}>
                            Từ giờ:
                            <input type="datetime-local" value={dateFrom} onChange={handleDateFromChange} />
                        </label>
                        <label style={{ marginRight: '20px' }}>
                            Đến giờ:
                            <input type="datetime-local" value={dateTo} onChange={handleDateToChange} />
                        </label>
                    </>
                );
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
            case 'by-quarter':
                return (
                    <>
                        <label style={{ marginRight: '20px' }}>
                            Từ quý:
                            <select value={`${quarterFrom.year}-Q${quarterFrom.quarter}`} onChange={handleQuarterFromChange}>
                                <option value="">Chọn quý</option>
                                {[...Array(4)].map((_, i) => (
                                    <option key={i} value={`${new Date().getFullYear()}-Q${i + 1}`}>{`Q${i + 1} ${new Date().getFullYear()}`}</option>
                                ))}
                            </select>
                        </label>
                        <label style={{ marginRight: '20px' }}>
                            Đến quý:
                            <select value={`${quarterTo.year}-Q${quarterTo.quarter}`} onChange={handleQuarterToChange}>
                                <option value="">Chọn quý</option>
                                {[...Array(4)].map((_, i) => (
                                    <option key={i} value={`${new Date().getFullYear()}-Q${i + 1}`}>{`Q${i + 1} ${new Date().getFullYear()}`}</option>
                                ))}
                            </select>
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
        if (statType === 'by-quarter') {
            return !quarterFrom.year || !quarterFrom.quarter || !quarterTo.year || !quarterTo.quarter;
        }
        return !dateFrom || !dateTo;
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
        return new Intl.NumberFormat('vi-VN').format(number) + ' vnd';
    };

    const exportPDF = async () => {
        const doc = new jsPDF();
    
        // Load the Arimo font
        const arimoBase64 = await loadFont(Arimo);
        doc.addFileToVFS('Arimo.ttf', arimoBase64);
        doc.addFont('Arimo.ttf', 'Arimo', 'normal');
        doc.setFont('Arimo');
    
        // Determine the time range based on the selected statType
        let timeRange = '';
        if (statType === 'by-quarter') {
            timeRange = `Từ quý ${quarterFrom.quarter} ${quarterFrom.year} đến quý ${quarterTo.quarter} ${quarterTo.year}`;
        } else {
            timeRange = `Từ ${dateFrom} đến ${dateTo}`;
        }
    
        // Add the title with the time range
        doc.text(`Thống kê doanh thu (${timeRange})`, 20, 10);
        doc.autoTable({
            head: [['Time', 'Doanh thu']],
            body: Object.entries(statistics[`revenue_by_${statType.split('-')[1]}`]).map(([key, value]) => [key, formatNumber(value)]),
        });
        doc.save('report_revenue.pdf');
    };
    

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ paddingBottom: '150px' }}>
                            <div className="card-header">
                                <strong className="card-title">Thống kê doanh thu</strong>
                                <div style={{ marginTop: '20px' }}>
                                    {renderDateInputs()}
                                    <label style={{ marginRight: '20px' }}>
                                        Loại thống kê:
                                        <select value={statType} onChange={handleStatTypeChange}>
                                            <option value="by-hour">Theo giờ</option>
                                            <option value="by-day">Theo ngày</option>
                                            <option value="by-month">Theo tháng</option>
                                            <option value="by-quarter">Theo quý</option>
                                            <option value="by-year">Theo năm</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                            <div className="card-body">
                                {loading && <div>Loading...</div>}
                                {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
                                {statistics && (
                                    <div>
                                        <Line data={getChartData()} />
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

export default M_StatisticRevenueSection;
