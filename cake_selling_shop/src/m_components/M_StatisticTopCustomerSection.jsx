import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Arimo from '../components/Arimo/Arimo-VariableFont_wght.ttf';

const M_StatisticTopCustomerSection = () => {
    const [topCustomers, setTopCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [limit, setLimit] = useState(10);

    const token = sessionStorage.getItem("token");

    const fetchTopCustomers = async () => {
        if (!dateFrom || !dateTo) {
            setError(new Error('Both date fields are required.'));
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
                limit
            };

            const response = await axios.get(`${URL}/api/user/top-customer`, {
                params,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTopCustomers(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dateFrom && dateTo) {
            fetchTopCustomers();
        }
    }, [dateFrom, dateTo, limit]);

    const handleDateFromChange = (e) => {
        setDateFrom(e.target.value);
    };

    const handleDateToChange = (e) => {
        setDateTo(e.target.value);
    };

    const handleLimitChange = (e) => {
        setLimit(e.target.value);
    };

    const isButtonDisabled = () => {
        return !dateFrom || !dateTo;
    };

    const loadFont = async (url) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const base64String = btoa(
            new Uint8Array(arrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        return base64String;
    };

    const exportPDF = async () => {
        const doc = new jsPDF();
    
        // Load the Arimo font
        const arimoBase64 = await loadFont(Arimo);
        doc.addFileToVFS('Arimo.ttf', arimoBase64);
        doc.addFont('Arimo.ttf', 'Arimo', 'normal');
        doc.setFont('Arimo');
    
        // Add the time range to the text
        doc.text(`Thống kê khách hàng hàng đầu từ ${dateFrom} đến ${dateTo}`, 20, 10);
        doc.autoTable({
            head: [['ID', 'Email', 'Name', 'PhoneNumber', 'Address', 'Total']],
            body: topCustomers.map(customer => [
                customer.user_id,
                customer.User.email,
                customer.User.full_name,
                customer.User.phone_number,
                customer.User.address,
                customer.total_spent + " vnd"
            ]),
        });
        doc.save('top_customers_report.pdf');
    };
    

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ paddingBottom: '150px' }}>
                            <div className="card-header">
                                <strong className="card-title">Thống kê khách hàng hàng đầu</strong>
                                <div style={{ marginTop: '20px' }}>
                                    <label style={{ marginRight: '20px' }}>
                                        Từ ngày:
                                        <input type="date" value={dateFrom} onChange={handleDateFromChange} />
                                    </label>
                                    <label style={{ marginRight: '20px' }}>
                                        Đến ngày:
                                        <input type="date" value={dateTo} onChange={handleDateToChange} />
                                    </label>
                                    <label style={{ marginRight: '20px' }}>
                                        Số lượng khách hàng:
                                        <input type="number" value={limit} onChange={handleLimitChange} min="1" />
                                    </label>
                                </div>
                            </div>
                            <div className="card-body">
                                {loading && <div>Loading...</div>}
                                {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
                                {topCustomers.length > 0 && (
                                    <div>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Email</th>
                                                    <th>Tên</th>
                                                    <th>Số điện thoại</th>
                                                    <th>Địa chỉ</th>
                                                    <th>Tổng chi tiêu</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {topCustomers.map((customer) => (
                                                    <tr key={customer.user_id}>
                                                        <td>{customer.user_id}</td>
                                                        <td>{customer.User.email}</td>
                                                        <td>{customer.User.full_name}</td>
                                                        <td>{customer.User.phone_number}</td>
                                                        <td>{customer.User.address}</td>
                                                        <td>{customer.total_spent}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <button onClick={exportPDF} style={{ marginTop: '50px' }}>Xuất báo cáo PDF</button>
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

export default M_StatisticTopCustomerSection;
