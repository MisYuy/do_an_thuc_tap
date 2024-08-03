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

const M_StatisticProductSection = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [productId, setProductId] = useState('');
    const [products, setProducts] = useState([]);

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${URL}/api/product/get-all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProducts(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchProducts();
    }, [token]);

    const fetchStatistics = async () => {
        if (!dateFrom || !dateTo || !productId) {
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
                productId
            };

            const response = await axios.get(`${URL}/api/statistic/by-product`, {
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
        if (dateFrom && dateTo && productId) {
            fetchStatistics();
        }
    }, [dateFrom, dateTo, productId]);

    const handleDateFromChange = (e) => {
        setDateFrom(e.target.value);
    };

    const handleDateToChange = (e) => {
        setDateTo(e.target.value);
    };

    const handleProductIdChange = (e) => {
        setProductId(e.target.value);
    };

    const getChartData = () => {
        if (!statistics) return {};

        const labels = Object.keys(statistics.monthly_data);
        const totalRevenue = labels.map(label => statistics.monthly_data[label].total_revenue);
        const totalQuantity = labels.map(label => statistics.monthly_data[label].total_quantity);

        return {
            labels,
            datasets: [
                {
                    label: 'Total Revenue',
                    data: totalRevenue,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                    yAxisID: 'y',
                },
                {
                    label: 'Total Quantity Sold',
                    data: totalQuantity,
                    backgroundColor: 'rgba(153,102,255,0.4)',
                    borderColor: 'rgba(153,102,255,1)',
                    borderWidth: 1,
                    yAxisID: 'y1',
                },
            ],
        };
    };

    const isButtonDisabled = () => {
        return !dateFrom || !dateTo || !productId;
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
    
        const selectedProduct = products.find(product => String(product.product_id) === String(productId));
    
        // Add the time range to the text
        doc.text(`Thống kê doanh thu và sl bán ra theo sản phẩm (${dateFrom} - ${dateTo})`, 20, 10);
        doc.autoTable({
            head: [['Product ID', 'Product Name', 'Month', 'Total Revenue', 'Total Quantity Sold']],
            body: Object.entries(statistics.monthly_data).map(([key, value]) => [
                selectedProduct.product_id,
                selectedProduct.name,
                key, 
                formatNumber(value.total_revenue), 
                value.total_quantity
            ]),
        });
        doc.save('product_report.pdf');
    };
    

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ paddingBottom: '150px' }}>
                            <div className="card-header">
                                <strong className="card-title">Thống kê doanh thu và số lượng bán ra theo sản phẩm</strong>
                                <div style={{ marginTop: '20px' }}>
                                    <label style={{ marginRight: '20px' }}>
                                        Từ tháng:
                                        <input type="month" value={dateFrom} onChange={handleDateFromChange} />
                                    </label>
                                    <label style={{ marginRight: '20px' }}>
                                        Đến tháng:
                                        <input type="month" value={dateTo} onChange={handleDateToChange} />
                                    </label>
                                    <label style={{ marginRight: '20px' }}>
                                        Sản phẩm:
                                        <select value={productId} onChange={handleProductIdChange}>
                                            <option value="">Select Product</option>
                                            {products.map(product => (
                                                <option key={product.product_id} value={product.product_id}>
                                                    {product.name} (ID: {product.product_id})
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
                                                    y1: {
                                                        type: 'linear',
                                                        display: true,
                                                        position: 'right',
                                                        grid: {
                                                            drawOnChartArea: false,
                                                        },
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

export default M_StatisticProductSection;
