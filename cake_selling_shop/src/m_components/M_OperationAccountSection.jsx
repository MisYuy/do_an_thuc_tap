import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';


const M_OperationAccountSection = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // State for preview image
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        phone_number: '',
        address: '',
        role: '',
        status: '',
        image: null
    });
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormData({ ...formData, [name]: file });
            setPreviewImage(window.URL.createObjectURL(file)); // Use the global URL object
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('user_id', user.user_id);
        data.append('email', formData.email);
        data.append('full_name', formData.full_name);
        data.append('phone_number', formData.phone_number);
        data.append('address', formData.address);
        data.append('role', formData.role);
        data.append('status', formData.status);
        data.append('image', formData.image);

        try {
            const response = await axios.put(`${URL}/api/user/update`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('User updated successfully:', response.data);
            setError(null); // Clear any previous errors
            window.location.reload();
        } catch (error) {
            setError(error.response ? error.response.data : 'Error updating user');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.put(`${URL}/api/user/delete?id=${userId}`);
            console.log('User deleted successfully');
            setShowModal(false); // Close the modal
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${URL}/api/user/get-by-id?id=${userId}`);
                setUser(response.data);
                setFormData({
                    email: response.data.email,
                    full_name: response.data.full_name,
                    phone_number: response.data.phone_number,
                    address: response.data.address,
                    role: response.data.role,
                    status: response.data.status,
                    image: null
                });
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong className="card-title">Thao tác</strong>
                            </div>
                            <div className="card-body">
                                <button type="button" className="btn btn-danger" style={{ marginRight: '20px' }} onClick={() => setShowModal(true)}>
                                    <i className="fa fa-trash"></i>&nbsp; Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong>Form chỉnh sửa</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-horizontal">
                                <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"></div>
                                        <div className="col-12 col-md-9" style={{ textAlign: 'center' }}>
                                            <img
                                                src={previewImage || (user.image ? `/images/product/${user.image}` : "/img/avatar.jpg")}
                                                className="img-fluid rounded"
                                                alt=""
                                                style={{ minWidth: '200px', minHeight: "200px", textAlign: 'center', maxWidth: '200px', maxHeight: "200px" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label className=" form-control-label">ID</label></div>
                                        <div className="col-12 col-md-9">
                                            <p className="form-control-static">{user.user_id}</p>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="email" className="form-control-label">Email</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="email" id="email" name="email" placeholder="Enter email" className="form-control" value={formData.email} onChange={handleChange} />
                                            <small className="form-text text-muted">Please enter the email</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="full_name" className="form-control-label">Họ và tên</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="full_name" name="full_name" placeholder="Enter full name" className="form-control" value={formData.full_name} onChange={handleChange} />
                                            <small className="form-text text-muted">Please enter the full name</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="phone_number" className="form-control-label">Số điện thoại</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="phone_number" name="phone_number" placeholder="Enter phone number" className="form-control" value={formData.phone_number} onChange={handleChange} />
                                            <small className="form-text text-muted">Please enter the phone number</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="address" className="form-control-label">Địa chỉ</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="address" name="address" placeholder="Enter address" className="form-control" value={formData.address} onChange={handleChange} />
                                            <small className="form-text text-muted">Please enter the address</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="role" className="form-control-label">Vai trò</label></div>
                                        <div className="col-12 col-md-9">
                                            <select name="role" id="role" className="form-control" value={formData.role} onChange={handleChange}>
                                                <option value="">Please select</option>
                                                <option value="Customer">Customer</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Staff">Staff</option>
                                            </select>
                                            <small className="form-text text-muted">Please select the role</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="status" className="form-control-label">Trạng thái</label></div>
                                        <div className="col-12 col-md-9">
                                            <select name="status" id="status" className="form-control" value={formData.status} onChange={handleChange}>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                            <small className="form-text text-muted">Please select the status</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="image" className="form-control-label">Hình ảnh</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="file" id="image" name="image" className="form-control-file" onChange={handleChange} />
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger">
                                            {typeof error === 'string' ? error : JSON.stringify(error)}
                                        </div>
                                    )}
                                    <div className="card-footer" style={{ textAlign: 'center' }}>
                                        <input className="btn btn-success" type="submit" value="Xác nhận" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn chắc chắn muốn xóa người dùng này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default M_OperationAccountSection;
