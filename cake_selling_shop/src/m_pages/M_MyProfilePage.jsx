import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { URL } from '../utils/constant.js';

const M_MyProfilePage = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        phone_number: '',
        address: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = JSON.parse(sessionStorage.getItem("user"));
                const response = await axios.get(`${URL}/api/user/get-by-id${user.user_id}`);
                setUser(response.data);
                setFormData({
                    email: response.data.email,
                    full_name: response.data.full_name,
                    phone_number: response.data.phone_number,
                    address: response.data.address,
                    image: null
                });
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormData({ ...formData, [name]: file });
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.full_name) newErrors.full_name = 'Full name is required';
        if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
        if (!formData.address) newErrors.address = 'Address is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const data = new FormData();
        data.append('email', formData.email);
        data.append('full_name', formData.full_name);
        data.append('phone_number', formData.phone_number);
        data.append('address', formData.address);
        data.append('image', formData.image);

        try {
            const response = await axios.put(`${URL}/api/user/update-profile`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Profile updated successfully:', response.data);
            setErrors({});
            window.location.reload();
        } catch (error) {
            setErrors({ form: error.response ? error.response.data : 'Error updating profile' });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            setErrors({ password: 'New password and confirm password do not match' });
            return;
        }

        try {
            const response = await axios.put(`${URL}/api/user/change-password`, passwordData);
            console.log('Password changed successfully:', response.data);
            setShowPasswordModal(false);
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
        } catch (error) {
            setErrors({ password: error.response ? error.response.data : 'Error changing password' });
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">My Profile</h2>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        isInvalid={!!errors.full_name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.full_name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPhoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        isInvalid={!!errors.phone_number}
                    />
                    <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        isInvalid={!!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formImage">
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />
                    {previewImage && <img src={previewImage} alt="Preview" className="img-thumbnail mt-2" style={{ maxWidth: '200px' }} />}
                </Form.Group>

                {errors.form && (
                    <div className="alert alert-danger">
                        {typeof errors.form === 'string' ? errors.form : JSON.stringify(errors.form)}
                    </div>
                )}

                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>

            <Button variant="link" className="mt-3" onClick={() => setShowPasswordModal(true)}>
                Change Password
            </Button>

            {/* Change Password Modal */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleChangePassword}>
                        <Form.Group controlId="formCurrentPassword">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="current_password"
                                value={passwordData.current_password}
                                onChange={handlePasswordChange}
                                isInvalid={!!errors.password}
                            />
                        </Form.Group>

                        <Form.Group controlId="formNewPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={handlePasswordChange}
                                isInvalid={!!errors.password}
                            />
                        </Form.Group>

                        <Form.Group controlId="formConfirmPassword">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirm_password"
                                value={passwordData.confirm_password}
                                onChange={handlePasswordChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Change Password
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default M_MyProfilePage;
