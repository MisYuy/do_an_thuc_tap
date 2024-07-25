import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const M_AddPromotionSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        discount_percentage: '',
        start_date: '',
        end_date: ''
    });
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const navigate = useNavigate();

    const validateInputs = () => {
        const errors = {};
        if (!formData.name) errors.name = 'Tên khuyến mãi là bắt buộc';
        if (!formData.description) errors.description = 'Mô tả là bắt buộc';
        if (!formData.discount_percentage) {
            errors.discount_percentage = 'Giảm giá là bắt buộc';
        } else if (formData.discount_percentage <= 0 || formData.discount_percentage > 100) {
            errors.discount_percentage = 'Giảm giá phải nằm trong khoảng 1-100%';
        }
        if (!formData.start_date) errors.start_date = 'Ngày bắt đầu là bắt buộc';
        if (!formData.end_date) errors.end_date = 'Ngày kết thúc là bắt buộc';
        if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
            errors.date = 'Ngày bắt đầu phải trước ngày kết thúc';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        try {
            const response = await axios.post(`${URL}/api/promotion/add-new`, formData);
            navigate(`/m/promotion`);
            console.log('Promotion added successfully:', response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError(error.response ? error.response.data : 'Error adding promotion');
        }
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12"> 
                        <div className="card">
                            <div className="card-header">
                                <strong>Form thêm khuyến mãi</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} className="form-horizontal">
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="name" className="form-control-label">Tên khuyến mãi</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="name" name="name" placeholder="Enter promotion name" className="form-control" value={formData.name} onChange={handleChange} />
                                            <small className="form-text text-muted">Please enter the promotion name</small>
                                            {validationErrors.name && <div className="text-danger">{validationErrors.name}</div>}
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3">
                                            <label htmlFor="description" className="form-control-label">Mô tả</label>
                                        </div>
                                        <div className="col-12 col-md-9">
                                            <textarea name="description" id="description" rows="9" placeholder="Content..." className="form-control" value={formData.description} onChange={handleChange}></textarea>
                                            {validationErrors.description && <div className="text-danger">{validationErrors.description}</div>}
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="discount_percentage" className="form-control-label">Giảm giá (%)</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="discount_percentage" name="discount_percentage" placeholder="Enter discount percentage" className="form-control" value={formData.discount_percentage} onChange={handleChange} />
                                            <small className="help-block form-text">Please enter the discount percentage</small>
                                            {validationErrors.discount_percentage && <div className="text-danger">{validationErrors.discount_percentage}</div>}
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="start_date" className="form-control-label">Ngày bắt đầu</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="date" id="start_date" name="start_date" className="form-control" value={formData.start_date} onChange={handleChange} />
                                            {validationErrors.start_date && <div className="text-danger">{validationErrors.start_date}</div>}
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="end_date" className="form-control-label">Ngày kết thúc</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="date" id="end_date" name="end_date" className="form-control" value={formData.end_date} onChange={handleChange} />
                                            {validationErrors.end_date && <div className="text-danger">{validationErrors.end_date}</div>}
                                            {validationErrors.date && <div className="text-danger">{validationErrors.date}</div>}
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger">
                                            {typeof error === 'string' ? error : JSON.stringify(error)}
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

export default M_AddPromotionSection;
