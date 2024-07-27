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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${URL}/api/product/get-all`);
                setProducts(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchProducts();
    }, []);

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

            const response = await axios.get(`${URL}/api/statistic/by-product`, { params });
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
                                    <button onClick={fetchStatistics} disabled={isButtonDisabled()}>
                                        Láy số liệu thống kê
                                    </button>
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
