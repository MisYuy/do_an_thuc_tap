import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const M_HeaderSection = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear all data in sessionStorage
        sessionStorage.clear();
        // Redirect to the login page
        navigate('/login');
        // Close the modal
        setShowModal(false);
    };

    return (
        <div>
            <header id="header" className="header">
                <div className="top-left">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="./"><img src="/images/logo_web.png" alt="Logo" style={{ maxWidth: '100px'}}/></a>
                        <a className="navbar-brand hidden" href="./"><img src="/images/logo_web.png" alt="Logo" /></a>
                    </div>
                </div>
                <div className="top-right">
                    <div className="user-area dropdown float-right">
                        <a href="/m/my-profile" className="dropdown-toggle active" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img className="user-avatar rounded-circle" src="/img/avatar.jpg" alt="User Avatar" />
                        </a>
                        <a href='#' style={{paddingTop: '15px'}} onClick={() => setShowModal(true)}>Đăng xuất</a>
                    </div>
                </div>
            </header>

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

export default M_HeaderSection;
