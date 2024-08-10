import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const M_AddAccountSection = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        address: '',
        role: '',
        image: null
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.role) newErrors.role = 'Role is required';
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
        data.append('password', formData.password);
        data.append('full_name', formData.fullName);
        data.append('phone_number', formData.phone);
        data.append('address', formData.address);
        data.append('role', formData.role);
        data.append('image', formData.image);

        const token = sessionStorage.getItem("token");

        try {
            const response = await axios.post(`${URL}/api/user/add-new`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/m/account/customer');
            console.log('User added successfully:', response.data);
            setErrors({});
        } catch (error) {
            setErrors({ form: error.response ? error.response.data : 'Error adding user' });
        }
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12"> 
                        <div className="card">
                            <div className="card-header">
                                <strong>Form thêm người dùng</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-horizontal">
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="email" className="form-control-label">Email</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="email" id="email" name="email" placeholder="Enter email" className="form-control" value={formData.email} onChange={handleChange} />
                                            {errors.email && <small className="form-text text-danger">{errors.email}</small>}
                                            <small className="form-text text-muted">Please enter the email</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="password" className="form-control-label">Mật khẩu</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="password" id="password" name="password" placeholder="Enter password" className="form-control" value={formData.password} onChange={handleChange} />
                                            {errors.password && <small className="form-text text-danger">{errors.password}</small>}
                                            <small className="form-text text-muted">Please enter the password</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="fullName" className="form-control-label">Họ và tên</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="fullName" name="fullName" placeholder="Enter full name" className="form-control" value={formData.fullName} onChange={handleChange} />
                                            {errors.fullName && <small className="form-text text-danger">{errors.fullName}</small>}
                                            <small className="form-text text-muted">Please enter the full name</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="phone" className="form-control-label">Số điện thoại</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="phone" name="phone" placeholder="Enter phone number" className="form-control" value={formData.phone} onChange={handleChange} />
                                            {errors.phone && <small className="form-text text-danger">{errors.phone}</small>}
                                            <small className="form-text text-muted">Please enter the phone number</small>
                                        </div>
                                    </div>  
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="address" className="form-control-label">Địa chỉ</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="address" name="address" placeholder="Enter address" className="form-control" value={formData.address} onChange={handleChange} />
                                            {errors.address && <small className="form-text text-danger">{errors.address}</small>}
                                            <small className="form-text text-muted">Please enter the address</small>
                                        </div>
                                    </div>  
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="role" className="form-control-label">Vai trò</label></div>
                                        <div className="col-12 col-md-9">
                                            <select name="role" id="role" className="form-control" value={formData.role} onChange={handleChange}>
                                                <option value="">Please select</option>
                                                <option value="customer">Customer</option>
                                                <option value="admin">Admin</option>
                                                <option value="sale staff">Sale Staff</option>
                                                <option value="warehouse staff">Warehouse Staff</option>
                                            </select>
                                            {errors.role && <small className="form-text text-danger">{errors.role}</small>}
                                            <small className="form-text text-muted">Please select the role</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="image" className="form-control-label">Hình ảnh</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="file" id="image" name="image" className="form-control-file" onChange={handleChange} />
                                        </div>
                                    </div>
                                    {errors.form && (
                                        <div className="alert alert-danger">
                                            {typeof errors.form === 'string' ? errors.form : JSON.stringify(errors.form)}
                                        </div>
                                    )}
                                    <div className="card-footer" style={{textAlign: 'center'}}>
                                        <input className="btn btn-success" type="submit" value="Xác nhận"/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default M_AddAccountSection;
