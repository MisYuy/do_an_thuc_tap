import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL, Nav_Item } from '../utils/constant';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ select }) => {
    const [cartItems, setCartItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

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

    const handleLogout = () => {
        // Clear all data in sessionStorage
        sessionStorage.clear();
        // Redirect to the login page
        navigate('/login');
        // Close the modal
        setShowModal(false);
    };

    return (
        <div className="container-fluid fixed-top">
            <div className="container topbar bg-primary d-none d-lg-block">
                <div className="d-flex justify-content-between">
                    <div className="top-info ps-2">
                        <small className="me-3">
                            <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
                            <a href="#" className="text-white">97 Man Thiện, Hiệp Phú, TPHCM</a>
                        </small>
                        <small className="me-3">
                            <i className="fas fa-envelope me-2 text-secondary"></i>
                            <a href="#" className="text-white">zuycake@gmail.com</a>
                        </small>
                    </div>
                    <div className="top-link pe-2">
                        <a href="#" className="text-white"><small className="text-white mx-2">Chính sách - Điều khoản sử dụng</small></a>
                    </div>
                </div>
            </div>
            <div className="container px-0">
                <nav className="navbar navbar-light bg-white navbar-expand-xl">
                    <a href="index.html" className="navbar-brand"><h1 className="text-primary display-6">ZuyCake</h1></a>
                    <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="fa fa-bars text-primary"></span>
                    </button>
                    <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                        <div className="navbar-nav mx-auto">
                            <a href="/home" className={`nav-item nav-link ${select === Nav_Item.HOME ? 'active' : ''}`}>Trang chủ</a>
                            <a href={`${select === Nav_Item.PRODUCT_DETAIL ? '../products' : 'products'}`} className={`nav-item nav-link ${select === Nav_Item.PRODUCTS ? 'active' : ''}`}>Sản phẩm</a>
                            <a href="/order-list" className={`nav-item nav-link ${select === Nav_Item.ORDER ? 'active' : ''}`}>Đơn hàng</a>
                            <a href="/policy" className={`nav-item nav-link ${select === Nav_Item.POLICY ? 'active' : ''}`}>Chính sách và điều khoản sử dụng</a>
                        </div>
                        <div className="d-flex m-3 me-0">
                            <a href="/cart" className="position-relative me-4 my-auto">
                                <i className="fa fa-shopping-bag fa-2x"></i>
                                <span className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1" style={{ top: '-5px', left: '15px', height: '20px', minWidth: '20px' }}>
                                    {cartItems ? cartItems.length : 0}
                                </span>
                            </a>
                            <a href="/profile" className="my-auto">
                                <i className="fas fa-user fa-2x"></i>
                            </a>
                            <button className="my-auto" style={{marginLeft: '30px'}} onClick={() => setShowModal(true)}><strong style={{cursor: 'pointer'}}>Đăng xuất</strong></button>
                        </div>
                    </div>
                </nav>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Xác nhận đăng xuất</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn chắc chắn muốn đăng xuất?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleLogout}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Navbar;
