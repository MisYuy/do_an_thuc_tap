import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table, Button, Spinner, Modal, Form, Badge } from 'react-bootstrap';

const OrderListSection = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newQuantities, setNewQuantities] = useState({});
    const [newNote, setNewNote] = useState('');
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user) return;

        axios.get(`${URL}/api/order/get-all-by-user-id`, {
            params: { id: user.user_id },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setOrders(sortedOrders);
            setLoading(false);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.put(`${URL}/api/order/change-status`, { status: 'canceled' }, {
                params: { id: orderId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Order canceled successfully');
            setOrders(orders.map(order => order.order_id === orderId ? { ...order, status: 'canceled' } : order));
        } catch (error) {
            toast.error('Failed to cancel order');
        }
    };

    const handleReorder = async (orderId) => {
        try {
            const order = orders.find(order => order.order_id === orderId);
            if (!order || !order.OrderItems) {
                throw new Error('Order or OrderItems not found');
            }
            const newOrder = await axios.post(`${URL}/api/order/create`, {
                user_id: user.user_id,
                total_amount: order.total_amount,
                status: 'pending',
                orderItems: order.OrderItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                }))
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Order placed successfully');
            setOrders([...orders, newOrder.data]);
        } catch (error) {
            toast.error('Failed to place order');
        }
    };

    const handleRowClick = (order) => {
        if (order.status === 'completed' || order.status === 'shipping') return;
        setSelectedOrder(order);
        setNewNote(order.note || '');
        const quantities = {};
        if (order.OrderItems) {
            order.OrderItems.forEach(item => {
                quantities[item.product_id] = item.quantity;
            });
        }
        setNewQuantities(quantities);
        setShowModal(true);
    };

    const handleQuantityChange = (productId, quantity) => {
        setNewQuantities({
            ...newQuantities,
            [productId]: quantity
        });
    };

    const handleSaveChanges = async () => {
        if (Object.values(newQuantities).some(qty => !qty || isNaN(qty) || qty <= 0)) {
            toast.error('Invalid quantity');
            return;
        }

        try {
            const updatedOrderItems = selectedOrder.OrderItems.map(item => ({
                ...item,
                quantity: newQuantities[item.product_id]
            }));

            // Calculate the new total amount
            const newTotalAmount = updatedOrderItems.reduce((total, item) => total + item.quantity * item.price, 0);

            await axios.put(`${URL}/api/order/update`, {
                user_id: user.user_id,
                total_amount: newTotalAmount,
                status: selectedOrder.status,
                notes: newNote,
                orderItems: updatedOrderItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                }))
            }, {
                params: { id: selectedOrder.order_id },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Order updated successfully');
            setOrders(orders.map(order => order.order_id === selectedOrder.order_id ? { ...order, OrderItems: updatedOrderItems, note: newNote, total_amount: newTotalAmount } : order));
            setShowModal(false);
        } catch (error) {
            toast.error('Failed to update order');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Badge bg="warning">Chờ xác nhận</Badge>;
            case 'completed':
                return <Badge bg="success">Đã hoàn thành</Badge>;
            case 'canceled':
                return <Badge bg="danger">Đã hủy</Badge>;
            case 'shipping':
                return <Badge bg="info">Đang giao hàng</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <h1 className="display-6 mb-4">Danh sách đơn hàng</h1>
                {orders.length === 0 ? (
                    <p>Không có đơn hàng nào.</p>
                ) : (
                    <Table striped bordered hover style={{ alignContent: 'center', textAlign: 'center' }}>
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Sản phẩm</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.order_id} onClick={() => handleRowClick(order)} style={{ cursor: order.status === 'completed' || order.status === 'shipping' ? 'not-allowed' : 'pointer' }}>
                                    <td>{order.order_id}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>{order.total_amount}₫</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        {order.OrderItems && order.OrderItems.map(item => (
                                            <div key={item.product_id}>
                                                {item.Product.name} - {item.quantity} x {item.price}₫
                                            </div>
                                        ))}
                                    </td>
                                    <td>{order.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
            <ToastContainer />

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Update Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {selectedOrder && selectedOrder.OrderItems && selectedOrder.OrderItems.map(item => (
                            <Form.Group controlId={`formQuantity-${item.product_id}`} key={item.product_id}>
                                <Form.Label>{item.Product.name} Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={newQuantities[item.product_id]}
                                    onChange={(e) => handleQuantityChange(item.product_id, e.target.value)}
                                />
                            </Form.Group>
                        ))}
                        <Form.Group controlId="formNote">
                            <Form.Label>Note</Form.Label>
                            <Form.Control
                                type="text"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    {selectedOrder && selectedOrder.status === 'pending' && (
                        <Button variant="danger" onClick={() => handleCancelOrder(selectedOrder.order_id)}>
                            Cancel Order
                        </Button>
                    )}
                    {selectedOrder && selectedOrder.status === 'canceled' && (
                        <Button variant="primary" onClick={() => handleReorder(selectedOrder.order_id)}>
                            Reorder
                        </Button>
                    )}
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderListSection;
