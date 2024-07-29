import React, { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner.jsx';
import axios from 'axios';
import { URL } from '../../utils/constant.js';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContentSection = () => {
    const [cartItems, setCartItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to Cash on Delivery
    const [shippingAddress, setShippingAddress] = useState(''); // State for shipping address
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

        const queryParams = {
            userId: user.user_id
        };

        axios.get(`${URL}/api/cart/get-all`, { 
            params: queryParams,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setCartItems(response.data);
            setLoading(false);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, []);

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleNotesChange = (index, event) => {
        const newCartItems = [...cartItems];
        newCartItems[index].notes = event.target.value;
        setCartItems(newCartItems);
    };

    const handleQuantityChange = (index, newQuantity) => {
        const newCartItems = [...cartItems];
        newCartItems[index].quantity = newQuantity;
        setCartItems(newCartItems);
    };

    const handleUpdateCartItem = (cartItemId, quantity, notes) => {
        axios.put(`${URL}/api/cart/update-cart-item`, {
            cartItemId,
            quantity,
            notes
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Cart item updated:', response.data);
        })
        .catch(error => {
            console.error('Error updating cart item:', error);
        });
    };

    const handleCheckout = () => {
        if (!shippingAddress) {
            toast.error('Vui lòng nhập địa chỉ giao hàng.');
            return;
        }

        const orderItems = cartItems.map(item => ({
            product_id: item.Product.product_id,
            quantity: item.quantity,
            price: item.Product.price,
            notes: item.notes
        }));

        const orderData = {
            user_id: user.user_id,
            total_amount: calculateTotalPrice() + calculateShippingFee(),
            status: 'pending',
            orderItems,
            shippingAddress
        };

        axios.post(`${URL}/api/order/create`, orderData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Order created:', response.data);
            toast.success('Đặt hàng thành công! Cảm ơn bạn đã đặt hàng.');
            setTimeout(() => {
                navigate('/home');
            }, 3000);
        })
        .catch(error => {
            console.error('Error creating order:', error);
            toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        });
    };

    const calculateTotalPrice = () => {
        const totalPrice = cartItems.reduce((total, item) => total + item.Product.price * item.quantity, 0);
        return totalPrice;
    };

    const calculateShippingFee = () => {
        const totalPrice = calculateTotalPrice();
        const shippingFee = totalPrice > 1000000 ? 0 : 50000;
        return shippingFee;
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (  
        <div className="container-fluid py-5">
            <div className="container py-5">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Hình</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Đơn giá</th>
                            <th scope="col">Số lượng</th>
                            <th scope="col">Tổng tiền</th>
                            <th scope="col">Ghi chú</th>
                            <th scope="col">Lưu</th>
                          </tr>
                        </thead>
                        <tbody>
                            {cartItems && cartItems.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">
                                        <div className="d-flex align-items-center">
                                            <img src={`/images/product/${item.Product.image}`} className="img-fluid me-5 rounded-circle" style={{ width: '80px', height: '80px' }} alt={item.name} />
                                        </div>
                                    </th>
                                    <td>
                                        <p className="mb-0 mt-4">{item.Product.name}</p>
                                    </td>
                                    <td>
                                        <p className="mb-0 mt-4">{item.Product.price}₫</p>
                                    </td>
                                    <td>
                                        <div className="input-group quantity mt-4" style={{ width: '100px' }}>
                                            <div className="input-group-btn">
                                                <button className="btn btn-sm btn-minus rounded-circle bg-light border" onClick={() => handleQuantityChange(index, item.quantity - 1)}>
                                                    <i className="fa fa-minus"></i>
                                                </button>
                                            </div>
                                            <input type="text" className="form-control form-control-sm text-center border-0" value={item.quantity} readOnly />
                                            <div className="input-group-btn">
                                                <button className="btn btn-sm btn-plus rounded-circle bg-light border" onClick={() => handleQuantityChange(index, item.quantity + 1)}>
                                                    <i className="fa fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="mb-0 mt-4">{item.Product.price * item.quantity}₫</p>
                                    </td>
                                    <td>
                                        <input type="text" className="form-control form-control-sm mt-4" placeholder="Notes" value={item.notes || ''} onChange={(e) => handleNotesChange(index, e)} />
                                    </td>
                                    <td>
                                        <button className="btn btn-md rounded-circle bg-light border mt-4" onClick={() => handleUpdateCartItem(item.cart_item_id, item.quantity, item.notes)}>
                                            <i className="fa fa-save text-success"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {cartItems && cartItems.length > 0 && (
                    <div className="row g-4 justify-content-end">
                        <div className="col-8"></div>
                        <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
                            <div className="bg-light rounded">
                                <div className="p-4">
                                    <h1 className="display-6 mb-4">Giỏ hàng <span className="fw-normal">Tổng tiền</span></h1>
                                    <div className="d-flex justify-content-between mb-4">
                                        <h5 className="mb-0 me-4">Giá tiền sản phẩm:</h5>
                                        <p className="mb-0">{calculateTotalPrice()}₫</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h5 className="mb-0 me-4">Phí ship</h5>
                                        <div>
                                            <p className="mb-0">50.000₫</p>
                                        </div>
                                    </div>
                                    <p className="mb-0 text-end">0₫ nếu giá trị đơn hàng lớn hơn 1.000.000₫</p>
                                    <p className="mb-0 text-end">Giao hàng tận nơi TP HCM.</p>
                                </div>
                                <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                                    <h5 className="mb-0 ps-4 me-4">Tổng tiền</h5>
                                    <p className="mb-0 pe-4">{calculateTotalPrice() + calculateShippingFee()}₫</p>
                                </div>
                                <div className="mb-4 ms-4">
                                    <h5 className="mb-3">Lựa chọn phương thức thanh toán:</h5>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="paymentMethod" id="cod" value="cod" checked={paymentMethod === 'cod'} onChange={handlePaymentMethodChange} />
                                        <label className="form-check-label" htmlFor="cod">
                                            Thanh toán bằng tiền mặt
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="paymentMethod" id="online" value="online" checked={paymentMethod === 'online'} onChange={handlePaymentMethodChange} />
                                        <label className="form-check-label" htmlFor="online">
                                            Thanh toán online
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-4 ms-4">
                                    <h5 className="mb-3">Địa chỉ giao hàng:</h5>
                                    <input type="text" className="form-control" placeholder="Nhập địa chỉ giao hàng" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
                                </div>
                                <button className="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4" type="button" onClick={handleCheckout}>Đặt hàng</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ContentSection;
