import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const M_AddCategorySection = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = 'Tên danh mục là bắt buộc';
        }
        if (formData.name.length > 50) {
            errors.name = 'Tên danh mục không được vượt quá 50 ký tự';
        }
        if (!formData.description) {
            errors.description = 'Mô tả là bắt buộc';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const token = sessionStorage.getItem("token");

        try {
            const response = await axios.post(`${URL}/api/category/add-new`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/m/category');
            console.log('Category added successfully:', response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError(error.response ? error.response.data : 'Error adding category');
        }
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12"> 
                        <div className="card">
                            <div className="card-header">
                                <strong>Form thêm danh mục</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} className="form-horizontal">
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="name" className="form-control-label">Tên danh mục</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="name" name="name" placeholder="Enter category name" className="form-control" value={formData.name} onChange={handleChange} />
                                            {validationErrors.name && <small className="form-text text-danger">{validationErrors.name}</small>}
                                            <small className="form-text text-muted">Please enter the category name</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3">
                                            <label htmlFor="description" className="form-control-label">Mô tả</label>
                                        </div>
                                        <div className="col-12 col-md-9">
                                            <textarea name="description" id="description" rows="9" placeholder="Content..." className="form-control" value={formData.description} onChange={handleChange}></textarea>
                                            {validationErrors.description && <small className="form-text text-danger">{validationErrors.description}</small>}
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

export default M_AddCategorySection;
