import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { URL } from '../utils/constant.js';

Modal.setAppElement('#root'); // Set the root element for accessibility

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
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const user = JSON.parse(sessionStorage.getItem('user'));
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
    }

    const handleRowClick = (order) => {
        setSelectedOrder(order);
        setModalIsOpen(true);
    };

    const handleChangeStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${URL}/api/order/change-status?id=${orderId}`, { status: newStatus, userId: user.user_id }, {
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

    // Helper function to format numbers
    const formatNumber = (number) => {
        return new Intl.NumberFormat('vi-VN').format(number);
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
                                            <th style={{ textAlign: 'center' }}>Địa chỉ giao hàng</th> {/* Add this line */}
                                            <th style={{ textAlign: 'center' }}>Ngày đặt</th>
                                            <th style={{ textAlign: 'center' }}>Tổng tiền</th>
                                            <th style={{ textAlign: 'center' }}>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedOrders.map(order => (
                                            <tr key={order.order_id}>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }} onClick={() => handleRowClick(order)}>{order.order_id}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }} onClick={() => handleRowClick(order)}>{order.User.user_id}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }} onClick={() => handleRowClick(order)}>{order.User.full_name}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }} onClick={() => handleRowClick(order)}>{order.User.email}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }} onClick={() => handleRowClick(order)}>{order.User.phone_number}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }} onClick={() => handleRowClick(order)}>{order.User.address}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }} onClick={() => handleRowClick(order)}>{order.shipping_address}</td> {/* Add this line */}
                                                <td style={{ alignContent: 'center', textAlign: 'center' }} onClick={() => handleRowClick(order)}>{new Date(order.created_at).toLocaleString()}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }} onClick={() => handleRowClick(order)}>{formatNumber(order.total_amount)}₫</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>
                                                <div className="dropdown-container">
                                                        <button onClick={() => handleToggleDropdown(order.order_id)} className="badge badge-complete" style={{ backgroundColor: getStatusColor(order.status) }}>
                                                            {getStatusText(order.status)}
                                                        </button>
                                                        {visibleOrderId === order.order_id && order.status !== 'completed' && (
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
            {selectedOrder && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Order Details"
                    style={{
                        content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            width: '1000px',
                            height: '700px',
                            overflow: 'auto',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            padding: '20px',
                            backgroundColor: '#f9f9f9',
                            animation: 'fadeIn 0.5s'
                        },
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }}
                >
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Chi tiết đơn hàng</h2>
                    <button 
                        onClick={() => setModalIsOpen(false)} 
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: '#ff5c5c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            lineHeight: '30px'
                        }}
                    >
                        &times;
                    </button>
                    <div>
                        <p><strong>ID Đơn hàng:</strong> {selectedOrder.order_id}</p>
                        <p><strong>ID Người đặt:</strong> {selectedOrder.User.user_id}</p>
                        <p><strong>Tên Người đặt:</strong> {selectedOrder.User.full_name}</p>
                        <p><strong>Email:</strong> {selectedOrder.User.email}</p>
                        <p><strong>Số điện thoại:</strong> {selectedOrder.User.phone_number}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.User.address}</p>
                        <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.shipping_address}</p> {/* Add this line */}
                        <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                        <p><strong>Tổng tiền:</strong> {formatNumber(selectedOrder.total_amount)}₫</p>
                        <p><strong>Trạng thái:</strong> {getStatusText(selectedOrder.status)}</p>
                        <p><strong>ID nhân viên thao tác cuối:</strong> {selectedOrder.ResponsibleUser ? selectedOrder.ResponsibleUser.user_id : 'none'}</p>
                        <p><strong>Tên nhân viên thao tác cuối:</strong> {selectedOrder.ResponsibleUser ? selectedOrder.ResponsibleUser.full_name : 'none'}</p>
                        <h3>Chi tiết sản phẩm</h3>
                        {selectedOrder.OrderItems.map(item => (
                            <div key={item.order_item_id} style={{ marginBottom: '10px' }}>
                                <strong>{item.Product.name}</strong> - SL: {item.quantity} - Giá: {formatNumber(item.price)}₫
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
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
