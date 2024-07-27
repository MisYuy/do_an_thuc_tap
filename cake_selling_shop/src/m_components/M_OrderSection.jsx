import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';

const M_OrderSection = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [visibleOrderId, setVisibleOrderId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('order_id');
    const [sortCriteria, setSortCriteria] = useState('order_id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedStatuses, setSelectedStatuses] = useState({
        pending: false,
        shipping: false,
        completed: false,
        canceled: false,
    });

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        axios.get(`${URL}/api/order/get-all`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setOrders(response.data);
        })
        .catch(error => {
            setError(error);
        });
    }, [token]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleToggleDropdown = (orderId) => {
        setVisibleOrderId(visibleOrderId === orderId ? null : orderId);
    };

    const handleChangeStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${URL}/api/order/change-status?id=${orderId}`, { status: newStatus }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrders(orders.map(order => order.order_id === orderId ? { ...order, status: newStatus } : order));
        } catch (error) {
            console.error('Error changing order status:', error);
            setError(error);
        }
    };

    // Filter orders based on search term, selected criteria, and selected statuses
    const filteredOrders = orders.filter(order => {
        const valueToCheck = 
            filterCriteria === 'order_id' ? order.order_id.toString() :
            filterCriteria === 'user_id' ? order.User.user_id.toString() :
            filterCriteria === 'full_name' ? order.User.full_name.toLowerCase() :
            filterCriteria === 'email' ? order.User.email.toLowerCase() :
            order.User.address.toLowerCase();

        const matchesSearchTerm = valueToCheck.includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatuses[order.status];

        return matchesSearchTerm && (Object.values(selectedStatuses).every(status => !status) || matchesStatus);
    });

    // Sort orders based on selected criteria and order
    const sortedOrders = filteredOrders.sort((a, b) => {
        const aValue = sortCriteria === 'order_id' ? a.order_id :
                       sortCriteria === 'user_id' ? a.User.user_id :
                       sortCriteria === 'full_name' ? a.User.full_name :
                       sortCriteria === 'email' ? a.User.email :
                       sortCriteria === 'created_at' ? new Date(a.created_at) :
                       a.total_amount;

        const bValue = sortCriteria === 'order_id' ? b.order_id :
                       sortCriteria === 'user_id' ? b.User.user_id :
                       sortCriteria === 'full_name' ? b.User.full_name :
                       sortCriteria === 'email' ? b.User.email :
                       sortCriteria === 'created_at' ? new Date(b.created_at) :
                       b.total_amount;

        return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const handleStatusChange = (status) => {
        setSelectedStatuses(prev => ({
            ...prev,
            [status]: !prev[status],
        }));
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ paddingBottom: '150px' }}>
                            <div className="card-header">
                                <strong className="card-title">Danh sách đơn hàng</strong>
                            </div>
                            <div className="card-body">
                                <div style={{ marginBottom: '20px' }}>
                                    <select 
                                        value={filterCriteria} 
                                        onChange={(e) => setFilterCriteria(e.target.value)} 
                                        style={{ padding: '5px'}}
                                    >
                                        <option value="order_id">ID Đơn hàng</option>
                                        <option value="user_id">ID Người đặt</option>
                                        <option value="full_name">Tên Người đặt</option>
                                        <option value="email">Email</option>
                                    </select>
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm..." 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                        style={{ marginLeft: '20px', padding: '5px', minWidth: '300px' }} 
                                    />
                                    <select className="standardSelect"
                                        value={sortCriteria} 
                                        onChange={(e) => setSortCriteria(e.target.value)} 
                                        style={{ marginLeft: '20px', padding: '5px'}}
                                    >
                                        <option value="order_id">Sắp xếp theo ID Đơn hàng</option>
                                        <option value="user_id">Sắp xếp theo ID Người đặt</option>
                                        <option value="full_name">Sắp xếp theo Tên Người đặt</option>
                                        <option value="email">Sắp xếp theo Email</option>
                                        <option value="created_at">Sắp xếp theo Ngày đặt</option>
                                        <option value="total_amount">Sắp xếp theo Tổng tiền</option>
                                    </select>
                                    <select 
                                        value={sortOrder} 
                                        onChange={(e) => setSortOrder(e.target.value)} 
                                        style={{ marginLeft: '20px', padding: '5px'}}
                                    >
                                        <option value="asc">Tăng dần</option>
                                        <option value="desc">Giảm dần</option>
                                    </select>
                                    <div style={{ display: 'flex', marginTop: '20px' }}>
                                        {['pending', 'shipping', 'completed', 'canceled'].map(status => (
                                            <div key={status} style={{ marginRight: '20px' }}>
                                                <label>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedStatuses[status]} 
                                                        onChange={() => handleStatusChange(status)} 
                                                        style={{ marginRight: '5px' }}
                                                    />
                                                    <span>{getStatusText(status)}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <table id="bootstrap-data-table" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>ID Đơn hàng</th>
                                            <th style={{ textAlign: 'center' }}>ID Người đặt</th>
                                            <th style={{ textAlign: 'center' }}>Tên Người đặt</th>
                                            <th style={{ textAlign: 'center' }}>Email</th>
                                            <th style={{ textAlign: 'center' }}>Số điện thoại</th>
                                            <th style={{ textAlign: 'center' }}>Địa chỉ</th>
                                            <th style={{ textAlign: 'center' }}>Ngày đặt</th>
                                            <th style={{ textAlign: 'center' }}>Tổng tiền</th>
                                            <th style={{ textAlign: 'center' }}>Trạng thái</th>
                                            <th style={{ textAlign: 'center' }}>Chi tiết sản phẩm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedOrders.map(order => (
                                            <tr key={order.order_id}>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{order.order_id}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{order.User.user_id}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{order.User.full_name}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{order.User.email}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{order.User.phone_number}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{order.User.address}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{new Date(order.created_at).toLocaleString()}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{order.total_amount}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>
                                                    <div className="dropdown-container">
                                                        <button onClick={() => handleToggleDropdown(order.order_id)} className="badge badge-complete" style={{ backgroundColor: getStatusColor(order.status) }}>
                                                            {getStatusText(order.status)}
                                                        </button>
                                                        {visibleOrderId === order.order_id && (
                                                            <div className="dropdown-content">
                                                                {['pending', 'shipping', 'completed', 'canceled'].map(status => (
                                                                    <a key={status} href="#" onClick={() => handleChangeStatus(order.order_id, status)}>
                                                                        {getStatusText(status)}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>
                                                    {order.OrderItems.map(item => (
                                                        <div key={item.order_item_id}>
                                                            {item.Product.name} - SL: {item.quantity} - Giá: {item.price}
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Back to Top Button */}
                <button 
                    onClick={scrollToTop} 
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: '#1ecc02',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        zIndex: 1000,
                    }}
                >
                    Back to Top
                </button>
            </div>
        </div>
    );
};

// Helper function to get status text
const getStatusText = (status) => {
    switch (status) {
        case 'pending':
            return 'Chờ xác nhận';
        case 'shipping':
            return 'Đang giao hàng';
        case 'completed':
            return 'Hoàn thành';
        case 'canceled':
            return 'Đã hủy';
        default:
            return 'Không xác định';
    }
};

// Helper function to get status color
const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return '#ffcc00'; // Yellow for pending
        case 'shipping':
            return '#0307fc'; // Blue for shipping
        case 'completed':
            return '#1ecc02'; // Green for completed
        case 'canceled':
            return '#ff0000'; // Red for canceled
        default:
            return '#000000'; // Default color
    }
};

export default M_OrderSection;
