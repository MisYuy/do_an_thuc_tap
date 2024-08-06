// BaseProfileSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../utils/constant.js';
import VerificationCode from '../components/authenticate_components/VerificationCode.jsx'; // Import the VerificationCode component
import { useNavigate } from 'react-router-dom';

const BaseProfileSection = ({ user, token }) => {
    const [profile, setProfile] = useState({
        email: '',
        full_name: '',
        phone_number: '',
        address: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [showVerificationCode, setShowVerificationCode] = useState(false); // State to manage verification code popup
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user) {
            // Uncomment and use navigate if you have a navigation function
            // navigate('/login');
        } else {
            axios.get(`${URL}/api/user/get-by-id`, {
                params: { id: user.user_id },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setProfile(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
        }
    }, [user, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setProfile(prevState => ({
                ...prevState,
                image: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in profile) {
            formData.append(key, profile[key]);
        }

        await axios.put(`${URL}/api/user/update`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            toast.success('Profile updated successfully');
        })
        .catch(error => {
            toast.error('Failed to update profile');
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (passwords.newPassword !== passwords.confirmNewPassword) {
                toast.error('New passwords do not match');
                return;
            }

            await axios.post(`${URL}/api/user/check-password`, {
                email: user.email,
                password: passwords.oldPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if(!response.data.result){
                    toast.error('Mật khẩu cũ không chính xác');
                    return;
                }
                axios.post(`${URL}/api/email/send-verification-code`, { email: user.email });
                setShowVerificationCode(true); // Show verification code popup
            })
            .catch(error => {
                toast.error('Failed to change password');
            });
        } catch (error) {
            console.log(error);
            toast.error('Failed to change password');
        }
    };

    const handleVerifySuccess = async () => {
       try {
            if (passwords.newPassword !== passwords.confirmNewPassword) {
                toast.error('New passwords do not match');
                return;
            }

            await axios.post(`${URL}/api/user/change-password`, {
                user_id: user.user_id,
                old_password: passwords.oldPassword,
                new_password: passwords.newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                toast.success('Password changed successfully');
                setShowChangePassword(false);
            })
            .catch(error => {
                toast.error('Failed to change password');
            });
        } catch (error) {
            console.log(error);
            toast.error('Failed to change password');
        }
        setShowVerificationCode(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div style={{ paddingTop: '0px' }}>
            <Container className="py-5">
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <h1 className="mb-4">Hồ sơ cá nhân</h1>
                        {!showChangePassword ? (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formEmail" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="formFullName" className="mb-3">
                                    <Form.Label>Họ và tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="full_name"
                                        value={profile.full_name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPhoneNumber" className="mb-3">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone_number"
                                        value={profile.phone_number}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formAddress" className="mb-3">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={profile.address}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formImage" className="mb-3">
                                    <Form.Label>Ảnh đại diện</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="image"
                                        onChange={handleImageChange}
                                    />
                                    <Image src={imagePreview || (profile.image ? `/images/avatar/${profile.image}` : imagePreview)} roundedCircle className="mt-3" style={{ width: '150px', height: '150px' }} />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Lưu thay đổi
                                </Button>
                            </Form>
                        ) : (
                            <Form onSubmit={handlePasswordSubmit} className="mt-3">
                                <Form.Group controlId="formOldPassword" className="mb-3">
                                    <Form.Label>Mật khẩu cũ</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="oldPassword"
                                        value={passwords.oldPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formNewPassword" className="mb-3">
                                    <Form.Label>Mật khẩu mới</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="newPassword"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formConfirmNewPassword" className="mb-3">
                                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmNewPassword"
                                        value={passwords.confirmNewPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Xác nhận
                                </Button>
                            </Form>
                        )}
                        <Button variant="secondary" className="mt-3" onClick={() => setShowChangePassword(!showChangePassword)}>
                            {showChangePassword ? 'Quay lại hồ sơ' : 'Đổi mật khẩu'}
                        </Button>
                    </Col>
                </Row>
                <ToastContainer />
            </Container>
            {showVerificationCode && (
                <VerificationCode
                    closeVerificationCode={() => setShowVerificationCode(false)}
                    handleVerifySuccess={handleVerifySuccess}
                />
            )}
        </div>
    );
};

export default BaseProfileSection;
