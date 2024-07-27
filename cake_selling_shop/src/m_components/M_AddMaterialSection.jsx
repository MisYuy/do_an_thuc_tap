import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const M_AddMaterialSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: ''
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
        if (!formData.name) errors.name = 'Tên vật liệu là bắt buộc';
        if (!formData.description) errors.description = 'Mô tả là bắt buộc';
        if (!formData.quantity) {
            errors.quantity = 'Số lượng là bắt buộc';
        } else if (formData.quantity < 0) {
            errors.quantity = 'Số lượng phải lớn hơn hoặc bằng 0';
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
            const response = await axios.post(`${URL}/api/material/add-new`, formData);
            navigate('/m/material');
            console.log('Material added successfully:', response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError(error.response ? error.response.data : 'Error adding material');
        }
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12"> 
                        <div className="card">
                            <div className="card-header">
                                <strong>Form thêm vật liệu</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} className="form-horizontal">
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="name" className="form-control-label">Tên vật liệu</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="name" name="name" placeholder="Enter material name" className="form-control" value={formData.name} onChange={handleChange} />
                                            <small className="form-text text-muted">Please enter the material name</small>
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
                                        <div className="col col-md-3"><label htmlFor="quantity" className="form-control-label">Số lượng</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="quantity" name="quantity" placeholder="Enter quantity" className="form-control" value={formData.quantity} onChange={handleChange} />
                                            <small className="help-block form-text">Please enter the quantity</small>
                                            {validationErrors.quantity && <div className="text-danger">{validationErrors.quantity}</div>}
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

export default M_AddMaterialSection;
